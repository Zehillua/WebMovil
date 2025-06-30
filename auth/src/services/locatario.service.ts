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
  // ✅ DEVOLVER MÁS CAMPOS PARA EL DASHBOARD
  return this.usuarioModel.find(
    { tipoUsuario: 'locatario' },
    { 
      _id: 1, 
      nombreLocal: 1,
      numeroLocal: 1,
      direccion: 1,
      valoracion: 1,
      // Agregar campos que tengas en el schema y necesites mostrar
    }
  ).lean().exec().then(locales => 
    locales.map(local => ({
      ...local,
      // Asegurar valores por defecto para el frontend
      valoracion: local.valoracion || 0,
      tiempoEntrega: '30-45 min', // Valor por defecto
      categorias: [],
      estado: 'abierto',
      descripcion: `Local de comida - ${local.nombreLocal}`
    }))
  );
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