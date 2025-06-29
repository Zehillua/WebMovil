import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Entrega } from '../schemas/entrega.schema';

@Injectable()
export class EntregaService {
  constructor(
    @InjectModel(Entrega.name) private entregaModel: Model<Entrega>,
  ) {}

  async registrarEntrega(entregaData: any): Promise<Entrega> {
    console.log('📦 Registrando nueva entrega:', entregaData.pedidoId);
    
    const entrega = new this.entregaModel({
      ...entregaData,
      repartidorId: new Types.ObjectId(entregaData.repartidorId),
      pedidoId: new Types.ObjectId(entregaData.pedidoId),
      cliente: {
        ...entregaData.cliente,
        id: new Types.ObjectId(entregaData.cliente.id)
      },
      local: {
        ...entregaData.local,
        id: new Types.ObjectId(entregaData.local.id)
      }
    });

    const entregaGuardada = await entrega.save();
    console.log('✅ Entrega registrada exitosamente');
    return entregaGuardada;
  }

  async obtenerEntregasRepartidor(repartidorId: string): Promise<Entrega[]> {
    return this.entregaModel
      .find({ repartidorId: new Types.ObjectId(repartidorId) })
      .sort({ fechaEntrega: -1 })
      .exec();
  }

  async obtenerEstadisticas(repartidorId: string): Promise<any> {
    const entregas = await this.entregaModel
      .find({ repartidorId: new Types.ObjectId(repartidorId) })
      .exec();

    const totalEntregas = entregas.length;
    const totalGanancias = entregas.reduce((sum, e) => sum + e.valorEntrega + e.propina, 0);
    const totalPropinas = entregas.reduce((sum, e) => sum + e.propina, 0);

    return {
      totalEntregas,
      totalGanancias,
      totalPropinas,
      promedioGananciaPorEntrega: totalEntregas > 0 ? totalGanancias / totalEntregas : 0
    };
  }
}