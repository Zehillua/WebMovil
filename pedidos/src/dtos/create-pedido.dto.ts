export class ComidaPedidoDto {
  nombre: string;
}

export class CreatePedidoDto {
  nombrePedido: string;
  pago: 'efectivo' | 'tarjeta';
  precioPedido: number;
  comidas: ComidaPedidoDto[];
  nombreLocalRetirar: string;
  ciudadLocal: string;
  numeroLocal: string;
  ciudadDejar: string;
  numeroCasaDepto: string;
  propina: number;
}
