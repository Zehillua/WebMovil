"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const usuario_schema_1 = require("../schemas/usuario.schema");
const usuario_service_1 = require("../services/usuario.service");
const usuario_controller_1 = require("../controllers/usuario.controller");
let UsuarioModule = class UsuarioModule {
};
exports.UsuarioModule = UsuarioModule;
exports.UsuarioModule = UsuarioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: usuario_schema_1.Usuario.name, schema: usuario_schema_1.UsuarioSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secreto',
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [usuario_controller_1.UsuarioController],
        providers: [usuario_service_1.UsuarioService],
        exports: [usuario_service_1.UsuarioService],
    })
], UsuarioModule);
