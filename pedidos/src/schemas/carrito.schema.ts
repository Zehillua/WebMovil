import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ComidaCarrito {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Locatario' })
  idLocatario: Types.ObjectId;

  @Prop({ required: true })
  nombreLocal: string;

  @Prop({ required: true })
  nombreComida: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  precio: number;

  @Prop()
  imagenUrl?: string;

  @Prop()
  idComida?: string;
}

export const ComidaCarritoSchema = SchemaFactory.createForClass(ComidaCarrito);

@Schema()
export class Carrito extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Usuario', unique: true })
  idComprador: Types.ObjectId;

  @Prop({ type: [ComidaCarritoSchema], default: [] })
  items: ComidaCarrito[];
}

export const CarritoSchema = SchemaFactory.createForClass(Carrito);