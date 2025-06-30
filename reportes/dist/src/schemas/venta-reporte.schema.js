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
exports.VentaReporteSchema = exports.VentaReporte = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VentaReporte = class VentaReporte extends mongoose_2.Document {
};
exports.VentaReporte = VentaReporte;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VentaReporte.prototype, "pedidoId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], VentaReporte.prototype, "nombrePedido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], VentaReporte.prototype, "precio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], VentaReporte.prototype, "fechaVenta", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], VentaReporte.prototype, "usuario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], VentaReporte.prototype, "local", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], VentaReporte.prototype, "repartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Schema.Types.Mixed], default: [] }),
    __metadata("design:type", Array)
], VentaReporte.prototype, "comidas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], VentaReporte.prototype, "esDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], VentaReporte.prototype, "propina", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], VentaReporte.prototype, "totalConPropina", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], VentaReporte.prototype, "fechaRegistro", void 0);
exports.VentaReporte = VentaReporte = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VentaReporte);
exports.VentaReporteSchema = mongoose_1.SchemaFactory.createForClass(VentaReporte);
