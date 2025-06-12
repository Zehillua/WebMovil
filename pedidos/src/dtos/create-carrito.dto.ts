import { CreateComidaCarritoDto } from './create-comidaCarrito.dto';

export class CreateCarritoDto {
  idComprador: string;
  items: CreateComidaCarritoDto[];
}