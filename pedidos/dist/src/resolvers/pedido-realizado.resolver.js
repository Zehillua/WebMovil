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
exports.PedidoRealizadoResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../guards/gql-auth.guard");
const pedido_service_1 = require("../services/pedido.service");
const pedido_types_1 = require("../types/pedido.types");
let PedidoRealizadoResolver = class PedidoRealizadoResolver {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async pedidosRealizadosPorUsuario(userId) {
        console.log(`🚀 GraphQL Query: pedidosRealizadosPorUsuario para ${userId}`);
        return this.pedidoService.obtenerPedidosRealizadosPorUsuario(userId);
    }
    // ✅ NUEVA QUERY para pedidos pendientes de valoración:
    async pedidosPendientesValoracion(userId) {
        console.log(`🚀 GraphQL Query: pedidosPendientesValoracion para ${userId}`);
        return this.pedidoService.obtenerPedidosPendientesValoracion(userId);
    }
    async todosPedidosRealizados() {
        console.log(`🚀 GraphQL Query: todosPedidosRealizados`);
        return this.pedidoService.obtenerTodosPedidosRealizados();
    }
    async estadisticasPedidosRealizados() {
        console.log(`🚀 GraphQL Query: estadisticasPedidosRealizados`);
        const stats = await this.pedidoService.obtenerEstadisticasPedidosRealizados();
        return JSON.stringify(stats);
    }
    // ✅ NUEVA MUTATION para valorar pedido:
    async valorarPedidoRealizado(pedidoRealizadoId, valoraciones) {
        console.log(`🚀 GraphQL Mutation: valorarPedidoRealizado ${pedidoRealizadoId}`);
        return this.pedidoService.valorarPedidoRealizado(pedidoRealizadoId, valoraciones);
    }
    // Mutation existente para testing:
    async transferirPedidoARealizado(pedidoId) {
        console.log(`🚀 GraphQL Mutation: transferirPedidoARealizado ${pedidoId}`);
        const pedido = await this.pedidoService['pedidoModel'].findById(pedidoId).lean().exec();
        if (!pedido) {
            throw new Error('Pedido no encontrado');
        }
        return this.pedidoService['transferirAPedidosRealizados'](pedido);
    }
};
exports.PedidoRealizadoResolver = PedidoRealizadoResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoRealizadoType]),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoRealizadoResolver.prototype, "pedidosRealizadosPorUsuario", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoRealizadoType]),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoRealizadoResolver.prototype, "pedidosPendientesValoracion", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoRealizadoType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoRealizadoResolver.prototype, "todosPedidosRealizados", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoRealizadoResolver.prototype, "estadisticasPedidosRealizados", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoRealizadoType),
    __param(0, (0, graphql_1.Args)('pedidoRealizadoId')),
    __param(1, (0, graphql_1.Args)('valoraciones')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pedido_types_1.ValoracionInput]),
    __metadata("design:returntype", Promise)
], PedidoRealizadoResolver.prototype, "valorarPedidoRealizado", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoRealizadoType),
    __param(0, (0, graphql_1.Args)('pedidoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoRealizadoResolver.prototype, "transferirPedidoARealizado", null);
exports.PedidoRealizadoResolver = PedidoRealizadoResolver = __decorate([
    (0, graphql_1.Resolver)(() => pedido_types_1.PedidoRealizadoType),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoRealizadoResolver);
