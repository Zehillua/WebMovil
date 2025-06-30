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
    constructor(pedidoRealizadoModel, ventaReporteModel) {
        this.pedidoRealizadoModel = pedidoRealizadoModel;
        this.ventaReporteModel = ventaReporteModel;
    }
    // ========== REGISTRAR PEDIDO REALIZADO ==========
    async registrarPedidoRealizado(pedidoData) {
        console.log('📊 REPORTES: Registrando pedido realizado:', pedidoData.pedidoId);
        try {
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
            console.log('✅ REPORTES: Pedido guardado exitosamente');
            return pedidoGuardado;
        }
        catch (error) {
            console.error('❌ REPORTES: Error guardando pedido:', error);
            throw error;
        }
    }
    // ========== TOP LOCALES PARA ADMIN - VERSIÓN SIMPLE ==========
    async obtenerTopLocales(limite = 20) {
        console.log('📊 REPORTES: Obteniendo top locales (método simple)');
        try {
            const pedidos = await this.pedidoRealizadoModel.find().exec();
            if (pedidos.length === 0) {
                console.log('📊 REPORTES: No hay pedidos registrados');
                return [];
            }
            // Agrupar por local manualmente
            const localesStats = {};
            pedidos.forEach(pedido => {
                const localId = pedido.local.id.toString();
                const localNombre = pedido.local.nombreLocal;
                if (!localesStats[localId]) {
                    localesStats[localId] = {
                        _id: localId,
                        nombreLocal: localNombre,
                        cantidadPedidos: 0,
                        totalVentas: 0,
                        totalPropinas: 0,
                        totalCompleto: 0
                    };
                }
                localesStats[localId].cantidadPedidos++;
                localesStats[localId].totalVentas += pedido.precio;
                localesStats[localId].totalPropinas += pedido.propina || 0;
                localesStats[localId].totalCompleto += pedido.precio + (pedido.propina || 0);
            });
            // Convertir a array y agregar promedio
            const resultado = Object.values(localesStats).map((local) => ({
                ...local,
                promedioVentaPorPedido: local.cantidadPedidos > 0
                    ? Math.round(local.totalVentas / local.cantidadPedidos)
                    : 0
            }));
            // Ordenar por total completo (descendente)
            resultado.sort((a, b) => b.totalCompleto - a.totalCompleto);
            const resultadoLimitado = resultado.slice(0, limite);
            console.log(`📊 REPORTES: Top ${resultadoLimitado.length} locales procesados`);
            return resultadoLimitado;
        }
        catch (error) {
            console.error('❌ REPORTES: Error obteniendo top locales:', error);
            return [];
        }
    }
    // ========== ESTADÍSTICAS GENERALES ==========
    async obtenerEstadisticasGenerales() {
        try {
            const pedidos = await this.pedidoRealizadoModel.find().exec();
            const totalPedidos = pedidos.length;
            const totalVentas = pedidos.reduce((sum, p) => sum + p.precio, 0);
            const totalPropinas = pedidos.reduce((sum, p) => sum + (p.propina || 0), 0);
            const totalCompleto = totalVentas + totalPropinas;
            return {
                resumenGeneral: {
                    totalPedidos,
                    totalVentas,
                    totalPropinas,
                    totalCompleto,
                    promedioVentaPorPedido: totalPedidos > 0 ? totalVentas / totalPedidos : 0
                }
            };
        }
        catch (error) {
            console.error('❌ REPORTES: Error obteniendo estadísticas:', error);
            return {
                resumenGeneral: {
                    totalPedidos: 0,
                    totalVentas: 0,
                    totalPropinas: 0,
                    totalCompleto: 0,
                    promedioVentaPorPedido: 0
                }
            };
        }
    }
    // ========== ESTADÍSTICAS POR FECHA ==========
    async obtenerEstadisticasPorFecha(fechaInicio, fechaFin) {
        try {
            const pedidos = await this.pedidoRealizadoModel
                .find({
                fechaEntrega: {
                    $gte: new Date(fechaInicio),
                    $lte: new Date(fechaFin)
                }
            })
                .exec();
            return {
                resumenPeriodo: {
                    fechaInicio,
                    fechaFin,
                    totalPedidos: pedidos.length,
                    totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
                    totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0)
                }
            };
        }
        catch (error) {
            console.error('❌ REPORTES: Error obteniendo estadísticas por fecha:', error);
            return {
                resumenPeriodo: {
                    fechaInicio,
                    fechaFin,
                    totalPedidos: 0,
                    totalVentas: 0,
                    totalPropinas: 0
                }
            };
        }
    }
    // ========== ESTADÍSTICAS DE LOCAL ==========
    async obtenerEstadisticasLocal(localId) {
        try {
            const pedidos = await this.pedidoRealizadoModel
                .find({ 'local.id': localId })
                .exec();
            if (pedidos.length === 0) {
                return {
                    localId,
                    nombreLocal: 'Local no encontrado',
                    totalPedidos: 0,
                    totalVentas: 0,
                    totalPropinas: 0
                };
            }
            return {
                localId,
                nombreLocal: pedidos[0].local.nombreLocal,
                totalPedidos: pedidos.length,
                totalVentas: pedidos.reduce((sum, p) => sum + p.precio, 0),
                totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
                promedioVentaPorPedido: pedidos.reduce((sum, p) => sum + p.precio, 0) / pedidos.length
            };
        }
        catch (error) {
            console.error('❌ REPORTES: Error obteniendo estadísticas de local:', error);
            return {
                localId,
                nombreLocal: 'Error',
                totalPedidos: 0,
                totalVentas: 0,
                totalPropinas: 0
            };
        }
    }
    // ========== MÉTODOS ADICIONALES SIMPLIFICADOS ==========
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
        return this.pedidoRealizadoModel
            .find(query)
            .sort({ fechaEntrega: -1 })
            .limit(100) // Limitar resultados
            .exec();
    }
    async buscarPedidosPorUsuario(usuarioId) {
        return this.pedidoRealizadoModel
            .find({ 'usuario.id': usuarioId })
            .sort({ fechaEntrega: -1 })
            .limit(50)
            .exec();
    }
    async buscarPedidosPorNombre(nombrePedido) {
        return this.pedidoRealizadoModel
            .find({
            nombrePedido: { $regex: nombrePedido, $options: 'i' }
        })
            .sort({ fechaEntrega: -1 })
            .limit(50)
            .exec();
    }
    // ========== MÉTODOS PARA COMPATIBILIDAD ==========
    async registrarVentaReporte(ventaData) {
        const venta = new this.ventaReporteModel(ventaData);
        return venta.save();
    }
    async obtenerVentasReporte(filtros) {
        return this.ventaReporteModel.find(filtros || {}).exec();
    }
    async obtenerEstadisticasRepartidor(repartidorId) {
        // Este método devuelve estadísticas limitadas ya que los repartidores tienen su propio microservicio
        const pedidos = await this.pedidoRealizadoModel
            .find({ 'repartidor.id': repartidorId })
            .exec();
        return {
            repartidorId,
            totalEntregas: pedidos.length,
            totalPropinas: pedidos.reduce((sum, p) => sum + (p.propina || 0), 0),
            mensaje: 'Para estadísticas completas de repartidores use el microservicio de repartidores'
        };
    }
    async obtenerTopRepartidores(limite = 10) {
        // Redirigir al microservicio de repartidores
        return [{
                mensaje: 'Use el microservicio de repartidores (puerto 3003) para el top de repartidores',
                endpoint: 'http://localhost:3003/graphql'
            }];
    }
    async limpiarPedidosAntiguos(diasAntiguedad = 365) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);
        const resultado = await this.pedidoRealizadoModel
            .deleteMany({ fechaEntrega: { $lt: fechaLimite } })
            .exec();
        console.log(`🗑️ REPORTES: Eliminados ${resultado.deletedCount} pedidos antiguos`);
        return { eliminados: resultado.deletedCount };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(pedido_realizado_schema_1.PedidoRealizado.name)),
    __param(1, (0, mongoose_2.InjectModel)(venta_reporte_schema_1.VentaReporte.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], StatsService);
