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
exports.CreateRepartidorDto = exports.CreateLocatarioDto = exports.CreateUsuarioDto = exports.CreateUsuarioBaseDto = exports.VentaDto = exports.ComidaDto = exports.TipoUsuario = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var TipoUsuario;
(function (TipoUsuario) {
    TipoUsuario["USUARIO"] = "usuario";
    TipoUsuario["LOCATARIO"] = "locatario";
    TipoUsuario["REPARTIDOR"] = "repartidor";
})(TipoUsuario || (exports.TipoUsuario = TipoUsuario = {}));
class ComidaDto {
}
exports.ComidaDto = ComidaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComidaDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComidaDto.prototype, "precio", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ComidaDto.prototype, "cantidad", void 0);
class VentaDto {
}
exports.VentaDto = VentaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VentaDto.prototype, "comida", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VentaDto.prototype, "precio", void 0);
class CreateUsuarioBaseDto {
}
exports.CreateUsuarioBaseDto = CreateUsuarioBaseDto;
__decorate([
    (0, class_validator_1.IsEnum)(TipoUsuario),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "tipoUsuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "nombre", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "apellido", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "clave", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "direccion", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioBaseDto.prototype, "telefono", void 0);
class CreateUsuarioDto extends CreateUsuarioBaseDto {
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombreUsuario", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "numeroCasaDepto", void 0);
class CreateLocatarioDto extends CreateUsuarioBaseDto {
}
exports.CreateLocatarioDto = CreateLocatarioDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLocatarioDto.prototype, "nombreLocal", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLocatarioDto.prototype, "numeroLocal", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ComidaDto),
    __metadata("design:type", Array)
], CreateLocatarioDto.prototype, "comidasStock", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VentaDto),
    __metadata("design:type", Array)
], CreateLocatarioDto.prototype, "ventas", void 0);
class CreateRepartidorDto extends CreateUsuarioBaseDto {
}
exports.CreateRepartidorDto = CreateRepartidorDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRepartidorDto.prototype, "usuarioRepartidor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRepartidorDto.prototype, "vehiculo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRepartidorDto.prototype, "patente", void 0);
