import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Venta } from '../schemas/venta.schema';
import { RegistrarVentaInput } from '../dto/venta.input';

@Injectable()
export class VentaService {
  constructor(
    @InjectModel(Venta.name) private ventaModel: Model<Venta>,
  ) {}

  async registrarVenta(ventaData: RegistrarVentaInput): Promise<Venta> {
    console.log('💰 Registrando nueva venta en locatarios:', ventaData.pedidoId);
    
    const venta = new this.ventaModel({
      localId: new Types.ObjectId(ventaData.localId),
      pedidoId: new Types.ObjectId(ventaData.pedidoId),
      nombrePedido: ventaData.nombrePedido,
      precio: ventaData.precio,
      fechaVenta: new Date(ventaData.fechaVenta),
      cliente: {
        id: new Types.ObjectId(ventaData.cliente.id),
        nombre: ventaData.cliente.nombre
      },
      comidas: ventaData.comidas,
      esDelivery: ventaData.esDelivery,
      propina: ventaData.propina,
      totalConPropina: ventaData.precio + ventaData.propina
    });

    const ventaGuardada = await venta.save();
    console.log('✅ Venta registrada en locatarios');
    return ventaGuardada;
  }

  async obtenerVentasPorLocal(localId: string): Promise<Venta[]> {
    return this.ventaModel
      .find({ localId: new Types.ObjectId(localId) })
      .sort({ fechaVenta: -1 })
      .exec();
  }

  async obtenerEstadisticasLocal(localId: string): Promise<any> {
    const ventas = await this.ventaModel
      .find({ localId: new Types.ObjectId(localId) })
      .exec();

    const totalVentas = ventas.length;
    const totalIngresos = ventas.reduce((sum, v) => sum + v.precio, 0);
    const totalPropinas = ventas.reduce((sum, v) => sum + v.propina, 0);
    const totalCompleto = totalIngresos + totalPropinas;

    return {
      localId,
      totalVentas,
      totalIngresos,
      totalPropinas,
      totalCompleto,
      promedioVentaPorPedido: totalVentas > 0 ? totalIngresos / totalVentas : 0,
      ventasRecientes: ventas
        .sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime())
        .slice(0, 10)
    };
  }
}