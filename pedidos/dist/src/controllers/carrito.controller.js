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
exports.CarritoController = void 0;
const common_1 = require("@nestjs/common");
const carrito_service_1 = require("../services/carrito.service");
const create_comidaCarrito_dto_1 = require("../dtos/create-comidaCarrito.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let CarritoController = class CarritoController {
    constructor(carritoService) {
        this.carritoService = carritoService;
    }
    // Agregar comida al carrito de un usuario
    async agregarComida(idComprador, dto, req) {
        // Seguridad: solo el dueño puede modificar su carrito
        if (req.user?.sub !== idComprador) {
            throw new common_1.UnauthorizedException('No puedes modificar el carrito de otro usuario');
        }
        return this.carritoService.agregarComidaAlCarrito(idComprador, dto);
    }
    //Calcular el total del carrito de un usuario
    async obtenerTotal(idComprador, req) {
        if (req.user?.sub !== idComprador) {
            throw new common_1.UnauthorizedException('No puedes ver el carrito de otro usuario');
        }
        return this.carritoService.calcularTotalCarrito(idComprador);
    }
    // Eliminar un item del carrito
    async eliminarItem(idComprador, itemId, req) {
        if (req.user?.sub !== idComprador) {
            throw new common_1.UnauthorizedException('No puedes modificar el carrito de otro usuario');
        }
        return this.carritoService.eliminarItem(idComprador, itemId);
    }
    // Vaciar el carrito
    async obtenerCarrito(idComprador, req) {
        if (req.user?.sub !== idComprador) {
            throw new common_1.UnauthorizedException('No puedes ver el carrito de otro usuario');
        }
        return this.carritoService.obtenerCarrito(idComprador);
    }
};
exports.CarritoController = CarritoController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':idComprador/agregar'),
    __param(0, (0, common_1.Param)('idComprador')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_comidaCarrito_dto_1.CreateComidaCarritoDto, Object]),
    __metadata("design:returntype", Promise)
], CarritoController.prototype, "agregarComida", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':idComprador/total'),
    __param(0, (0, common_1.Param)('idComprador')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarritoController.prototype, "obtenerTotal", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':idComprador/item/:itemId'),
    __param(0, (0, common_1.Param)('idComprador')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CarritoController.prototype, "eliminarItem", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':idComprador'),
    __param(0, (0, common_1.Param)('idComprador')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarritoController.prototype, "obtenerCarrito", null);
exports.CarritoController = CarritoController = __decorate([
    (0, common_1.Controller)('carrito'),
    __metadata("design:paramtypes", [carrito_service_1.CarritoService])
], CarritoController);
