import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Comida {
  @Prop({ required: true })
  nombre: string;
  @Prop({ required: true })
  precio: number;
  @Prop({ required: true })
  cantidad: number;
}

export class Venta {
  @Prop({ required: true })
  comida: string; 
  @Prop({ required: true })
  precio: number;
}

@Schema({ collection: 'users' })
export class Usuario extends Document {
  @Prop({ required: true })
  tipoUsuario: 'usuario' | 'locatario' | 'repartidor';

  // Común para todos
  @Prop()
  nombre: string;
  @Prop()
  apellido: string;
  @Prop({ unique: true, sparse: true })
  nombreUsuario?: string;
  @Prop({ unique: true, sparse: true })
  correo: string;
  @Prop({ required: true })
  contraseña: string;
  @Prop()
  pais: string;
  @Prop()
  ciudad: string;
  @Prop()
  numeroTelefono: string;

  // Usuario
  @Prop()
  numeroCasaDepto?: string;

  // Locatario
  @Prop()
  nombreLocal?: string;
  @Prop()
  numeroLocal?: string;
  @Prop({ type: [{ nombre: String, precio: Number, cantidad: Number }] })
  comidasStock?: Comida[];
  @Prop({ type: [{ comida: String, precio: Number }] })
  ventas?: Venta[];

  // Repartidor
  @Prop()
  vehiculo?: string;
  @Prop()
  patente?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
