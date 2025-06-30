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
exports.PromocionSchema = exports.ComidaPromocionSchema = exports.Promocion = exports.ComidaPromocion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ComidaPromocion = class ComidaPromocion {
};
exports.ComidaPromocion = ComidaPromocion;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Comida', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ComidaPromocion.prototype, "comidaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ComidaPromocion.prototype, "nombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ComidaPromocion.prototype, "cantidad", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ComidaPromocion.prototype, "precioOriginal", void 0);
exports.ComidaPromocion = ComidaPromocion = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ComidaPromocion);
let Promocion = class Promocion extends mongoose_2.Document {
};
exports.Promocion = Promocion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Promocion.prototype, "nombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Promocion.prototype, "descripcion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Promocion.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promocion.prototype, "imagenUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ComidaPromocion], required: true }),
    __metadata("design:type", Array)
], Promocion.prototype, "comidas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Locatario', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Promocion.prototype, "locatarioId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Promocion.prototype, "activa", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Promocion.prototype, "fechaInicio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Promocion.prototype, "fechaFin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Promocion.prototype, "cantidadDisponible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Promocion.prototype, "cantidadVendida", void 0);
exports.Promocion = Promocion = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Promocion);
exports.ComidaPromocionSchema = mongoose_1.SchemaFactory.createForClass(ComidaPromocion);
exports.PromocionSchema = mongoose_1.SchemaFactory.createForClass(Promocion);
