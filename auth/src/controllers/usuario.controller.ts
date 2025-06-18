import { Controller, Post, Body, BadRequestException, Get, Req, UseGuards, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto, CreateLocatarioDto, CreateRepartidorDto, TipoUsuario } from '../dtos/create-usuario.dto';
import { LoginUsuarioDto } from '../dtos/login-usuario.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';

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
    return this.usuarioService.loginUsuario(loginUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = req.user as any;
    return this.usuarioService.updateUsuario(usuario._id, updateUsuarioDto);
  }
}
