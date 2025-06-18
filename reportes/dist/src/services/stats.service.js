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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let StatsService = class StatsService {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
    }
    async obtenerLocales() {
        // Devuelve nombreLocal, numeroTelefono, ciudad y numeroLocal
        return this.usuarioModel.find({ tipoUsuario: 'locatario' }, {
            nombreLocal: 1,
            numeroTelefono: 1,
            ciudad: 1,
            numeroLocal: 1,
            _id: 0
        }).exec();
    }
    async estadisticasLocal(nombreLocal) {
        // 1. Buscar el locatario por nombreLocal
        const locatario = await this.usuarioModel.findOne({ nombreLocal });
        // 2. Obtener ventas y comidas
        const ventas = locatario.ventas || [];
        const comidasStock = locatario.comidasStock || [];
        const promociones = locatario.promociones || [];
        // 3. Calcular estadísticas
        const totalVentas = ventas.length;
        const dineroRecaudado = ventas.reduce((sum, v) => sum + v.precio, 0);
        // Por comida
        const resumenComidas = comidasStock.map((comida) => {
            const ventasComida = ventas.filter((v) => v.comida === comida.nombre);
            const cantidad = ventasComida.length;
            const dinero = ventasComida.reduce((sum, v) => sum + v.precio, 0);
            return {
                nombre: comida.nombre,
                cantidadVentas: cantidad,
                dineroRecaudado: dinero,
            };
        });
        return {
            totalVentas,
            dineroRecaudado,
            resumenComidas,
            promociones,
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Usuario')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], StatsService);
