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
exports.RegistroMultipleBDResolver = exports.PedidoEnCaminoResolver = exports.PedidoPendienteRepartidorResolver = exports.PedidoRepartidorResolver = exports.PedidoResolver = void 0;
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
    async pedidosPorUsuario(userId) {
        return this.pedidoService.obtenerPedidosPorUsuario(userId);
    }
    async pedidosPorLocal(localId) {
        return this.pedidoService.obtenerPedidosPorLocal(localId);
    }
    async pedidosDeliveryDisponibles() {
        console.log('🚀 GraphQL Query: pedidosDeliveryDisponibles ejecutada');
        const pedidos = await this.pedidoService.obtenerPedidosDeliveryParaGraphQL();
        console.log(`📊 Retornando ${pedidos.length} pedidos al frontend`);
        return pedidos;
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
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
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idLocal,
                nombreLocal: 'Local no disponible',
                direccion: 'Dirección no disponible'
            };
        }
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
    async repartidor(pedido) {
        if (!pedido.repartidor || !pedido.dealer) {
            return null;
        }
        try {
            const res = await axios_1.default.get(`http://localhost:3000/usuarios/${pedido.repartidor}`);
            return {
                _id: pedido.repartidor,
                usuarioRepartidor: res.data.nombreUsuario || `${res.data.nombre} ${res.data.apellido}`,
                vehiculo: res.data.vehiculo || 'No especificado',
                patente: res.data.patente || 'No especificada',
                valoracion: res.data.valoracion || 0,
                telefono: res.data.telefono || ''
            };
        }
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del repartidor:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.repartidor,
                usuarioRepartidor: 'Repartidor no disponible',
                vehiculo: 'No especificado',
                patente: 'No especificada',
                valoracion: 0,
                telefono: ''
            };
        }
    }
    // Mutations existentes...
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
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoRepartidorType]),
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
    (0, graphql_1.ResolveField)(() => pedido_types_1.RepartidorType, { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoResolver.prototype, "repartidor", null);
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
let PedidoRepartidorResolver = class PedidoRepartidorResolver {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
    async usuario(pedido) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
            return {
                _id: pedido.idComprador,
                nombre: res.data.nombre || '',
                apellido: res.data.apellido || '',
                nombreUsuario: res.data.nombreUsuario || '',
                direccion: Array.isArray(res.data.direccion)
                    ? res.data.direccion.join(', ')
                    : (res.data.direccion || ''),
                numeroCasaDepto: res.data.numeroCasaDepto || ''
            };
        }
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del usuario:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idComprador,
                nombre: 'Usuario no disponible',
                apellido: '',
                nombreUsuario: '',
                direccion: '',
                numeroCasaDepto: ''
            };
        }
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
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
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idLocal,
                nombreLocal: 'Local no disponible',
                direccion: 'Dirección no disponible'
            };
        }
    }
};
exports.PedidoRepartidorResolver = PedidoRepartidorResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.UsuarioType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoRepartidorResolver.prototype, "usuario", null);
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.LocalType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoRepartidorResolver.prototype, "local", null);
exports.PedidoRepartidorResolver = PedidoRepartidorResolver = __decorate([
    (0, graphql_1.Resolver)(() => pedido_types_1.PedidoRepartidorType),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoRepartidorResolver);
let PedidoPendienteRepartidorResolver = class PedidoPendienteRepartidorResolver {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async pedidosPendientesRepartidor(idRepartidor) {
        console.log(`🚀 GraphQL Query: pedidosPendientesRepartidor para ${idRepartidor}`);
        return this.pedidoService.obtenerPedidosPendientesRepartidorGraphQL(idRepartidor);
    }
    async marcarPedidoEnCamino(id) {
        console.log(`🚚 GraphQL Mutation: marcarPedidoEnCamino ${id}`);
        return this.pedidoService.marcarEnCamino(id);
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
    async usuario(pedido) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
            return {
                _id: pedido.idComprador,
                nombre: res.data.nombre || '',
                apellido: res.data.apellido || '',
                nombreUsuario: res.data.nombreUsuario || '',
                direccion: Array.isArray(res.data.direccion)
                    ? res.data.direccion.join(', ')
                    : (res.data.direccion || ''),
                numeroCasaDepto: res.data.numeroCasaDepto || ''
            };
        }
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del usuario:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idComprador,
                nombre: 'Usuario no disponible',
                apellido: '',
                nombreUsuario: '',
                direccion: '',
                numeroCasaDepto: ''
            };
        }
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
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
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idLocal,
                nombreLocal: 'Local no disponible',
                direccion: 'Dirección no disponible'
            };
        }
    }
};
exports.PedidoPendienteRepartidorResolver = PedidoPendienteRepartidorResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoPendienteRepartidorType]),
    __param(0, (0, graphql_1.Args)('idRepartidor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoPendienteRepartidorResolver.prototype, "pedidosPendientesRepartidor", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoPendienteRepartidorType),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoPendienteRepartidorResolver.prototype, "marcarPedidoEnCamino", null);
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.UsuarioType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoPendienteRepartidorResolver.prototype, "usuario", null);
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.LocalType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoPendienteRepartidorResolver.prototype, "local", null);
exports.PedidoPendienteRepartidorResolver = PedidoPendienteRepartidorResolver = __decorate([
    (0, graphql_1.Resolver)(() => pedido_types_1.PedidoPendienteRepartidorType),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoPendienteRepartidorResolver);
let PedidoEnCaminoResolver = class PedidoEnCaminoResolver {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async pedidosEnCaminoRepartidor(idRepartidor) {
        console.log(`🚀 GraphQL Query: pedidosEnCaminoRepartidor para ${idRepartidor}`);
        return this.pedidoService.obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor);
    }
    async entregarPedido(id, codigoPedido) {
        console.log(`📦 GraphQL Mutation: entregarPedido ${id} con código ${codigoPedido}`);
        return this.pedidoService.entregarPedido(id, codigoPedido);
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
    async usuario(pedido) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
            return {
                _id: pedido.idComprador,
                nombre: res.data.nombre || '',
                apellido: res.data.apellido || '',
                nombreUsuario: res.data.nombreUsuario || '',
                direccion: Array.isArray(res.data.direccion)
                    ? res.data.direccion.join(', ')
                    : (res.data.direccion || ''),
                numeroCasaDepto: res.data.numeroCasaDepto || ''
            };
        }
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del usuario:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idComprador,
                nombre: 'Usuario no disponible',
                apellido: '',
                nombreUsuario: '',
                direccion: '',
                numeroCasaDepto: ''
            };
        }
    }
    // ✅ CORREGIR MANEJO DE ERRORES:
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
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
            return {
                _id: pedido.idLocal,
                nombreLocal: 'Local no disponible',
                direccion: 'Dirección no disponible'
            };
        }
    }
};
exports.PedidoEnCaminoResolver = PedidoEnCaminoResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [pedido_types_1.PedidoEnCaminoType]),
    __param(0, (0, graphql_1.Args)('idRepartidor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoEnCaminoResolver.prototype, "pedidosEnCaminoRepartidor", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => pedido_types_1.PedidoEnCaminoType),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('codigoPedido', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PedidoEnCaminoResolver.prototype, "entregarPedido", null);
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.UsuarioType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoEnCaminoResolver.prototype, "usuario", null);
__decorate([
    (0, graphql_1.ResolveField)(() => pedido_types_1.LocalType),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PedidoEnCaminoResolver.prototype, "local", null);
exports.PedidoEnCaminoResolver = PedidoEnCaminoResolver = __decorate([
    (0, graphql_1.Resolver)(() => pedido_types_1.PedidoEnCaminoType),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoEnCaminoResolver);
// ✅ AGREGAR EL NUEVO RESOLVER PARA MÚLTIPLES BD:
let RegistroMultipleBDResolver = class RegistroMultipleBDResolver {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async registrarPedidoEnMultiplesBD(pedidoId) {
        console.log(`📝 GraphQL: Registrando pedido ${pedidoId} en múltiples BD`);
        try {
            await this.pedidoService.guardarPedidoEnMultiplesBDPublico(pedidoId);
            return 'Pedido registrado exitosamente en todas las bases de datos';
        }
        catch (error) { // ✅ ESPECIFICAR TIPO
            console.error('Error en registro múltiple:', error instanceof Error ? error.message : error);
            throw new Error(`Error registrando pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
};
exports.RegistroMultipleBDResolver = RegistroMultipleBDResolver;
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('pedidoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegistroMultipleBDResolver.prototype, "registrarPedidoEnMultiplesBD", null);
exports.RegistroMultipleBDResolver = RegistroMultipleBDResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], RegistroMultipleBDResolver);
