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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComidaResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../guards/gql-auth.guard");
const comida_input_1 = require("../dto/comida.input");
const comida_service_1 = require("../services/comida.service");
const comida_type_1 = require("../dto/comida.type"); // <-- Asegúrate de tener este archivo
let ComidaResolver = class ComidaResolver {
    constructor(comidaService) {
        this.comidaService = comidaService;
    }
    async agregarComida(input, context) {
        const user = context.req.user;
        return this.comidaService.crearComida(user._id, input);
    }
};
exports.ComidaResolver = ComidaResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => comida_type_1.ComidaType),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comida_input_1.CrearComidaDto, Object]),
    __metadata("design:returntype", Promise)
], ComidaResolver.prototype, "agregarComida", null);
exports.ComidaResolver = ComidaResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [comida_service_1.ComidaService])
], ComidaResolver);
