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
exports.ComidaPromocionSchema = exports.PromocionCarritoSchema = exports.ItemCarritoSchema = exports.CarritoSchema = exports.Carrito = exports.PromocionCarrito = exports.ItemCarrito = exports.ComidaPromocion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
// ✅ SCHEMA PARA COMIDAS EN PROMOCIONES
let ComidaPromocion = class ComidaPromocion {
};
exports.ComidaPromocion = ComidaPromocion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
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
    (0, mongoose_1.Schema)()
], ComidaPromocion);
// ✅ SCHEMA PARA ITEMS DE COMIDA
let ItemCarrito = class ItemCarrito {
};
exports.ItemCarrito = ItemCarrito;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItemCarrito.prototype, "idComida", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ItemCarrito.prototype, "idLocatario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItemCarrito.prototype, "nombreLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItemCarrito.prototype, "nombreComida", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ItemCarrito.prototype, "cantidad", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ItemCarrito.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ItemCarrito.prototype, "imagenUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'comida' }),
    __metadata("design:type", String)
], ItemCarrito.prototype, "tipo", void 0);
exports.ItemCarrito = ItemCarrito = __decorate([
    (0, mongoose_1.Schema)()
], ItemCarrito);
// ✅ SCHEMA PARA PROMOCIONES
let PromocionCarrito = class PromocionCarrito {
};
exports.PromocionCarrito = PromocionCarrito;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "idPromocion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PromocionCarrito.prototype, "idLocatario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "nombreLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "nombrePromocion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PromocionCarrito.prototype, "cantidad", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PromocionCarrito.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "imagenUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'promocion' }),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "tipo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ComidaPromocion] }),
    __metadata("design:type", Array)
], PromocionCarrito.prototype, "comidas", void 0);
exports.PromocionCarrito = PromocionCarrito = __decorate([
    (0, mongoose_1.Schema)()
], PromocionCarrito);
// ✅ SCHEMA PRINCIPAL DEL CARRITO
let Carrito = class Carrito extends mongoose_2.Document {
};
exports.Carrito = Carrito;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Carrito.prototype, "idComprador", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ItemCarrito], default: [] }),
    __metadata("design:type", Array)
], Carrito.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PromocionCarrito], default: [] }),
    __metadata("design:type", Array)
], Carrito.prototype, "promociones", void 0);
exports.Carrito = Carrito = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Carrito);
exports.CarritoSchema = mongoose_1.SchemaFactory.createForClass(Carrito);
exports.ItemCarritoSchema = mongoose_1.SchemaFactory.createForClass(ItemCarrito);
exports.PromocionCarritoSchema = mongoose_1.SchemaFactory.createForClass(PromocionCarrito);
exports.ComidaPromocionSchema = mongoose_1.SchemaFactory.createForClass(ComidaPromocion);
