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
exports.ComidaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const comida_service_1 = require("../services/comida.service");
const comida_input_1 = require("../dto/comida.input");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ComidaController = class ComidaController {
    constructor(comidaService) {
        this.comidaService = comidaService;
    }
    async crearComida(dto, req) {
        const usuario = req.user;
        return this.comidaService.crearComida(usuario._id, dto);
    }
    //AGREGA LIMITE DE PESOO**** - aws podria servir para el tema de imagenes
    async uploadFile(file) {
        if (!file) {
            throw new Error('No se recibió ningún archivo');
        }
        return { url: `/uploads/${file.filename}` };
    }
    async obtenerMisComidas(req) {
        const usuario = req.user;
        return this.comidaService.obtenerComidasPorLocatario(usuario._id);
    }
    async obtenerComida(id, req) {
        const usuario = req.user;
        return this.comidaService.obtenerComidaPorId(id, usuario._id);
    }
    async actualizarComida(id, dto, req) {
        const usuario = req.user;
        return this.comidaService.actualizarComida(id, dto, usuario._id);
    }
    async eliminarComida(id, req) {
        const usuario = req.user;
        return this.comidaService.eliminarComida(id, usuario._id);
    }
    async obtenerComidasPorLocatarioId(id) {
        return this.comidaService.obtenerComidasPorLocatario(id);
    }
};
exports.ComidaController = ComidaController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comida_input_1.CrearComidaDto, Object]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "crearComida", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "obtenerMisComidas", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "obtenerComida", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "actualizarComida", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "eliminarComida", null);
__decorate([
    (0, common_1.Get)('/locatario/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ComidaController.prototype, "obtenerComidasPorLocatarioId", null);
exports.ComidaController = ComidaController = __decorate([
    (0, common_1.Controller)('comidas'),
    __metadata("design:paramtypes", [comida_service_1.ComidaService])
], ComidaController);
