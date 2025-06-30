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
exports.PedidoController = void 0;
const common_1 = require("@nestjs/common");
const pedido_service_1 = require("../services/pedido.service");
const create_pedido_dto_1 = require("../dtos/create-pedido.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let PedidoController = class PedidoController {
    constructor(pedidoService) {
        this.pedidoService = pedidoService;
    }
    async crear(createPedidoDto) {
        return this.pedidoService.crearPedido(createPedidoDto);
    }
    async obtenerTodos() {
        return this.pedidoService.obtenerPedidos();
    }
    async obtenerPorUsuario(idComprador) {
        return this.pedidoService.obtenerPedidosPorUsuario(idComprador);
    }
    async obtenerPorLocal(idLocal) {
        return this.pedidoService.obtenerPedidosPorLocal(idLocal);
    }
    async actualizarEstado(id, body) {
        return this.pedidoService.actualizarEstado(id, body.estado);
    }
    async rechazarPedido(id) {
        return this.pedidoService.rechazarPedido(id);
    }
    async eliminarPedido(id) {
        return this.pedidoService.eliminarPedido(id);
    }
    async marcarListo(id) {
        return this.pedidoService.marcarListo(id);
    }
    async obtenerPedidosDeliveryDisponibles() {
        return this.pedidoService.obtenerPedidosDeliveryDisponibles();
    }
    // NUEVO ENDPOINT - Pedidos pendientes de un repartidor específico
    async obtenerPedidosPendientesRepartidor(idRepartidor, req) {
        // Verificar que el repartidor solo puede ver sus propios pedidos
        if (req.user?.sub !== idRepartidor) {
            throw new common_1.UnauthorizedException('No puedes ver pedidos de otro repartidor');
        }
        return this.pedidoService.obtenerPedidosPendientesRepartidor(idRepartidor);
    }
    async aceptarPorRepartidor(id, body) {
        return this.pedidoService.aceptarPorRepartidor(id, body.idRepartidor);
    }
    async marcarEnCamino(id) {
        return this.pedidoService.marcarEnCamino(id);
    }
    async marcarEntregado(id) {
        return this.pedidoService.marcarEntregado(id);
    }
    async migrarDatosRepartidor() {
        await this.pedidoService.migrarDatosRepartidorExistentes();
        return {
            message: 'Migración de datos de repartidores completada',
            timestamp: new Date().toISOString()
        };
    }
    // ✅ ENDPOINT PARA VALORAR PEDIDO REALIZADO:
    async valorarPedidoRealizado(id, valoraciones) {
        return this.pedidoService.valorarPedidoRealizado(id, valoraciones);
    }
    // ✅ ENDPOINT PARA OBTENER PEDIDOS REALIZADOS:
    async obtenerPedidosRealizadosPorUsuario(idUsuario) {
        return this.pedidoService.obtenerPedidosRealizadosPorUsuario(idUsuario);
    }
    // ✅ ENDPOINT PARA ENTREGAR PEDIDO CON CÓDIGO:
    async entregarPedido(id, body) {
        return this.pedidoService.entregarPedido(id, body.codigoPedido);
    }
};
exports.PedidoController = PedidoController;
__decorate([
    (0, common_1.Post)('crear'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pedido_dto_1.CreatePedidoDto]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "obtenerTodos", null);
__decorate([
    (0, common_1.Get)('usuario/:idComprador'),
    __param(0, (0, common_1.Param)('idComprador')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "obtenerPorUsuario", null);
__decorate([
    (0, common_1.Get)('local/:idLocal'),
    __param(0, (0, common_1.Param)('idLocal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "obtenerPorLocal", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "actualizarEstado", null);
__decorate([
    (0, common_1.Patch)(':id/rechazar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "rechazarPedido", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "eliminarPedido", null);
__decorate([
    (0, common_1.Patch)(':id/listo'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "marcarListo", null);
__decorate([
    (0, common_1.Get)('delivery/disponibles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "obtenerPedidosDeliveryDisponibles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('repartidor/:idRepartidor/pendientes'),
    __param(0, (0, common_1.Param)('idRepartidor')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "obtenerPedidosPendientesRepartidor", null);
__decorate([
    (0, common_1.Patch)(':id/aceptar-repartidor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "aceptarPorRepartidor", null);
__decorate([
    (0, common_1.Patch)(':id/en-camino'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "marcarEnCamino", null);
__decorate([
    (0, common_1.Patch)(':id/entregado'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "marcarEntregado", null);
__decorate([
    (0, common_1.Get)('admin/migrar-datos-repartidor'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "migrarDatosRepartidor", null);
__decorate([
    (0, common_1.Post)('realizado/:id/valorar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "valorarPedidoRealizado", null);
__decorate([
    (0, common_1.Get)('usuario/:idUsuario/realizados'),
    __param(0, (0, common_1.Param)('idUsuario')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "obtenerPedidosRealizadosPorUsuario", null);
__decorate([
    (0, common_1.Post)(':id/entregar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PedidoController.prototype, "entregarPedido", null);
exports.PedidoController = PedidoController = __decorate([
    (0, common_1.Controller)('pedidos'),
    __metadata("design:paramtypes", [pedido_service_1.PedidoService])
], PedidoController);
