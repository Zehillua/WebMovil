import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ✅ DEFINIR INTERFACES SEPARADAS PARA LOS OBJETOS ANIDADOS
interface UsuarioInfo {
  id: Types.ObjectId;
  nombre: string;
  apellido: string;
}

interface LocalInfo {
  id: Types.ObjectId;
  nombreLocal: string;
}

interface RepartidorInfo {
  id: Types.ObjectId;
  nombre: string;
}

interface ComidaInfo {
  nombre: string;
  cantidad: number;
}

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

  // ✅ ESPECIFICAR TIPO EXPLÍCITAMENTE
  @Prop({ 
    type: {
      id: { type: Types.ObjectId, required: true },
      nombre: { type: String, required: true },
      apellido: { type: String, required: true }
    },
    required: true
  })
  usuario: UsuarioInfo;

  // ✅ ESPECIFICAR TIPO EXPLÍCITAMENTE
  @Prop({ 
    type: {
      id: { type: Types.ObjectId, required: true },
      nombreLocal: { type: String, required: true }
    },
    required: true
  })
  local: LocalInfo;

  // ✅ ESPECIFICAR TIPO EXPLÍCITAMENTE
  @Prop({ 
    type: {
      id: { type: Types.ObjectId, required: true },
      nombre: { type: String, required: true }
    },
    required: true
  })
  repartidor: RepartidorInfo;

  // ✅ ESPECIFICAR TIPO EXPLÍCITAMENTE PARA ARRAY
  @Prop({ 
    type: [{
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true }
    }],
    default: []
  })
  comidas: ComidaInfo[];

  @Prop({ default: 0 })
  propina: number;

  @Prop({ required: true })
  totalConPropina: number;
}

export const PedidoRealizadoSchema = SchemaFactory.createForClass(PedidoRealizado);