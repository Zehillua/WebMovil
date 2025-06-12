import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'categorias' })
export class Categoria extends Document {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  locatario: Types.ObjectId;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
