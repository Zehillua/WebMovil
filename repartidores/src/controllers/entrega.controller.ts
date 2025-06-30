import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EntregaService } from '../services/entrega.service';

@Controller('repartidores')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}

  @Post('entrega')
  async registrarEntrega(@Body() entregaData: any) {
    console.log('📥 Controlador: Registrando entrega');
    return this.entregaService.registrarEntrega(entregaData);
  }

  @Get('entregas/:repartidorId')
  async obtenerEntregasRepartidor(@Param('repartidorId') repartidorId: string) {
    console.log(`📥 Controlador: Obteniendo entregas para repartidor ${repartidorId}`);
    try {
      const entregas = await this.entregaService.obtenerEntregasRepartidor(repartidorId);
      console.log(`📤 Controlador: Devolviendo ${entregas.length} entregas`);
      return entregas;
    } catch (error) {
      console.error('❌ Error en controlador obtenerEntregasRepartidor:', error);
      throw error;
    }
  }

  @Get('estadisticas/:repartidorId')
  async obtenerEstadisticas(@Param('repartidorId') repartidorId: string) {
    console.log(`📊 Controlador: Obteniendo estadísticas para repartidor ${repartidorId}`);
    try {
      const estadisticas = await this.entregaService.obtenerEstadisticas(repartidorId);
      console.log('📤 Controlador: Devolviendo estadísticas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error en controlador obtenerEstadisticas:', error);
      throw error;
    }
  }
}