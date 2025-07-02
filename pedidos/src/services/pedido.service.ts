import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Types } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { Carrito } from '../schemas/carrito.schema';
import { PedidoRealizado } from '../schemas/pedido-realizado.schema';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    @InjectModel(Carrito.name) private carritoModel: Model<any>,
    @InjectModel(PedidoRealizado.name) private pedidoRealizadoModel: Model<PedidoRealizado>,
  ) {}

  async crearPedido(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // 1. Obtener dirección del local
    let direccionLocal = '';
    try {
      const res = await axios.get(`http://localhost:3000/locatarios/${createPedidoDto.idLocal}`);
      direccionLocal = this.normalizarDireccion(res.data.direccion);
    } catch (e) {
      direccionLocal = 'Dirección no disponible';
    }

    // 2. Si es delivery, manejar dirección de entrega
    let direccionEntrega = '';
    if (createPedidoDto.esDelivery) {
      if (createPedidoDto.direccionEntrega) {
        // Si viene dirección desde el frontend, usarla
        direccionEntrega = this.normalizarDireccion(createPedidoDto.direccionEntrega);
      } else {
        // Si no viene dirección, obtenerla del usuario
        try {
          const resUsuario = await axios.get(`http://localhost:3000/usuarios/${createPedidoDto.idComprador}`);
          direccionEntrega = this.normalizarDireccion(resUsuario.data.direccion);
        } catch (e) {
          console.error('Error obteniendo dirección del usuario:', e);
          direccionEntrega = 'Dirección no disponible';
        }
      }
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
      fechaPedido: new Date(),
    };

    const pedido = new this.pedidoModel(pedidoData);
    const pedidoGuardado = await pedido.save();

    await this.carritoModel.deleteOne({ idComprador: pedidoData.idComprador });

    return pedidoGuardado;
  }

    private normalizarDireccion(direccion: any): string {
    if (!direccion) return 'Dirección no disponible';
    
    
    if (Array.isArray(direccion)) {
      const elementosValidos = direccion.filter(item => 
        item && 
        typeof item === 'string' && 
        item.trim() !== ''
      );
      return elementosValidos.length > 0 
        ? elementosValidos.join(', ') 
        : 'Dirección no disponible';
    }
    
    
    if (typeof direccion === 'string') {
      const direccionLimpia = direccion.trim();
      return direccionLimpia !== '' ? direccionLimpia : 'Dirección no disponible';
    }
    
    
    if (typeof direccion === 'object') {
      
      if (direccion.calle || direccion.ciudad || direccion.direccion) {
        const partes = [];
        if (direccion.calle) partes.push(direccion.calle);
        if (direccion.numero) partes.push(direccion.numero);
        if (direccion.ciudad) partes.push(direccion.ciudad);
        if (direccion.direccion) partes.push(direccion.direccion);
        return partes.length > 0 ? partes.join(', ') : 'Dirección no disponible';
      }
     
      return JSON.stringify(direccion);
    }
    
   
    const resultado = String(direccion).trim();
    return resultado !== '' ? resultado : 'Dirección no disponible';
  }

  async obtenerPedidos(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  // ✅ VERSIÓN SIMPLIFICADA - sin validaciones estrictas:
  async obtenerPedidosPorUsuario(idComprador: string): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ idComprador: new Types.ObjectId(idComprador) })
      .lean()
      .exec();

    const pedidosConDatos = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let datosLocal = null;

        try {
          datosLocal = await this.obtenerDatosLocal(pedido.idLocal);
        } catch (e) {
          console.error('Error obteniendo datos del local:', e);
          datosLocal = { 
            nombreLocal: 'Local no disponible', 
            direccion: 'Dirección no disponible' 
          };
        }

        return {
          ...pedido,
          repartidor: pedido.repartidor,
          datosRepartidor: pedido.datosRepartidor,
          fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
          fechaRechazo: pedido.fechaRechazo ? new Date(pedido.fechaRechazo).toISOString() : undefined,
          local: datosLocal
        };
      })
    );

    return pedidosConDatos;
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
        estado: true,
        dealer: false
      })
      .lean()
      .exec();
  }

  async obtenerPedidosDeliveryDisponibles(): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ 
        esDelivery: true,
        estado: true,
        dealer: false
      })
      .lean()
      .exec();

    const pedidosConDatos = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let nombreLocal = '';
        let direccionLocal = '';
        let nombreUsuario = '';
        let datosRepartidor = null;
        
        try {
          const resLocal = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
          nombreLocal = resLocal.data.nombreLocal || '';
          direccionLocal = this.normalizarDireccion(resLocal.data.direccion);
        } catch (e) {
          console.error('Error obteniendo datos del local:', e);
        }

        try {
          const resUsuario = await axios.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
          nombreUsuario = resUsuario.data.nombreUsuario || `${resUsuario.data.nombre} ${resUsuario.data.apellido}`;
        } catch (e) {
          console.error('Error obteniendo datos del usuario:', e);
        }

        if (pedido.repartidor) {
          try {
            datosRepartidor = await this.obtenerDatosRepartidor(pedido.repartidor);
          } catch (e) {
            console.error('Error obteniendo datos del repartidor:', e);
          }
        }

        return {
          ...pedido,
          nombreLocal,
          direccionLocal,
          nombreUsuario,
          repartidor: pedido.repartidor,
          datosRepartidor: datosRepartidor
        };
      })
    );
    
    return pedidosConDatos;
  }

  async obtenerPedidosDeliveryParaGraphQL(): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ 
        esDelivery: true,
        estado: true,
        dealer: false
      })
      .lean()
      .exec();
    
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

  async eliminarPedido(id: string) {
    return this.pedidoModel.findByIdAndDelete(id);
  }

  @Cron('*/10 * * * * *')
  async eliminarPedidosRechazadosAntiguos() {
    const fechaLimite = new Date();
    fechaLimite.setSeconds(fechaLimite.getSeconds() - 30);

    const resultado = await this.pedidoModel.deleteMany({
      estadoRechazado: true,
      fechaRechazo: { $lt: fechaLimite }
    });

    if (resultado.deletedCount > 0) {
      console.log(`Eliminados ${resultado.deletedCount} pedidos rechazados antiguos`);
    }
  }

  async marcarListo(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { listo: true }, { new: true });
  }

  // ✅ VERSIÓN SIMPLIFICADA de aceptarPorRepartidor:
  async aceptarPedidoRepartidor(id: string, idRepartidor: string) {
  console.log(`🚗 Service: aceptarPedidoRepartidor ${id} por ${idRepartidor}`);
  
  try {
    const datosRepartidor = await this.obtenerDatosRepartidor(idRepartidor);
    
    const pedidoActualizado = await this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor),
        datosRepartidor: {
          _id: datosRepartidor._id,
          nombreUsuario: datosRepartidor.nombreUsuario,
          usuarioRepartidor: datosRepartidor.usuarioRepartidor,
          vehiculo: datosRepartidor.vehiculo,
          patente: datosRepartidor.patente,
          valoracion: datosRepartidor.valoracion,
          telefono: datosRepartidor.telefono
        }
      }, 
      { new: true }
    );
    
    if (!pedidoActualizado) {
      throw new Error('Pedido no encontrado');
    }
    
    console.log(`✅ Pedido aceptado por repartidor: ${id}`);
    return pedidoActualizado;
    
  } catch (error: unknown) {
    console.error('❌ Error aceptando pedido por repartidor:', error);
    
    // Fallback básico
    const pedidoActualizado = await this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor),
        datosRepartidor: {
          _id: idRepartidor,
          nombreUsuario: 'Repartidor',
          usuarioRepartidor: 'Repartidor',
          vehiculo: 'Vehículo no especificado',
          patente: 'Patente no especificada',
          valoracion: 0,
          telefono: ''
        }
      }, 
      { new: true }
    );
    
    if (!pedidoActualizado) {
      throw new Error('Pedido no encontrado');
    }
    
    return pedidoActualizado;
  }
}


  async marcarEnCamino(id: string) {
    const codigoPedido = Math.floor(1000 + Math.random() * 9000);
    
    return this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        enCamino: true,
        codigoPedido: codigoPedido
      }, 
      { new: true }
    );
  }

  async marcarEntregado(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { pedidoEntregado: true }, { new: true });
  }

  async obtenerPedidosPendientesRepartidor(idRepartidor: string): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor),
        enCamino: false,
        pedidoEntregado: false
      })
      .lean()
      .exec();

    const pedidosConDatos = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let nombreLocal = '';
        let direccionLocal = '';
        let nombreUsuario = '';
        let direccionUsuario = '';
        
        try {
          const resLocal = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
          nombreLocal = resLocal.data.nombreLocal || '';
          const dir = resLocal.data.direccion;
          direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
        } catch (e) {
          console.error('Error obteniendo datos del local:', e);
        }

        try {
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
    const pedidos = await this.pedidoModel
      .find({ 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor),
        enCamino: false,
        pedidoEntregado: false
      })
      .lean()
      .exec();
    
    return pedidos;
  }

  async obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor: string): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor),
        enCamino: true,
        pedidoEntregado: false
      })
      .lean()
      .exec();

    return pedidos.map(pedido => ({
      ...pedido,
      enCamino: pedido.enCamino ?? false,
      pedidoEntregado: pedido.pedidoEntregado ?? false,
      codigoPedido: pedido.codigoPedido ?? 0,
      propina: pedido.propina ?? false,
      cantidadPropina: pedido.cantidadPropina ?? 0,
      dealer: pedido.dealer ?? false,
      estado: pedido.estado ?? false,
      listo: pedido.listo ?? false,
      estadoRechazado: pedido.estadoRechazado ?? false,
      esDelivery: pedido.esDelivery ?? false
    }));
  }

  async entregarPedido(id: string, codigoIngresado: number) {
    const pedido = await this.pedidoModel.findById(id).lean().exec();
    
    if (!pedido) {
      throw new BadRequestException('Pedido no encontrado');
    }

    if (pedido.codigoPedido !== codigoIngresado) {
      throw new BadRequestException('Código incorrecto');
    }

    const pedidoRealizado = await this.transferirAPedidosRealizados(pedido);
    await this.guardarPedidoEnMultiplesBD(pedidoRealizado);

    return pedidoRealizado;
  }

  private async transferirAPedidosRealizados(pedido: any): Promise<any> {
  try {
    const [datosUsuario, datosLocal, datosRepartidor] = await Promise.all([
      this.obtenerDatosUsuario(pedido.idComprador),
      this.obtenerDatosLocal(pedido.idLocal),
      this.obtenerDatosRepartidor(pedido.repartidor)
    ]);

    const pedidoRealizadoData = {
      pedidoOriginalId: pedido._id,
      nombrePedido: pedido.nombrePedido,
      idComprador: pedido.idComprador,
      idLocal: pedido.idLocal,
      precioPedido: pedido.precioPedido,
      pago: pedido.pago,
      fechaPedido: pedido.fechaPedido,
      fechaEntrega: new Date(),
      esDelivery: pedido.esDelivery,
      direccionEntrega: this.normalizarDireccion(pedido.direccionEntrega),
      comidas: pedido.comidas || [], // ✅ GARANTIZAR ARRAY
      promociones: pedido.promociones || [], // ✅ AGREGAR PROMOCIONES FALTANTES
      propina: pedido.propina,
      cantidadPropina: pedido.cantidadPropina || 0,
      repartidor: pedido.repartidor,
      codigoPedido: pedido.codigoPedido,
      direccionLocal: this.normalizarDireccion(pedido.direccionLocal),
      // ✅ INICIALIZAR CAMPOS DE VALORACIÓN
      valoracionPedido: 0,
      valoracionDelivery: 0,
      valoracionLocal: 0,
      valoracionCompletada: false,
      datosUsuario: {
        nombre: datosUsuario.nombre || 'N/A',
        apellido: datosUsuario.apellido || 'N/A',
        nombreUsuario: datosUsuario.nombreUsuario || 'N/A',
        direccion: datosUsuario.direccion
      },
      datosLocal: {
        nombreLocal: datosLocal.nombreLocal || 'N/A',
        direccion: datosLocal.direccion
      },
      datosRepartidor: {
        nombreUsuario: datosRepartidor.nombreUsuario || 'N/A',
        vehiculo: datosRepartidor.vehiculo || 'N/A',
        patente: datosRepartidor.patente || 'N/A',
        valoracion: datosRepartidor.valoracion || 0
      }
    };

    console.log(`📦 Transfiriendo pedido a realizados:`);
    console.log(`- Pedido ID: ${pedido._id}`);
    console.log(`- Nombre: ${pedidoRealizadoData.nombrePedido}`);
    console.log(`- Comidas: ${pedidoRealizadoData.comidas.length}`);
    console.log(`- Promociones: ${pedidoRealizadoData.promociones.length}`); // ✅ DEBUG

    const pedidoRealizado = new this.pedidoRealizadoModel(pedidoRealizadoData);
    const pedidoGuardado = await pedidoRealizado.save();

    await this.pedidoModel.findByIdAndDelete(pedido._id);

    console.log(`✅ Pedido transferido exitosamente: ${pedidoGuardado._id}`);

    return pedidoGuardado.toObject();

  } catch (error: unknown) {
    console.error('❌ Error transfiriendo pedido:', error);
    
    if (error instanceof Error) {
      console.error('❌ Detalle del error:', error.message);
      throw new BadRequestException(`Error procesando la entrega del pedido: ${error.message}`);
    }
    
    throw new BadRequestException('Error procesando la entrega del pedido');
  }
}

  async obtenerPedidosRealizadosPorUsuario(userId: string): Promise<any[]> {
  console.log(`🔍 Buscando pedidos realizados para usuario: ${userId}`);
  
  try {
    const pedidos = await this.pedidoRealizadoModel
      .find({ 'datosUsuario._id': new Types.ObjectId(userId) })
      .sort({ fechaEntrega: -1 })
      .lean()
      .exec();

    console.log(`📊 Encontrados ${pedidos.length} pedidos realizados`);
    
    return pedidos.map(pedido => ({
      ...pedido,
      _id: pedido._id.toString(),
      fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
      fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toISOString() : new Date().toISOString(),
      fechaRegistro: pedido.fechaRegistro ? new Date(pedido.fechaRegistro).toISOString() : new Date().toISOString(),
      comidas: pedido.comidas || [],
      promociones: pedido.promociones || [], // ✅ INCLUIR PROMOCIONES
      valoracionPedido: pedido.valoracionPedido || 0,
      valoracionDelivery: pedido.valoracionDelivery || 0,
      valoracionLocal: pedido.valoracionLocal || 0,
      valoracionCompletada: pedido.valoracionCompletada || false
    }));
    
  } catch (error) {
    console.error('❌ Error obteniendo pedidos realizados:', error);
    throw new BadRequestException('Error obteniendo pedidos realizados por usuario');
  }
}

  async obtenerTodosPedidosRealizados(): Promise<any[]> {
    return this.pedidoRealizadoModel
      .find()
      .sort({ fechaEntrega: -1 })
      .lean()
      .exec();
  }

  async obtenerEstadisticasPedidosRealizados(): Promise<any> {
    const stats = await this.pedidoRealizadoModel.aggregate([
      {
        $group: {
          _id: null,
          totalPedidos: { $sum: 1 },
          totalVentas: { $sum: '$precioPedido' },
          totalPropinas: { $sum: '$cantidadPropina' },
          promedioVenta: { $avg: '$precioPedido' },
          promedioPropina: { $avg: '$cantidadPropina' }
        }
      }
    ]);

    return stats[0] || {
      totalPedidos: 0,
      totalVentas: 0,
      totalPropinas: 0,
      promedioVenta: 0,
      promedioPropina: 0
    };
  }

  async guardarPedidoEnMultiplesBDPublico(pedidoId: string) {
    const pedido = await this.pedidoModel.findById(pedidoId).lean().exec();
    
    if (!pedido) {
      throw new BadRequestException('Pedido no encontrado');
    }

    await this.guardarPedidoEnMultiplesBD(pedido);
  }

  private async guardarPedidoEnMultiplesBD(pedido: any) {
    try {
      const [datosUsuario, datosLocal, datosRepartidor] = await Promise.all([
        this.obtenerDatosUsuario(pedido.idComprador),
        this.obtenerDatosLocal(pedido.idLocal),
        this.obtenerDatosRepartidor(pedido.repartidor)
      ]);

      const pedidoCompleto = {
        ...pedido,
        fechaEntrega: new Date(),
        usuario: datosUsuario,
        local: datosLocal,
        repartidor: datosRepartidor
      };

      await this.guardarEnReportes(pedidoCompleto);
      await this.guardarEnVentasGraphQL(pedidoCompleto);
      await this.guardarEnEntregas(pedidoCompleto);
      
    } catch (error) {
      console.error('❌ Error guardando en múltiples BD:', error);
    }
  }

  private async guardarEnVentasGraphQL(pedido: any) {
    try {
      const mutation = `
        mutation RegistrarVenta($input: RegistrarVentaInput!) {
          registrarVenta(input: $input) {
            _id
            nombrePedido
            precio
          }
        }
      `;

      const variables = {
        input: {
          localId: pedido.local._id.toString(),
          pedidoId: pedido._id.toString(),
          nombrePedido: pedido.nombrePedido,
          precio: pedido.precioPedido,
          fechaVenta: pedido.fechaEntrega.toISOString(),
          cliente: {
            id: pedido.usuario._id.toString(),
            nombre: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`
          },
          comidas: pedido.comidas,
          esDelivery: pedido.esDelivery || false,
          propina: pedido.cantidadPropina || 0
        }
      };

      await axios.post('http://localhost:3001/graphql', {
        query: mutation,
        variables: variables
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Guardado en ventas locatarios con GraphQL (3001)');
    } catch (e) {
      console.error('❌ Error guardando en ventas GraphQL:', e instanceof Error ? e.message : e);
    }
  }

  // ✅ VERSIONES SIMPLIFICADAS - SIN validaciones estrictas:
  private async obtenerDatosUsuario(idUsuario: string | Types.ObjectId | undefined) {
  // ✅ CONVERTIR A STRING Y MANEJAR UNDEFINED
  const usuarioId = idUsuario ? idUsuario.toString() : null;
  
  if (!usuarioId) {
    console.warn('⚠️ ID de usuario no válido');
    return { 
      nombre: 'Usuario no disponible', 
      apellido: '',
      nombreUsuario: 'N/A',
      direccion: 'Dirección no disponible',
      _id: 'desconocido'
    };
  }
  
  try {
    const res = await axios.get(`http://localhost:3000/usuarios/${usuarioId}`);
    const data = res.data;
    
    return {
      ...data,
      nombre: data.nombre || 'N/A',
      apellido: data.apellido || 'N/A',
      nombreUsuario: data.nombreUsuario || `${data.nombre} ${data.apellido}`,
      direccion: this.normalizarDireccion(data.direccion),
      _id: data._id || usuarioId
    };
  } catch (error: unknown) {
    console.error('❌ Error obteniendo datos de usuario:', error);
    return { 
      nombre: 'Usuario no disponible', 
      apellido: '',
      nombreUsuario: 'N/A',
      direccion: 'Dirección no disponible',
      _id: usuarioId
    };
  }
}

  private async obtenerDatosLocal(idLocal: string | Types.ObjectId | undefined) {
  // ✅ CONVERTIR A STRING Y MANEJAR UNDEFINED
  const localId = idLocal ? idLocal.toString() : null;
  
  if (!localId) {
    console.warn('⚠️ ID de local no válido');
    return { 
      nombreLocal: 'Local no disponible', 
      direccion: 'Dirección no disponible',
      _id: 'desconocido'
    };
  }
  
  try {
    const res = await axios.get(`http://localhost:3000/locatarios/${localId}`);
    const data = res.data;
    
    return {
      ...data,
      nombreLocal: data.nombreLocal || 'Local no disponible',
      direccion: this.normalizarDireccion(data.direccion),
      _id: data._id || localId
    };
  } catch (error: unknown) {
    console.error('❌ Error obteniendo datos de local:', error);
    return { 
      nombreLocal: 'Local no disponible', 
      direccion: 'Dirección no disponible',
      _id: localId
    };
  }
}

   private async obtenerDatosRepartidor(idRepartidor: string | Types.ObjectId | undefined) {
  // ✅ CONVERTIR A STRING Y MANEJAR UNDEFINED
  const repartidorId = idRepartidor ? idRepartidor.toString() : null;
  
  if (!repartidorId) {
    console.warn('⚠️ ID de repartidor no válido');
    return {
      _id: 'desconocido',
      nombre: 'N/A',
      apellido: 'N/A',
      nombreUsuario: 'Repartidor no disponible',
      usuarioRepartidor: 'Repartidor no disponible',
      vehiculo: 'Vehículo no especificado',
      patente: 'Patente no especificada',
      valoracion: 0,
      telefono: '',
      correo: ''
    };
  }
  
  try {
    const res = await axios.get(`http://localhost:3000/usuarios/${repartidorId}`);
    const data = res.data;
    
    return {
      _id: data._id || repartidorId,
      nombre: data.nombre || 'N/A',
      apellido: data.apellido || 'N/A',
      nombreUsuario: data.nombreUsuario || data.usuarioRepartidor || `${data.nombre} ${data.apellido}`,
      usuarioRepartidor: data.usuarioRepartidor || data.nombreUsuario || `${data.nombre} ${data.apellido}`,
      vehiculo: data.vehiculo || 'Vehículo no especificado',
      patente: data.patente || 'Patente no especificada',
      valoracion: data.valoracionRepartidor || 0,
      telefono: data.telefono || '',
      correo: data.correo || ''
    };
  } catch (error: unknown) {
    console.error('❌ Error obteniendo datos de repartidor:', error);
    return { 
      _id: repartidorId,
      nombre: 'N/A',
      apellido: 'N/A',
      nombreUsuario: 'Repartidor no disponible',
      usuarioRepartidor: 'Repartidor no disponible',
      vehiculo: 'Vehículo no disponible',
      patente: 'Patente no disponible',
      valoracion: 0,
      telefono: '',
      correo: ''
    };
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
        distancia: 'No calculada',
        tiempoEntrega: 'No calculado'
      });
      console.log('✅ Guardado en entregas repartidores (3003)');
    } catch (e) {
      console.error('❌ Error guardando en entregas:', e instanceof Error ? e.message : e);
    }
  }

  async valorarPedidoRealizado(
  pedidoRealizadoId: string, 
  valoraciones: {
    valoracionPedido: number;
    valoracionDelivery: number;
    valoracionLocal: number;
  }
): Promise<any> {
  const { valoracionPedido, valoracionDelivery, valoracionLocal } = valoraciones;
  
  // ✅ VALIDAR RANGOS
  if (valoracionPedido < 0 || valoracionPedido > 5 ||
      valoracionDelivery < 0 || valoracionDelivery > 5 ||
      valoracionLocal < 0 || valoracionLocal > 5) {
    throw new BadRequestException('Las valoraciones deben estar entre 0 y 5');
  }

  try {
    console.log(`🌟 Valorando pedido realizado: ${pedidoRealizadoId}`);
    console.log(`📊 Valoraciones: Pedido=${valoracionPedido}, Delivery=${valoracionDelivery}, Local=${valoracionLocal}`);

    // ✅ BUSCAR EL PEDIDO PRIMERO PARA DEBUG
    const pedidoExistente = await this.pedidoRealizadoModel.findById(pedidoRealizadoId).lean().exec();
    
    if (!pedidoExistente) {
      console.error(`❌ Pedido realizado no encontrado: ${pedidoRealizadoId}`);
      throw new BadRequestException('Pedido realizado no encontrado');
    }

    console.log(`✅ Pedido encontrado: ${pedidoExistente.nombrePedido}`);
    console.log(`📦 Comidas: ${pedidoExistente.comidas?.length || 0}`);
    console.log(`🎉 Promociones: ${pedidoExistente.promociones?.length || 0}`);

    // ✅ VERIFICAR SI YA ESTÁ VALORADO
    if (pedidoExistente.valoracionCompletada) {
      console.warn(`⚠️ Pedido ya valorado: ${pedidoRealizadoId}`);
      throw new BadRequestException('Este pedido ya ha sido valorado');
    }

    // ✅ ACTUALIZAR CON VALIDACIÓN
    const pedidoActualizado = await this.pedidoRealizadoModel.findByIdAndUpdate(
      pedidoRealizadoId,
      {
        $set: {
          valoracionPedido: Number(valoracionPedido),
          valoracionDelivery: Number(valoracionDelivery), 
          valoracionLocal: Number(valoracionLocal),
          valoracionCompletada: true
        }
      },
      { 
        new: true,
        runValidators: true,
        lean: true
      }
    ).exec();

    if (!pedidoActualizado) {
      console.error(`❌ Error actualizando pedido: ${pedidoRealizadoId}`);
      throw new BadRequestException('Error actualizando el pedido');
    }

    console.log(`✅ Pedido valorado exitosamente: ${pedidoRealizadoId}`);

    // ✅ ENVIAR VALORACIONES A OTROS MICROSERVICIOS (SIN AWAIT PARA NO BLOQUEAR)
    this.enviarValoracionesAMicroservicios(pedidoActualizado).catch(error => {
      console.error('❌ Error enviando valoraciones a microservicios (no crítico):', error);
    });

    // ✅ RETORNAR ESTRUCTURA CONSISTENTE
    return {
      _id: pedidoActualizado._id.toString(),
      pedidoOriginalId: pedidoActualizado.pedidoOriginalId || pedidoActualizado._id.toString(),
      nombrePedido: pedidoActualizado.nombrePedido || 'Pedido sin nombre',
      idComprador: pedidoActualizado.idComprador ? pedidoActualizado.idComprador.toString() : '',
      idLocal: pedidoActualizado.idLocal ? pedidoActualizado.idLocal.toString() : '',
      precioPedido: pedidoActualizado.precioPedido || 0,
      pago: pedidoActualizado.pago || 'No especificado',
      fechaPedido: pedidoActualizado.fechaPedido ? new Date(pedidoActualizado.fechaPedido).toISOString() : new Date().toISOString(),
      fechaEntrega: pedidoActualizado.fechaEntrega ? new Date(pedidoActualizado.fechaEntrega).toISOString() : new Date().toISOString(),
      fechaRegistro: pedidoActualizado.fechaRegistro ? new Date(pedidoActualizado.fechaRegistro).toISOString() : new Date().toISOString(),
      esDelivery: pedidoActualizado.esDelivery || false,
      direccionEntrega: pedidoActualizado.direccionEntrega || null,
      comidas: pedidoActualizado.comidas || [],
      promociones: pedidoActualizado.promociones || [], // ✅ INCLUIR PROMOCIONES
      propina: pedidoActualizado.propina || false,
      cantidadPropina: pedidoActualizado.cantidadPropina || 0,
      repartidor: pedidoActualizado.repartidor ? pedidoActualizado.repartidor.toString() : '',
      codigoPedido: pedidoActualizado.codigoPedido || 0,
      direccionLocal: pedidoActualizado.direccionLocal || null,
      valoracionPedido: pedidoActualizado.valoracionPedido,
      valoracionDelivery: pedidoActualizado.valoracionDelivery,
      valoracionLocal: pedidoActualizado.valoracionLocal,
      valoracionCompletada: pedidoActualizado.valoracionCompletada,
      datosUsuario: {
        nombre: pedidoActualizado.datosUsuario?.nombre || 'Usuario',
        apellido: pedidoActualizado.datosUsuario?.apellido || 'Desconocido',
        nombreUsuario: pedidoActualizado.datosUsuario?.nombreUsuario || 'N/A',
        direccion: pedidoActualizado.datosUsuario?.direccion || 'Sin dirección'
      },
      datosLocal: {
        nombreLocal: pedidoActualizado.datosLocal?.nombreLocal || 'Local desconocido',
        direccion: pedidoActualizado.datosLocal?.direccion || 'Sin dirección'
      },
      datosRepartidor: {
        nombreUsuario: pedidoActualizado.datosRepartidor?.nombreUsuario || 'Repartidor',
        vehiculo: pedidoActualizado.datosRepartidor?.vehiculo || 'N/A',
        patente: pedidoActualizado.datosRepartidor?.patente || 'N/A',
        valoracion: pedidoActualizado.datosRepartidor?.valoracion || 0
      }
    };

  } catch (error: unknown) {
    console.error('❌ Error completo valorando pedido:', error);
    
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new BadRequestException(`Error guardando valoraciones: ${error.message}`);
    }
    
    throw new BadRequestException(`Error desconocido guardando las valoraciones: ${String(error)}`);
  }
}

  private async enviarValoracionesAMicroservicios(pedido: any) {
    try {
      await this.actualizarValoracionRepartidor(
        pedido.repartidor, 
        pedido.valoracionDelivery
      );

      await this.actualizarValoracionLocal(
        pedido.idLocal, 
        pedido.valoracionLocal
      );

      await this.enviarValoracionesAReportes(pedido);

    } catch (error) {
      console.error('❌ Error enviando valoraciones a microservicios:', error);
    }
  }

  private async actualizarValoracionRepartidor(idRepartidor: string | Types.ObjectId | undefined, nuevaValoracion: number) {
  // ✅ CONVERTIR A STRING Y MANEJAR UNDEFINED
  const repartidorId = idRepartidor ? idRepartidor.toString() : null;
  
  if (!repartidorId) {
    console.warn('⚠️ ID de repartidor no válido para valoración');
    return;
  }
  
  try {
    await this.guardarValoracionEnEntrega(repartidorId, nuevaValoracion);
    await this.actualizarPromedioRepartidor(repartidorId, nuevaValoracion);
  } catch (error) {
    console.error(`❌ Error actualizando valoración del repartidor:`, error);
  }
}

private async guardarValoracionEnEntrega(idRepartidor: string, valoracion: number) {
  try {
    const mutation = `
      mutation ActualizarValoracionEntrega($repartidorId: String!, $valoracion: Float!) {
        actualizarValoracionEntrega(repartidorId: $repartidorId, valoracion: $valoracion) {
          _id
          valoracionRecibida
          fechaValoracion
        }
      }
    `;

    const response = await axios.post('http://localhost:3003/graphql', {
      query: mutation,
      variables: {
        repartidorId: idRepartidor, // ✅ YA ES STRING
        valoracion: valoracion
      }
    });

    if (response.data.errors) {
      console.error('❌ Errores GraphQL:', response.data.errors);
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.actualizarValoracionEntrega;

  } catch (error: unknown) {
    console.error('❌ Error guardando valoración en entrega:', error);
    
    if (error instanceof Error) {
      throw new BadRequestException(`Error guardando valoración: ${error.message}`);
    } else {
      throw new BadRequestException('Error desconocido guardando valoración en entrega');
    }
  }
}
  private async actualizarPromedioRepartidor(idRepartidor: string, nuevaValoracion: number) {
  try {
    await axios.patch(`http://localhost:3000/usuarios/${idRepartidor}/valoracion`, {
      nuevaValoracion: nuevaValoracion,
      tipo: 'repartidor'
    });
  } catch (error) {
    console.error(`❌ Error actualizando promedio del repartidor:`, error);
  }
}

private async actualizarValoracionLocal(idLocal: string | Types.ObjectId | undefined, nuevaValoracion: number) {
  // ✅ CONVERTIR A STRING Y MANEJAR UNDEFINED
  const localId = idLocal ? idLocal.toString() : null;
  
  if (!localId) {
    console.warn('⚠️ ID de local no válido para valoración');
    return;
  }
  
  try {
    await axios.patch(`http://localhost:3000/locatarios/${localId}/valoracion`, {
      nuevaValoracion
    });
  } catch (error) {
    console.error(`❌ Error actualizando valoración del local:`, error);
  }
}
  private async enviarValoracionesAReportes(pedido: any) {
    try {
      await axios.post('http://localhost:3004/stats/valoracion', {
        pedidoId: pedido._id,
        idLocal: pedido.idLocal,
        idRepartidor: pedido.repartidor,
        valoracionPedido: pedido.valoracionPedido,
        valoracionDelivery: pedido.valoracionDelivery,
        valoracionLocal: pedido.valoracionLocal,
        fechaValoracion: new Date()
      });
    } catch (error) {
      console.error('❌ Error enviando valoraciones a reportes:', error);
    }
  }

  // ✅ MANTENER MÉTODO DE MIGRACIÓN SIMPLIFICADO:
  async migrarDatosRepartidorExistentes() {
    const pedidosSinDatos = await this.pedidoModel
      .find({ 
        repartidor: { $exists: true, $ne: null },
        datosRepartidor: { $exists: false }
      })
      .lean()
      .exec();
    
    for (const pedido of pedidosSinDatos) {
      try {
        const datosRepartidor = await this.obtenerDatosRepartidor(pedido.repartidor);
        
        await this.pedidoModel.findByIdAndUpdate(pedido._id, {
          datosRepartidor: {
            _id: datosRepartidor._id,
            nombreUsuario: datosRepartidor.nombreUsuario,
            usuarioRepartidor: datosRepartidor.usuarioRepartidor,
            vehiculo: datosRepartidor.vehiculo,
            patente: datosRepartidor.patente,
            valoracion: datosRepartidor.valoracion,
            telefono: datosRepartidor.telefono
          }
        });
        
      } catch (error) {
        console.error(`❌ Error migrando pedido ${pedido._id}:`, error);
      }
    }
  }

  // ✅ AGREGAR MÉTODO FALTANTE:
  async obtenerPedidosPendientesValoracion(userId: string): Promise<any[]> {
  console.log(`🔍 Buscando pedidos pendientes de valoración para usuario: ${userId}`);
  
  try {
    const pedidos = await this.pedidoRealizadoModel
      .find({ 
        idComprador: new Types.ObjectId(userId), // ✅ USAR CAMPO CORRECTO
        valoracionCompletada: { $ne: true }
      })
      .lean()
      .exec();

    console.log(`📊 Encontrados ${pedidos.length} pedidos pendientes de valoración`);
    
    return pedidos.map(pedido => ({
      _id: pedido._id.toString(),
      pedidoOriginalId: pedido.pedidoOriginalId || pedido._id.toString(),
      nombrePedido: pedido.nombrePedido || 'Pedido sin nombre',
      idComprador: pedido.idComprador ? pedido.idComprador.toString() : userId,
      idLocal: pedido.idLocal ? pedido.idLocal.toString() : '',
      precioPedido: pedido.precioPedido || 0,
      pago: pedido.pago || 'No especificado',
      fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
      fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toISOString() : new Date().toISOString(),
      fechaRegistro: pedido.fechaRegistro ? new Date(pedido.fechaRegistro).toISOString() : new Date().toISOString(),
      esDelivery: pedido.esDelivery || false,
      direccionEntrega: pedido.direccionEntrega || null,
      comidas: pedido.comidas || [],
      promociones: pedido.promociones || [], // ✅ SIEMPRE ARRAY
      propina: pedido.propina || false,
      cantidadPropina: pedido.cantidadPropina || 0,
      repartidor: pedido.repartidor ? pedido.repartidor.toString() : '',
      codigoPedido: pedido.codigoPedido || 0,
      direccionLocal: pedido.direccionLocal || null,
      valoracionPedido: pedido.valoracionPedido || 0,
      valoracionDelivery: pedido.valoracionDelivery || 0,
      valoracionLocal: pedido.valoracionLocal || 0,
      valoracionCompletada: pedido.valoracionCompletada || false,
      // ✅ DATOS DENORMALIZADOS CON VALORES POR DEFECTO
      datosUsuario: {
        nombre: pedido.datosUsuario?.nombre || 'Usuario',
        apellido: pedido.datosUsuario?.apellido || 'Desconocido',
        nombreUsuario: pedido.datosUsuario?.nombreUsuario || 'N/A',
        direccion: pedido.datosUsuario?.direccion || 'Sin dirección'
      },
      datosLocal: {
        nombreLocal: pedido.datosLocal?.nombreLocal || 'Local desconocido',
        direccion: pedido.datosLocal?.direccion || 'Sin dirección'
      },
      datosRepartidor: {
        nombreUsuario: pedido.datosRepartidor?.nombreUsuario || 'Repartidor',
        vehiculo: pedido.datosRepartidor?.vehiculo || 'N/A',
        patente: pedido.datosRepartidor?.patente || 'N/A',
        valoracion: pedido.datosRepartidor?.valoracion || 0
      }
    }));
    
  } catch (error) {
    console.error('❌ Error obteniendo pedidos pendientes de valoración:', error);
    throw new BadRequestException('Error obteniendo pedidos pendientes de valoración');
  }
}

}