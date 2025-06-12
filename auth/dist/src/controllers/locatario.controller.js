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
exports.LocatarioController = void 0;
const common_1 = require("@nestjs/common");
const locatario_service_1 = require("../services/locatario.service");
let LocatarioController = class LocatarioController {
    constructor(locatarioService) {
        this.locatarioService = locatarioService;
    }
    async getLocatarios() {
        return this.locatarioService.obtenerLocatarios();
    }
    async obtenerUsuarioPorId(id) {
        const usuario = await this.locatarioService.obtenerLocatarioPorId(id);
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        // Puedes filtrar los campos que quieres devolver:
        return {
            _id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            nombreLocal: usuario.nombreLocal,
            numeroLocal: usuario.numeroLocal,
            correo: usuario.correo,
            tipoUsuario: usuario.tipoUsuario,
        };
    }
};
exports.LocatarioController = LocatarioController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocatarioController.prototype, "getLocatarios", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocatarioController.prototype, "obtenerUsuarioPorId", null);
exports.LocatarioController = LocatarioController = __decorate([
    (0, common_1.Controller)('locatarios'),
    __metadata("design:paramtypes", [locatario_service_1.LocatarioService])
], LocatarioController);
