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
exports.UsuarioSchema = exports.Usuario = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Usuario = class Usuario extends mongoose_2.Document {
};
exports.Usuario = Usuario;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Usuario.prototype, "tipoUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], Usuario.prototype, "correo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Usuario.prototype, "clave", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "direccion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "telefono", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Usuario.prototype, "saldo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "isAdmin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombreUsuario", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "numeroCasaDepto", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "nombreLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "numeroLocal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                nombre: String,
                precio: Number,
                cantidad: Number,
                ingredientes: [String],
                descripcion: String,
                imagenUrl: String,
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], Usuario.prototype, "comidasStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ comida: String, precio: Number }] }),
    __metadata("design:type", Array)
], Usuario.prototype, "ventas", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ nombrePromo: String, precioPromo: Number }] }),
    __metadata("design:type", Array)
], Usuario.prototype, "ventasPromo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Usuario.prototype, "valoracion", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "usuarioRepartidor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "vehiculo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Usuario.prototype, "patente", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Usuario.prototype, "valoracionRepartidor", void 0);
exports.Usuario = Usuario = __decorate([
    (0, mongoose_1.Schema)({ collection: 'users' })
], Usuario);
exports.UsuarioSchema = mongoose_1.SchemaFactory.createForClass(Usuario);
