"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_strategy_1 = require("../strategies/jwt.strategy");
const usuario_service_1 = require("../services/usuario.service");
const usuario_module_1 = require("./usuario.module");
const usuario_schema_1 = require("../schemas/usuario.schema");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: usuario_schema_1.Usuario.name, schema: usuario_schema_1.UsuarioSchema }]),
            usuario_module_1.UsuarioModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secreto', // Usa variable de entorno en producción
                signOptions: { expiresIn: '1d' },
            }),
        ],
        providers: [jwt_strategy_1.JwtStrategy, usuario_service_1.UsuarioService],
        exports: [jwt_1.JwtModule],
    })
], AuthModule);
