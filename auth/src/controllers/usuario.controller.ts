import { Controller, Post, Body, BadRequestException, Get, Req, UseGuards, Param, NotFoundException, Patch} from '@nestjs/common';
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
  @Get('me/admin-check')
  async getAdminCheck(@Req() req: Request) {
    console.log('🔍 Admin check - Usuario autenticado:', req.user);
    
    // Obtener información completa del usuario desde la base de datos
    const userId = (req.user as any).sub || (req.user as any).userId;
    console.log('🔍 ID del usuario para admin check:', userId);
    
    const usuario = await this.usuarioService.obtenerUsuarioPorId(userId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    console.log('👤 Usuario encontrado para admin check:', {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      tipoUsuario: usuario.tipoUsuario,
      isAdmin: usuario.isAdmin // ✅ DEBUG IMPORTANTE
    });
    
    // Retornar información específica para verificación de admin
    return {
      _id: usuario._id,
      userId: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      tipoUsuario: usuario.tipoUsuario,
      isAdmin: usuario.isAdmin, // ✅ CAMPO CLAVE PARA ADMIN
      // Campos adicionales si es necesario
      nombreUsuario: usuario.nombreUsuario,
      nombreLocal: usuario.nombreLocal,
      usuarioRepartidor: usuario.usuarioRepartidor
    };
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

  @UseGuards(JwtAuthGuard)
  @Get('me/direccion')
    async getDireccion(@Req() req: Request) {
      const userId = (req.user as any).userId;
      const direccion = await this.usuarioService.obtenerDireccion(userId);
      return { direccion };
  }

  // En auth/src/controllers/usuario.controller.ts - AGREGA:
  @Get(':id')
    async obtenerUsuarioPorId(@Param('id') id: string) {
      const usuario = await this.usuarioService.obtenerUsuarioPorId(id);
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      
      return {
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        nombreUsuario: usuario.nombreUsuario,
        direccion: usuario.direccion,
        numeroCasaDepto: usuario.numeroCasaDepto,
      };
  }

  @Patch(':id/valoracion')
  async actualizarValoracion(
    @Param('id') id: string, 
    @Body() body: { nuevaValoracion: number; tipo: 'repartidor' | 'local' }
  ) {
    const { nuevaValoracion, tipo } = body;
    
    if (nuevaValoracion < 0 || nuevaValoracion > 5) {
      throw new BadRequestException('Valoración debe estar entre 0 y 5');
    }

    const usuario = await this.usuarioService.actualizarValoracion(id, nuevaValoracion, tipo);
    return usuario;
  }
}
