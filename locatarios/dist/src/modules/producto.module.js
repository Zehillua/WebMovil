"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const producto_schema_1 = require("../schemas/producto.schema");
const producto_service_1 = require("../services/producto.service");
const producto_controller_1 = require("../controllers/producto.controller");
let ProductoModule = class ProductoModule {
};
exports.ProductoModule = ProductoModule;
exports.ProductoModule = ProductoModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: producto_schema_1.Producto.name, schema: producto_schema_1.ProductoSchema }])],
        controllers: [producto_controller_1.ProductoController],
        providers: [producto_service_1.ProductoService],
        exports: [producto_service_1.ProductoService],
    })
], ProductoModule);
