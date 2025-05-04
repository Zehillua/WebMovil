import { Controller, Post, Body, Get } from '@nestjs/common';


@Controller('t') // Asegúrate de que la ruta esté definida aquí
export class TestControllerr {
  
    @Get()
  async crearTest() {
    console.log('Mensaje recibido desde Postman:',);
}
}