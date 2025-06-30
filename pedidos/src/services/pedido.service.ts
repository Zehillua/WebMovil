import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Types } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { Carrito } from '../schemas/carrito.schema';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    @InjectModel(Carrito.name) private carritoModel: Model<any>,
  ) {}

  async crearPedido(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // 1. Obtener dirección del local
    let direccionLocal = '';
    try {
      const res = await axios.get(`http://localhost:3000/locatarios/${createPedidoDto.idLocal}`);
      const dir = res.data.direccion;
      direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
    } catch (e) {
      direccionLocal = '';
    }

    // 2. Si es delivery, guardar dirección de entrega del usuario
    let direccionEntrega = '';
    if (createPedidoDto.esDelivery) {
      const dir = createPedidoDto.direccionEntrega;
      direccionEntrega = Array.isArray(dir) ? dir.join(', ') : (dir || '');
    }

    // 3. Crear el pedido con todos los datos
    const pedidoData = {
      ...createPedidoDto,
      idComprador: new Types.ObjectId(createPedidoDto.idComprador),
      idLocal: new Types.ObjectId(createPedidoDto.idLocal),
      idRepartidor: createPedidoDto.idRepartidor ? new Types.ObjectId(createPedidoDto.idRepartidor) : undefined,
      estado: false,
      dealer: false,
      repartidor: null,
      direccionLocal,
      direccionEntrega,
      fechaPedido: new Date(), // ✅ ASEGURAR FECHA ACTUAL
    };

    const pedido = new this.pedidoModel(pedidoData);
    const pedidoGuardado = await pedido.save();

    await this.carritoModel.deleteOne({ idComprador: pedidoData.idComprador });

    return pedidoGuardado;
  }

  async obtenerPedidos(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async obtenerPedidosPorUsuario(idComprador: string): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ idComprador: new Types.ObjectId(idComprador) })
      .lean()
      .exec();
    return pedidos.map(pedido => ({
      ...pedido,
      fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
      fechaRechazo: pedido.fechaRechazo ? new Date(pedido.fechaRechazo).toISOString() : undefined
    }));
  }

  async obtenerPedidosPorLocal(idLocal: string): Promise<any[]> {
    return this.pedidoModel
      .find({ idLocal: new Types.ObjectId(idLocal) })
      .lean()
      .exec();
  }

  async obtenerPedidosDeliveryBasicos(): Promise<any[]> {
    return this.pedidoModel
      .find({ 
        esDelivery: true,
        estado: true,  // Aceptado por el local
        dealer: false  // No tomado por repartidor aún
      })
      .lean()
      .exec();
  }

  // MANTENER el método existente para REST:
  async obtenerPedidosDeliveryDisponibles(): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ 
        esDelivery: true,
        estado: true,  // Aceptado por el local
        dealer: false  // No tomado por repartidor aún
      })
      .lean()
      .exec();

    // Obtener datos adicionales del local y usuario
    const pedidosConDatos = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let nombreLocal = '';
        let direccionLocal = '';
        let nombreUsuario = '';
        
        try {
          // Obtener datos del local
          const resLocal = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
          nombreLocal = resLocal.data.nombreLocal || '';
          const dir = resLocal.data.direccion;
          direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
        } catch (e) {
          console.error('Error obteniendo datos del local:', e);
        }

        try {
          // Obtener datos del usuario
          const resUsuario = await axios.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
          nombreUsuario = resUsuario.data.nombreUsuario || `${resUsuario.data.nombre} ${resUsuario.data.apellido}`;
        } catch (e) {
          console.error('Error obteniendo datos del usuario:', e);
        }

        return {
          ...pedido,
          nombreLocal,
          direccionLocal,
          nombreUsuario,
        };
      })
    );
    
    return pedidosConDatos;
  }

  async obtenerPedidosDeliveryParaGraphQL(): Promise<any[]> {
    console.log('🔍 Buscando pedidos con filtros:');
    console.log('- esDelivery: true');
    console.log('- estado: true (aceptado por local)'); 
    console.log('- listo: true (preparado)');
    console.log('- dealer: false (no tomado por repartidor)');

    const pedidos = await this.pedidoModel
      .find({ 
        esDelivery: true,
        estado: true,    // ✅ ACEPTADO por el local
        dealer: false    // ✅ NO tomado por repartidor aún
      })
      .lean()
      .exec();

    console.log(`📦 Encontrados ${pedidos.length} pedidos que cumplen criterios`);
    
    return pedidos;
  }


  async actualizarEstado(id: string, estado: boolean) {
    return this.pedidoModel.findByIdAndUpdate(id, { estado }, { new: true });
  }

  async rechazarPedido(id: string) {
    return this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        estadoRechazado: true,
        fechaRechazo: new Date()
      }, 
      { new: true }
    );
  }

  // Método para eliminar un pedido específico
  async eliminarPedido(id: string) {
    return this.pedidoModel.findByIdAndDelete(id);
  }

  // Tarea programada que se ejecuta cada 10 segundos para eliminar pedidos rechazados antiguos
  @Cron('*/10 * * * * *') // Cada 10 segundos (formato: segundos minutos horas día mes año)
  async eliminarPedidosRechazadosAntiguos() {
    const fechaLimite = new Date();
    fechaLimite.setSeconds(fechaLimite.getSeconds() - 30); // 30 segundos atrás

    const resultado = await this.pedidoModel.deleteMany({
      estadoRechazado: true,
      fechaRechazo: { $lt: fechaLimite }
    });

    if (resultado.deletedCount > 0) {
      console.log(`Eliminados ${resultado.deletedCount} pedidos rechazados antiguos (más de 30 segundos)`);
    }
  }

  async marcarListo(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { listo: true }, { new: true });
  }

  async aceptarPorRepartidor(id: string, idRepartidor: string) {
    return this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor)
      }, 
      { new: true }
    );
  }

  // ACTUALIZAR método marcarEnCamino para generar código:
    async marcarEnCamino(id: string) {
      // Generar código aleatorio de 4 dígitos
      const codigoPedido = Math.floor(1000 + Math.random() * 9000);
      
      console.log(`🚚 Generando código ${codigoPedido} para pedido ${id}`);
      
      return this.pedidoModel.findByIdAndUpdate(
        id, 
        { 
          enCamino: true,
          codigoPedido: codigoPedido // ✅ GUARDAR CÓDIGO
        }, 
        { new: true }
      );
    }

  async marcarEntregado(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { pedidoEntregado: true }, { new: true });
  }

  // NUEVO MÉTODO - Obtener pedidos pendientes de un repartidor específico
  async obtenerPedidosPendientesRepartidor(idRepartidor: string): Promise<any[]> {
    console.log(`🚚 Buscando pedidos pendientes para repartidor: ${idRepartidor}`);
    
    const pedidos = await this.pedidoModel
      .find({ 
        dealer: true,                                    // Tomado por repartidor
        repartidor: new Types.ObjectId(idRepartidor),   // ID del repartidor específico
        enCamino: false,                                // AÚN NO está en camino
        pedidoEntregado: false                          // AÚN NO entregado
      })
      .lean()
      .exec();

    console.log(`📦 Encontrados ${pedidos.length} pedidos pendientes para el repartidor`);

  // Obtener datos adicionales del local y usuario
    const pedidosConDatos = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let nombreLocal = '';
        let direccionLocal = '';
        let nombreUsuario = '';
        let direccionUsuario = '';
        
        try {
          // Obtener datos del local
          const resLocal = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
          nombreLocal = resLocal.data.nombreLocal || '';
          const dir = resLocal.data.direccion;
          direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
        } catch (e) {
          console.error('Error obteniendo datos del local:', e);
        }

        try {
          // Obtener datos del usuario
          const resUsuario = await axios.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
          nombreUsuario = resUsuario.data.nombreUsuario || `${resUsuario.data.nombre} ${resUsuario.data.apellido}`;
          const dirUsuario = resUsuario.data.direccion;
          direccionUsuario = Array.isArray(dirUsuario) ? dirUsuario.join(', ') : (dirUsuario || '');
        } catch (e) {
          console.error('Error obteniendo datos del usuario:', e);
        }

        return {
          ...pedido,
          nombreLocal,
          direccionLocal,
          nombreUsuario,
          direccionUsuario,
        };
      })
    );
    
    return pedidosConDatos;
  }

  async obtenerPedidosPendientesRepartidorGraphQL(idRepartidor: string): Promise<any[]> {
    console.log(`🚚 GraphQL: Buscando pedidos pendientes para repartidor: ${idRepartidor}`);
    
    const pedidos = await this.pedidoModel
      .find({ 
        dealer: true,                                    // Tomado por repartidor
        repartidor: new Types.ObjectId(idRepartidor),   // ID del repartidor específico
        enCamino: false,                                // AÚN NO está en camino
        pedidoEntregado: false                          // AÚN NO entregado
      })
      .lean()
      .exec();

    console.log(`📦 GraphQL: Encontrados ${pedidos.length} pedidos pendientes`);
    
    // NO hacer queries adicionales aquí - los resolvers se encargan
    return pedidos;
  }

  // NUEVO MÉTODO - Obtener pedidos en camino del repartidor:
  async obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor: string): Promise<any[]> {
    console.log(`🚚 GraphQL: Buscando pedidos en camino para repartidor: ${idRepartidor}`);
    
    const pedidos = await this.pedidoModel
      .find({ 
        dealer: true,                                    // Tomado por repartidor
        repartidor: new Types.ObjectId(idRepartidor),   // ID del repartidor específico
        enCamino: true,                                 // ✅ YA está en camino
        pedidoEntregado: false                          // ✅ AÚN NO entregado
      })
      .lean()
      .exec();

    console.log(`📦 GraphQL: Encontrados ${pedidos.length} pedidos en camino`);
    
    return pedidos;
  }

  // NUEVO MÉTODO - Entregar pedido con código:
  async entregarPedido(id: string, codigoIngresado: number) {
    // 1. Obtener el pedido
    const pedido = await this.pedidoModel.findById(id).lean().exec();
    
    if (!pedido) {
      throw new BadRequestException('Pedido no encontrado');
    }

    // 2. Verificar código
    if (pedido.codigoPedido !== codigoIngresado) {
      throw new BadRequestException('Código incorrecto');
    }

    // 3. Marcar como entregado
    const pedidoEntregado = await this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        pedidoEntregado: true,
        fechaEntrega: new Date()
      }, 
      { new: true }
    ).lean().exec();

    // 4. Guardar en múltiples bases de datos
    await this.guardarPedidoEnMultiplesBD(pedidoEntregado);

    return pedidoEntregado;
  }

  // MÉTODO PRIVADO - Guardar en múltiples bases de datos:
  private async guardarPedidoEnMultiplesBD(pedido: any) {
    console.log('💾 Guardando pedido entregado en múltiples bases de datos...');
    
    try {
      // Obtener datos adicionales
      const [datosUsuario, datosLocal, datosRepartidor] = await Promise.all([
        this.obtenerDatosUsuario(pedido.idComprador),
        this.obtenerDatosLocal(pedido.idLocal),
        this.obtenerDatosRepartidor(pedido.repartidor)
      ]);

      // Preparar datos completos
      const pedidoCompleto = {
        ...pedido,
        fechaEntrega: new Date(),
        usuario: datosUsuario,
        local: datosLocal,
        repartidor: datosRepartidor
      };

      // 1. Guardar en reportes (puerto 3004)
      await this.guardarEnReportes(pedidoCompleto);
      
      // 2. Guardar en locatarios/ventas (puerto 3001)
      await this.guardarEnVentas(pedidoCompleto);
      
      // 3. Guardar en repartidores/entregas (puerto 3003)
      await this.guardarEnEntregas(pedidoCompleto);

      console.log('✅ Pedido guardado exitosamente en todas las bases de datos');
      
    } catch (error) {
      console.error('❌ Error guardando en múltiples BD:', error);
      // No fallar la entrega por errores de guardado
    }
  }

  private async obtenerDatosUsuario(idUsuario: any) {
    try {
      const res = await axios.get(`http://localhost:3000/usuarios/${idUsuario}`);
      return res.data;
    } catch (e) {
      return { nombre: 'Usuario no disponible', _id: idUsuario };
    }
  }

  private async obtenerDatosLocal(idLocal: any) {
    try {
      const res = await axios.get(`http://localhost:3000/locatarios/${idLocal}`);
      return res.data;
    } catch (e) {
      return { nombreLocal: 'Local no disponible', _id: idLocal };
    }
  }

  private async obtenerDatosRepartidor(idRepartidor: any) {
    try {
      const res = await axios.get(`http://localhost:3000/usuarios/${idRepartidor}`);
      return res.data;
    } catch (e) {
      return { nombreUsuario: 'Repartidor no disponible', _id: idRepartidor };
    }
  }

  private async guardarEnReportes(pedido: any) {
    try {
      await axios.post('http://localhost:3004/stats/pedido-realizado', {
        pedidoId: pedido._id,
        nombrePedido: pedido.nombrePedido,
        precio: pedido.precioPedido,
        fechaEntrega: pedido.fechaEntrega,
        usuario: {
          id: pedido.usuario._id,
          nombre: pedido.usuario.nombre,
          apellido: pedido.usuario.apellido
        },
        local: {
          id: pedido.local._id,
          nombreLocal: pedido.local.nombreLocal
        },
        repartidor: {
          id: pedido.repartidor._id,
          nombre: pedido.repartidor.nombreUsuario
        },
        comidas: pedido.comidas,
        propina: pedido.cantidadPropina || 0
      });
      console.log('✅ Guardado en reportes (3004)');
    } catch (e) {
      console.error('❌ Error guardando en reportes:', e instanceof Error ? e.message : e);
    }
  }

  private async guardarEnVentas(pedido: any) {
    try {
      await axios.post('http://localhost:3001/locatarios/venta', {
        localId: pedido.local._id,
        pedidoId: pedido._id,
        nombrePedido: pedido.nombrePedido,
        precio: pedido.precioPedido,
        fechaVenta: pedido.fechaEntrega,
        cliente: {
          id: pedido.usuario._id,
          nombre: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`
        },
        comidas: pedido.comidas,
        esDelivery: pedido.esDelivery,
        propina: pedido.cantidadPropina || 0
      });
      console.log('✅ Guardado en ventas locatarios (3001)');
    } catch (e) {
      console.error('❌ Error guardando en ventas:', e instanceof Error ? e.message : e);
    }
  }

  private async guardarEnEntregas(pedido: any) {
    try {
      await axios.post('http://localhost:3003/repartidores/entrega', {
        repartidorId: pedido.repartidor._id,
        pedidoId: pedido._id,
        nombrePedido: pedido.nombrePedido,
        valorEntrega: pedido.precioPedido,
        propina: pedido.cantidadPropina || 0,
        fechaEntrega: pedido.fechaEntrega,
        cliente: {
          id: pedido.usuario._id,
          nombre: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,
          direccion: pedido.direccionEntrega
        },
        local: {
          id: pedido.local._id,
          nombreLocal: pedido.local.nombreLocal,
          direccion: pedido.direccionLocal
        },
        distancia: 'No calculada', // TODO: calcular distancia real
        tiempoEntrega: 'No calculado' // TODO: calcular tiempo real
      });
      console.log('✅ Guardado en entregas repartidores (3003)');
    } catch (e) {
      console.error('❌ Error guardando en entregas:', e instanceof Error ? e.message : e);
    }
  }



}
