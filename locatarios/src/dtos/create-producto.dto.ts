import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  categoria: string; // id de la categoría

  @IsString()
  @IsNotEmpty()
  locatario: string; // id del locatario

  @IsString()
  ingredientes: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
