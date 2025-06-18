import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('Iniciando el servidor...');
  console.log('JWT_SECRET', process.env.JWT_SECRET);
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.API_PORT || 3000)
}
bootstrap();