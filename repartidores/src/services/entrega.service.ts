import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Entrega } from '../schemas/entrega.schema';

@Injectable()
export class EntregaService {
  constructor(
    @InjectModel(Entrega.name) private entregaModel: Model<Entrega>,
  ) {}

  async registrarEntrega(entregaData: any): Promise<Entrega> {
    console.log('📦 Registrando nueva entrega:', entregaData.pedidoId);
    
    const entrega = new this.entregaModel({
      ...entregaData,
      repartidorId: new Types.ObjectId(entregaData.repartidorId),
      pedidoId: new Types.ObjectId(entregaData.pedidoId),
      cliente: {
        ...entregaData.cliente,
        id: new Types.ObjectId(entregaData.cliente.id)
      },
      local: {
        ...entregaData.local,
        id: new Types.ObjectId(entregaData.local.id)
      },
      fechaEntrega: new Date(),
      valoracionRegistrada: false,
      valoracionRecibida: 0
    });

    const entregaGuardada = await entrega.save();
    console.log('✅ Entrega registrada exitosamente');

    // ✅ ENVIAR DATOS AL MICROSERVICIO DE REPORTES
    await this.enviarAReportes(entregaGuardada);

    return entregaGuardada;
  }

  // ✅ MÉTODO PARA ENVIAR DATOS A REPORTES
  private async enviarAReportes(entrega: Entrega): Promise<void> {
    try {
      const datosParaReporte = {
        pedidoId: entrega.pedidoId.toString(),
        nombrePedido: entrega.nombrePedido,
        precio: entrega.valorEntrega,
        fechaEntrega: entrega.fechaEntrega,
        usuario: {
          id: entrega.cliente.id.toString(),
          nombre: entrega.cliente.nombre,
          apellido: entrega.cliente.nombre.split(' ')[1] || ''
        },
        local: {
          id: entrega.local.id.toString(),
          nombreLocal: entrega.local.nombreLocal
        },
        repartidor: {
          id: entrega.repartidorId.toString(),
          nombre: 'Repartidor' // Se puede obtener de otro servicio si es necesario
        },
        comidas: [], // Agregar si tienes esta info
        propina: entrega.propina || 0,
        totalConPropina: entrega.valorEntrega + (entrega.propina || 0)
      };

      console.log('📊 Enviando datos a reportes...');
      const response = await fetch('http://localhost:3004/stats/pedido-realizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaReporte)
      });

      if (response.ok) {
        console.log('✅ Datos enviados a reportes exitosamente');
      } else {
        console.error('❌ Error enviando datos a reportes:', response.status);
      }
    } catch (error) {
      console.error('❌ Error conectando con microservicio de reportes:', error);
    }
  }

  async obtenerEntregasRepartidor(repartidorId: string): Promise<Entrega[]> {
    console.log(`🔍 Buscando entregas para repartidor: ${repartidorId}`);
    
    if (!Types.ObjectId.isValid(repartidorId)) {
      console.error('❌ ID de repartidor no válido:', repartidorId);
      return [];
    }

    const entregas = await this.entregaModel
      .find({ repartidorId: new Types.ObjectId(repartidorId) })
      .sort({ fechaEntrega: -1 })
      .exec();

    console.log(`📦 Encontradas ${entregas.length} entregas para repartidor ${repartidorId}`);
    return entregas;
  }

  async obtenerEstadisticas(repartidorId: string): Promise<any> {
    console.log(`📊 Calculando estadísticas para repartidor: ${repartidorId}`);
    
    if (!Types.ObjectId.isValid(repartidorId)) {
      return {
        totalEntregas: 0,
        totalGanancias: 0,
        totalPropinas: 0,
        promedioGananciaPorEntrega: 0
      };
    }

    const entregas = await this.entregaModel
      .find({ repartidorId: new Types.ObjectId(repartidorId) })
      .exec();

    const totalEntregas = entregas.length;
    const totalGanancias = entregas.reduce((sum, e) => sum + e.valorEntrega + (e.propina || 0), 0);
    const totalPropinas = entregas.reduce((sum, e) => sum + (e.propina || 0), 0);

    return {
      totalEntregas,
      totalGanancias,
      totalPropinas,
      promedioGananciaPorEntrega: totalEntregas > 0 ? totalGanancias / totalEntregas : 0
    };
  }

  async actualizarValoracionMasReciente(repartidorId: string, valoracion: number): Promise<Entrega> {
    const entrega = await this.entregaModel.findOneAndUpdate(
      { 
        repartidorId: new Types.ObjectId(repartidorId),
        valoracionRegistrada: false
      },
      {
        valoracionRecibida: valoracion,
        fechaValoracion: new Date(),
        valoracionRegistrada: true
      },
      { 
        new: true,
        sort: { fechaEntrega: -1 }
      }
    );

    if (!entrega) {
      throw new Error('No se encontró entrega reciente sin valoración para este repartidor');
    }

    return entrega;
  }

  async obtenerEntregasConValoracion(repartidorId: string): Promise<Entrega[]> {
    return this.entregaModel
      .find({ 
        repartidorId: new Types.ObjectId(repartidorId),
        valoracionRegistrada: true
      })
      .sort({ fechaValoracion: -1 })
      .exec();
  }

  async calcularPromedioValoracion(repartidorId: string): Promise<number> {
    const entregas = await this.entregaModel
      .find({ 
        repartidorId: new Types.ObjectId(repartidorId),
        valoracionRegistrada: true
      })
      .exec();

    if (entregas.length === 0) return 0;

    const suma = entregas.reduce((acc, entrega) => acc + entrega.valoracionRecibida, 0);
    return Math.round((suma / entregas.length) * 10) / 10;
  }

  // ✅ MÉTODO PARA TOP REPARTIDORES - VERSION SIMPLIFICADA
  async obtenerTopRepartidoresStats(): Promise<any[]> {
    console.log('📊 Obteniendo estadísticas de top repartidores');
    
    try {
      // Obtener todas las entregas agrupadas por repartidor
      const entregas = await this.entregaModel.find().exec();
      
      // Procesar datos manualmente para evitar errores de tipos
      const repartidoresMap = new Map<string, any>();
      
      entregas.forEach((entrega: any) => {
        const repartidorId = entrega.repartidorId.toString();
        
        if (!repartidoresMap.has(repartidorId)) {
          repartidoresMap.set(repartidorId, {
            repartidorId,
            nombreRepartidor: `Repartidor ${repartidorId.slice(-4)}`,
            cantidadEntregas: 0,
            totalPropinas: 0,
            totalGanancias: 0,
            valoraciones: [],
            vehiculo: 'No especificado',
            patente: 'No especificada'
          });
        }
        
        const repartidor = repartidoresMap.get(repartidorId);
        repartidor.cantidadEntregas += 1;
        repartidor.totalPropinas += entrega.propina || 0;
        repartidor.totalGanancias += entrega.valorEntrega + (entrega.propina || 0);
        
        if (entrega.valoracionRegistrada) {
          repartidor.valoraciones.push(entrega.valoracionRecibida);
        }
      });
      
      // Convertir a array y calcular promedios
      const resultado = Array.from(repartidoresMap.values()).map((repartidor: any) => ({
        ...repartidor,
        valoracionPromedio: repartidor.valoraciones.length > 0 
          ? Math.round((repartidor.valoraciones.reduce((a: number, b: number) => a + b, 0) / repartidor.valoraciones.length) * 10) / 10
          : 0,
        promedioPropinasPorEntrega: repartidor.cantidadEntregas > 0 
          ? Math.round(repartidor.totalPropinas / repartidor.cantidadEntregas)
          : 0
      }));
      
      // Ordenar por cantidad de entregas
      resultado.sort((a, b) => b.cantidadEntregas - a.cantidadEntregas);
      
      // Enriquecer datos con información de usuarios
      const repartidoresEnriquecidos = await Promise.all(
        resultado.map(async (repartidor: any) => {
          try {
            // Intentar obtener datos del microservicio de usuarios
            const userResponse = await fetch(`http://localhost:3000/usuarios/${repartidor.repartidorId}`, {
              timeout: 3000
            } as any);
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              repartidor.nombreRepartidor = 
                userData.usuarioRepartidor || 
                `${userData.nombre} ${userData.apellido}` ||
                repartidor.nombreRepartidor;
              
              repartidor.vehiculo = userData.vehiculo || repartidor.vehiculo;
              repartidor.patente = userData.patente || repartidor.patente;
            }
          } catch (error) {
            console.error(`Error obteniendo datos del repartidor ${repartidor.repartidorId}:`, error);
            // Mantener valores por defecto si hay error
          }
          
          return repartidor;
        })
      );

      console.log(`📊 Encontrados ${repartidoresEnriquecidos.length} repartidores con estadísticas`);
      return repartidoresEnriquecidos.slice(0, 50); // Limitar a 50 resultados
      
    } catch (error) {
      console.error('❌ Error obteniendo top repartidores:', error);
      return [];
    }
  }
}