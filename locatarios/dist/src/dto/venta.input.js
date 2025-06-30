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
exports.RegistrarVentaInput = exports.ComidaVentaInput = exports.ClienteVentaInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let ClienteVentaInput = class ClienteVentaInput {
};
exports.ClienteVentaInput = ClienteVentaInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ClienteVentaInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ClienteVentaInput.prototype, "nombre", void 0);
exports.ClienteVentaInput = ClienteVentaInput = __decorate([
    (0, graphql_1.InputType)()
], ClienteVentaInput);
let ComidaVentaInput = class ComidaVentaInput {
};
exports.ComidaVentaInput = ComidaVentaInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ComidaVentaInput.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ComidaVentaInput.prototype, "cantidad", void 0);
exports.ComidaVentaInput = ComidaVentaInput = __decorate([
    (0, graphql_1.InputType)()
], ComidaVentaInput);
let RegistrarVentaInput = class RegistrarVentaInput {
};
exports.RegistrarVentaInput = RegistrarVentaInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RegistrarVentaInput.prototype, "localId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RegistrarVentaInput.prototype, "pedidoId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RegistrarVentaInput.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], RegistrarVentaInput.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RegistrarVentaInput.prototype, "fechaVenta", void 0);
__decorate([
    (0, graphql_1.Field)(() => ClienteVentaInput),
    __metadata("design:type", ClienteVentaInput)
], RegistrarVentaInput.prototype, "cliente", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ComidaVentaInput]),
    __metadata("design:type", Array)
], RegistrarVentaInput.prototype, "comidas", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], RegistrarVentaInput.prototype, "esDelivery", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], RegistrarVentaInput.prototype, "propina", void 0);
exports.RegistrarVentaInput = RegistrarVentaInput = __decorate([
    (0, graphql_1.InputType)()
], RegistrarVentaInput);
