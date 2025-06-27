import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Pedido extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Usuario' })
  idComprador: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Local' })
  idLocal: Types.ObjectId;

  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ required: true, enum: ['efectivo', 'tarjeta'] })
  pago: string;

  @Prop({ required: true })
  precioPedido: number;

  @Prop({ type: [{ nombre: String, cantidad: Number }], required: true })
  comidas: { nombre: string; cantidad: number }[];

  @Prop({ required: true })
  esDelivery: boolean;

  @Prop({ default: false })
  estadoRechazado?: boolean;

  @Prop({ default: false })
  estado: boolean;

  @Prop({ default: false })
  dealer: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Repartidor', default: null })
  repartidor?: Types.ObjectId;

// ...resto del schema...
  @Prop()
  direccionEntrega?: string;

  @Prop()
  direccionLocal: string;

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