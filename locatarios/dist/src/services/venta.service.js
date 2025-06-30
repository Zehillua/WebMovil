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
exports.VentaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const venta_schema_1 = require("../schemas/venta.schema");
let VentaService = class VentaService {
    constructor(ventaModel) {
        this.ventaModel = ventaModel;
    }
    async registrarVenta(ventaData) {
        console.log('💰 Registrando nueva venta en locatarios:', ventaData.pedidoId);
        const venta = new this.ventaModel({
            localId: new mongoose_2.Types.ObjectId(ventaData.localId),
            pedidoId: new mongoose_2.Types.ObjectId(ventaData.pedidoId),
            nombrePedido: ventaData.nombrePedido,
            precio: ventaData.precio,
            fechaVenta: new Date(ventaData.fechaVenta),
            cliente: {
                id: new mongoose_2.Types.ObjectId(ventaData.cliente.id),
                nombre: ventaData.cliente.nombre
            },
            comidas: ventaData.comidas,
            esDelivery: ventaData.esDelivery,
            propina: ventaData.propina,
            totalConPropina: ventaData.precio + ventaData.propina
        });
        const ventaGuardada = await venta.save();
        console.log('✅ Venta registrada en locatarios');
        return ventaGuardada;
    }
    async obtenerVentasPorLocal(localId) {
        return this.ventaModel
            .find({ localId: new mongoose_2.Types.ObjectId(localId) })
            .sort({ fechaVenta: -1 })
            .exec();
    }
    async obtenerEstadisticasLocal(localId) {
        const ventas = await this.ventaModel
            .find({ localId: new mongoose_2.Types.ObjectId(localId) })
            .exec();
        const totalVentas = ventas.length;
        const totalIngresos = ventas.reduce((sum, v) => sum + v.precio, 0);
        const totalPropinas = ventas.reduce((sum, v) => sum + v.propina, 0);
        const totalCompleto = totalIngresos + totalPropinas;
        return {
            localId,
            totalVentas,
            totalIngresos,
            totalPropinas,
            totalCompleto,
            promedioVentaPorPedido: totalVentas > 0 ? totalIngresos / totalVentas : 0,
            ventasRecientes: ventas
                .sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime())
                .slice(0, 10)
        };
    }
};
exports.VentaService = VentaService;
exports.VentaService = VentaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(venta_schema_1.Venta.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], VentaService);
