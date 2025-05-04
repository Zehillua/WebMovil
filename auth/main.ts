import 'reflect-metadata'; // Asegúrate de importar reflect-metadata primero
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Iniciando el servidor...'); // Mensaje de inicio
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar CORS para permitir solicitudes desde otros dominios
  await app.listen(3000, '0.0.0.0'); // El puerto de tu servidor HTTP
}
bootstrap();