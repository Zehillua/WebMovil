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
exports.ComidaPromoRealizadaType = exports.PromocionRealizadaType = exports.PedidoType = exports.DatosRepartidorPedidoType = exports.RepartidorType = exports.LocalType = exports.PromocionPedidoType = exports.ComidaPromocionType = exports.ComidaType = void 0;
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
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'comida' }),
    __metadata("design:type", String)
], ComidaType.prototype, "tipo", void 0);
exports.ComidaType = ComidaType = __decorate([
    (0, graphql_1.ObjectType)()
], ComidaType);
// ✅ NUEVO TIPO PARA COMIDAS EN PROMOCIONES
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
// ✅ NUEVO TIPO PARA PROMOCIONES EN PEDIDOS
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
let LocalType = class LocalType {
};
exports.LocalType = LocalType;
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
// ✅ TIPO PRINCIPAL DEL PEDIDO ACTUALIZADO
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
let PromocionRealizadaType = class PromocionRealizadaType {
};
exports.PromocionRealizadaType = PromocionRealizadaType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PromocionRealizadaType.prototype, "nombrePromocion", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], PromocionRealizadaType.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], PromocionRealizadaType.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaPromoRealizadaType]),
    __metadata("design:type", Array)
], PromocionRealizadaType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PromocionRealizadaType.prototype, "tipo", void 0);
exports.PromocionRealizadaType = PromocionRealizadaType = __decorate([
    (0, graphql_1.ObjectType)()
], PromocionRealizadaType);
let ComidaPromoRealizadaType = class ComidaPromoRealizadaType {
};
exports.ComidaPromoRealizadaType = ComidaPromoRealizadaType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ComidaPromoRealizadaType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComidaPromoRealizadaType.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ComidaPromoRealizadaType.prototype, "precioOriginal", void 0);
exports.ComidaPromoRealizadaType = ComidaPromoRealizadaType = __decorate([
    (0, graphql_1.ObjectType)()
], ComidaPromoRealizadaType);
