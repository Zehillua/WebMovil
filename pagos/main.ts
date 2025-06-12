import 'reflect-metadata'; // Asegúrate de importar reflect-metadata primero
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`Microservicio pagos escuchando en el puerto ${port}`);
}
bootstrap();