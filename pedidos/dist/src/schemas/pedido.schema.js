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
exports.PedidoSchema = exports.Pedido = exports.ComidaPedido = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class ComidaPedido {
}
exports.ComidaPedido = ComidaPedido;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ComidaPedido.prototype, "nombre", void 0);
let Pedido = class Pedido extends mongoose_2.Document {
};
exports.Pedido = Pedido;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pedido.prototype, "nombrePedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['efectivo', 'tarjeta'] }),
    __metadata("design:type", String)
], Pedido.prototype, "pago", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Pedido.prototype, "precioPedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ nombre: String }], required: true }),
    __metadata("design:type", Array)
], Pedido.prototype, "comidas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pedido.prototype, "nombreLocalRetirar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pedido.prototype, "ciudadLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pedido.prototype, "numeroLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pedido.prototype, "ciudadDejar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pedido.prototype, "numeroCasaDepto", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Pedido.prototype, "propina", void 0);
exports.Pedido = Pedido = __decorate([
    (0, mongoose_1.Schema)({ collection: 'pedidos' })
], Pedido);
exports.PedidoSchema = mongoose_1.SchemaFactory.createForClass(Pedido);
