import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComidaController } from '../controllers/comidas.controller';
import { Comida, ComidaSchema } from '../schemas/comida.schema';
import { ComidaService } from '../services/comida.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comida.name, schema: ComidaSchema }]),
  ],
  controllers: [ComidaController],
  providers: [ComidaService],
  exports: [ComidaService],
})
export class ComidaModule {}