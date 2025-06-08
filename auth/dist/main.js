"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Asegúrate de importar reflect-metadata primero
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    console.log('Iniciando el servidor...'); // Mensaje de inicio
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(); // Habilitar CORS para permitir solicitudes desde otros dominios
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
