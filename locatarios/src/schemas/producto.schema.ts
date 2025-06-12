import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Categoria } from './categoria.schema';

@Schema({ collection: 'productos' })
export class Producto extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Categoria', required: true })
  categoria: Categoria | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  locatario: Types.ObjectId;

  @Prop()
  ingredientes: string;

  @Prop()
  descripcion: string;

  @Prop({ required: true })
  precio: number;

  @Prop()
  imagenUrl?: string;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);
