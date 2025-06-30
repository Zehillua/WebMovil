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
    console.log(`🔍 Buscando entregas para repartidor: ${repartidorId}`);
    
    // Verificar que el ID sea válido
    if (!Types.ObjectId.isValid(repartidorId)) {
      console.error('❌ ID de repartidor no válido:', repartidorId);
      return [];
    }

    const entregas = await this.entregaModel
      .find({ repartidorId: new Types.ObjectId(repartidorId) })
      .sort({ fechaEntrega: -1 })
      .exec();

    console.log(`📦 Encontradas ${entregas.length} entregas para repartidor ${repartidorId}`);
    
    // Log de las primeras entregas para debug
    if (entregas.length > 0) {
      console.log('🔍 Primera entrega:', {
        _id: entregas[0]._id,
        nombrePedido: entregas[0].nombrePedido,
        repartidorId: entregas[0].repartidorId,
        fechaEntrega: entregas[0].fechaEntrega
      });
    }

    return entregas;
  }

  async obtenerEstadisticas(repartidorId: string): Promise<any> {
    console.log(`📊 Calculando estadísticas para repartidor: ${repartidorId}`);
    
    if (!Types.ObjectId.isValid(repartidorId)) {
      console.error('❌ ID de repartidor no válido para estadísticas:', repartidorId);
      return {
        totalEntregas: 0,
        totalGanancias: 0,
        totalPropinas: 0,
        promedioGananciaPorEntrega: 0
      };
    }

    const entregas = await this.entregaModel
      .find({ repartidorId: new Types.ObjectId(repartidorId) })
      .exec();

    const totalEntregas = entregas.length;
    const totalGanancias = entregas.reduce((sum, e) => sum + e.valorEntrega + e.propina, 0);
    const totalPropinas = entregas.reduce((sum, e) => sum + e.propina, 0);

    const estadisticas = {
      totalEntregas,
      totalGanancias,
      totalPropinas,
      promedioGananciaPorEntrega: totalEntregas > 0 ? totalGanancias / totalEntregas : 0
    };

    console.log('📊 Estadísticas calculadas:', estadisticas);
    return estadisticas;
  }

  async actualizarValoracionMasReciente(
    repartidorId: string, 
    valoracion: number
  ): Promise<Entrega> {
    // Buscar la entrega más reciente sin valoración
    const entrega = await this.entregaModel.findOneAndUpdate(
      { 
        repartidorId: new Types.ObjectId(repartidorId),
        valoracionRegistrada: false
      },
      {
        valoracionRecibida: valoracion,
        fechaValoracion: new Date(),
        valoracionRegistrada: true
      },
      { 
        new: true,
        sort: { fechaEntrega: -1 } // Más reciente primero
      }
    );

    if (!entrega) {
      throw new Error('No se encontró entrega reciente sin valoración para este repartidor');
    }

    return entrega;
  }

  async obtenerEntregasConValoracion(repartidorId: string): Promise<Entrega[]> {
    return this.entregaModel
      .find({ 
        repartidorId: new Types.ObjectId(repartidorId),
        valoracionRegistrada: true
      })
      .sort({ fechaValoracion: -1 })
      .exec();
  }

  async calcularPromedioValoracion(repartidorId: string): Promise<number> {
    const entregas = await this.entregaModel
      .find({ 
        repartidorId: new Types.ObjectId(repartidorId),
        valoracionRegistrada: true
      })
      .exec();

    if (entregas.length === 0) return 0;

    const suma = entregas.reduce((acc, entrega) => acc + entrega.valoracionRecibida, 0);
    return Math.round((suma / entregas.length) * 10) / 10; // Redondear a 1 decimal
  }
}