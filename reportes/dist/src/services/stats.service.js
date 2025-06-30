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
const pedido_realizado_schema_1 = require("../schemas/pedido-realizado.schema");
const venta_reporte_schema_1 = require("../schemas/venta-reporte.schema");
let StatsService = class StatsService {
    constructor(usuarioModel, pedidoRealizadoModel, ventaReporteModel) {
        this.usuarioModel = usuarioModel;
        this.pedidoRealizadoModel = pedidoRealizadoModel;
        this.ventaReporteModel = ventaReporteModel;
    }
    // ========== MÉTODOS PARA PEDIDOS REALIZADOS ==========
    async registrarPedidoRealizado(pedidoData) {
        console.log('📊 Registrando pedido realizado en reportes:', pedidoData.pedidoId);
        const pedido = new this.pedidoRealizadoModel({
            pedidoId: pedidoData.pedidoId,
            nombrePedido: pedidoData.nombrePedido,
            precio: pedidoData.precio,
            fechaEntrega: pedidoData.fechaEntrega,
            fechaRegistro: new Date(),
            usuario: {
                id: pedidoData.usuario.id,
                nombre: pedidoData.usuario.nombre,
                apellido: pedidoData.usuario.apellido
            },
            local: {
                id: pedidoData.local.id,
                nombreLocal: pedidoData.local.nombreLocal
            },
            repartidor: {
                id: pedidoData.repartidor.id,
                nombre: pedidoData.repartidor.nombre
            },
            comidas: pedidoData.comidas || [],
            propina: pedidoData.propina || 0,
            totalConPropina: pedidoData.precio + (pedidoData.propina || 0)
        });
        const pedidoGuardado = await pedido.save();
        console.log('✅ Pedido realizado registrado en reportes');
        return pedidoGuardado;
    }
    async obtenerPedidosRealizados(filtros) {
        const query = {};
        if (filtros?.fechaInicio && filtros?.fechaFin) {
            query['fechaEntrega'] = {
                $gte: new Date(filtros.fechaInicio),
                $lte: new Date(filtros.fechaFin)
            };
        }
        if (filtros?.localId) {
            query['local.id'] = filtros.localId;
        }
        if (filtros?.repartidorId) {
            query['repartidor.id'] = filtros.repartidorId;
        }
        return this.pedidoRealizadoModel
            .find(query)
            .sort({ fechaEntrega: -1 })
            .exec();
    }
    // ========== MÉTODOS PARA VENTAS REPORTE ==========
    async registrarVentaReporte(ventaData) {
        console.log('📊 Registrando venta en reportes:', ventaData.pedidoId);
        const venta = new this.ventaReporteModel({
            pedidoId: ventaData.pedidoId,
            nombrePedido: ventaData.nombrePedido,
            precio: ventaData.precio,
            fechaVenta: ventaData.fechaVenta,
            usuario: {
                id: ventaData.usuario.id,
                nombre: ventaData.usuario.nombre,
                apellido: ventaData.usuario.apellido
            },
            local: {
                id: ventaData.local.id,
                nombreLocal: ventaData.local.nombreLocal
            },
            repartidor: {
                id: ventaData.repartidor.id,
                nombre: ventaData.repartidor.nombre
            },
            comidas: ventaData.comidas || [],
            esDelivery: ventaData.esDelivery || false,
            propina: ventaData.propina || 0,
            totalConPropina: ventaData.precio + (ventaData.propina || 0),
            fechaRegistro: new Date()
        });
        const ventaGuardada = await venta.save();
        console.log('✅ Venta registrada en reportes');
        return ventaGuardada;
    }
    async obtenerVentasReporte(filtros) {
        const query = {};
        if (filtros?.fechaInicio && filtros?.fechaFin) {
            query['fechaVenta'] = {
                $gte: new Date(filtros.fechaInicio),
                $lte: new Date(filtros.fechaFin)
            };
        }
        if (filtros?.localId) {
            query['local.id'] = filtros.localId;
        }
        return this.ventaReporteModel
            .find(query)
            .sort({ fechaVenta: -1 })
            .exec();
    }
    // ========== ESTADÍSTICAS GENERALES ==========
    async obtenerEstadisticasGenerales() {
        // Usar pedidos realizados para estadísticas principales
        const pedidos = await this.pedidoRealizadoModel.find().exec();
        const totalPedidos = pedidos.length;
        const totalVentas = pedidos.reduce((sum, p) => sum + p.precio, 0);
        const totalPropinas = pedidos.reduce((sum, p) => sum + (p.propina || 0), 0);
        const totalCompleto = totalVentas + totalPropinas;
        // Agrupar por local
        const ventasPorLocalMap = pedidos.reduce((acc, pedido) => {
            const localId = pedido.local.id.toString();
            if (!acc[localId]) {
                acc[localId] = {
                    nombreLocal: pedido.local.nombreLocal,
                    cantidadPedidos: 0,
                    totalVentas: 0,
                    totalPropinas: 0
                };
            }
            acc[localId].cantidadPedidos++;
            acc[localId].totalVentas += pedido.precio;
            acc[localId].totalPropinas += (pedido.propina || 0);
            return acc;
        }, {});
        // Agrupar por repartidor
        const entregasPorRepartidorMap = pedidos.reduce((acc, pedido) => {
            const repartidorId = pedido.repartidor.id.toString();
            if (!acc[repartidorId]) {
                acc[repartidorId] = {
                    nombreRepartidor: pedido.repartidor.nombre,
                    cantidadEntregas: 0,
                    totalPropinas: 0
                };
            }
            acc[repartidorId].cantidadEntregas++;
            acc[repartidorId].totalPropinas += (pedido.propina || 0);
            return acc;
        }, {});
        return {
            resumenGeneral: {
                totalPedidos,
                totalVentas,
                totalPropinas,
                totalCompleto,
                promedioVentaPorPedido: totalPedidos > 0 ? totalVentas / totalPedidos : 0
            },
            ventasPorLocal: Object.values(ventasPorLocalMap),
            entregasPorRepartidor: Object.values(entregasPorRepartidorMap)
        };
    }
    async obtenerEstadisticasPorFecha(fechaInicio, fechaFin) {
        const pedidos = await this.pedidoRealizadoModel
            .find({
            fechaEntrega: {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFin)
            }
        })
            .exec();
        // Agrupar por día
        const ventasPorDiaMap = pedidos.reduce((acc, pedido) => {
            const fecha = new Date(pedido.fechaEntrega).toISOString().split('T')[0];
            if (!acc[fecha]) {
                acc[fecha] = {
                    fecha,
                    cantidadPedidos: 0,
                    totalVentas: 0,
                    totalPropinas: 0
                };
            }
            acc[fecha].cantidadPedidos++;
            acc[fecha].totalVentas += pedido.precio;
            acc[fecha].totalPropinas += (pedido.propina || 0);
            return acc;
        }, {});
        return {
            resumenPeriodo: {
                fechaInicio,
                fechaFin,
                totalPedidos: pedidos.length,
                totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
                totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0)
            },
            ventasPorDia: Object.values(ventasPorDiaMap).sort((a, b) => a.fecha.localeCompare(b.fecha))
        };
    }
    // ========== MÉTODOS ESPECÍFICOS ==========
    async obtenerEstadisticasLocal(localId) {
        const pedidos = await this.pedidoRealizadoModel
            .find({ 'local.id': localId })
            .exec();
        if (pedidos.length === 0) {
            return {
                localId,
                nombreLocal: 'Local no encontrado',
                totalPedidos: 0,
                totalVentas: 0,
                totalPropinas: 0,
                pedidosRecientes: []
            };
        }
        return {
            localId,
            nombreLocal: pedidos[0].local.nombreLocal,
            totalPedidos: pedidos.length,
            totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
            totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
            promedioVentaPorPedido: pedidos.reduce((sum, p) => sum + p.precio, 0) / pedidos.length,
            pedidosRecientes: pedidos
                .sort((a, b) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime())
                .slice(0, 10)
        };
    }
    async obtenerEstadisticasRepartidor(repartidorId) {
        const pedidos = await this.pedidoRealizadoModel
            .find({ 'repartidor.id': repartidorId })
            .exec();
        if (pedidos.length === 0) {
            return {
                repartidorId,
                nombreRepartidor: 'Repartidor no encontrado',
                totalEntregas: 0,
                totalPropinas: 0,
                entregasRecientes: []
            };
        }
        return {
            repartidorId,
            nombreRepartidor: pedidos[0].repartidor.nombre,
            totalEntregas: pedidos.length,
            totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
            promedioPropinaPorEntrega: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0) / pedidos.length,
            entregasRecientes: pedidos
                .sort((a, b) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime())
                .slice(0, 10)
        };
    }
    // ========== MÉTODOS DE TOP RANKINGS ==========
    async obtenerTopLocales(limite = 10) {
        const estadisticas = await this.obtenerEstadisticasGenerales();
        return estadisticas.ventasPorLocal
            .sort((a, b) => b.totalVentas - a.totalVentas)
            .slice(0, limite);
    }
    async obtenerTopRepartidores(limite = 10) {
        const estadisticas = await this.obtenerEstadisticasGenerales();
        return estadisticas.entregasPorRepartidor
            .sort((a, b) => b.cantidadEntregas - a.cantidadEntregas)
            .slice(0, limite);
    }
    // ========== MÉTODOS DE BÚSQUEDA ==========
    async buscarPedidosPorUsuario(usuarioId) {
        return this.pedidoRealizadoModel
            .find({ 'usuario.id': usuarioId })
            .sort({ fechaEntrega: -1 })
            .exec();
    }
    async buscarPedidosPorNombre(nombrePedido) {
        return this.pedidoRealizadoModel
            .find({
            nombrePedido: { $regex: nombrePedido, $options: 'i' }
        })
            .sort({ fechaEntrega: -1 })
            .exec();
    }
    // ========== MÉTODO DE LIMPIEZA ==========
    async limpiarPedidosAntiguos(diasAntiguedad = 365) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);
        const resultado = await this.pedidoRealizadoModel
            .deleteMany({ fechaEntrega: { $lt: fechaLimite } })
            .exec();
        console.log(`🗑️ Eliminados ${resultado.deletedCount} pedidos antiguos`);
        return { eliminados: resultado.deletedCount };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Usuario')),
    __param(1, (0, mongoose_2.InjectModel)(pedido_realizado_schema_1.PedidoRealizado.name)),
    __param(2, (0, mongoose_2.InjectModel)(venta_reporte_schema_1.VentaReporte.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], StatsService);
