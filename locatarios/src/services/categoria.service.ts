import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from '../schemas/categoria.schema';
import { CreateCategoriaDto } from '../dtos/create-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(@InjectModel(Categoria.name) private categoriaModel: Model<Categoria>) {}

  async crearCategoria(dto: CreateCategoriaDto): Promise<Categoria> {
    const nueva = new this.categoriaModel(dto);
    return nueva.save();
  }

  async obtenerCategoriasPorLocatario(locatarioId: string): Promise<Categoria[]> {
    return this.categoriaModel.find({ locatario: locatarioId }).exec();
  }

  async obtenerCategorias(): Promise<Categoria[]> {
    return this.categoriaModel.find().exec();
  }
}
