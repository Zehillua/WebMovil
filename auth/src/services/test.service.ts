import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '../schemas/test.schema'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class TestService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}

  async crearTest(mensaje: string): Promise<Test> {
    const nuevoTest = new this.testModel({ mensaje });
    return nuevoTest.save(); // Guardar el mensaje en MongoDB
  }
}