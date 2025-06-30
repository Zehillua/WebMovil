import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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
    @InjectModel('Usuario') private usuarioModel: Model<any>,
    @InjectModel(PedidoRealizado.name) private pedidoRealizadoModel: Model<PedidoRealizado>, // ✅ CORREGIDO
    @InjectModel(VentaReporte.name) private ventaReporteModel: Model<VentaReporte>, // ✅ CORREGIDO
  ) {}

  // ========== MÉTODOS PARA PEDIDOS REALIZADOS ==========

  async registrarPedidoRealizado(pedidoData: PedidoRealizadoData): Promise<PedidoRealizado> {
    console.log('📊 Registrando pedido realizado en reportes:', pedidoData.pedidoId);
    
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
    console.log('✅ Pedido realizado registrado en reportes');
    return pedidoGuardado;
  }

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
    
    if (filtros?.repartidorId) {
      query['repartidor.id'] = filtros.repartidorId;
    }

    return this.pedidoRealizadoModel
      .find(query)
      .sort({ fechaEntrega: -1 })
      .exec();
  }

  // ========== MÉTODOS PARA VENTAS REPORTE ==========

  async registrarVentaReporte(ventaData: any): Promise<VentaReporte> {
    console.log('📊 Registrando venta en reportes:', ventaData.pedidoId);
    
    const venta = new this.ventaReporteModel({
      pedidoId: ventaData.pedidoId,
      nombrePedido: ventaData.nombrePedido,
      precio: ventaData.precio,
      fechaVenta: ventaData.fechaVenta,
      usuario: {
        id: ventaData.usuario.id,
        nombre: ventaData.usuario.nombre,
        apellido: ventaData.usuario.apellido
      },
      local: {
        id: ventaData.local.id,
        nombreLocal: ventaData.local.nombreLocal
      },
      repartidor: {
        id: ventaData.repartidor.id,
        nombre: ventaData.repartidor.nombre
      },
      comidas: ventaData.comidas || [],
      esDelivery: ventaData.esDelivery || false,
      propina: ventaData.propina || 0,
      totalConPropina: ventaData.precio + (ventaData.propina || 0),
      fechaRegistro: new Date()
    });

    const ventaGuardada = await venta.save();
    console.log('✅ Venta registrada en reportes');
    return ventaGuardada;
  }

  async obtenerVentasReporte(filtros?: any): Promise<VentaReporte[]> {
    const query: any = {};
    
    if (filtros?.fechaInicio && filtros?.fechaFin) {
      query['fechaVenta'] = {
        $gte: new Date(filtros.fechaInicio),
        $lte: new Date(filtros.fechaFin)
      };
    }
    
    if (filtros?.localId) {
      query['local.id'] = filtros.localId;
    }

    return this.ventaReporteModel
      .find(query)
      .sort({ fechaVenta: -1 })
      .exec();
  }

  // ========== ESTADÍSTICAS GENERALES ==========

  async obtenerEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    // Usar pedidos realizados para estadísticas principales
    const pedidos = await this.pedidoRealizadoModel.find().exec();
    
    const totalPedidos = pedidos.length;
    const totalVentas = pedidos.reduce((sum, p) => sum + p.precio, 0);
    const totalPropinas = pedidos.reduce((sum, p) => sum + (p.propina || 0), 0);
    const totalCompleto = totalVentas + totalPropinas;
    
    // Agrupar por local
    const ventasPorLocalMap: Record<string, VentasPorLocal> = pedidos.reduce((acc, pedido) => {
      const localId = pedido.local.id.toString();
      if (!acc[localId]) {
        acc[localId] = {
          nombreLocal: pedido.local.nombreLocal,
          cantidadPedidos: 0,
          totalVentas: 0,
          totalPropinas: 0
        };
      }
      acc[localId].cantidadPedidos++;
      acc[localId].totalVentas += pedido.precio;
      acc[localId].totalPropinas += (pedido.propina || 0);
      return acc;
    }, {} as Record<string, VentasPorLocal>);

    // Agrupar por repartidor
    const entregasPorRepartidorMap: Record<string, EntregasPorRepartidor> = pedidos.reduce((acc, pedido) => {
      const repartidorId = pedido.repartidor.id.toString();
      if (!acc[repartidorId]) {
        acc[repartidorId] = {
          nombreRepartidor: pedido.repartidor.nombre,
          cantidadEntregas: 0,
          totalPropinas: 0
        };
      }
      acc[repartidorId].cantidadEntregas++;
      acc[repartidorId].totalPropinas += (pedido.propina || 0);
      return acc;
    }, {} as Record<string, EntregasPorRepartidor>);

    return {
      resumenGeneral: {
        totalPedidos,
        totalVentas,
        totalPropinas,
        totalCompleto,
        promedioVentaPorPedido: totalPedidos > 0 ? totalVentas / totalPedidos : 0
      },
      ventasPorLocal: Object.values(ventasPorLocalMap),
      entregasPorRepartidor: Object.values(entregasPorRepartidorMap)
    };
  }

  async obtenerEstadisticasPorFecha(fechaInicio: string, fechaFin: string): Promise<EstadisticasPorFecha> {
    const pedidos = await this.pedidoRealizadoModel
      .find({
        fechaEntrega: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        }
      })
      .exec();

    // Agrupar por día
    const ventasPorDiaMap: Record<string, VentasPorDia> = pedidos.reduce((acc, pedido) => {
      const fecha = new Date(pedido.fechaEntrega).toISOString().split('T')[0];
      if (!acc[fecha]) {
        acc[fecha] = {
          fecha,
          cantidadPedidos: 0,
          totalVentas: 0,
          totalPropinas: 0
        };
      }
      acc[fecha].cantidadPedidos++;
      acc[fecha].totalVentas += pedido.precio;
      acc[fecha].totalPropinas += (pedido.propina || 0);
      return acc;
    }, {} as Record<string, VentasPorDia>);

    return {
      resumenPeriodo: {
        fechaInicio,
        fechaFin,
        totalPedidos: pedidos.length,
        totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
        totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0)
      },
      ventasPorDia: Object.values(ventasPorDiaMap).sort((a, b) => a.fecha.localeCompare(b.fecha))
    };
  }

  // ========== MÉTODOS ESPECÍFICOS ==========

  async obtenerEstadisticasLocal(localId: string): Promise<any> {
    const pedidos = await this.pedidoRealizadoModel
      .find({ 'local.id': localId })
      .exec();

    if (pedidos.length === 0) {
      return {
        localId,
        nombreLocal: 'Local no encontrado',
        totalPedidos: 0,
        totalVentas: 0,
        totalPropinas: 0,
        pedidosRecientes: []
      };
    }

    return {
      localId,
      nombreLocal: pedidos[0].local.nombreLocal,
      totalPedidos: pedidos.length,
      totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
      totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
      promedioVentaPorPedido: pedidos.reduce((sum, p) => sum + p.precio, 0) / pedidos.length,
      pedidosRecientes: pedidos
        .sort((a, b) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime())
        .slice(0, 10)
    };
  }

  async obtenerEstadisticasRepartidor(repartidorId: string): Promise<any> {
    const pedidos = await this.pedidoRealizadoModel
      .find({ 'repartidor.id': repartidorId })
      .exec();

    if (pedidos.length === 0) {
      return {
        repartidorId,
        nombreRepartidor: 'Repartidor no encontrado',
        totalEntregas: 0,
        totalPropinas: 0,
        entregasRecientes: []
      };
    }

    return {
      repartidorId,
      nombreRepartidor: pedidos[0].repartidor.nombre,
      totalEntregas: pedidos.length,
      totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
      promedioPropinaPorEntrega: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0) / pedidos.length,
      entregasRecientes: pedidos
        .sort((a, b) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime())
        .slice(0, 10)
    };
  }

  // ========== MÉTODOS DE TOP RANKINGS ==========

  async obtenerTopLocales(limite: number = 10): Promise<VentasPorLocal[]> {
    const estadisticas = await this.obtenerEstadisticasGenerales();
    return estadisticas.ventasPorLocal
      .sort((a, b) => b.totalVentas - a.totalVentas)
      .slice(0, limite);
  }

  async obtenerTopRepartidores(limite: number = 10): Promise<EntregasPorRepartidor[]> {
    const estadisticas = await this.obtenerEstadisticasGenerales();
    return estadisticas.entregasPorRepartidor
      .sort((a, b) => b.cantidadEntregas - a.cantidadEntregas)
      .slice(0, limite);
  }

  // ========== MÉTODOS DE BÚSQUEDA ==========

  async buscarPedidosPorUsuario(usuarioId: string): Promise<PedidoRealizado[]> {
    return this.pedidoRealizadoModel
      .find({ 'usuario.id': usuarioId })
      .sort({ fechaEntrega: -1 })
      .exec();
  }

  async buscarPedidosPorNombre(nombrePedido: string): Promise<PedidoRealizado[]> {
    return this.pedidoRealizadoModel
      .find({ 
        nombrePedido: { $regex: nombrePedido, $options: 'i' }
      })
      .sort({ fechaEntrega: -1 })
      .exec();
  }

  // ========== MÉTODO DE LIMPIEZA ==========

  async limpiarPedidosAntiguos(diasAntiguedad: number = 365): Promise<{ eliminados: number }> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);
    
    const resultado = await this.pedidoRealizadoModel
      .deleteMany({ fechaEntrega: { $lt: fechaLimite } })
      .exec();
    
    console.log(`🗑️ Eliminados ${resultado.deletedCount} pedidos antiguos`);
    return { eliminados: resultado.deletedCount };
  }
}