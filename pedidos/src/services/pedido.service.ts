import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Types } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { Carrito } from '../schemas/carrito.schema';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    @InjectModel(Carrito.name) private carritoModel: Model<any>,
  ) {}

  async crearPedido(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // 1. Obtener dirección del local
    let direccionLocal = '';
    try {
      const res = await axios.get(`http://localhost:3000/locatarios/${createPedidoDto.idLocal}`);
      const dir = res.data.direccion;
      direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
    } catch (e) {
      direccionLocal = '';
    }

    // 2. Si es delivery, guardar dirección de entrega del usuario
    let direccionEntrega = '';
    if (createPedidoDto.esDelivery) {
      const dir = createPedidoDto.direccionEntrega;
      direccionEntrega = Array.isArray(dir) ? dir.join(', ') : (dir || '');
    }

    // 3. Crear el pedido con todos los datos
    const pedidoData = {
      ...createPedidoDto,
      idComprador: new Types.ObjectId(createPedidoDto.idComprador),
      idLocal: new Types.ObjectId(createPedidoDto.idLocal),
      idRepartidor: createPedidoDto.idRepartidor ? new Types.ObjectId(createPedidoDto.idRepartidor) : undefined,
      estado: false,
      dealer: false,
      repartidor: null,
      direccionLocal,
      direccionEntrega,
    };

    const pedido = new this.pedidoModel(pedidoData);
    const pedidoGuardado = await pedido.save();

    // Elimina el carrito del usuario después de crear el pedido
    await this.carritoModel.deleteOne({ idComprador: pedidoData.idComprador });

    return pedidoGuardado;
  }

  async obtenerPedidos(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async obtenerPedidosPorUsuario(idComprador: string): Promise<any[]> {
    return this.pedidoModel
      .find({ idComprador: new Types.ObjectId(idComprador) })
      .lean()
      .exec();
  }

  async obtenerPedidosPorLocal(idLocal: string): Promise<any[]> {
    return this.pedidoModel
      .find({ idLocal: new Types.ObjectId(idLocal) })
      .lean()
      .exec();
  }

  async obtenerPedidosDeliveryDisponibles(): Promise<any[]> {
    return this.pedidoModel
      .find({ 
        esDelivery: true,
        estado: true,
        listo: true,
        dealer: false
      })
      .lean()
      .exec();
  }
  async actualizarEstado(id: string, estado: boolean) {
    return this.pedidoModel.findByIdAndUpdate(id, { estado }, { new: true });
  }

  async rechazarPedido(id: string) {
    return this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        estadoRechazado: true,
        fechaRechazo: new Date()
      }, 
      { new: true }
    );
  }

  // Método para eliminar un pedido específico
  async eliminarPedido(id: string) {
    return this.pedidoModel.findByIdAndDelete(id);
  }

  // Tarea programada que se ejecuta cada 10 segundos para eliminar pedidos rechazados antiguos
  @Cron('*/10 * * * * *') // Cada 10 segundos (formato: segundos minutos horas día mes año)
  async eliminarPedidosRechazadosAntiguos() {
    const fechaLimite = new Date();
    fechaLimite.setSeconds(fechaLimite.getSeconds() - 30); // 30 segundos atrás

    const resultado = await this.pedidoModel.deleteMany({
      estadoRechazado: true,
      fechaRechazo: { $lt: fechaLimite }
    });

    if (resultado.deletedCount > 0) {
      console.log(`Eliminados ${resultado.deletedCount} pedidos rechazados antiguos (más de 30 segundos)`);
    }
  }

  async marcarListo(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { listo: true }, { new: true });
  }

  async aceptarPorRepartidor(id: string, idRepartidor: string) {
    return this.pedidoModel.findByIdAndUpdate(
      id, 
      { 
        dealer: true,
        repartidor: new Types.ObjectId(idRepartidor)
      }, 
      { new: true }
    );
  }

  async marcarEnCamino(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { enCamino: true }, { new: true });
  }

  async marcarEntregado(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { pedidoEntregado: true }, { new: true });
  }
}
