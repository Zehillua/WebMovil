import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comida } from '../schemas/comida.schema';
import { CrearComidaDto } from '../dto/comida.input';

@Injectable()
export class ComidaService {
  constructor(
    @InjectModel(Comida.name) private comidaModel: Model<Comida>,
  ) {}

  async crearComida(locatarioId: string, dto: CrearComidaDto) {
    const nuevaComida = new this.comidaModel({
      ...dto,
      locatarioId: new Types.ObjectId(locatarioId),
    });
    return nuevaComida.save();
  }

  async obtenerComidasPorLocatario(locatarioId: string) {
    return this.comidaModel.find({ locatarioId: new Types.ObjectId(locatarioId) });
  }

  async obtenerComidaPorId(comidaId: string, locatarioId: string) {
    const comida = await this.comidaModel.findOne({
      _id: comidaId,
      locatarioId: new Types.ObjectId(locatarioId),
    });
    if (!comida) throw new NotFoundException('Comida no encontrada o no autorizada');
    return comida;
  }

  async actualizarComida(comidaId: string, dto: Partial<CrearComidaDto>, locatarioId: string) {
    const comida = await this.comidaModel.findOneAndUpdate(
      { _id: comidaId, locatarioId: new Types.ObjectId(locatarioId) },
      dto,
      { new: true }
    );
    if (!comida) throw new NotFoundException('Comida no encontrada o no autorizada');
    return comida;
  }

  async eliminarComida(comidaId: string, locatarioId: string) {
    const result = await this.comidaModel.findOneAndDelete({
      _id: comidaId,
      locatarioId: new Types.ObjectId(locatarioId),
    });
    if (!result) throw new NotFoundException('Comida no encontrada o no autorizada');
    return { success: true };
  }
}