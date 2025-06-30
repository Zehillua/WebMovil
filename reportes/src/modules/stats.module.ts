import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from '../controllers/stats.controller';
import { StatsService } from '../services/stats.service';
import { PedidoRealizado, PedidoRealizadoSchema } from '../schemas/pedido-realizado.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Usuario', schema: {} },
      { name: 'PedidoRealizado', schema: PedidoRealizadoSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}