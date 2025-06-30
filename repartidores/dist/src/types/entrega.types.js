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
exports.EstadisticasType = exports.EntregaType = exports.LocalType = exports.ClienteType = void 0;
const graphql_1 = require("@nestjs/graphql");
let ClienteType = class ClienteType {
};
exports.ClienteType = ClienteType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ClienteType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ClienteType.prototype, "nombre", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ClienteType.prototype, "direccion", void 0);
exports.ClienteType = ClienteType = __decorate([
    (0, graphql_1.ObjectType)()
], ClienteType);
let LocalType = class LocalType {
};
exports.LocalType = LocalType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], LocalType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LocalType.prototype, "nombreLocal", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LocalType.prototype, "direccion", void 0);
exports.LocalType = LocalType = __decorate([
    (0, graphql_1.ObjectType)()
], LocalType);
let EntregaType = class EntregaType {
};
exports.EntregaType = EntregaType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], EntregaType.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], EntregaType.prototype, "repartidorId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], EntregaType.prototype, "pedidoId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EntregaType.prototype, "nombrePedido", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EntregaType.prototype, "valorEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    __metadata("design:type", Number)
], EntregaType.prototype, "propina", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], EntregaType.prototype, "fechaEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    __metadata("design:type", Number)
], EntregaType.prototype, "valoracionRecibida", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], EntregaType.prototype, "fechaValoracion", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { defaultValue: false }),
    __metadata("design:type", Boolean)
], EntregaType.prototype, "valoracionRegistrada", void 0);
__decorate([
    (0, graphql_1.Field)(() => ClienteType),
    __metadata("design:type", ClienteType)
], EntregaType.prototype, "cliente", void 0);
__decorate([
    (0, graphql_1.Field)(() => LocalType),
    __metadata("design:type", LocalType)
], EntregaType.prototype, "local", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'No calculada' }),
    __metadata("design:type", String)
], EntregaType.prototype, "distancia", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'No calculado' }),
    __metadata("design:type", String)
], EntregaType.prototype, "tiempoEntrega", void 0);
exports.EntregaType = EntregaType = __decorate([
    (0, graphql_1.ObjectType)()
], EntregaType);
let EstadisticasType = class EstadisticasType {
};
exports.EstadisticasType = EstadisticasType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EstadisticasType.prototype, "totalEntregas", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EstadisticasType.prototype, "totalGanancias", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EstadisticasType.prototype, "totalPropinas", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EstadisticasType.prototype, "promedioGananciaPorEntrega", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { defaultValue: 0 }),
    __metadata("design:type", Number)
], EstadisticasType.prototype, "valoracionPromedio", void 0);
exports.EstadisticasType = EstadisticasType = __decorate([
    (0, graphql_1.ObjectType)()
], EstadisticasType);
