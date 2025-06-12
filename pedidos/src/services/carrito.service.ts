import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Carrito } from '../schemas/carrito.schema';
import { CreateComidaCarritoDto } from '../dtos/create-comidaCarrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectModel(Carrito.name) private carritoModel: Model<Carrito>,
  ) {}


 async agregarComidaAlCarrito(idComprador: string, dto: CreateComidaCarritoDto) {
    const compradorId = new Types.ObjectId(idComprador);
    const locatarioId = new Types.ObjectId(dto.idLocatario);

    const item = {
        ...dto,
        idLocatario: locatarioId,
    };

    let carrito = await this.carritoModel.findOne({ idComprador: compradorId });
    if (!carrito) {
        carrito = new this.carritoModel({ idComprador: compradorId, items: [item] });
    } else {
        carrito.items.push(item);
    }
    return carrito.save();
    }

  async obtenerCarrito(idComprador: string) {
    const compradorId = new Types.ObjectId(idComprador);
    const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
    return carrito || { items: [] };
  }

  async eliminarItem(idComprador: string, itemId: string) {
    return this.carritoModel.updateOne(
      { idComprador: new Types.ObjectId(idComprador) },
      { $pull: { items: { _id: new Types.ObjectId(itemId) } } }
    );
  }

  async vaciarCarrito(idComprador: string) {
    return this.carritoModel.updateOne(
      { idComprador: new Types.ObjectId(idComprador) },
      { $set: { items: [] } }
    );
  }
}