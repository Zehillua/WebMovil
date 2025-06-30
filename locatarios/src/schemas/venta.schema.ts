import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Venta extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  localId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  pedidoId: Types.ObjectId;

  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ type: Date, default: Date.now })
  fechaVenta: Date;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  cliente: {
    id: Types.ObjectId;
    nombre: string;
  };

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  comidas: Array<{
    nombre: string;
    cantidad: number;
  }>;

  @Prop({ default: false })
  esDelivery: boolean;

  @Prop({ default: 0 })
  propina: number;

  @Prop({ required: true })
  totalConPropina: number;
}

export const VentaSchema = SchemaFactory.createForClass(Venta);