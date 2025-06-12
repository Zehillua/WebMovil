import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class ComidaPromoDto {
  nombre: string;
  precio: number;
}

export class PromocionDto {
  nombrePromo: string;
  comidas: ComidaPromoDto[];
  precioPromo: number;
}


export class Comida {
  @Prop({ required: true })
  nombre: string;
  @Prop({ required: true })
  precio: number;
  @Prop({ required: true })
  cantidad: number;
  @Prop({ required: true })
  ingredientes: string[];
  @Prop({ required: true })
  descripcion: string;
  @Prop()
  imagenUrl?: string;
}

export class VentaNormal {
  //Venta normal
  @Prop({ required: true })
  comida: string; 

  @Prop({ required: true })
  precio: number;

  @Prop()
  fecha?: Date;

  @Prop()
  valoracion?: number;

  @Prop()
  comentario?: string;

  @Prop()
  esDelivery: boolean;

  @Prop()
  correoRepartidor?: string;

  @Prop()
  correoUsuario?: string;
  
  @Prop()
  propina?: number;
  
}

export class VentaPromo {
  //Venta promocion
  @Prop({ required: true })
  nombrePromo: string;

  @Prop({ required: true })
  precioPromo: number;

  @Prop()
  fecha?: Date;

  @Prop()
  valoracion?: number;

  @Prop()
  comentario?: string;

  @Prop()
  esDelivery: boolean;

  @Prop()
  correoRepartidor?: string;

  @Prop()
  correoUsuario?: string;
  
  @Prop()
  propina?: number;
}

export const VentaNormalSchema = SchemaFactory.createForClass(VentaNormal);
export const VentaPromoSchema = SchemaFactory.createForClass(VentaPromo);