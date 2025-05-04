import { Controller, Post, Get, Body } from '@nestjs/common';
import { TestService } from '../services/test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async crearPrueba(@Body('mensaje') mensaje: string) {
    return this.testService.crearPrueba(mensaje);
  }

  @Get()
  async obtenerPruebas() {
    return this.testService.obtenerPruebas();
  }
}
