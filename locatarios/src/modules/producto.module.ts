import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, ProductoSchema } from '../schemas/producto.schema';
import { ProductoService } from '../services/producto.service';
import { ProductoController } from '../controllers/producto.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Producto.name, schema: ProductoSchema }])],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
