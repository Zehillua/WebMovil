import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ComidaType {
  @Field()
  nombre: string;

  @Field(() => Int)
  cantidad: number;

  @Field({ defaultValue: 'comida' })
  tipo: string;
}

// ✅ NUEVO TIPO PARA COMIDAS EN PROMOCIONES
@ObjectType()
export class ComidaPromocionType {
  @Field()
  nombre: string;

  @Field(() => Int)
  cantidad: number;
}

// ✅ NUEVO TIPO PARA PROMOCIONES EN PEDIDOS
@ObjectType()
export class PromocionPedidoType {
  @Field()
  nombrePromocion: string;

  @Field(() => Int)
  cantidad: number;

  @Field(() => Float)
  precio: number;

  @Field(() => [ComidaPromocionType])
  comidas: ComidaPromocionType[];

  @Field({ defaultValue: 'promocion' })
  tipo: string;
}

@ObjectType()
export class LocalType {
  @Field()
  nombreLocal: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class RepartidorType {
  @Field(() => ID)
  _id: string;

  @Field()
  usuarioRepartidor: string;

  @Field()
  vehiculo: string;

  @Field()
  patente: string;

  @Field(() => Float)
  valoracion: number;

  @Field({ nullable: true })
  telefono?: string;
}

@ObjectType()
export class DatosRepartidorPedidoType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombreUsuario: string;

  @Field()
  usuarioRepartidor: string;

  @Field()
  vehiculo: string;

  @Field()
  patente: string;

  @Field(() => Float)
  valoracion: number;

  @Field({ nullable: true })
  telefono?: string;
}

// ✅ TIPO PRINCIPAL DEL PEDIDO ACTUALIZADO
@ObjectType()
export class PedidoType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field()
  estado: boolean;

  @Field({ nullable: true })
  listo?: boolean;

  @Field({ nullable: true })
  enCamino?: boolean;

  @Field({ nullable: true })
  estadoRechazado?: boolean;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  pago: string;

  @Field(() => String)
  fechaPedido: string;

  @Field()
  esDelivery: boolean;

  @Field({ nullable: true })
  direccionEntrega?: string;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  // ✅ NUEVO CAMPO PARA PROMOCIONES
  @Field(() => [PromocionPedidoType], { defaultValue: [] })
  promociones: PromocionPedidoType[];

  @Field(() => LocalType)
  local: LocalType;

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field({ nullable: true })
  dealer?: boolean;

  @Field(() => RepartidorType, { nullable: true })
  repartidor?: RepartidorType;

  @Field(() => DatosRepartidorPedidoType, { nullable: true })
  datosRepartidor?: DatosRepartidorPedidoType;

  @Field(() => Int, { nullable: true })
  codigoPedido?: number;
}

@ObjectType()
export class PromocionRealizadaType {
  @Field()
  nombrePromocion: string;

  @Field()
  cantidad: number;

  @Field()
  precio: number;

  @Field(() => [ComidaPromoRealizadaType])
  comidas: ComidaPromoRealizadaType[];

  @Field()
  tipo: string;
}

@ObjectType()
export class ComidaPromoRealizadaType {
  @Field()
  nombre: string;

  @Field()
  cantidad: number;

  @Field()
  precioOriginal: number;
}