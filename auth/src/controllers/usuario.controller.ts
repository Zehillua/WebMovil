import { Controller, Post, Body, BadRequestException, Get, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard'; // Asegúrate de tener este guard
import { Request } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto, CreateLocatarioDto, CreateRepartidorDto, TipoUsuario } from '../dtos/create-usuario.dto';
import { LoginUsuarioDto } from '../dtos/login-usuario.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('registro')
  async registro(@Body() body: any) {
    let dtoInstance: any;
    if (body.tipoUsuario === TipoUsuario.USUARIO) {
      dtoInstance = plainToInstance(CreateUsuarioDto, body);
    } else if (body.tipoUsuario === TipoUsuario.LOCATARIO) {
      dtoInstance = plainToInstance(CreateLocatarioDto, body);
    } else if (body.tipoUsuario === TipoUsuario.REPARTIDOR) {
      dtoInstance = plainToInstance(CreateRepartidorDto, body);
    } else {
      throw new BadRequestException('tipoUsuario inválido');
    }
    const errors = await validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      throw new BadRequestException(errors.map(e => Object.values(e.constraints || {})).flat());
    }
    return this.usuarioService.crearUsuario(dtoInstance);
  }

  @Post('login')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    console.log('DTO recibido:', loginUsuarioDto);
    return this.usuarioService.loginUsuario(loginUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    console.log('Usuario autenticado en /usuarios/me:', req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/saldo')
  async getSaldo(@Req() req: Request) {
    // req.user.userId viene del JWT payload
    const userId = (req.user as any).userId;
    const saldo = await this.usuarioService.obtenerSaldo(userId);
    return { saldo };
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/recargar')
  async recargarSaldo(@Req() req: Request, @Body() body: { monto: number }) {
    const userId = (req.user as any).userId;
    const { monto } = body;
    if (!monto || typeof monto !== 'number' || monto <= 0) {
      throw new BadRequestException('Monto inválido');
    }
    const saldo = await this.usuarioService.recargarSaldo(userId, monto);
    return { saldo };
  }

}
