import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from '../controllers/stats.controller';
import { StatsService } from '../services/stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: {} }]), // Schema vacío para acceso dinámico
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
