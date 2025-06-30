import { Injectable, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../schemas/usuario.schema';
import axios from 'axios';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUsuarioDto } from '../dtos/login-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    private jwtService: JwtService,
  ) {}


async crearUsuario(createUsuarioDto: any): Promise<Usuario> {
    const hash = await bcrypt.hash(createUsuarioDto.clave, 10);
    const direccionArray = createUsuarioDto.direccion
      ? [createUsuarioDto.direccion]
      : [];

    let usuarioData: any = {
      ...createUsuarioDto,
      clave: hash,
      isAdmin: !!createUsuarioDto.isAdmin,
      cartera: createUsuarioDto.cartera ?? 0,
      direccion: direccionArray,
    };

    if (createUsuarioDto.tipoUsuario === 'usuario') {
      usuarioData = {
        tipoUsuario: 'usuario',
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        correo: createUsuarioDto.correo,
        clave: hash,
        direccion: createUsuarioDto.direccion,
        telefono: createUsuarioDto.telefono,
        nombreUsuario: createUsuarioDto.nombreUsuario,
        numeroCasaDepto: createUsuarioDto.numeroCasaDepto,
        cartera: createUsuarioDto.cartera ?? 0,
      };
    } else if (createUsuarioDto.tipoUsuario === 'locatario') {
      const dto = createUsuarioDto as any;
      usuarioData = {
        tipoUsuario: 'locatario',
        nombre: dto.nombre,
        apellido: dto.apellido,
        nombreUsuario: dto.nombreUsuario,
        correo: dto.correo,
        clave: hash,
        direccion: dto.direccion,
        telefono: dto.telefono,
        nombreLocal: dto.nombreLocal,
        numeroLocal: dto.numeroLocal,
        comidasStock: dto.comidasStock ?? [],
        ventas: dto.ventas ?? [],
        ventasPromo: dto.ventasPromo ?? [],
        valoracion: dto.valoracion ?? 0,
        // agrega aquí cualquier otro campo que uses en locatarios
      };
    } else if (createUsuarioDto.tipoUsuario === 'repartidor') {
      const dto = createUsuarioDto as any;
      usuarioData = {
        tipoUsuario: 'repartidor',
        nombre: dto.nombre,
        apellido: dto.apellido,
        correo: dto.correo,
        clave: hash,
        direccion: dto.direccion,
        telefono: dto.telefono,
        usuarioRepartidor: dto.usuarioRepartidor,
        vehiculo: dto.vehiculo,
        patente: dto.patente,
        valoracionRepartidor: dto.valoracionRepartidor ?? 0,
        // agrega aquí cualquier otro campo que uses en repartidores
      };
    }

    if (usuarioData.nombreUsuario === null || usuarioData.nombreUsuario === undefined) {
      delete usuarioData.nombreUsuario;
    }

    try {
      const usuario = new this.usuarioModel(usuarioData);
      const savedUser = await usuario.save();

      // Sincronizar con microservicio locatarios
      if (savedUser.tipoUsuario === 'locatario') {
        try {
          await axios.post('http://localhost:3001/locatarios/sync', {
            _id: savedUser._id,
            ...usuarioData, // envía todos los campos del locatario
          });
        } catch (err) {
          console.error('Error sincronizando locatario:', (err as any).message);
        }
      }

      // Sincronizar con microservicio repartidores
      if (savedUser.tipoUsuario === 'repartidor') {
        try {
          await axios.post('http://localhost:3002/repartidores/sync', {
            _id: savedUser._id,
            ...usuarioData, // envía todos los campos del repartidor
          });
        } catch (err) {
          console.error('Error sincronizando repartidor:', (err as any).message);
        }
      }

      return savedUser;
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.correo) {
        throw new BadRequestException('El correo ya está registrado');
      }
      throw error;
    }
  }

  async loginUsuario(loginDto: LoginUsuarioDto): Promise<{ access_token: string; tipoUsuario: string }> {
    const { correo, clave } = loginDto;

    if (!correo) {
      throw new UnauthorizedException('Debe ingresar correo electrónico');
    }

    const usuario = await this.usuarioModel.findOne({ correo });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordOk = await bcrypt.compare(clave, usuario.clave);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: usuario._id, correo: usuario.correo, tipoUsuario: usuario.tipoUsuario };
    const access_token = this.jwtService.sign(payload);
    return { access_token, tipoUsuario: usuario.tipoUsuario };
  }

  async obtenerSaldo(userId: string): Promise<number> {
    const usuario = await this.usuarioModel.findById(userId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    return usuario.cartera ?? 0;
  }

  async recargarSaldo(userId: string, monto: number): Promise<number> {
    const usuario = await this.usuarioModel.findById(userId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    usuario.cartera = (usuario.cartera ?? 0) + monto;
    await usuario.save();
    return usuario.cartera;
  }

  async obtenerDireccion(userId: string): Promise<string[] | string> {
    const usuario = await this.usuarioModel.findById(userId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    return usuario.direccion;
  }

  // En auth/src/services/usuario.service.ts - AGREGA:
  async obtenerUsuarioPorId(id: string) {
    return this.usuarioModel.findById(id);
  }

  async actualizarValoracion(
    userId: string, 
    nuevaValoracion: number, 
    tipo: 'repartidor' | 'local'
  ): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(userId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    if (tipo === 'repartidor') {
      // Calcular nuevo promedio
      const totalActual = usuario.totalPuntosValoracion || 0;
      const countActual = usuario.totalValoraciones || 0;
      
      const nuevoTotal = totalActual + nuevaValoracion;
      const nuevoCount = countActual + 1;
      const nuevoPromedio = nuevoTotal / nuevoCount;

      usuario.valoracionRepartidor = Math.round(nuevoPromedio * 10) / 10; // Redondear a 1 decimal
      usuario.totalValoraciones = nuevoCount;
      usuario.totalPuntosValoracion = nuevoTotal;
    }
    // Agregar lógica similar para locatarios si es necesario

    await usuario.save();
    return usuario;
  }
  
}
