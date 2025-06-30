import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class PedidoRealizado extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  pedidoOriginalId: Types.ObjectId;

  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ type: Types.ObjectId, required: true })
  idComprador: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  idLocal: Types.ObjectId;

  @Prop({ required: true })
  precioPedido: number;

  @Prop({ required: true })
  pago: string;

  @Prop({ type: Date, required: true })
  fechaPedido: Date;

  @Prop({ type: Date, required: true })
  fechaEntrega: Date;

  @Prop({ type: Date, default: Date.now })
  fechaRegistro: Date;

  @Prop({ required: true })
  esDelivery: boolean;

  @Prop()
  direccionEntrega: string;

  @Prop([{
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true }
  }])
  comidas: { nombre: string; cantidad: number }[];

  @Prop({ default: false })
  propina: boolean;

  @Prop({ default: 0 })
  cantidadPropina: number;

  @Prop({ type: Types.ObjectId, required: true })
  repartidor: Types.ObjectId;

  @Prop({ required: true })
  codigoPedido: number;

  @Prop()
  direccionLocal: string;

  // ✅ NUEVOS CAMPOS DE VALORACIÓN:
  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  valoracionPedido: number;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  valoracionDelivery: number;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  valoracionLocal: number;

  @Prop({ default: false })
  valoracionCompletada: boolean;

  // Datos denormalizados para consultas rápidas
  @Prop({ type: MongooseSchema.Types.Mixed })
  datosUsuario: {
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    direccion: string;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  datosLocal: {
    nombreLocal: string;
    direccion: string;
  };

   @Prop([{
    nombrePromocion: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precio: { type: Number, required: true },
    comidas: [{
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true },
      precioOriginal: { type: Number, required: true }
    }],
    tipo: { type: String, default: 'promocion' }
  }])
  promociones: {
    nombrePromocion: string;
    cantidad: number;
    precio: number;
    comidas: {
      nombre: string;
      cantidad: number;
      precioOriginal: number;
    }[];
    tipo: string;
  }[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  datosRepartidor: {
    nombreUsuario: string;
    vehiculo: string;
    patente: string;
    valoracion: number;
  };
}

export const PedidoRealizadoSchema = SchemaFactory.createForClass(PedidoRealizado);