import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ComidaPromocion {
  @Prop({ type: Types.ObjectId, ref: 'Comida', required: true })
  comidaId: Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  precioOriginal: number;
}

@Schema({ timestamps: true })
export class Promocion extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  precio: number;

  @Prop()
  imagenUrl: string;

  @Prop({ type: [ComidaPromocion], required: true })
  comidas: ComidaPromocion[];

  @Prop({ type: Types.ObjectId, ref: 'Locatario', required: true })
  locatarioId: Types.ObjectId;

  @Prop({ default: true })
  activa: boolean;

  @Prop({ type: Date })
  fechaInicio: Date;

  @Prop({ type: Date })
  fechaFin: Date;

  @Prop({ default: 0 })
  cantidadDisponible: number;

  @Prop({ default: 0 })
  cantidadVendida: number;
}

export const ComidaPromocionSchema = SchemaFactory.createForClass(ComidaPromocion);
export const PromocionSchema = SchemaFactory.createForClass(Promocion);