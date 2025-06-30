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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("../services/stats.service");
let StatsController = class StatsController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    // ========== ENDPOINTS PARA PEDIDOS REALIZADOS ==========
    async registrarPedidoRealizado(pedidoData) {
        return this.statsService.registrarPedidoRealizado(pedidoData);
    }
    async obtenerPedidosRealizados(filtros) {
        return this.statsService.obtenerPedidosRealizados(filtros);
    }
    // ========== ENDPOINTS PARA VENTAS REPORTE ==========
    async registrarVentaReporte(ventaData) {
        return this.statsService.registrarVentaReporte(ventaData);
    }
    async obtenerVentasReporte(filtros) {
        return this.statsService.obtenerVentasReporte(filtros);
    }
    // ========== ENDPOINTS DE ESTADÍSTICAS ==========
    async obtenerEstadisticasGenerales() {
        return this.statsService.obtenerEstadisticasGenerales();
    }
    async obtenerEstadisticasPorFecha(fechaInicio, fechaFin) {
        return this.statsService.obtenerEstadisticasPorFecha(fechaInicio, fechaFin);
    }
    async obtenerEstadisticasLocal(localId) {
        return this.statsService.obtenerEstadisticasLocal(localId);
    }
    async obtenerEstadisticasRepartidor(repartidorId) {
        return this.statsService.obtenerEstadisticasRepartidor(repartidorId);
    }
    // ========== ENDPOINTS DE RANKINGS ==========
    async obtenerTopLocales(limite) {
        const limiteNum = limite ? parseInt(limite) : 10;
        return this.statsService.obtenerTopLocales(limiteNum);
    }
    async obtenerTopRepartidores(limite) {
        const limiteNum = limite ? parseInt(limite) : 10;
        return this.statsService.obtenerTopRepartidores(limiteNum);
    }
    // ========== ENDPOINTS DE BÚSQUEDA ==========
    async buscarPedidosPorUsuario(usuarioId) {
        return this.statsService.buscarPedidosPorUsuario(usuarioId);
    }
    async buscarPedidosPorNombre(nombrePedido) {
        return this.statsService.buscarPedidosPorNombre(nombrePedido);
    }
    // ========== ENDPOINT DE LIMPIEZA ==========
    async limpiarPedidosAntiguos(body) {
        return this.statsService.limpiarPedidosAntiguos(body.diasAntiguedad);
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Post)('pedido-realizado'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "registrarPedidoRealizado", null);
__decorate([
    (0, common_1.Get)('pedidos-realizados'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerPedidosRealizados", null);
__decorate([
    (0, common_1.Post)('venta-realizada'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "registrarVentaReporte", null);
__decorate([
    (0, common_1.Get)('ventas-realizadas'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerVentasReporte", null);
__decorate([
    (0, common_1.Get)('generales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerEstadisticasGenerales", null);
__decorate([
    (0, common_1.Get)('por-fecha'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerEstadisticasPorFecha", null);
__decorate([
    (0, common_1.Get)('local/:localId'),
    __param(0, (0, common_1.Param)('localId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerEstadisticasLocal", null);
__decorate([
    (0, common_1.Get)('repartidor/:repartidorId'),
    __param(0, (0, common_1.Param)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerEstadisticasRepartidor", null);
__decorate([
    (0, common_1.Get)('top-locales'),
    __param(0, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerTopLocales", null);
__decorate([
    (0, common_1.Get)('top-repartidores'),
    __param(0, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "obtenerTopRepartidores", null);
__decorate([
    (0, common_1.Get)('usuario/:usuarioId/pedidos'),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "buscarPedidosPorUsuario", null);
__decorate([
    (0, common_1.Get)('buscar/:nombrePedido'),
    __param(0, (0, common_1.Param)('nombrePedido')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "buscarPedidosPorNombre", null);
__decorate([
    (0, common_1.Post)('limpiar-antiguos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "limpiarPedidosAntiguos", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
