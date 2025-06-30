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
exports.VentaType = exports.ComidaVentaType = exports.ClienteVentaType = void 0;
const graphql_1 = require("@nestjs/graphql");
let ClienteVentaType = class ClienteVentaType {
};
exports.ClienteVentaType = ClienteVentaType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ClienteVentaType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ClienteVentaType.prototype, "nombre", void 0);
exports.ClienteVentaType = ClienteVentaType = __decorate([
    (0, graphql_1.ObjectType)()
], ClienteVentaType);
let ComidaVentaType = class ComidaVentaType {
};
exports.ComidaVentaType = ComidaVentaType;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ComidaVentaType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ComidaVentaType.prototype, "cantidad", void 0);
exports.ComidaVentaType = ComidaVentaType = __decorate([
    (0, graphql_1.ObjectType)()
], ComidaVentaType);
let VentaType = class VentaType {
};
exports.VentaType = VentaType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], VentaType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], VentaType.prototype, "localId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], VentaType.prototype, "pedidoId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], VentaType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], VentaType.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], VentaType.prototype, "fechaVenta", void 0);
__decorate([
    (0, graphql_1.Field)(() => ClienteVentaType),
    __metadata("design:type", ClienteVentaType)
], VentaType.prototype, "cliente", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaVentaType]),
    __metadata("design:type", Array)
], VentaType.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], VentaType.prototype, "esDelivery", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], VentaType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], VentaType.prototype, "totalConPropina", void 0);
exports.VentaType = VentaType = __decorate([
    (0, graphql_1.ObjectType)()
], VentaType);
