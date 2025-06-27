import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { Carrito } from '../schemas/carrito.schema';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    @InjectModel(Carrito.name) private carritoModel: Model<any>, // Asegúrate de que el modelo Carrito esté definido correctamente
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
      direccionLocal,    // <-- SIEMPRE guarda la dirección del local
      direccionEntrega,  // <-- Si es delivery, guarda la dirección de entrega
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
    const pedidos = await this.pedidoModel
      .find({ idComprador: new Types.ObjectId(idComprador) })
      .exec();

    // Por cada pedido, consulta el microservicio de auth/locatarios
    const pedidosConLocal = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let nombreLocal = '';
        let direccionLocal = '';
        try {
          const res = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
          nombreLocal = res.data.nombreLocal || '';
          direccionLocal = res.data.direccion || '';
        } catch (e) {
          // Si falla, deja vacío
        }
        return {
          ...pedido.toObject(),
          nombreLocal,
          direccionLocal,
        };
      })
    );
    return pedidosConLocal;
  }

  async obtenerPedidosPorLocal(idLocal: string): Promise<any[]> {
    const pedidos = await this.pedidoModel
      .find({ idLocal: new Types.ObjectId(idLocal) })
      .exec();

    // Si quieres agregar nombreLocal y direccionLocal desde el microservicio de locales:
    const pedidosConLocal = await Promise.all(
      pedidos.map(async (pedido: any) => {
        let nombreLocal = '';
        let direccionLocal = '';
        try {
          const res = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
          nombreLocal = res.data.nombreLocal || '';
          const dir = res.data.direccion;
          direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
        } catch (e) {
          // Si falla, deja vacío
        }
        return {
          ...pedido.toObject(),
          nombreLocal,
          direccionLocal,
        };
      })
    );
    return pedidosConLocal;
  }

  async actualizarEstado(id: string, estado: boolean) {
    return this.pedidoModel.findByIdAndUpdate(id, { estado }, { new: true });
  }

  async rechazarPedido(id: string) {
    return this.pedidoModel.findByIdAndUpdate(id, { estadoRechazado: true }, { new: true });
  }

}
