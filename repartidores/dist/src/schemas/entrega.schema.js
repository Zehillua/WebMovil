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
exports.EntregaSchema = exports.Entrega = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Entrega = class Entrega extends mongoose_2.Document {
};
exports.Entrega = Entrega;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Entrega.prototype, "repartidorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Entrega.prototype, "pedidoId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Entrega.prototype, "nombrePedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Entrega.prototype, "valorEntrega", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Entrega.prototype, "propina", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Entrega.prototype, "fechaEntrega", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            id: { type: mongoose_2.Types.ObjectId, required: true },
            nombre: { type: String, required: true },
            direccion: { type: String, required: true }
        },
        required: true
    }),
    __metadata("design:type", Object)
], Entrega.prototype, "cliente", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            id: { type: mongoose_2.Types.ObjectId, required: true },
            nombreLocal: { type: String, required: true },
            direccion: { type: String, required: true }
        },
        required: true
    }),
    __metadata("design:type", Object)
], Entrega.prototype, "local", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'No calculada' }),
    __metadata("design:type", String)
], Entrega.prototype, "distancia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'No calculado' }),
    __metadata("design:type", String)
], Entrega.prototype, "tiempoEntrega", void 0);
exports.Entrega = Entrega = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Entrega);
exports.EntregaSchema = mongoose_1.SchemaFactory.createForClass(Entrega);
