import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../schemas/usuario.schema';

@Injectable()
export class LocatarioService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async obtenerLocatarios() {
    // Solo devuelve _id y nombreLocal
    return this.usuarioModel.find(
      { tipoUsuario: 'locatario' },
      { _id: 1, nombreLocal: 1 }
    ).lean();
  }

  async obtenerLocatarioPorId(id: string) {
  return this.usuarioModel.findById(id);
}
}