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
  estadoRechazado?: boolean;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  pago: string;

  @Field()
  fechaPedido: string;

  @Field()
  esDelivery: boolean;

  @Field({ nullable: true })
  direccionEntrega?: string;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field(() => LocalType)
  local: LocalType; // Resolver automático

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field({ nullable: true })
  dealer?: boolean;

  @Field({ nullable: true })
  repartidor?: string;
}