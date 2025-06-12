import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from '../schemas/producto.schema';
import { CreateProductoDto } from '../dtos/create-producto.dto';

@Injectable()
export class ProductoService {
  constructor(@InjectModel(Producto.name) private productoModel: Model<Producto>) {}

  async crearProducto(dto: CreateProductoDto): Promise<Producto> {
    const nuevo = new this.productoModel(dto);
    return nuevo.save();
  }

  async obtenerProductosPorLocatario(locatarioId: string): Promise<Producto[]> {
    return this.productoModel.find({ locatario: locatarioId }).populate('categoria').exec();
  }

  async obtenerProductos(): Promise<Producto[]> {
    return this.productoModel.find().populate('categoria').exec();
  }

  async eliminarProducto(id: string): Promise<any> {
    return this.productoModel.findByIdAndDelete(id);
  }
}
