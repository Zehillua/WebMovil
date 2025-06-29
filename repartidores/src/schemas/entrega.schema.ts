import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ✅ DEFINIR INTERFACES SEPARADAS PARA LOS OBJETOS ANIDADOS
interface ClienteInfo {
  id: Types.ObjectId;
  nombre: string;
  direccion: string;
}

interface LocalInfo {
  id: Types.ObjectId;
  nombreLocal: string;
  direccion: string;
}

@Schema({ timestamps: true })
export class Entrega extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  repartidorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  pedidoId: Types.ObjectId;

  @Prop({ required: true })
  nombrePedido: string;

  @Prop({ required: true })
  valorEntrega: number;

  @Prop({ default: 0 })
  propina: number;

  @Prop({ type: Date, default: Date.now })
  fechaEntrega: Date;

  // ✅ ESPECIFICAR TIPO EXPLÍCITAMENTE
  @Prop({ 
    type: {
      id: { type: Types.ObjectId, required: true },
      nombre: { type: String, required: true },
      direccion: { type: String, required: true }
    },
    required: true
  })
  cliente: ClienteInfo;

  // ✅ ESPECIFICAR TIPO EXPLÍCITAMENTE
  @Prop({ 
    type: {
      id: { type: Types.ObjectId, required: true },
      nombreLocal: { type: String, required: true },
      direccion: { type: String, required: true }
    },
    required: true
  })
  local: LocalInfo;

  @Prop({ default: 'No calculada' })
  distancia: string;

  @Prop({ default: 'No calculado' })
  tiempoEntrega: string;
}

export const EntregaSchema = SchemaFactory.createForClass(Entrega);