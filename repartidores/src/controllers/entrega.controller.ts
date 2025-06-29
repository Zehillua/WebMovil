import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EntregaService } from '../services/entrega.service';

@Controller('repartidores')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}

  @Post('entrega')
  async registrarEntrega(@Body() entregaData: any) {
    return this.entregaService.registrarEntrega(entregaData);
  }

  @Get('entregas/:repartidorId')
  async obtenerEntregasRepartidor(@Param('repartidorId') repartidorId: string) {
    return this.entregaService.obtenerEntregasRepartidor(repartidorId);
  }

  @Get('estadisticas/:repartidorId')
  async obtenerEstadisticas(@Param('repartidorId') repartidorId: string) {
    return this.entregaService.obtenerEstadisticas(repartidorId);
  }
}