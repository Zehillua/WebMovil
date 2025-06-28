import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { PedidoService } from '../services/pedido.service';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';

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
}
