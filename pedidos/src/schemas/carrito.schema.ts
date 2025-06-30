import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ✅ SCHEMA PARA COMIDAS (ACTUALIZADO)
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

  @Prop({ required: true }) // ✅ AHORA ES REQUERIDO
  idComida: string;

  @Prop({ default: 'comida' })
  tipo: string;
}

// ✅ SCHEMA PARA PROMOCIONES
@Schema()
export class PromocionCarrito {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Locatario' })
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

  @Prop({ required: true })
  idPromocion: string;

  @Prop({ default: 'promocion' })
  tipo: string;

  @Prop([{
    comidaId: { type: String, required: true },
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioOriginal: { type: Number, required: true }
  }])
  comidas: {
    comidaId: string;
    nombre: string;
    cantidad: number;
    precioOriginal: number;
  }[];
}

export const ComidaCarritoSchema = SchemaFactory.createForClass(ComidaCarrito);
export const PromocionCarritoSchema = SchemaFactory.createForClass(PromocionCarrito);

// ✅ CARRITO ACTUALIZADO
@Schema()
export class Carrito extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Usuario', unique: true })
  idComprador: Types.ObjectId;

  @Prop({ type: [ComidaCarritoSchema], default: [] })
  items: ComidaCarrito[];

  @Prop({ type: [PromocionCarritoSchema], default: [] })
  promociones: PromocionCarrito[];
}

export const CarritoSchema = SchemaFactory.createForClass(Carrito);