import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class PedidoRealizado extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  pedidoId: Types.ObjectId;

  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ type: Date, required: true })
  fechaEntrega: Date;

  @Prop({ type: Date, default: Date.now })
  fechaRegistro: Date;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  usuario: {
    id: Types.ObjectId;
    nombre: string;
    apellido: string;
  };

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  local: {
    id: Types.ObjectId;
    nombreLocal: string;
  };

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  repartidor: {
    id: Types.ObjectId;
    nombre: string;
  };

  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  comidas: Array<{
    nombre: string;
    cantidad: number;
  }>;

  @Prop({ default: 0 })
  propina: number;

  @Prop({ required: true })
  totalConPropina: number;
}

export const PedidoRealizadoSchema = SchemaFactory.createForClass(PedidoRealizado);