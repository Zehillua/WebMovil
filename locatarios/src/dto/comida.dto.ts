import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CrearComidaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => Float)
  @IsNumber()
  precio: number;

  @Field(() => Float)
  @IsNumber()
  cantidad: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  ingredientes: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imagenUrl?: string;
}
