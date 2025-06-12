import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Carrito, CarritoSchema } from '../schemas/carrito.schema';
import { CarritoService } from '../services/carrito.service';
import { CarritoController } from '../controllers/carrito.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Carrito.name, schema: CarritoSchema }]),
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}