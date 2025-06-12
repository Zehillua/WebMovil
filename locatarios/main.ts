import 'reflect-metadata'; // Asegúrate de importar reflect-metadata primero
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Permite peticiones desde tu frontend
    credentials: true,
  });
  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`Microservicio locatarios escuchando en el puerto ${port}`);
}
bootstrap();