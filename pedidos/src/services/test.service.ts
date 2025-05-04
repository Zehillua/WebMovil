import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '../schemas/test.schema';

@Injectable() // Este decorador debe estar en la clase
export class TestService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}

  async crearPrueba(mensaje: string): Promise<Test> {
    const nuevoTest = new this.testModel({ mensaje });
    return nuevoTest.save();
  }

  async obtenerPruebas(): Promise<Test[]> {
    return this.testModel.find().exec();
  }
}