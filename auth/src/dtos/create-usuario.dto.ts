import { IsBoolean, IsString, IsNotEmpty, IsEmail, IsEnum, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ComidaDto, VentaNormalDto, VentaPromoDto } from './comidas.dto';

export enum TipoUsuario {
  USUARIO = 'usuario',
  LOCATARIO = 'locatario',
  REPARTIDOR = 'repartidor',
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
  direccion: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}

// Usuario normal
export class CreateUsuarioDto extends CreateUsuarioBaseDto {
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  numeroCasaDepto: string;
}

// Locatario
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
  @IsOptional()
  comidasStock: ComidaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaNormalDto)
  @IsOptional()
  ventas: VentaNormalDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaPromoDto)
  @IsOptional()
  ventasPromo: VentaPromoDto[];

  @IsNumber()
  @IsOptional()
  valoracion: number;
}

// Repartidor
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

  @IsNumber()
  @IsOptional()
  valoracionRepartidor: number;
}