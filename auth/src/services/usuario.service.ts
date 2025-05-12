import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../schemas/usuario.schema';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { LoginUsuarioDto } from '../dtos/login-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async crearUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hash = await bcrypt.hash(createUsuarioDto.contraseña, 10);
    let usuarioData: any = {
      ...createUsuarioDto,
      contraseña: hash,
    };
    if (createUsuarioDto.tipoUsuario === 'usuario') {
      usuarioData = {
        tipoUsuario: 'usuario',
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        nombreUsuario: createUsuarioDto.nombreUsuario,
        correo: createUsuarioDto.correo,
        contraseña: hash,
        pais: createUsuarioDto.pais,
        ciudad: createUsuarioDto.ciudad,
        numeroTelefono: createUsuarioDto.numeroTelefono,
        numeroCasaDepto: createUsuarioDto.numeroCasaDepto,
      };
    } else if (createUsuarioDto.tipoUsuario === 'locatario') {
      usuarioData = {
        tipoUsuario: 'locatario',
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        nombreLocal: createUsuarioDto.nombreLocal,
        correo: createUsuarioDto.correo,
        contraseña: hash,
        pais: createUsuarioDto.pais,
        ciudad: createUsuarioDto.ciudad,
        numeroTelefono: createUsuarioDto.numeroTelefono,
        numeroLocal: createUsuarioDto.numeroLocal,
        comidasStock: createUsuarioDto.comidasStock || [],
        ventas: createUsuarioDto.ventas || [],
      };
    } else if (createUsuarioDto.tipoUsuario === 'repartidor') {
      usuarioData = {
        tipoUsuario: 'repartidor',
        nombre: createUsuarioDto.nombre,
        apellido: createUsuarioDto.apellido,
        nombreUsuario: createUsuarioDto.nombreUsuario, // ahora requerido
        correo: createUsuarioDto.correo,
        contraseña: hash,
        pais: createUsuarioDto.pais,
        ciudad: createUsuarioDto.ciudad,
        numeroTelefono: createUsuarioDto.numeroTelefono,
        vehiculo: createUsuarioDto.vehiculo,
        patente: createUsuarioDto.patente,
      };
    }
    // Eliminar nombreUsuario si es null o undefined
    if (usuarioData.nombreUsuario === null || usuarioData.nombreUsuario === undefined) {
      delete usuarioData.nombreUsuario;
    }
    const usuario = new this.usuarioModel(usuarioData);
    return usuario.save();
  }

  async loginUsuario(loginDto: LoginUsuarioDto): Promise<Usuario> {
    const { nombreUsuario, correo, contraseña } = loginDto;
    
    let filtro = {};
    if (nombreUsuario) {
      filtro = { nombreUsuario };
    } else if (correo) {
      filtro = { correo };
    } else {
      throw new UnauthorizedException('Debe ingresar nombre de usuario o correo');
    }
    const usuario = await this.usuarioModel.findOne(filtro);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordOk = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuario;
  }
}
