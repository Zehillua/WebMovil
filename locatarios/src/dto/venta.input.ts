import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';

@InputType()
export class ClienteVentaInput {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;
}

@InputType()
export class ComidaVentaInput {
  @Field()
  nombre: string;

  @Field(() => Int)
  cantidad: number;
}

@InputType()
export class RegistrarVentaInput {
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

  @Field(() => ClienteVentaInput)
  cliente: ClienteVentaInput;

  @Field(() => [ComidaVentaInput])
  comidas: ComidaVentaInput[];

  @Field()
  esDelivery: boolean;

  @Field(() => Float)
  propina: number;
}