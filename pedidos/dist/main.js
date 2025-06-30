"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(3002);
    console.log('🚀 Microservicio de Pedidos corriendo en puerto 3002');
    console.log('📊 GraphQL Playground disponible en http://localhost:3002/graphql');
    console.log('🛒 API REST disponible en http://localhost:3002/pedidos');
    console.log('🛒 API REST Carrito disponible en http://localhost:3002/carrito');
}
bootstrap();
