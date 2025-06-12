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
exports.CreateRepartidorDto = exports.CreateLocatarioDto = exports.CreateUsuarioDto = exports.CreateUsuarioBaseDto = exports.TipoUsuario = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const comidas_dto_1 = require("./comidas.dto");
var TipoUsuario;
(function (TipoUsuario) {
    TipoUsuario["USUARIO"] = "usuario";
    TipoUsuario["LOCATARIO"] = "locatario";
    TipoUsuario["REPARTIDOR"] = "repartidor";
})(TipoUsuario || (exports.TipoUsuario = TipoUsuario = {}));
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
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUsuarioBaseDto.prototype, "isAdmin", void 0);
// Usuario normal
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
// Locatario
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
    (0, class_transformer_1.Type)(() => comidas_dto_1.ComidaDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateLocatarioDto.prototype, "comidasStock", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => comidas_dto_1.VentaNormalDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateLocatarioDto.prototype, "ventas", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => comidas_dto_1.VentaPromoDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateLocatarioDto.prototype, "ventasPromo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateLocatarioDto.prototype, "valoracion", void 0);
// Repartidor
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
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRepartidorDto.prototype, "valoracionRepartidor", void 0);
