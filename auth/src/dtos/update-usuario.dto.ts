import { IsOptional, IsString, IsEnum, IsNumber, IsArray, ValidateNested, IsEmail, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoUsuario } from './create-usuario.dto';
import { ComidaDto, VentaNormalDto, VentaPromoDto } from './comidas.dto';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsEnum(TipoUsuario)
  tipoUsuario?: TipoUsuario;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  clave?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @IsOptional()
  @IsString()
  numeroCasaDepto?: string;

  @IsOptional()
  @IsString()
  nombreLocal?: string;

  @IsOptional()
  @IsString()
  numeroLocal?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComidaDto)
  comidasStock?: ComidaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaNormalDto)
  ventas?: VentaNormalDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaPromoDto)
  ventasPromo?: VentaPromoDto[];

  @IsOptional()
  @IsNumber()
  valoracion?: number;

  @IsOptional()
  @IsString()
  usuarioRepartidor?: string;

  @IsOptional()
  @IsString()
  vehiculo?: string;

  @IsOptional()
  @IsString()
  patente?: string;

  @IsOptional()
  @IsNumber()
  valoracionRepartidor?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  saldo?: number;
}
