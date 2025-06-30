import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from '../controllers/stats.controller';
import { StatsService } from '../services/stats.service';
import { PedidoRealizado, PedidoRealizadoSchema } from '../schemas/pedido-realizado.schema';
import { VentaReporte, VentaReporteSchema } from '../schemas/venta-reporte.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Usuario', schema: {} }, // Schema simple para usuarios
      { name: PedidoRealizado.name, schema: PedidoRealizadoSchema }, // ✅ CORREGIDO
      { name: VentaReporte.name, schema: VentaReporteSchema }, // ✅ AGREGADO
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService], // ✅ EXPORTAR para otros módulos
})
export class StatsModule {}