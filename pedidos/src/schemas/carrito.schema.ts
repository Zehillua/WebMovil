import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ✅ SCHEMA PARA COMIDAS EN PROMOCIONES
@Schema()
export class ComidaPromocion {
  @Prop({ required: true })
  comidaId: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  precioOriginal: number;
}

// ✅ SCHEMA PARA ITEMS DE COMIDA
@Schema()
export class ItemCarrito {
  @Prop({ required: true })
  idComida: string;

  @Prop({ type: Types.ObjectId, required: true })
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

  @Prop({ default: 'comida' })
  tipo: string;
}

// ✅ SCHEMA PARA PROMOCIONES
@Schema()
export class PromocionCarrito {
  @Prop({ required: true })
  idPromocion: string;

  @Prop({ type: Types.ObjectId, required: true })
  idLocatario: Types.ObjectId;

  @Prop({ required: true })
  nombreLocal: string;

  @Prop({ required: true })
  nombrePromocion: string;

  @Prop({ required: true })
  cantidad: number;

  @Prop({ required: true })
  precio: number;

  @Prop()
  imagenUrl?: string;

  @Prop({ default: 'promocion' })
  tipo: string;

  @Prop({ type: [ComidaPromocion] })
  comidas?: ComidaPromocion[];
}

// ✅ SCHEMA PRINCIPAL DEL CARRITO
@Schema({ timestamps: true })
export class Carrito extends Document {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  idComprador: Types.ObjectId;

  @Prop({ type: [ItemCarrito], default: [] })
  items: ItemCarrito[];

  @Prop({ type: [PromocionCarrito], default: [] })
  promociones: PromocionCarrito[];
}

export const CarritoSchema = SchemaFactory.createForClass(Carrito);
export const ItemCarritoSchema = SchemaFactory.createForClass(ItemCarrito);
export const PromocionCarritoSchema = SchemaFactory.createForClass(PromocionCarrito);
export const ComidaPromocionSchema = SchemaFactory.createForClass(ComidaPromocion);