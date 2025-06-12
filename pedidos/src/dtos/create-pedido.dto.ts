export class ComidaPedidoDto {
  nombre: string;
}

export class CreatePedidoDto {
  idComprador: string;
  idLocal: string;
  nombrePedido: string;
  pago: 'efectivo' | 'tarjeta';
  precioPedido: number;
  comidas: ComidaPedidoDto[];
  esDelivery: boolean;
  direccionEntrega?: string;
  numeroCasaDepto?: string;
  propina: boolean;
  cantidadPropina?: number;
  idRepartidor?: string;
  fechaPedido?: Date;
  valoracionPedido?: number;
}