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
exports.PedidoRealizadoSchema = exports.PedidoRealizado = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PedidoRealizado = class PedidoRealizado extends mongoose_2.Document {
};
exports.PedidoRealizado = PedidoRealizado;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PedidoRealizado.prototype, "pedidoOriginalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PedidoRealizado.prototype, "nombrePedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PedidoRealizado.prototype, "idComprador", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PedidoRealizado.prototype, "idLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PedidoRealizado.prototype, "precioPedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PedidoRealizado.prototype, "pago", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], PedidoRealizado.prototype, "fechaPedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], PedidoRealizado.prototype, "fechaEntrega", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], PedidoRealizado.prototype, "fechaRegistro", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], PedidoRealizado.prototype, "esDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PedidoRealizado.prototype, "direccionEntrega", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true }
        }]),
    __metadata("design:type", Array)
], PedidoRealizado.prototype, "comidas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PedidoRealizado.prototype, "propina", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PedidoRealizado.prototype, "cantidadPropina", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PedidoRealizado.prototype, "repartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PedidoRealizado.prototype, "codigoPedido", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PedidoRealizado.prototype, "direccionLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], PedidoRealizado.prototype, "valoracionPedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], PedidoRealizado.prototype, "valoracionDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 5, default: 0 }),
    __metadata("design:type", Number)
], PedidoRealizado.prototype, "valoracionLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PedidoRealizado.prototype, "valoracionCompletada", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], PedidoRealizado.prototype, "datosUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], PedidoRealizado.prototype, "datosLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], PedidoRealizado.prototype, "datosRepartidor", void 0);
exports.PedidoRealizado = PedidoRealizado = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PedidoRealizado);
exports.PedidoRealizadoSchema = mongoose_1.SchemaFactory.createForClass(PedidoRealizado);
