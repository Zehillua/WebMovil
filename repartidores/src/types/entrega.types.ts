import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ClienteType {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class LocalType {
  @Field(() => ID)
  id: string;

  @Field()
  nombreLocal: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class EntregaType {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  repartidorId: string;

  @Field(() => ID)
  pedidoId: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  valorEntrega: number;

  @Field(() => Float, { defaultValue: 0 })
  propina: number;

  @Field()
  fechaEntrega: Date;

  // ✅ CAMPOS DE VALORACIÓN:
  @Field(() => Float, { defaultValue: 0 })
  valoracionRecibida: number;

  @Field({ nullable: true })
  fechaValoracion?: Date;

  @Field(() => Boolean, { defaultValue: false })
  valoracionRegistrada: boolean;

  @Field(() => ClienteType)
  cliente: ClienteType;

  @Field(() => LocalType)
  local: LocalType;

  @Field({ defaultValue: 'No calculada' })
  distancia: string;

  @Field({ defaultValue: 'No calculado' })
  tiempoEntrega: string;
}

@ObjectType()
export class EstadisticasType {
  @Field(() => Int)
  totalEntregas: number;

  @Field(() => Float)
  totalGanancias: number;

  @Field(() => Float)
  totalPropinas: number;

  @Field(() => Float)
  promedioGananciaPorEntrega: number;

  @Field(() => Float, { defaultValue: 0 })
  valoracionPromedio: number;
}