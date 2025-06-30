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
exports.EntregaResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const entrega_service_1 = require("../services/entrega.service");
const entrega_types_1 = require("../types/entrega.types");
let EntregaResolver = class EntregaResolver {
    constructor(entregaService) {
        this.entregaService = entregaService;
    }
    async actualizarValoracionEntrega(repartidorId, valoracion) {
        return this.entregaService.actualizarValoracionMasReciente(repartidorId, valoracion);
    }
    async valoracionesRepartidor(repartidorId) {
        return this.entregaService.obtenerEntregasConValoracion(repartidorId);
    }
    async entregasRepartidor(repartidorId) {
        return this.entregaService.obtenerEntregasRepartidor(repartidorId);
    }
    async estadisticasRepartidor(repartidorId) {
        const stats = await this.entregaService.obtenerEstadisticas(repartidorId);
        const promedioValoracion = await this.entregaService.calcularPromedioValoracion(repartidorId);
        return {
            ...stats,
            valoracionPromedio: promedioValoracion
        };
    }
    async promedioValoracionRepartidor(repartidorId) {
        return this.entregaService.calcularPromedioValoracion(repartidorId);
    }
    // ✅ NUEVO QUERY PARA TOP REPARTIDORES
    async topRepartidoresStats() {
        return this.entregaService.obtenerTopRepartidoresStats();
    }
};
exports.EntregaResolver = EntregaResolver;
__decorate([
    (0, graphql_1.Mutation)(() => entrega_types_1.EntregaType),
    __param(0, (0, graphql_1.Args)('repartidorId')),
    __param(1, (0, graphql_1.Args)('valoracion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EntregaResolver.prototype, "actualizarValoracionEntrega", null);
__decorate([
    (0, graphql_1.Query)(() => [entrega_types_1.EntregaType]),
    __param(0, (0, graphql_1.Args)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntregaResolver.prototype, "valoracionesRepartidor", null);
__decorate([
    (0, graphql_1.Query)(() => [entrega_types_1.EntregaType]),
    __param(0, (0, graphql_1.Args)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntregaResolver.prototype, "entregasRepartidor", null);
__decorate([
    (0, graphql_1.Query)(() => entrega_types_1.EstadisticasType),
    __param(0, (0, graphql_1.Args)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntregaResolver.prototype, "estadisticasRepartidor", null);
__decorate([
    (0, graphql_1.Query)(() => Number),
    __param(0, (0, graphql_1.Args)('repartidorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntregaResolver.prototype, "promedioValoracionRepartidor", null);
__decorate([
    (0, graphql_1.Query)(() => [entrega_types_1.RepartidorStatsType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EntregaResolver.prototype, "topRepartidoresStats", null);
exports.EntregaResolver = EntregaResolver = __decorate([
    (0, graphql_1.Resolver)(() => entrega_types_1.EntregaType),
    __metadata("design:paramtypes", [entrega_service_1.EntregaService])
], EntregaResolver);
