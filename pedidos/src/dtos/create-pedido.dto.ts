import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ComidaPedidoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsString()
  tipo?: string;
}

// ✅ NUEVO DTO PARA PROMOCIONES EN PEDIDOS
export class PromocionPedidoDto {
  @IsString()
  nombrePromocion: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio: number;

  @IsArray()
  comidas: { nombre: string; cantidad: number }[];

  @IsOptional()
  @IsString()
  tipo?: string;
}

export class CreatePedidoDto {
  @IsString()
  idComprador: string;

  @IsString()
  idLocal: string;

  @IsString()
  nombrePedido: string;

  @IsEnum(['efectivo', 'tarjeta'])
  pago: 'efectivo' | 'tarjeta';

  @IsNumber()
  precioPedido: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComidaPedidoDto)
  comidas: ComidaPedidoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromocionPedidoDto)
  promociones?: PromocionPedidoDto[];

  @IsBoolean()
  esDelivery: boolean;

  @IsOptional()
  @IsString()
  direccionEntrega?: string;

  @IsOptional()
  @IsString()
  direccionLocal?: string;

  @IsOptional()
  @IsString()
  numeroCasaDepto?: string;

  @IsBoolean()
  propina: boolean;

  @IsOptional()
  @IsNumber()
  cantidadPropina?: number;

  @IsOptional()
  @IsString()
  idRepartidor?: string;

  @IsOptional()
  fechaPedido?: Date;

  @IsOptional()
  @IsNumber()
  valoracionPedido?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsBoolean()
  dealer?: boolean;

  @IsOptional()
  @IsString()
  repartidor?: string;

  @IsOptional()
  @IsBoolean()
  estadoRechazado?: boolean;

  @IsOptional()
  @IsBoolean()
  listo?: boolean;

  @IsOptional()
  @IsBoolean()
  enCamino?: boolean;

  @IsOptional()
  @IsBoolean()
  pedidoEntregado?: boolean;

  @IsOptional()
  fechaRechazo?: Date;

  @IsOptional()
  @IsNumber()
  codigoPedido?: number;
}