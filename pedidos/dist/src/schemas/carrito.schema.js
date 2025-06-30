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
exports.CarritoSchema = exports.Carrito = exports.PromocionCarritoSchema = exports.ComidaCarritoSchema = exports.PromocionCarrito = exports.ComidaCarrito = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
// ✅ SCHEMA PARA COMIDAS (ACTUALIZADO)
let ComidaCarrito = class ComidaCarrito {
};
exports.ComidaCarrito = ComidaCarrito;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Locatario' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ComidaCarrito.prototype, "idLocatario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ComidaCarrito.prototype, "nombreLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ComidaCarrito.prototype, "nombreComida", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ComidaCarrito.prototype, "cantidad", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ComidaCarrito.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ComidaCarrito.prototype, "imagenUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }) // ✅ AHORA ES REQUERIDO
    ,
    __metadata("design:type", String)
], ComidaCarrito.prototype, "idComida", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'comida' }),
    __metadata("design:type", String)
], ComidaCarrito.prototype, "tipo", void 0);
exports.ComidaCarrito = ComidaCarrito = __decorate([
    (0, mongoose_1.Schema)()
], ComidaCarrito);
// ✅ SCHEMA PARA PROMOCIONES
let PromocionCarrito = class PromocionCarrito {
};
exports.PromocionCarrito = PromocionCarrito;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Locatario' }),
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
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "idPromocion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'promocion' }),
    __metadata("design:type", String)
], PromocionCarrito.prototype, "tipo", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            comidaId: { type: String, required: true },
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            precioOriginal: { type: Number, required: true }
        }]),
    __metadata("design:type", Array)
], PromocionCarrito.prototype, "comidas", void 0);
exports.PromocionCarrito = PromocionCarrito = __decorate([
    (0, mongoose_1.Schema)()
], PromocionCarrito);
exports.ComidaCarritoSchema = mongoose_1.SchemaFactory.createForClass(ComidaCarrito);
exports.PromocionCarritoSchema = mongoose_1.SchemaFactory.createForClass(PromocionCarrito);
// ✅ CARRITO ACTUALIZADO
let Carrito = class Carrito extends mongoose_2.Document {
};
exports.Carrito = Carrito;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'Usuario', unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Carrito.prototype, "idComprador", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ComidaCarritoSchema], default: [] }),
    __metadata("design:type", Array)
], Carrito.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.PromocionCarritoSchema], default: [] }),
    __metadata("design:type", Array)
], Carrito.prototype, "promociones", void 0);
exports.Carrito = Carrito = __decorate([
    (0, mongoose_1.Schema)()
], Carrito);
exports.CarritoSchema = mongoose_1.SchemaFactory.createForClass(Carrito);
