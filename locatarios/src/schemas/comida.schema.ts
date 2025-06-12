import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Comida extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ type: [String], default: [] })
  ingredientes: string[];

  @Prop()
  descripcion: string;

  @Prop()
  imagenUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Locatario', required: true })
  locatarioId: Types.ObjectId;
}

export const ComidaSchema = SchemaFactory.createForClass(Comida);