import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class ComidaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => Int)
  @IsNumber()
  precio: number;

  @Field(() => Int)
  @IsNumber()
  cantidad: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  ingredientes: string[];

  @Field()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Field({ nullable: true }) // <-- Nuevo campo
  @IsString()
  @IsOptional()
  imagenUrl?: string;
}

// DTO para venta promo
export class VentaPromoDto {
  @IsString()
  @IsNotEmpty()
  nombrePromo: string;

  @IsNumber()
  precioPromo: number;

  @IsBoolean()
  esDelivery: boolean;

  @IsString()
  @IsOptional()
  correoRepartidor?: string;

  @IsString()
  @IsOptional()
  correoUsuario?: string;
}

// ...existing code...

export class VentaNormalDto {
  @IsString()
  @IsNotEmpty()
  comida: string;

  @IsNumber()
  precio: number;

  @IsBoolean()
  esDelivery: boolean;

  @IsString()
  @IsOptional()
  correoRepartidor?: string;

  @IsString()
  @IsOptional()
  correoUsuario?: string;

  @IsNumber()
  @IsOptional()
  propina?: number;

  @IsNumber()
  @IsOptional()
  valoracion?: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsOptional()
  fecha?: Date;
}