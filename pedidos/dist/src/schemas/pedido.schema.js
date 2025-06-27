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
exports.PedidoSchema = exports.Pedido = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Pedido = class Pedido extends mongoose_2.Document {
};
exports.Pedido = Pedido;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Usuario' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Pedido.prototype, "idComprador", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Local' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Pedido.prototype, "idLocal", void 0);
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
    (0, mongoose_1.Prop)({ type: [{ nombre: String, cantidad: Number }], required: true }),
    __metadata("design:type", Array)
], Pedido.prototype, "comidas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Pedido.prototype, "esDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Pedido.prototype, "estadoRechazado", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Pedido.prototype, "estado", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Pedido.prototype, "dealer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Repartidor', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Pedido.prototype, "repartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pedido.prototype, "direccionEntrega", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pedido.prototype, "direccionLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pedido.prototype, "numeroCasaDepto", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Pedido.prototype, "propina", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Pedido.prototype, "cantidadPropina", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Repartidor' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Pedido.prototype, "idRepartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Pedido.prototype, "fechaPedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "valoracionPedido", void 0);
exports.Pedido = Pedido = __decorate([
    (0, mongoose_1.Schema)()
], Pedido);
exports.PedidoSchema = mongoose_1.SchemaFactory.createForClass(Pedido);
