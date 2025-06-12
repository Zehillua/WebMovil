"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Asegúrate de importar reflect-metadata primero
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:5173', // Permite peticiones desde tu frontend
        credentials: true,
    });
    const port = process.env.API_PORT || 3000;
    await app.listen(port);
    console.log(`Microservicio locatarios escuchando en el puerto ${port}`);
}
bootstrap();
