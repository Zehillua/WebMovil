import { Controller, Post, Body } from '@nestjs/common';
import { TestService } from '../services/test.service';

@Controller('test') // Asegúrate de que la ruta esté definida aquí
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async crearTest(@Body('mensaje') mensaje: string) {
    console.log('Mensaje recibido desde Postman:', mensaje);
    try {
      return await this.testService.crearTest(mensaje);
       // Llama al servicio para guardar el mensaje
    } catch (error) {
      console.error('Error en el controlador:', error);
      throw error;
    }
  }
}