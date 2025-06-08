import { IsString, IsNotEmpty, IsEmail, IsEnum, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoUsuario {
  USUARIO = 'usuario',
  LOCATARIO = 'locatario',
  REPARTIDOR = 'repartidor',
}

export class ComidaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  cantidad: number;
}

export class VentaDto {
  @IsString()
  @IsNotEmpty()
  comida: string;

  @IsNumber()
  precio: number;
}

export class CreateUsuarioBaseDto {
  @IsEnum(TipoUsuario)
  tipoUsuario: TipoUsuario;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  clave: string;

  @IsString()
  @IsNotEmpty()
  direccion: string; // Nuevo campo

  @IsString()
  @IsNotEmpty()
  telefono: string; // Renombrado
}

export class CreateUsuarioDto extends CreateUsuarioBaseDto {
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  numeroCasaDepto: string;
}

export class CreateLocatarioDto extends CreateUsuarioBaseDto {
  @IsString()
  @IsNotEmpty()
  nombreLocal: string;

  @IsString()
  @IsNotEmpty()
  numeroLocal: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComidaDto)
  comidasStock: ComidaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaDto)
  ventas: VentaDto[];
}

export class CreateRepartidorDto extends CreateUsuarioBaseDto {
  @IsString()
  @IsNotEmpty()
  usuarioRepartidor: string;

  @IsString()
  @IsNotEmpty()
  vehiculo: string;

  @IsString()
  @IsNotEmpty()
  patente: string;
}