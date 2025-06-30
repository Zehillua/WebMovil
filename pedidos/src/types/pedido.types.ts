import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ComidaType {
  @Field()
  nombre: string;

  @Field(() => Int)
  cantidad: number;
}

@ObjectType()
export class LocalType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombreLocal: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class UsuarioType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field({ nullable: true })
  nombreUsuario?: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  numeroCasaDepto?: string;
}

// NUEVO TIPO PARA REPARTIDOR:
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
export class PedidoRepartidorType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  direccionEntrega: string;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => LocalType) 
  local: LocalType;
}

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

  @Field(() => Int, { nullable: true })
  codigoPedido?: number;
}



@ObjectType()
export class PedidoPendienteRepartidorType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  direccionEntrega: string;

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field()
  enCamino: boolean;

  @Field()
  pedidoEntregado: boolean;

  // Resolvers automáticos
  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => LocalType) 
  local: LocalType;
}

@ObjectType()
export class PedidoEnCaminoType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  direccionEntrega: string;

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field()
  enCamino: boolean;

  @Field()
  pedidoEntregado: boolean;

  @Field(() => Int, { nullable: true })
  codigoPedido?: number;

  // Resolvers automáticos
  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => LocalType) 
  local: LocalType;
}