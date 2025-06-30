import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';

@Schema()
export class Pedido extends Document {
  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idComprador: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Local', required: true })
  idLocal: ObjectId;

  @Prop({ default: false })
  estado: boolean;

  @Prop({ default: false })
  listo: boolean;

  @Prop({ default: false })
  enCamino: boolean;

  @Prop({ default: false })
  estadoRechazado: boolean;

  @Prop({ required: true })
  precioPedido: number;

  @Prop({ required: true })
  pago: string;

  @Prop({ type: Date, default: Date.now })
  fechaPedido: Date;

  @Prop({ default: false })
  esDelivery: boolean;

  @Prop()
  direccionEntrega: string;

  @Prop([{
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true }
  }])
  comidas: { nombre: string; cantidad: number }[];

  @Prop()
  propina: boolean;

  @Prop()
  cantidadPropina: number;

  @Prop({ default: false })
  dealer: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  repartidor?: Types.ObjectId;

  // ✅ AGREGAR CAMPO PARA DATOS COMPLETOS DEL REPARTIDOR:
  @Prop({
    type: {
      _id: { type: String },
      nombreUsuario: { type: String },
      usuarioRepartidor: { type: String },
      vehiculo: { type: String },
      patente: { type: String },
      valoracion: { type: Number, default: 0 },
      telefono: { type: String }
    }
  })
  datosRepartidor?: {
    _id: string;
    nombreUsuario: string;
    usuarioRepartidor: string;
    vehiculo: string;
    patente: string;
    valoracion: number;
    telefono: string;
  };

  @Prop({ default: false })
  pedidoEntregado: boolean;

  @Prop()
  direccionLocal: string;

  @Prop({ type: Date })
  fechaRechazo: Date;

  // ✅ NUEVO CAMPO PARA CÓDIGO DE ENTREGA:
  @Prop({ type: Number, default: 0 })
  codigoPedido: number;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);