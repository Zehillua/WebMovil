"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const test_schema_1 = require("./src/schemas/test.schema");
const test_service_1 = require("./src/services/test.service");
const test_controller_1 = require("./src/controllers/test.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Conexión a la base de datos (ajustá el URI a tu caso)
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/mi_basedatos'),
            // Registro del schema
            mongoose_1.MongooseModule.forFeature([{ name: test_schema_1.Test.name, schema: test_schema_1.TestSchema }]),
        ],
        controllers: [test_controller_1.TestController],
        providers: [test_service_1.TestService],
    })
], AppModule);
