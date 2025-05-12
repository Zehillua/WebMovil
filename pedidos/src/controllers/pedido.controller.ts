import { Controller, Post, Get, Body } from '@nestjs/common';
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
}
