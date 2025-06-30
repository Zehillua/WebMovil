import { Controller, Post, Get, Body, Param, Patch, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { PedidoService } from '../services/pedido.service';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post('crear')
  async crear(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.crearPedido(createPedidoDto);
  }

  @Get()
  async obtenerTodos() {
    return this.pedidoService.obtenerPedidos();
  }
  @Get('usuario/:idComprador')
  async obtenerPorUsuario(@Param('idComprador') idComprador: string) {
    return this.pedidoService.obtenerPedidosPorUsuario(idComprador);
  }

  @Get('local/:idLocal')
  async obtenerPorLocal(@Param('idLocal') idLocal: string) {
    return this.pedidoService.obtenerPedidosPorLocal(idLocal);
  }

  @Patch(':id/estado')
  async actualizarEstado(@Param('id') id: string, @Body() body: { estado: boolean }) {
    return this.pedidoService.actualizarEstado(id, body.estado);
  }

  @Patch(':id/rechazar')
  async rechazarPedido(@Param('id') id: string) {
    return this.pedidoService.rechazarPedido(id);
  }

  @Delete(':id')
  async eliminarPedido(@Param('id') id: string) {
    return this.pedidoService.eliminarPedido(id);
  }

  @Patch(':id/listo')
  async marcarListo(@Param('id') id: string) {
    return this.pedidoService.marcarListo(id);
  }

  @Get('delivery/disponibles')
  async obtenerPedidosDeliveryDisponibles() {
    return this.pedidoService.obtenerPedidosDeliveryDisponibles();
  }

  // NUEVO ENDPOINT - Pedidos pendientes de un repartidor específico
  @UseGuards(JwtAuthGuard)
  @Get('repartidor/:idRepartidor/pendientes')
  async obtenerPedidosPendientesRepartidor(
    @Param('idRepartidor') idRepartidor: string,
    @Req() req: any
  ) {
    // Verificar que el repartidor solo puede ver sus propios pedidos
    if (req.user?.sub !== idRepartidor) {
      throw new UnauthorizedException('No puedes ver pedidos de otro repartidor');
    }
    return this.pedidoService.obtenerPedidosPendientesRepartidor(idRepartidor);
  }

  @Patch(':id/aceptar-repartidor')
  async aceptarPorRepartidor(@Param('id') id: string, @Body() body: { idRepartidor: string }) {
    return this.pedidoService.aceptarPorRepartidor(id, body.idRepartidor);
  }

  @Patch(':id/en-camino')
  async marcarEnCamino(@Param('id') id: string) {
    return this.pedidoService.marcarEnCamino(id);
  }

  @Patch(':id/entregado')
  async marcarEntregado(@Param('id') id: string) {
    return this.pedidoService.marcarEntregado(id);
  }

 @Get('admin/migrar-datos-repartidor')
  async migrarDatosRepartidor() {
    await this.pedidoService.migrarDatosRepartidorExistentes();
    return { 
      message: 'Migración de datos de repartidores completada',
      timestamp: new Date().toISOString()
    };
  }

  // ✅ ENDPOINT PARA VALORAR PEDIDO REALIZADO:
  @Post('realizado/:id/valorar')
  async valorarPedidoRealizado(
    @Param('id') id: string,
    @Body() valoraciones: {
      valoracionPedido: number;
      valoracionDelivery: number;
      valoracionLocal: number;
    }
  ) {
    return this.pedidoService.valorarPedidoRealizado(id, valoraciones);
  }

  // ✅ ENDPOINT PARA OBTENER PEDIDOS REALIZADOS:
  @Get('usuario/:idUsuario/realizados')
  async obtenerPedidosRealizadosPorUsuario(@Param('idUsuario') idUsuario: string) {
    return this.pedidoService.obtenerPedidosRealizadosPorUsuario(idUsuario);
  }

  // ✅ ENDPOINT PARA ENTREGAR PEDIDO CON CÓDIGO:
  @Post(':id/entregar')
  async entregarPedido(
    @Param('id') id: string,
    @Body() body: { codigoPedido: number }
  ) {
    return this.pedidoService.entregarPedido(id, body.codigoPedido);
  }
}
