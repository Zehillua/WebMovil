import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
    // Validación de propina con tarjeta...
    const pedidoData = {
      ...createPedidoDto,
      idComprador: new Types.ObjectId(createPedidoDto.idComprador),
      idLocal: new Types.ObjectId(createPedidoDto.idLocal),
      idRepartidor: createPedidoDto.idRepartidor ? new Types.ObjectId(createPedidoDto.idRepartidor) : undefined,
      estado: false,
      dealer: false,
      repartidor: null
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

  async obtenerPedidosPorUsuario(idComprador: string): Promise<Pedido[]> {
    return this.pedidoModel.find({ idComprador: new Types.ObjectId(idComprador) }).exec();
  }
}
