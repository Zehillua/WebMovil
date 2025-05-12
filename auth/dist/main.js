"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Asegúrate de importar reflect-metadata primero
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    console.log('Iniciando el servidor...'); // Mensaje de inicio
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors(); // Habilitar CORS para permitir solicitudes desde otros dominios
    await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
