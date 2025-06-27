"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Asegúrate de importar reflect-metadata primero
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3003); // El puerto de tu servidor HTTP
}
bootstrap();
