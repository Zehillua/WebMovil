import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CONFIGURAR CORS AQUÍ
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      'http://localhost:4173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
  });
  
  // ✅ VALIDACIÓN GLOBAL
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    skipUndefinedProperties: true, // ✅ AGREGAR ESTA LÍNEA
    skipNullProperties: false,
    skipMissingProperties: false,
  }));
  
  await app.listen(3002);
  console.log('🚀 Microservicio de Pedidos corriendo en puerto 3002');
  console.log('📊 GraphQL Playground disponible en http://localhost:3002/graphql');
  console.log('🛒 API REST disponible en http://localhost:3002/pedidos');
  console.log('🛒 API REST Carrito disponible en http://localhost:3002/carrito');
}

bootstrap();