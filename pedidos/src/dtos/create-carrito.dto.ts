import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AgregarCarritoDto {
  @IsString()
  comidaId: string;  // ✅ Nota: 'comidaId' no 'idComida'

  @IsString()
  locatarioId: string;  // ✅ Nota: 'locatarioId' no 'idLocatario'

  @IsString()
  nombreLocal: string;

  @IsString()
  nombreComida: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}