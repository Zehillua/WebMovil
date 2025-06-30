import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { StatsService } from '../services/stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // ========== ENDPOINTS PARA PEDIDOS REALIZADOS ==========

  @Post('pedido-realizado')
  async registrarPedidoRealizado(@Body() pedidoData: any) {
    return this.statsService.registrarPedidoRealizado(pedidoData);
  }

  @Get('pedidos-realizados')
  async obtenerPedidosRealizados(@Query() filtros: any) {
    return this.statsService.obtenerPedidosRealizados(filtros);
  }

  // ========== ENDPOINTS PARA VENTAS REPORTE ==========

  @Post('venta-realizada')
  async registrarVentaReporte(@Body() ventaData: any) {
    return this.statsService.registrarVentaReporte(ventaData);
  }

  @Get('ventas-realizadas')
  async obtenerVentasReporte(@Query() filtros: any) {
    return this.statsService.obtenerVentasReporte(filtros);
  }

  // ========== ENDPOINTS DE ESTADÍSTICAS ==========

  @Get('generales')
  async obtenerEstadisticasGenerales() {
    return this.statsService.obtenerEstadisticasGenerales();
  }

  @Get('por-fecha')
  async obtenerEstadisticasPorFecha(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return this.statsService.obtenerEstadisticasPorFecha(fechaInicio, fechaFin);
  }

  @Get('local/:localId')
  async obtenerEstadisticasLocal(@Param('localId') localId: string) {
    return this.statsService.obtenerEstadisticasLocal(localId);
  }

  @Get('repartidor/:repartidorId')
  async obtenerEstadisticasRepartidor(@Param('repartidorId') repartidorId: string) {
    return this.statsService.obtenerEstadisticasRepartidor(repartidorId);
  }

  // ========== ENDPOINTS DE RANKINGS ==========

  @Get('top-locales')
  async obtenerTopLocales(@Query('limite') limite?: string) {
    const limiteNum = limite ? parseInt(limite) : 10;
    return this.statsService.obtenerTopLocales(limiteNum);
  }

  @Get('top-repartidores')
  async obtenerTopRepartidores(@Query('limite') limite?: string) {
    const limiteNum = limite ? parseInt(limite) : 10;
    return this.statsService.obtenerTopRepartidores(limiteNum);
  }

  // ========== ENDPOINTS DE BÚSQUEDA ==========

  @Get('usuario/:usuarioId/pedidos')
  async buscarPedidosPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.statsService.buscarPedidosPorUsuario(usuarioId);
  }

  @Get('buscar/:nombrePedido')
  async buscarPedidosPorNombre(@Param('nombrePedido') nombrePedido: string) {
    return this.statsService.buscarPedidosPorNombre(nombrePedido);
  }

  // ========== ENDPOINT DE LIMPIEZA ==========

  @Post('limpiar-antiguos')
  async limpiarPedidosAntiguos(@Body() body: { diasAntiguedad?: number }) {
    return this.statsService.limpiarPedidosAntiguos(body.diasAntiguedad);
  }
}