import 'reflect-metadata'; // Asegúrate de importar reflect-metadata primero
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('Iniciando el servidor...'); // Mensaje de inicio
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar CORS para permitir solicitudes desde otros dominios
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.API_PORT || 3000)
}
bootstrap();