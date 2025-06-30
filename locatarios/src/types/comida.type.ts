import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ComidaType {
  @Field()
  nombre: string;

  @Field(() => Int)
  precio: number;

  @Field(() => Int)
  cantidad: number;

  @Field(() => [String])
  ingredientes: string[];

  @Field()
  descripcion: string;

  @Field({ nullable: true })
  imagenUrl?: string;
}