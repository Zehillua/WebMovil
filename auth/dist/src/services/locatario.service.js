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
exports.LocatarioService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usuario_schema_1 = require("../schemas/usuario.schema");
let LocatarioService = class LocatarioService {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
    }
    async obtenerLocatarios() {
        // ✅ DEVOLVER MÁS CAMPOS PARA EL DASHBOARD
        return this.usuarioModel.find({ tipoUsuario: 'locatario' }, {
            _id: 1,
            nombreLocal: 1,
            numeroLocal: 1,
            direccion: 1,
            valoracion: 1,
            // Agregar campos que tengas en el schema y necesites mostrar
        }).lean().exec().then(locales => locales.map(local => ({
            ...local,
            // Asegurar valores por defecto para el frontend
            valoracion: local.valoracion || 0,
            tiempoEntrega: '30-45 min', // Valor por defecto
            categorias: [],
            estado: 'abierto',
            descripcion: `Local de comida - ${local.nombreLocal}`
        })));
    }
    async obtenerLocatarioPorId(id) {
        return this.usuarioModel.findById(id);
    }
    async actualizarValoracion(locatarioId, nuevaValoracion) {
        const locatario = await this.usuarioModel.findById(locatarioId);
        if (!locatario)
            throw new common_1.NotFoundException('Locatario no encontrado');
        // Calcular nuevo promedio
        const totalActual = locatario.totalPuntosValoracion || 0;
        const countActual = locatario.totalValoraciones || 0;
        const nuevoTotal = totalActual + nuevaValoracion;
        const nuevoCount = countActual + 1;
        const nuevoPromedio = nuevoTotal / nuevoCount;
        locatario.valoracion = Math.round(nuevoPromedio * 10) / 10; // Redondear a 1 decimal
        locatario.totalValoraciones = nuevoCount;
        locatario.totalPuntosValoracion = nuevoTotal;
        await locatario.save();
        return locatario;
    }
};
exports.LocatarioService = LocatarioService;
exports.LocatarioService = LocatarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LocatarioService);
