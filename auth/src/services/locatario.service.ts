import { Injectable, NotFoundException } from '@nestjs/common';
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

async actualizarValoracion(
  locatarioId: string, 
  nuevaValoracion: number
): Promise<Usuario> {
  const locatario = await this.usuarioModel.findById(locatarioId);
  if (!locatario) throw new NotFoundException('Locatario no encontrado');

  // Calcular nuevo promedio
  const totalActual = locatario.totalPuntosValoracion || 0;
  const countActual = locatario.totalValoraciones || 0;
  
  const nuevoTotal = totalActual + nuevaValoracion;
  const nuevoCount = countActual + 1;
  const nuevoPromedio = nuevoTotal / nuevoCount;

  locatario.valoracion = Math.round(nuevoPromedio * 10) / 10; // Redondear a 1 decimal
  locatario.totalValoraciones = nuevoCount;
  locatario.totalPuntosValoracion = nuevoTotal;

  await locatario.save();
  return locatario;
}
}