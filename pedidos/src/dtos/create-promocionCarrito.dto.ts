import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ComidaPromocionDto {
  @IsString()
  comidaId: string;

  @IsString()
  nombre: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precioOriginal: number;
}

export class CreatePromocionCarritoDto {
  @IsString()
  idPromocion: string;

  @IsString()
  idLocatario: string;

  @IsString()
  nombreLocal: string;

  @IsString()
  nombrePromocion: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComidaPromocionDto)
  comidas?: ComidaPromocionDto[];
}