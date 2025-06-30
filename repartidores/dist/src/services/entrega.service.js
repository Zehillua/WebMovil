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
exports.EntregaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const entrega_schema_1 = require("../schemas/entrega.schema");
let EntregaService = class EntregaService {
    constructor(entregaModel) {
        this.entregaModel = entregaModel;
    }
    async registrarEntrega(entregaData) {
        console.log('📦 Registrando nueva entrega:', entregaData.pedidoId);
        const entrega = new this.entregaModel({
            ...entregaData,
            repartidorId: new mongoose_2.Types.ObjectId(entregaData.repartidorId),
            pedidoId: new mongoose_2.Types.ObjectId(entregaData.pedidoId),
            cliente: {
                ...entregaData.cliente,
                id: new mongoose_2.Types.ObjectId(entregaData.cliente.id)
            },
            local: {
                ...entregaData.local,
                id: new mongoose_2.Types.ObjectId(entregaData.local.id)
            }
        });
        const entregaGuardada = await entrega.save();
        console.log('✅ Entrega registrada exitosamente');
        return entregaGuardada;
    }
    async obtenerEntregasRepartidor(repartidorId) {
        console.log(`🔍 Buscando entregas para repartidor: ${repartidorId}`);
        // Verificar que el ID sea válido
        if (!mongoose_2.Types.ObjectId.isValid(repartidorId)) {
            console.error('❌ ID de repartidor no válido:', repartidorId);
            return [];
        }
        const entregas = await this.entregaModel
            .find({ repartidorId: new mongoose_2.Types.ObjectId(repartidorId) })
            .sort({ fechaEntrega: -1 })
            .exec();
        console.log(`📦 Encontradas ${entregas.length} entregas para repartidor ${repartidorId}`);
        // Log de las primeras entregas para debug
        if (entregas.length > 0) {
            console.log('🔍 Primera entrega:', {
                _id: entregas[0]._id,
                nombrePedido: entregas[0].nombrePedido,
                repartidorId: entregas[0].repartidorId,
                fechaEntrega: entregas[0].fechaEntrega
            });
        }
        return entregas;
    }
    async obtenerEstadisticas(repartidorId) {
        console.log(`📊 Calculando estadísticas para repartidor: ${repartidorId}`);
        if (!mongoose_2.Types.ObjectId.isValid(repartidorId)) {
            console.error('❌ ID de repartidor no válido para estadísticas:', repartidorId);
            return {
                totalEntregas: 0,
                totalGanancias: 0,
                totalPropinas: 0,
                promedioGananciaPorEntrega: 0
            };
        }
        const entregas = await this.entregaModel
            .find({ repartidorId: new mongoose_2.Types.ObjectId(repartidorId) })
            .exec();
        const totalEntregas = entregas.length;
        const totalGanancias = entregas.reduce((sum, e) => sum + e.valorEntrega + e.propina, 0);
        const totalPropinas = entregas.reduce((sum, e) => sum + e.propina, 0);
        const estadisticas = {
            totalEntregas,
            totalGanancias,
            totalPropinas,
            promedioGananciaPorEntrega: totalEntregas > 0 ? totalGanancias / totalEntregas : 0
        };
        console.log('📊 Estadísticas calculadas:', estadisticas);
        return estadisticas;
    }
    async actualizarValoracionMasReciente(repartidorId, valoracion) {
        // Buscar la entrega más reciente sin valoración
        const entrega = await this.entregaModel.findOneAndUpdate({
            repartidorId: new mongoose_2.Types.ObjectId(repartidorId),
            valoracionRegistrada: false
        }, {
            valoracionRecibida: valoracion,
            fechaValoracion: new Date(),
            valoracionRegistrada: true
        }, {
            new: true,
            sort: { fechaEntrega: -1 } // Más reciente primero
        });
        if (!entrega) {
            throw new Error('No se encontró entrega reciente sin valoración para este repartidor');
        }
        return entrega;
    }
    async obtenerEntregasConValoracion(repartidorId) {
        return this.entregaModel
            .find({
            repartidorId: new mongoose_2.Types.ObjectId(repartidorId),
            valoracionRegistrada: true
        })
            .sort({ fechaValoracion: -1 })
            .exec();
    }
    async calcularPromedioValoracion(repartidorId) {
        const entregas = await this.entregaModel
            .find({
            repartidorId: new mongoose_2.Types.ObjectId(repartidorId),
            valoracionRegistrada: true
        })
            .exec();
        if (entregas.length === 0)
            return 0;
        const suma = entregas.reduce((acc, entrega) => acc + entrega.valoracionRecibida, 0);
        return Math.round((suma / entregas.length) * 10) / 10; // Redondear a 1 decimal
    }
};
exports.EntregaService = EntregaService;
exports.EntregaService = EntregaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(entrega_schema_1.Entrega.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EntregaService);
