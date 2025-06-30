"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComidaModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const comidas_controller_1 = require("../controllers/comidas.controller");
const comida_schema_1 = require("../schemas/comida.schema");
const comida_service_1 = require("../services/comida.service");
const comida_resolver_1 = require("../resolvers/comida.resolver");
const venta_resolver_1 = require("../resolvers/venta.resolver");
const venta_service_1 = require("../services/venta.service");
const venta_schema_1 = require("../schemas/venta.schema");
let ComidaModule = class ComidaModule {
};
exports.ComidaModule = ComidaModule;
exports.ComidaModule = ComidaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: comida_schema_1.Comida.name, schema: comida_schema_1.ComidaSchema },
                { name: venta_schema_1.Venta.name, schema: venta_schema_1.VentaSchema },
            ]),
        ],
        controllers: [comidas_controller_1.ComidaController],
        providers: [
            comida_service_1.ComidaService,
            comida_resolver_1.ComidaResolver,
            venta_service_1.VentaService,
            venta_resolver_1.VentaResolver
        ],
        exports: [comida_service_1.ComidaService, venta_service_1.VentaService],
    })
], ComidaModule);
