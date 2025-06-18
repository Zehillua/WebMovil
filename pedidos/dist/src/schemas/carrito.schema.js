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
exports.CarritoSchema = exports.Carrito = exports.ComidaCarritoSchema = exports.ComidaCarrito = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
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
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ComidaCarrito.prototype, "idComida", void 0);
exports.ComidaCarrito = ComidaCarrito = __decorate([
    (0, mongoose_1.Schema)()
], ComidaCarrito);
exports.ComidaCarritoSchema = mongoose_1.SchemaFactory.createForClass(ComidaCarrito);
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
exports.Carrito = Carrito = __decorate([
    (0, mongoose_1.Schema)()
], Carrito);
exports.CarritoSchema = mongoose_1.SchemaFactory.createForClass(Carrito);
