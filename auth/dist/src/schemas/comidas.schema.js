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
exports.VentaPromoSchema = exports.VentaNormalSchema = exports.VentaPromo = exports.VentaNormal = exports.Comida = exports.PromocionDto = exports.ComidaPromoDto = void 0;
const mongoose_1 = require("@nestjs/mongoose");
class ComidaPromoDto {
}
exports.ComidaPromoDto = ComidaPromoDto;
class PromocionDto {
}
exports.PromocionDto = PromocionDto;
class Comida {
}
exports.Comida = Comida;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Comida.prototype, "nombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Comida.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Comida.prototype, "cantidad", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], Comida.prototype, "ingredientes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Comida.prototype, "descripcion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Comida.prototype, "imagenUrl", void 0);
class VentaNormal {
}
exports.VentaNormal = VentaNormal;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VentaNormal.prototype, "comida", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], VentaNormal.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], VentaNormal.prototype, "fecha", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VentaNormal.prototype, "valoracion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VentaNormal.prototype, "comentario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], VentaNormal.prototype, "esDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VentaNormal.prototype, "correoRepartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VentaNormal.prototype, "correoUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VentaNormal.prototype, "propina", void 0);
class VentaPromo {
}
exports.VentaPromo = VentaPromo;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VentaPromo.prototype, "nombrePromo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], VentaPromo.prototype, "precioPromo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], VentaPromo.prototype, "fecha", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VentaPromo.prototype, "valoracion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VentaPromo.prototype, "comentario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], VentaPromo.prototype, "esDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VentaPromo.prototype, "correoRepartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VentaPromo.prototype, "correoUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VentaPromo.prototype, "propina", void 0);
exports.VentaNormalSchema = mongoose_1.SchemaFactory.createForClass(VentaNormal);
exports.VentaPromoSchema = mongoose_1.SchemaFactory.createForClass(VentaPromo);
