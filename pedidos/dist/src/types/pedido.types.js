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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoEnCaminoType = exports.PedidoPendienteRepartidorType = exports.PedidoType = exports.PedidoRepartidorType = exports.RepartidorType = exports.UsuarioType = exports.LocalType = exports.ComidaType = void 0;
const graphql_1 = require("@nestjs/graphql");
let ComidaType = class ComidaType {
};
exports.ComidaType = ComidaType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ComidaType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ComidaType.prototype, "cantidad", void 0);
exports.ComidaType = ComidaType = __decorate([
    (0, graphql_1.ObjectType)()
], ComidaType);
let LocalType = class LocalType {
};
exports.LocalType = LocalType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], LocalType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LocalType.prototype, "nombreLocal", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LocalType.prototype, "direccion", void 0);
exports.LocalType = LocalType = __decorate([
    (0, graphql_1.ObjectType)()
], LocalType);
let UsuarioType = class UsuarioType {
};
exports.UsuarioType = UsuarioType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UsuarioType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UsuarioType.prototype, "apellido", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioType.prototype, "nombreUsuario", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioType.prototype, "direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UsuarioType.prototype, "numeroCasaDepto", void 0);
exports.UsuarioType = UsuarioType = __decorate([
    (0, graphql_1.ObjectType)()
], UsuarioType);
// NUEVO TIPO PARA REPARTIDOR:
let RepartidorType = class RepartidorType {
};
exports.RepartidorType = RepartidorType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RepartidorType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RepartidorType.prototype, "usuarioRepartidor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RepartidorType.prototype, "vehiculo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RepartidorType.prototype, "patente", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], RepartidorType.prototype, "valoracion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RepartidorType.prototype, "telefono", void 0);
exports.RepartidorType = RepartidorType = __decorate([
    (0, graphql_1.ObjectType)()
], RepartidorType);
let PedidoRepartidorType = class PedidoRepartidorType {
};
exports.PedidoRepartidorType = PedidoRepartidorType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoRepartidorType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRepartidorType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PedidoRepartidorType.prototype, "precioPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRepartidorType.prototype, "direccionEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaType]),
    __metadata("design:type", Array)
], PedidoRepartidorType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoRepartidorType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PedidoRepartidorType.prototype, "cantidadPropina", void 0);
__decorate([
    (0, graphql_1.Field)(() => UsuarioType),
    __metadata("design:type", UsuarioType)
], PedidoRepartidorType.prototype, "usuario", void 0);
__decorate([
    (0, graphql_1.Field)(() => LocalType),
    __metadata("design:type", LocalType)
], PedidoRepartidorType.prototype, "local", void 0);
exports.PedidoRepartidorType = PedidoRepartidorType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoRepartidorType);
let PedidoType = class PedidoType {
};
exports.PedidoType = PedidoType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "estado", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "listo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "enCamino", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "estadoRechazado", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PedidoType.prototype, "precioPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoType.prototype, "pago", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PedidoType.prototype, "fechaPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "esDelivery", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PedidoType.prototype, "direccionEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaType]),
    __metadata("design:type", Array)
], PedidoType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(() => LocalType),
    __metadata("design:type", LocalType)
], PedidoType.prototype, "local", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PedidoType.prototype, "cantidadPropina", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoType.prototype, "dealer", void 0);
__decorate([
    (0, graphql_1.Field)(() => RepartidorType, { nullable: true }),
    __metadata("design:type", RepartidorType)
], PedidoType.prototype, "repartidor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], PedidoType.prototype, "codigoPedido", void 0);
exports.PedidoType = PedidoType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoType);
let PedidoPendienteRepartidorType = class PedidoPendienteRepartidorType {
};
exports.PedidoPendienteRepartidorType = PedidoPendienteRepartidorType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoPendienteRepartidorType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoPendienteRepartidorType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PedidoPendienteRepartidorType.prototype, "precioPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoPendienteRepartidorType.prototype, "direccionEntrega", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoPendienteRepartidorType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PedidoPendienteRepartidorType.prototype, "cantidadPropina", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaType]),
    __metadata("design:type", Array)
], PedidoPendienteRepartidorType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoPendienteRepartidorType.prototype, "enCamino", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoPendienteRepartidorType.prototype, "pedidoEntregado", void 0);
__decorate([
    (0, graphql_1.Field)(() => UsuarioType),
    __metadata("design:type", UsuarioType)
], PedidoPendienteRepartidorType.prototype, "usuario", void 0);
__decorate([
    (0, graphql_1.Field)(() => LocalType),
    __metadata("design:type", LocalType)
], PedidoPendienteRepartidorType.prototype, "local", void 0);
exports.PedidoPendienteRepartidorType = PedidoPendienteRepartidorType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoPendienteRepartidorType);
let PedidoEnCaminoType = class PedidoEnCaminoType {
};
exports.PedidoEnCaminoType = PedidoEnCaminoType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoEnCaminoType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoEnCaminoType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PedidoEnCaminoType.prototype, "precioPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoEnCaminoType.prototype, "direccionEntrega", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PedidoEnCaminoType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], PedidoEnCaminoType.prototype, "cantidadPropina", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaType]),
    __metadata("design:type", Array)
], PedidoEnCaminoType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoEnCaminoType.prototype, "enCamino", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoEnCaminoType.prototype, "pedidoEntregado", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], PedidoEnCaminoType.prototype, "codigoPedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => UsuarioType),
    __metadata("design:type", UsuarioType)
], PedidoEnCaminoType.prototype, "usuario", void 0);
__decorate([
    (0, graphql_1.Field)(() => LocalType),
    __metadata("design:type", LocalType)
], PedidoEnCaminoType.prototype, "local", void 0);
exports.PedidoEnCaminoType = PedidoEnCaminoType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoEnCaminoType);
