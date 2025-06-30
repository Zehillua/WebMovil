import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ClienteVentaType {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;
}

@ObjectType()
export class ComidaVentaType {
  @Field()
  nombre: string;

  @Field(() => Int)
  cantidad: number;
}

@ObjectType()
export class VentaType {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  localId: string;

  @Field(() => ID)
  pedidoId: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precio: number;

  @Field()
  fechaVenta: string;

  @Field(() => ClienteVentaType)
  cliente: ClienteVentaType;

  @Field(() => [ComidaVentaType])
  comidas: ComidaVentaType[];

  @Field()
  esDelivery: boolean;

  @Field(() => Float)
  propina: number;

  @Field(() => Float)
  totalConPropina: number;
}