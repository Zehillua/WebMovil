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
exports.PromocionesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const promocion_service_1 = require("../services/promocion.service");
const promocion_dto_1 = require("../dto/promocion.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let PromocionesController = class PromocionesController {
    constructor(promocionService) {
        this.promocionService = promocionService;
    }
    async crearPromocion(dto, req) {
        const usuario = req.user;
        console.log('🎉 Solicitud para crear promoción:', dto.nombre);
        return this.promocionService.crearPromocion(usuario._id, dto);
    }
    async uploadImagenPromocion(file) {
        if (!file) {
            throw new Error('No se recibió ningún archivo');
        }
        console.log('📸 Imagen de promoción subida:', file.filename);
        return { url: `/uploads/${file.filename}` };
    }
    async obtenerMisPromociones(req) {
        const usuario = req.user;
        return this.promocionService.obtenerPromocionesPorLocatario(usuario._id);
    }
    async obtenerEstadisticas(req) {
        const usuario = req.user;
        return this.promocionService.obtenerEstadisticasPromociones(usuario._id);
    }
    async obtenerPromocionesActivas(locatarioId) {
        return this.promocionService.obtenerPromocionesActivas(locatarioId);
    }
    async obtenerPromocion(id, req) {
        const usuario = req.user;
        return this.promocionService.obtenerPromocionPorId(id, usuario._id);
    }
    async actualizarPromocion(id, dto, req) {
        const usuario = req.user;
        return this.promocionService.actualizarPromocion(id, dto, usuario._id);
    }
    async toggleEstadoPromocion(id, req) {
        const usuario = req.user;
        return this.promocionService.toggleEstadoPromocion(id, usuario._id);
    }
    async eliminarPromocion(id, req) {
        const usuario = req.user;
        return this.promocionService.eliminarPromocion(id, usuario._id);
    }
    async obtenerPromocionesPorLocatarioId(id) {
        return this.promocionService.obtenerPromocionesPorLocatario(id);
    }
};
exports.PromocionesController = PromocionesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [promocion_dto_1.CrearPromocionDto, Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "crearPromocion", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, 'promo-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        limits: { fileSize: 3 * 1024 * 1024 }, // 3MB para promociones
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "uploadImagenPromocion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "obtenerMisPromociones", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('estadisticas'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "obtenerEstadisticas", null);
__decorate([
    (0, common_1.Get)('activas'),
    __param(0, (0, common_1.Query)('locatario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "obtenerPromocionesActivas", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "obtenerPromocion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, promocion_dto_1.ActualizarPromocionDto, Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "actualizarPromocion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "toggleEstadoPromocion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "eliminarPromocion", null);
__decorate([
    (0, common_1.Get)('locatario/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PromocionesController.prototype, "obtenerPromocionesPorLocatarioId", null);
exports.PromocionesController = PromocionesController = __decorate([
    (0, common_1.Controller)('promociones'),
    __metadata("design:paramtypes", [promocion_service_1.PromocionService])
], PromocionesController);
