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
exports.PedidoType = exports.LocalType = exports.ComidaType = void 0;
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
    (0, graphql_1.Field)(),
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
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PedidoType.prototype, "repartidor", void 0);
exports.PedidoType = PedidoType = __decorate([
    (0, graphql_1.ObjectType)()
], PedidoType);
