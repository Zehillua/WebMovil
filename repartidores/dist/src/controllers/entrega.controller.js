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
exports.EntregaController = void 0;
const common_1 = require("@nestjs/common");
const entrega_service_1 = require("../services/entrega.service");
let EntregaController = class EntregaController {
    constructor(entregaService) {
        this.entregaService = entregaService;
    }
    async registrarEntrega(entregaData) {
        console.log('📥 Controlador: Registrando entrega');
        return this.entregaService.registrarEntrega(entregaData);
    }
    async obtenerEntregasRepartidor(repartidorId) {
        console.log(`📥 Controlador: Obteniendo entregas para repartidor ${repartidorId}`);
        try {
            const entregas = await this.entregaService.obtenerEntregasRepartidor(repartidorId);
            console.log(`📤 Controlador: Devolviendo ${entregas.length} entregas`);
            return entregas;
        }
        catch (error) {
            console.error('❌ Error en controlador obtenerEntregasRepartidor:', error);
            throw error;
        }
    }
    async obtenerEstadisticas(repartidorId) {
        console.log(`📊 Controlador: Obteniendo estadísticas para repartidor ${repartidorId}`);
        try {
            const estadisticas = await this.entregaService.obtenerEstadisticas(repartidorId);
            console.log('📤 Controlador: Devolviendo estadísticas:', estadisticas);
            return estadisticas;
        }
        catch (error) {
            console.error('❌ Error en controlador obtenerEstadisticas:', error);
            throw error;
        }
    }
};
exports.EntregaController = EntregaController;
__decorate([
    (0, common_1.Post)('entrega'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EntregaController.prototype, "registrarEntrega", null);
__decorate([
    (0, common_1.Get)('entregas/:repartidorId'),
    __param(0, (0, common_1.Param)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntregaController.prototype, "obtenerEntregasRepartidor", null);
__decorate([
    (0, common_1.Get)('estadisticas/:repartidorId'),
    __param(0, (0, common_1.Param)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntregaController.prototype, "obtenerEstadisticas", null);
exports.EntregaController = EntregaController = __decorate([
    (0, common_1.Controller)('repartidores'),
    __metadata("design:paramtypes", [entrega_service_1.EntregaService])
], EntregaController);
