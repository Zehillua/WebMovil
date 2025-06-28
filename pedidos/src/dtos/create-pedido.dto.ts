export class ComidaPedidoDto {
  nombre: string;
  cantidad: number;
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
  direccionLocal?: string;
  numeroCasaDepto?: string;
  propina: boolean;
  cantidadPropina?: number;
  idRepartidor?: string;
  fechaPedido?: Date;
  valoracionPedido?: number;
  estado?: boolean;
  dealer?: boolean;
  repartidor?: string;
  estadoRechazado?: boolean;
  listo?: boolean;
  enCamino?: boolean;
  pedidoEntregado?: boolean;
  fechaRechazo?: Date;
}