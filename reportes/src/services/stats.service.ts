import { Injectable } from '@nestjs/common';
import { Model, PipelineStage } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { 
  PedidoRealizadoData, 
  PedidoRealizadoDocument, 
  EstadisticasGenerales,
  VentasPorLocal,
  EntregasPorRepartidor,
  EstadisticasPorFecha,
  VentasPorDia
} from '../interfaces/pedido-realizado.interface';
import { PedidoRealizado } from '../schemas/pedido-realizado.schema';
import { VentaReporte } from '../schemas/venta-reporte.schema';

@Injectable()
export class StatsService {
  constructor(
    // ❌ ELIMINAR ESTA LÍNEA - NO EXISTE UsuarioModel EN REPORTES
    // @InjectModel('Usuario') private usuarioModel: Model<any>,
    
    // ✅ SOLO ESTOS DOS MODELOS SON NECESARIOS
    @InjectModel(PedidoRealizado.name) private pedidoRealizadoModel: Model<PedidoRealizado>,
    @InjectModel(VentaReporte.name) private ventaReporteModel: Model<VentaReporte>,
  ) {}

  // ========== REGISTRAR PEDIDO REALIZADO ==========
  async registrarPedidoRealizado(pedidoData: any): Promise<PedidoRealizado> {
    console.log('📊 REPORTES: Registrando pedido realizado:', pedidoData.pedidoId);
    
    try {
      const pedido = new this.pedidoRealizadoModel({
        pedidoId: pedidoData.pedidoId,
        nombrePedido: pedidoData.nombrePedido,
        precio: pedidoData.precio,
        fechaEntrega: pedidoData.fechaEntrega,
        fechaRegistro: new Date(),
        usuario: {
          id: pedidoData.usuario.id,
          nombre: pedidoData.usuario.nombre,
          apellido: pedidoData.usuario.apellido
        },
        local: {
          id: pedidoData.local.id,
          nombreLocal: pedidoData.local.nombreLocal
        },
        repartidor: {
          id: pedidoData.repartidor.id,
          nombre: pedidoData.repartidor.nombre
        },
        comidas: pedidoData.comidas || [],
        propina: pedidoData.propina || 0,
        totalConPropina: pedidoData.precio + (pedidoData.propina || 0)
      });

      const pedidoGuardado = await pedido.save();
      console.log('✅ REPORTES: Pedido guardado exitosamente');
      return pedidoGuardado;
    } catch (error) {
      console.error('❌ REPORTES: Error guardando pedido:', error);
      throw error;
    }
  }

  // ========== TOP LOCALES PARA ADMIN - VERSIÓN SIMPLE ==========
  async obtenerTopLocales(limite: number = 20): Promise<any[]> {
    console.log('📊 REPORTES: Obteniendo top locales (método simple)');
    
    try {
      const pedidos = await this.pedidoRealizadoModel.find().exec();
      
      if (pedidos.length === 0) {
        console.log('📊 REPORTES: No hay pedidos registrados');
        return [];
      }
      
      // Agrupar por local manualmente
      const localesStats: Record<string, any> = {};
      
      pedidos.forEach(pedido => {
        const localId = pedido.local.id.toString();
        const localNombre = pedido.local.nombreLocal;
        
        if (!localesStats[localId]) {
          localesStats[localId] = {
            _id: localId,
            nombreLocal: localNombre,
            cantidadPedidos: 0,
            totalVentas: 0,
            totalPropinas: 0,
            totalCompleto: 0
          };
        }
        
        localesStats[localId].cantidadPedidos++;
        localesStats[localId].totalVentas += pedido.precio;
        localesStats[localId].totalPropinas += pedido.propina || 0;
        localesStats[localId].totalCompleto += pedido.precio + (pedido.propina || 0);
      });
      
      // Convertir a array y agregar promedio
      const resultado = Object.values(localesStats).map((local: any) => ({
        ...local,
        promedioVentaPorPedido: local.cantidadPedidos > 0 
          ? Math.round(local.totalVentas / local.cantidadPedidos)
          : 0
      }));
      
      // Ordenar por total completo (descendente)
      resultado.sort((a, b) => b.totalCompleto - a.totalCompleto);
      
      const resultadoLimitado = resultado.slice(0, limite);
      console.log(`📊 REPORTES: Top ${resultadoLimitado.length} locales procesados`);
      
      return resultadoLimitado;
      
    } catch (error) {
      console.error('❌ REPORTES: Error obteniendo top locales:', error);
      return [];
    }
  }

  // ========== ESTADÍSTICAS GENERALES ==========
  async obtenerEstadisticasGenerales(): Promise<any> {
    try {
      const pedidos = await this.pedidoRealizadoModel.find().exec();
      
      const totalPedidos = pedidos.length;
      const totalVentas = pedidos.reduce((sum, p) => sum + p.precio, 0);
      const totalPropinas = pedidos.reduce((sum, p) => sum + (p.propina || 0), 0);
      const totalCompleto = totalVentas + totalPropinas;
      
      return {
        resumenGeneral: {
          totalPedidos,
          totalVentas,
          totalPropinas,
          totalCompleto,
          promedioVentaPorPedido: totalPedidos > 0 ? totalVentas / totalPedidos : 0
        }
      };
    } catch (error) {
      console.error('❌ REPORTES: Error obteniendo estadísticas:', error);
      return { 
        resumenGeneral: { 
          totalPedidos: 0, 
          totalVentas: 0, 
          totalPropinas: 0, 
          totalCompleto: 0, 
          promedioVentaPorPedido: 0 
        } 
      };
    }
  }

  // ========== ESTADÍSTICAS POR FECHA ==========
  async obtenerEstadisticasPorFecha(fechaInicio: string, fechaFin: string): Promise<any> {
    try {
      const pedidos = await this.pedidoRealizadoModel
        .find({
          fechaEntrega: {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin)
          }
        })
        .exec();

      return {
        resumenPeriodo: {
          fechaInicio,
          fechaFin,
          totalPedidos: pedidos.length,
          totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
          totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0)
        }
      };
    } catch (error) {
      console.error('❌ REPORTES: Error obteniendo estadísticas por fecha:', error);
      return { 
        resumenPeriodo: { 
          fechaInicio, 
          fechaFin, 
          totalPedidos: 0, 
          totalVentas: 0, 
          totalPropinas: 0 
        } 
      };
    }
  }

  // ========== ESTADÍSTICAS DE LOCAL ==========
  async obtenerEstadisticasLocal(localId: string): Promise<any> {
    try {
      const pedidos = await this.pedidoRealizadoModel
        .find({ 'local.id': localId })
        .exec();

      if (pedidos.length === 0) {
        return {
          localId,
          nombreLocal: 'Local no encontrado',
          totalPedidos: 0,
          totalVentas: 0,
          totalPropinas: 0
        };
      }

      return {
        localId,
        nombreLocal: pedidos[0].local.nombreLocal,
        totalPedidos: pedidos.length,
        totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
        totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
        promedioVentaPorPedido: pedidos.reduce((sum, p) => sum + p.precio, 0) / pedidos.length
      };
    } catch (error) {
      console.error('❌ REPORTES: Error obteniendo estadísticas de local:', error);
      return { 
        localId, 
        nombreLocal: 'Error', 
        totalPedidos: 0, 
        totalVentas: 0, 
        totalPropinas: 0 
      };
    }
  }

  // ========== MÉTODOS ADICIONALES SIMPLIFICADOS ==========
  async obtenerPedidosRealizados(filtros?: any): Promise<PedidoRealizado[]> {
    const query: any = {};
    
    if (filtros?.fechaInicio && filtros?.fechaFin) {
      query['fechaEntrega'] = {
        $gte: new Date(filtros.fechaInicio),
        $lte: new Date(filtros.fechaFin)
      };
    }
    
    if (filtros?.localId) {
      query['local.id'] = filtros.localId;
    }

    return this.pedidoRealizadoModel
      .find(query)
      .sort({ fechaEntrega: -1 })
      .limit(100) // Limitar resultados
      .exec();
  }

  async buscarPedidosPorUsuario(usuarioId: string): Promise<PedidoRealizado[]> {
    return this.pedidoRealizadoModel
      .find({ 'usuario.id': usuarioId })
      .sort({ fechaEntrega: -1 })
      .limit(50)
      .exec();
  }

  async buscarPedidosPorNombre(nombrePedido: string): Promise<PedidoRealizado[]> {
    return this.pedidoRealizadoModel
      .find({ 
        nombrePedido: { $regex: nombrePedido, $options: 'i' }
      })
      .sort({ fechaEntrega: -1 })
      .limit(50)
      .exec();
  }

  // ========== MÉTODOS PARA COMPATIBILIDAD ==========
  async registrarVentaReporte(ventaData: any): Promise<VentaReporte> {
    const venta = new this.ventaReporteModel(ventaData);
    return venta.save();
  }

  async obtenerVentasReporte(filtros?: any): Promise<VentaReporte[]> {
    return this.ventaReporteModel.find(filtros || {}).exec();
  }

  async obtenerEstadisticasRepartidor(repartidorId: string): Promise<any> {
    // Este método devuelve estadísticas limitadas ya que los repartidores tienen su propio microservicio
    const pedidos = await this.pedidoRealizadoModel
      .find({ 'repartidor.id': repartidorId })
      .exec();

    return {
      repartidorId,
      totalEntregas: pedidos.length,
      totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
      mensaje: 'Para estadísticas completas de repartidores use el microservicio de repartidores'
    };
  }

  async obtenerTopRepartidores(limite: number = 10): Promise<any[]> {
    // Redirigir al microservicio de repartidores
    return [{ 
      mensaje: 'Use el microservicio de repartidores (puerto 3003) para el top de repartidores',
      endpoint: 'http://localhost:3003/graphql'
    }];
  }

  async limpiarPedidosAntiguos(diasAntiguedad: number = 365): Promise<{ eliminados: number }> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);
    
    const resultado = await this.pedidoRealizadoModel
      .deleteMany({ fechaEntrega: { $lt: fechaLimite } })
      .exec();
    
    console.log(`🗑️ REPORTES: Eliminados ${resultado.deletedCount} pedidos antiguos`);
    return { eliminados: resultado.deletedCount };
  }
}