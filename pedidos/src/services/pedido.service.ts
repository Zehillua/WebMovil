import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
  ) {}

  async crearPedido(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // Validación de propina con tarjeta
    if (createPedidoDto.pago === 'tarjeta' && createPedidoDto.propina) {
      if (
        typeof createPedidoDto.cantidadPropina !== 'number' ||
        !Number.isInteger(createPedidoDto.cantidadPropina) ||
        createPedidoDto.cantidadPropina < 0
      ) {
        throw new BadRequestException('La propina debe ser un número entero positivo');
      }
    }

    const pedido = new this.pedidoModel(createPedidoDto);
    return pedido.save();
  }

  async obtenerPedidos(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async obtenerPedidosPorUsuario(idComprador: string): Promise<Pedido[]> {
  return this.pedidoModel.find({ idComprador }).exec();
}
}
