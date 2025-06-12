"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard"); // Asegúrate de tener este guard
const usuario_service_1 = require("../services/usuario.service");
const create_usuario_dto_1 = require("../dtos/create-usuario.dto");
const login_usuario_dto_1 = require("../dtos/login-usuario.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let UsuarioController = class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
    async registro(body) {
        let dtoInstance;
        if (body.tipoUsuario === create_usuario_dto_1.TipoUsuario.USUARIO) {
            dtoInstance = (0, class_transformer_1.plainToInstance)(create_usuario_dto_1.CreateUsuarioDto, body);
        }
        else if (body.tipoUsuario === create_usuario_dto_1.TipoUsuario.LOCATARIO) {
            dtoInstance = (0, class_transformer_1.plainToInstance)(create_usuario_dto_1.CreateLocatarioDto, body);
        }
        else if (body.tipoUsuario === create_usuario_dto_1.TipoUsuario.REPARTIDOR) {
            dtoInstance = (0, class_transformer_1.plainToInstance)(create_usuario_dto_1.CreateRepartidorDto, body);
        }
        else {
            throw new common_1.BadRequestException('tipoUsuario inválido');
        }
        const errors = await (0, class_validator_1.validate)(dtoInstance, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors.map(e => Object.values(e.constraints || {})).flat());
        }
        return this.usuarioService.crearUsuario(dtoInstance);
    }
    async login(loginUsuarioDto) {
        console.log('DTO recibido:', loginUsuarioDto);
        return this.usuarioService.loginUsuario(loginUsuarioDto);
    }
    async getMe(req) {
        console.log('Usuario autenticado en /usuarios/me:', req.user);
        return req.user;
    }
};
exports.UsuarioController = UsuarioController;
__decorate([
    (0, common_1.Post)('registro'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "registro", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_usuario_dto_1.LoginUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuarioController.prototype, "getMe", null);
exports.UsuarioController = UsuarioController = __decorate([
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService])
], UsuarioController);
