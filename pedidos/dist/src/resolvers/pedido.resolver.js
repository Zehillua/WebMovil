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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../guards/gql-auth.guard");
const pedido_service_1 = require("../services/pedido.service");
const pedido_types_1 = require("../types/pedido.types");
const axios_1 = __importDefault(require("axios"));
let PedidoResolver = class PedidoResolver {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    // Reemplaza: GET /pedidos/usuario/:id
    async pedidosPorUsuario(userId) {
        return this.pedidoService.obtenerPedidosPorUsuario(userId);
    }
    // Reemplaza: GET /pedidos/local/:id  
    async pedidosPorLocal(localId) {
        return this.pedidoService.obtenerPedidosPorLocal(localId);
    }
    // Reemplaza: GET /pedidos/delivery/disponibles
    async pedidosDeliveryDisponibles() {
        return this.pedidoService.obtenerPedidosDeliveryDisponibles();
    }
    // Resolver automático para Local (evita N+1 queries)
    async local(pedido) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
            return {
                _id: pedido.idLocal,
                nombreLocal: res.data.nombreLocal || '',
                direccion: Array.isArray(res.data.direccion)
                    ? res.data.direccion.join(', ')
                    : (res.data.direccion || '')
            };
        }
        catch (e) {
            return {
                _id: pedido.idLocal,
                nombreLocal: 'Local no disponible',
                direccion: 'Dirección no disponible'
            };
        }
    }
    // Mutations para reemplazar PATCH endpoints
    async actualizarEstadoPedido(id, estado) {
        return this.pedidoService.actualizarEstado(id, estado);
    }
    async rechazarPedido(id) {
        return this.pedidoService.rechazarPedido(id);
    }
    async marcarPedidoListo(id) {
        return this.pedidoService.marcarListo(id);
    }
};
exports.PedidoResolver = PedidoResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoType]),
    __param(0, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "pedidosPorUsuario", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoType]),
    __param(0, (0, graphql_1.Args)('localId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "pedidosPorLocal", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "pedidosDeliveryDisponibles", null);
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.LocalType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "local", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoType),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "actualizarEstadoPedido", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoType),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "rechazarPedido", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoType),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "marcarPedidoListo", null);
exports.PedidoResolver = PedidoResolver = __decorate([
    (0, graphql_1.Resolver)(() => pedido_types_1.PedidoType),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoResolver);
