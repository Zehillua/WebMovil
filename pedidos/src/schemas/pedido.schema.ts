import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Pedido extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Usuario' })
  idComprador: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Locatario' })
  idLocal: Types.ObjectId;

  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ required: true, enum: ['efectivo', 'tarjeta'] })
  pago: string;

  @Prop({ required: true })
  precioPedido: number;

  @Prop({ type: [{ nombre: String }], required: true })
  comidas: { nombre: string }[];

  @Prop({ required: true })
  esDelivery: boolean;

  @Prop()
  direccionEntrega?: string;

  @Prop()
  numeroCasaDepto?: string;

  @Prop({ required: true })
  propina: boolean;

  @Prop()
  cantidadPropina?: number;

  @Prop({ type: Types.ObjectId, ref: 'Repartidor' })
  idRepartidor?: Types.ObjectId;

  @Prop({ default: Date.now })
  fechaPedido?: Date;

  @Prop({ default: 0 })
  valoracionPedido: number;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);