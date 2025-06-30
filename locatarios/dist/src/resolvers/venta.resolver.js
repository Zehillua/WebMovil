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
exports.VentaResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const venta_service_1 = require("../services/venta.service");
const venta_type_1 = require("../types/venta.type");
const venta_input_1 = require("../dto/venta.input");
let VentaResolver = class VentaResolver {
    constructor(ventaService) {
        this.ventaService = ventaService;
    }
    async registrarVenta(input) {
        return this.ventaService.registrarVenta(input);
    }
    async ventasPorLocal(localId) {
        return this.ventaService.obtenerVentasPorLocal(localId);
    }
    async estadisticasLocal(localId) {
        const estadisticas = await this.ventaService.obtenerEstadisticasLocal(localId);
        return JSON.stringify(estadisticas);
    }
};
exports.VentaResolver = VentaResolver;
__decorate([
    (0, graphql_1.Mutation)(() => venta_type_1.VentaType),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [venta_input_1.RegistrarVentaInput]),
    __metadata("design:returntype", Promise)
], VentaResolver.prototype, "registrarVenta", null);
__decorate([
    (0, graphql_1.Query)(() => [venta_type_1.VentaType]),
    __param(0, (0, graphql_1.Args)('localId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VentaResolver.prototype, "ventasPorLocal", null);
__decorate([
    (0, graphql_1.Query)(() => String) // Retorna JSON como string
    ,
    __param(0, (0, graphql_1.Args)('localId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VentaResolver.prototype, "estadisticasLocal", null);
exports.VentaResolver = VentaResolver = __decorate([
    (0, graphql_1.Resolver)(() => venta_type_1.VentaType),
    __metadata("design:paramtypes", [venta_service_1.VentaService])
], VentaResolver);
