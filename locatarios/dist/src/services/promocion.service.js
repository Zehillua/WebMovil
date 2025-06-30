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
exports.PromocionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const promocion_schema_1 = require("../schemas/promocion.schema");
const comida_schema_1 = require("../schemas/comida.schema");
let PromocionService = class PromocionService {
    constructor(promocionModel, comidaModel) {
        this.promocionModel = promocionModel;
        this.comidaModel = comidaModel;
    }
    async crearPromocion(locatarioId, dto) {
        console.log('🎉 Creando nueva promoción:', dto.nombre);
        // Validar que todas las comidas pertenezcan al locatario
        const comidasIds = dto.comidas.map(c => c.comidaId);
        const comidasExistentes = await this.comidaModel.find({
            _id: { $in: comidasIds },
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
        });
        if (comidasExistentes.length !== comidasIds.length) {
            throw new common_1.BadRequestException('Una o más comidas no pertenecen a tu local');
        }
        // Calcular precio total original para validación
        const precioOriginalTotal = dto.comidas.reduce((total, comida) => {
            return total + (comida.precioOriginal * comida.cantidad);
        }, 0);
        console.log(`💰 Precio original total: $${precioOriginalTotal}, Precio promoción: $${dto.precio}`);
        // Validar que el precio de promoción sea menor al original
        if (dto.precio >= precioOriginalTotal) {
            throw new common_1.BadRequestException('El precio de la promoción debe ser menor al precio original');
        }
        // Crear promoción
        const nuevaPromocion = new this.promocionModel({
            ...dto,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId),
            comidas: dto.comidas.map(comida => ({
                ...comida,
                comidaId: new mongoose_2.Types.ObjectId(comida.comidaId)
            })),
            fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : new Date(),
            fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : null,
            cantidadDisponible: dto.cantidadDisponible || 0,
            cantidadVendida: 0,
            activa: dto.activa !== undefined ? dto.activa : true
        });
        const promocionGuardada = await nuevaPromocion.save();
        console.log('✅ Promoción creada exitosamente');
        return promocionGuardada;
    }
    async obtenerPromocionesPorLocatario(locatarioId) {
        console.log(`📋 Obteniendo promociones del locatario: ${locatarioId}`);
        const promociones = await this.promocionModel
            .find({ locatarioId: new mongoose_2.Types.ObjectId(locatarioId) })
            .populate('comidas.comidaId', 'nombre precio')
            .sort({ createdAt: -1 })
            .lean();
        console.log(`✅ Encontradas ${promociones.length} promociones`);
        return promociones;
    }
    async obtenerPromocionPorId(promocionId, locatarioId) {
        const promocion = await this.promocionModel
            .findOne({
            _id: promocionId,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
        })
            .populate('comidas.comidaId', 'nombre precio descripcion imagenUrl')
            .lean();
        if (!promocion) {
            throw new common_1.NotFoundException('Promoción no encontrada o no autorizada');
        }
        return promocion;
    }
    async obtenerPromocionesActivas(locatarioId) {
        const filtro = {
            activa: true,
            $or: [
                { fechaFin: { $gte: new Date() } },
                { fechaFin: null }
            ]
        };
        if (locatarioId) {
            filtro.locatarioId = new mongoose_2.Types.ObjectId(locatarioId);
        }
        const promociones = await this.promocionModel
            .find(filtro)
            .populate('comidas.comidaId', 'nombre precio')
            .sort({ createdAt: -1 })
            .lean();
        return promociones;
    }
    async actualizarPromocion(promocionId, dto, locatarioId) {
        console.log(`🔄 Actualizando promoción: ${promocionId}`);
        // Si se actualizan las comidas, validar que pertenezcan al locatario
        if (dto.comidas) {
            const comidasIds = dto.comidas.map(c => c.comidaId);
            const comidasExistentes = await this.comidaModel.find({
                _id: { $in: comidasIds },
                locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
            });
            if (comidasExistentes.length !== comidasIds.length) {
                throw new common_1.BadRequestException('Una o más comidas no pertenecen a tu local');
            }
            // Convertir IDs a ObjectId
            dto.comidas = dto.comidas.map(comida => ({
                ...comida,
                comidaId: new mongoose_2.Types.ObjectId(comida.comidaId)
            }));
        }
        const updateData = { ...dto };
        if (dto.fechaInicio)
            updateData.fechaInicio = new Date(dto.fechaInicio);
        if (dto.fechaFin)
            updateData.fechaFin = new Date(dto.fechaFin);
        const promocion = await this.promocionModel.findOneAndUpdate({
            _id: promocionId,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
        }, updateData, { new: true }).populate('comidas.comidaId', 'nombre precio');
        if (!promocion) {
            throw new common_1.NotFoundException('Promoción no encontrada o no autorizada');
        }
        console.log('✅ Promoción actualizada exitosamente');
        return promocion;
    }
    async eliminarPromocion(promocionId, locatarioId) {
        const result = await this.promocionModel.findOneAndDelete({
            _id: promocionId,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
        });
        if (!result) {
            throw new common_1.NotFoundException('Promoción no encontrada o no autorizada');
        }
        console.log('✅ Promoción eliminada exitosamente');
        return { success: true, message: 'Promoción eliminada correctamente' };
    }
    async toggleEstadoPromocion(promocionId, locatarioId) {
        const promocion = await this.promocionModel.findOne({
            _id: promocionId,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
        });
        if (!promocion) {
            throw new common_1.NotFoundException('Promoción no encontrada o no autorizada');
        }
        promocion.activa = !promocion.activa;
        await promocion.save();
        console.log(`✅ Promoción ${promocion.activa ? 'activada' : 'desactivada'}`);
        return promocion;
    }
    async obtenerEstadisticasPromociones(locatarioId) {
        const promociones = await this.promocionModel.find({
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId)
        });
        const totalPromociones = promociones.length;
        const promocionesActivas = promociones.filter(p => p.activa).length;
        const totalVendidas = promociones.reduce((sum, p) => sum + p.cantidadVendida, 0);
        const ingresosTotales = promociones.reduce((sum, p) => sum + (p.precio * p.cantidadVendida), 0);
        return {
            totalPromociones,
            promocionesActivas,
            totalVendidas,
            ingresosTotales,
            promocionMasVendida: promociones.sort((a, b) => b.cantidadVendida - a.cantidadVendida)[0] || null
        };
    }
};
exports.PromocionService = PromocionService;
exports.PromocionService = PromocionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(promocion_schema_1.Promocion.name)),
    __param(1, (0, mongoose_1.InjectModel)(comida_schema_1.Comida.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PromocionService);
