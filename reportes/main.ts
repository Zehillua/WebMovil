import 'reflect-metadata'; // Asegúrate de importar reflect-metadata primero
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para permitir solicitudes desde otros dominios
  await app.listen(3004); // El puerto de tu servidor HTTP
}
bootstrap();