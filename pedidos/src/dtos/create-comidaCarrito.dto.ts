import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateComidaCarritoDto {
  @IsString()
  idComida: string;        

  @IsString()
  idLocatario: string;     

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