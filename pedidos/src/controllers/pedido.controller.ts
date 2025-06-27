import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
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
}
