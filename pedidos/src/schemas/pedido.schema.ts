import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ComidaPedido {
  @Prop({ required: true })
  nombre: string;
}

@Schema({ collection: 'pedidos' })
export class Pedido extends Document {
  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ required: true, enum: ['efectivo', 'tarjeta'] })
  pago: string;

  @Prop({ required: true })
  precioPedido: number;

  @Prop({ type: [{ nombre: String }], required: true })
  comidas: ComidaPedido[];

  @Prop({ required: true })
  nombreLocalRetirar: string;

  @Prop({ required: true })
  ciudadLocal: string;

  @Prop({ required: true })
  numeroLocal: string;

  @Prop({ required: true })
  ciudadDejar: string;

  @Prop({ required: true })
  numeroCasaDepto: string;

  @Prop({ required: true })
  propina: number;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
