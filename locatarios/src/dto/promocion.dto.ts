import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsDateString, IsBoolean, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ComidaPromocionDto {
  @IsString()
  @IsNotEmpty()
  comidaId: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precioOriginal: number;
}

export class CrearPromocionDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComidaPromocionDto)
  comidas: ComidaPromocionDto[];

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cantidadDisponible?: number;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}

export class ActualizarPromocionDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio?: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ComidaPromocionDto)
  comidas?: ComidaPromocionDto[];

  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cantidadDisponible?: number;
}