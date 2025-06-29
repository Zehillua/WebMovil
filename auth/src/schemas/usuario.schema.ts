import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Comida, VentaNormal, VentaPromo } from './comidas.schema';


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
    correo: string;
    @Prop({ required: true })
    clave: string;
    @Prop({ type: [String], default: [] })
    direccion: string[];
    @Prop()
    telefono: string;
    @Prop({ default: false })
    isAdmin: boolean;

    // Usuario
    
    @Prop()
    nombreUsuario?: string;
    @Prop()
    numeroCasaDepto?: string;
    @Prop({ default: 0 })
    cartera?: number;

    // Locatario
    @Prop()
    nombreLocal?: string;
    @Prop()
    numeroLocal?: string;
    @Prop({
      type: [{
        nombre: String,
        precio: Number,
        cantidad: Number,
        ingredientes: [String],
        descripcion: String,
        imagenUrl: String,
      }],
      default: [],
    })
    comidasStock?: Comida[];
    @Prop({ type: [{ comida: String, precio: Number }] })
    ventas?: VentaNormal[];
    @Prop({ type: [{ nombrePromo: String, precioPromo: Number}] })
    ventasPromo?: VentaPromo[];
    @Prop()
    valoracion?: number;


    // Repartidor
    @Prop()
    usuarioRepartidor?: string;
    @Prop()
    vehiculo?: string;
    @Prop()
    patente?: string;
    @Prop()
    valoracionRepartidor?: number;
  }

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
