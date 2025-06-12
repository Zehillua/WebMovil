import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel('Usuario') private usuarioModel: Model<any>,
  ) {}

  async obtenerLocales() {
    // Devuelve nombreLocal, numeroTelefono, ciudad y numeroLocal
    return this.usuarioModel.find(
      { tipoUsuario: 'locatario' },
      {
        nombreLocal: 1,
        numeroTelefono: 1,
        ciudad: 1,
        numeroLocal: 1,
        _id: 0
      }
    ).exec();
  }

  async estadisticasLocal(nombreLocal: string) {
    // 1. Buscar el locatario por nombreLocal
    const locatario = await this.usuarioModel.findOne({ nombreLocal });

    // 2. Obtener ventas y comidas
    const ventas: any[] = locatario.ventas || [];
    const comidasStock: any[] = locatario.comidasStock || [];
    const promociones: any[] = locatario.promociones || [];

    // 3. Calcular estadísticas
    const totalVentas = ventas.length;
    const dineroRecaudado = ventas.reduce((sum: number, v: any) => sum + v.precio, 0);

    // Por comida
    const resumenComidas = comidasStock.map((comida: any) => {
      const ventasComida = ventas.filter((v: any) => v.comida === comida.nombre);
      const cantidad = ventasComida.length;
      const dinero = ventasComida.reduce((sum: number, v: any) => sum + v.precio, 0);
      return {
        nombre: comida.nombre,
        cantidadVentas: cantidad,
        dineroRecaudado: dinero,
      };
    });

    return {
      totalVentas,
      dineroRecaudado,
      resumenComidas,
      promociones,
    };
  }
}