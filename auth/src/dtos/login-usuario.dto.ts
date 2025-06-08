import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUsuarioDto {
  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  clave: string;
}