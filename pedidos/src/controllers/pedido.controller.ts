import { Controller, Post, Get, Body, Param } from '@nestjs/common';
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
}
