import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel('Usuario') private usuarioModel: Model<any>,
  ) {}

  async obtenerLocales() {
    // Devuelve solo nombreLocal y nombre completo del usuario que registró el local
    return this.usuarioModel.find(
      { tipoUsuario: 'locatario' },
      {
        nombreLocal: 1,
        nombre: 1,
        apellido: 1,
        _id: 0
      }
    ).exec();
  }
}
