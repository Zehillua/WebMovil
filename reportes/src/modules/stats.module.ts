import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from '../controllers/stats.controller';
import { StatsService } from '../services/stats.service';
import { PedidoRealizado, PedidoRealizadoSchema } from '../schemas/pedido-realizado.schema';
import { VentaReporte, VentaReporteSchema } from '../schemas/venta-reporte.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PedidoRealizado.name, schema: PedidoRealizadoSchema },
      { name: VentaReporte.name, schema: VentaReporteSchema },
      // ✅ NO INCLUIR UsuarioModel PORQUE NO EXISTE EN ESTE MICROSERVICIO
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}