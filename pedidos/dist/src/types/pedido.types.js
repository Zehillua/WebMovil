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
exports.ValoracionInput = exports.PromocionRealizadaType = exports.ComidaPromoRealizadaType = exports.PedidoRealizadoType = exports.PedidoEnCaminoType = exports.PedidoPendienteRepartidorType = exports.PedidoRepartidorType = exports.PedidoType = exports.PromocionPedidoType = exports.ComidaPromocionType = exports.DatosRepartidorType = exports.DatosLocalType = exports.DatosUsuarioType = exports.DatosRepartidorPedidoType = exports.RepartidorType = exports.UsuarioType = exports.LocalType = exports.ComidaType = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
// ✅ 1. DEFINIR TIPOS BÁSICOS PRIMERO:
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
// ✅ 2. DEFINIR TIPOS DE REPARTIDOR ANTES DE USARLOS:
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
// ✅ 3. DEFINIR DatosRepartidorPedidoType ANTES DE USARLO:
let DatosRepartidorPedidoType = class DatosRepartidorPedidoType {
};
exports.DatosRepartidorPedidoType = DatosRepartidorPedidoType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], DatosRepartidorPedidoType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorPedidoType.prototype, "nombreUsuario", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorPedidoType.prototype, "usuarioRepartidor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorPedidoType.prototype, "vehiculo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorPedidoType.prototype, "patente", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], DatosRepartidorPedidoType.prototype, "valoracion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], DatosRepartidorPedidoType.prototype, "telefono", void 0);
exports.DatosRepartidorPedidoType = DatosRepartidorPedidoType = __decorate([
    (0, graphql_1.ObjectType)()
], DatosRepartidorPedidoType);
// ✅ 4. DEFINIR TIPOS DE DATOS DENORMALIZADOS:
let DatosUsuarioType = class DatosUsuarioType {
};
exports.DatosUsuarioType = DatosUsuarioType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosUsuarioType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosUsuarioType.prototype, "apellido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosUsuarioType.prototype, "nombreUsuario", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosUsuarioType.prototype, "direccion", void 0);
exports.DatosUsuarioType = DatosUsuarioType = __decorate([
    (0, graphql_1.ObjectType)()
], DatosUsuarioType);
let DatosLocalType = class DatosLocalType {
};
exports.DatosLocalType = DatosLocalType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosLocalType.prototype, "nombreLocal", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosLocalType.prototype, "direccion", void 0);
exports.DatosLocalType = DatosLocalType = __decorate([
    (0, graphql_1.ObjectType)()
], DatosLocalType);
let DatosRepartidorType = class DatosRepartidorType {
};
exports.DatosRepartidorType = DatosRepartidorType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorType.prototype, "nombreUsuario", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorType.prototype, "vehiculo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], DatosRepartidorType.prototype, "patente", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], DatosRepartidorType.prototype, "valoracion", void 0);
exports.DatosRepartidorType = DatosRepartidorType = __decorate([
    (0, graphql_1.ObjectType)()
], DatosRepartidorType);
let ComidaPromocionType = class ComidaPromocionType {
};
exports.ComidaPromocionType = ComidaPromocionType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ComidaPromocionType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ComidaPromocionType.prototype, "cantidad", void 0);
exports.ComidaPromocionType = ComidaPromocionType = __decorate([
    (0, graphql_1.ObjectType)()
], ComidaPromocionType);
let PromocionPedidoType = class PromocionPedidoType {
};
exports.PromocionPedidoType = PromocionPedidoType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PromocionPedidoType.prototype, "nombrePromocion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PromocionPedidoType.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PromocionPedidoType.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaPromocionType]),
    __metadata("design:type", Array)
], PromocionPedidoType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'promocion' }),
    __metadata("design:type", String)
], PromocionPedidoType.prototype, "tipo", void 0);
exports.PromocionPedidoType = PromocionPedidoType = __decorate([
    (0, graphql_1.ObjectType)()
], PromocionPedidoType);
// ✅ 5. AHORA DEFINIR TIPOS DE PEDIDO (que usan los anteriores):
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
    (0, graphql_1.Field)(() => [PromocionPedidoType], { defaultValue: [] }),
    __metadata("design:type", Array)
], PedidoType.prototype, "promociones", void 0);
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
    (0, graphql_1.Field)(() => DatosRepartidorPedidoType, { nullable: true }),
    __metadata("design:type", DatosRepartidorPedidoType)
], PedidoType.prototype, "datosRepartidor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], PedidoType.prototype, "codigoPedido", void 0);
exports.PedidoType = PedidoType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoType);
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
    (0, graphql_1.Field)(() => [PromocionPedidoType], { defaultValue: [] }),
    __metadata("design:type", Array)
], PedidoRepartidorType.prototype, "promociones", void 0);
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
    (0, graphql_1.Field)(() => [PromocionPedidoType], { defaultValue: [] }),
    __metadata("design:type", Array)
], PedidoPendienteRepartidorType.prototype, "promociones", void 0);
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
    (0, graphql_1.Field)(() => [PromocionPedidoType], { defaultValue: [] }),
    __metadata("design:type", Array)
], PedidoEnCaminoType.prototype, "promociones", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], PedidoEnCaminoType.prototype, "enCamino", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], PedidoEnCaminoType.prototype, "pedidoEntregado", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, defaultValue: 0 }),
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
// ✅ 6. TIPOS DE PEDIDOS REALIZADOS:
let PedidoRealizadoType = class PedidoRealizadoType {
};
exports.PedidoRealizadoType = PedidoRealizadoType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "pedidoOriginalId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "idComprador", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "idLocal", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PedidoRealizadoType.prototype, "precioPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "pago", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "fechaPedido", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "fechaEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "fechaRegistro", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoRealizadoType.prototype, "esDelivery", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "direccionEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaType]),
    __metadata("design:type", Array)
], PedidoRealizadoType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(() => [PromocionRealizadaType], { defaultValue: [] }),
    __metadata("design:type", Array)
], PedidoRealizadoType.prototype, "promociones", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PedidoRealizadoType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PedidoRealizadoType.prototype, "cantidadPropina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "repartidor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PedidoRealizadoType.prototype, "codigoPedido", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PedidoRealizadoType.prototype, "direccionLocal", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    __metadata("design:type", Number)
], PedidoRealizadoType.prototype, "valoracionPedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    __metadata("design:type", Number)
], PedidoRealizadoType.prototype, "valoracionDelivery", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    __metadata("design:type", Number)
], PedidoRealizadoType.prototype, "valoracionLocal", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], PedidoRealizadoType.prototype, "valoracionCompletada", void 0);
__decorate([
    (0, graphql_1.Field)(() => DatosUsuarioType),
    __metadata("design:type", DatosUsuarioType)
], PedidoRealizadoType.prototype, "datosUsuario", void 0);
__decorate([
    (0, graphql_1.Field)(() => DatosLocalType),
    __metadata("design:type", DatosLocalType)
], PedidoRealizadoType.prototype, "datosLocal", void 0);
__decorate([
    (0, graphql_1.Field)(() => DatosRepartidorType),
    __metadata("design:type", DatosRepartidorType)
], PedidoRealizadoType.prototype, "datosRepartidor", void 0);
exports.PedidoRealizadoType = PedidoRealizadoType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoRealizadoType);
let ComidaPromoRealizadaType = class ComidaPromoRealizadaType {
};
exports.ComidaPromoRealizadaType = ComidaPromoRealizadaType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ComidaPromoRealizadaType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ComidaPromoRealizadaType.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ComidaPromoRealizadaType.prototype, "precioOriginal", void 0);
exports.ComidaPromoRealizadaType = ComidaPromoRealizadaType = __decorate([
    (0, graphql_1.ObjectType)()
], ComidaPromoRealizadaType);
let PromocionRealizadaType = class PromocionRealizadaType {
};
exports.PromocionRealizadaType = PromocionRealizadaType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PromocionRealizadaType.prototype, "nombrePromocion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PromocionRealizadaType.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], PromocionRealizadaType.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaPromoRealizadaType]),
    __metadata("design:type", Array)
], PromocionRealizadaType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'promocion' }),
    __metadata("design:type", String)
], PromocionRealizadaType.prototype, "tipo", void 0);
exports.PromocionRealizadaType = PromocionRealizadaType = __decorate([
    (0, graphql_1.ObjectType)()
], PromocionRealizadaType);
// ✅ 7. INPUT TYPES AL FINAL:
let ValoracionInput = class ValoracionInput {
};
exports.ValoracionInput = ValoracionInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.Min)(0.5, { message: 'La valoración del pedido debe ser al menos 0.5' }),
    (0, class_validator_1.Max)(5, { message: 'La valoración del pedido no puede ser mayor a 5' }),
    __metadata("design:type", Number)
], ValoracionInput.prototype, "valoracionPedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.Min)(0.5, { message: 'La valoración del delivery debe ser al menos 0.5' }),
    (0, class_validator_1.Max)(5, { message: 'La valoración del delivery no puede ser mayor a 5' }),
    __metadata("design:type", Number)
], ValoracionInput.prototype, "valoracionDelivery", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.Min)(0.5, { message: 'La valoración del local debe ser al menos 0.5' }),
    (0, class_validator_1.Max)(5, { message: 'La valoración del local no puede ser mayor a 5' }),
    __metadata("design:type", Number)
], ValoracionInput.prototype, "valoracionLocal", void 0);
exports.ValoracionInput = ValoracionInput = __decorate([
    (0, graphql_1.InputType)()
], ValoracionInput);
