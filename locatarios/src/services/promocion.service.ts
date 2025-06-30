import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Promocion } from '../schemas/promocion.schema';
import { Comida } from '../schemas/comida.schema';
import { CrearPromocionDto, ActualizarPromocionDto } from '../dto/promocion.dto';

@Injectable()
export class PromocionService {
  constructor(
    @InjectModel(Promocion.name) private promocionModel: Model<Promocion>,
    @InjectModel(Comida.name) private comidaModel: Model<Comida>,
  ) {}

  async crearPromocion(locatarioId: string, dto: CrearPromocionDto) {
    console.log('🎉 Creando nueva promoción:', dto.nombre);

    // Validar que todas las comidas pertenezcan al locatario
    const comidasIds = dto.comidas.map(c => c.comidaId);
    const comidasExistentes = await this.comidaModel.find({
      _id: { $in: comidasIds },
      locatarioId: new Types.ObjectId(locatarioId)
    });

    if (comidasExistentes.length !== comidasIds.length) {
      throw new BadRequestException('Una o más comidas no pertenecen a tu local');
    }

    // Calcular precio total original para validación
    const precioOriginalTotal = dto.comidas.reduce((total, comida) => {
      return total + (comida.precioOriginal * comida.cantidad);
    }, 0);

    console.log(`💰 Precio original total: $${precioOriginalTotal}, Precio promoción: $${dto.precio}`);

    // Validar que el precio de promoción sea menor al original
    if (dto.precio >= precioOriginalTotal) {
      throw new BadRequestException('El precio de la promoción debe ser menor al precio original');
    }

    // Crear promoción
    const nuevaPromocion = new this.promocionModel({
      ...dto,
      locatarioId: new Types.ObjectId(locatarioId),
      comidas: dto.comidas.map(comida => ({
        ...comida,
        comidaId: new Types.ObjectId(comida.comidaId)
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

  async obtenerPromocionesPorLocatario(locatarioId: string) {
    console.log(`📋 Obteniendo promociones del locatario: ${locatarioId}`);
    
    const promociones = await this.promocionModel
      .find({ locatarioId: new Types.ObjectId(locatarioId) })
      .populate('comidas.comidaId', 'nombre precio')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Encontradas ${promociones.length} promociones`);
    return promociones;
  }

  async obtenerPromocionPorId(promocionId: string, locatarioId: string) {
    const promocion = await this.promocionModel
      .findOne({
        _id: promocionId,
        locatarioId: new Types.ObjectId(locatarioId)
      })
      .populate('comidas.comidaId', 'nombre precio descripcion imagenUrl')
      .lean();

    if (!promocion) {
      throw new NotFoundException('Promoción no encontrada o no autorizada');
    }

    return promocion;
  }

  async obtenerPromocionesActivas(locatarioId?: string) {
    const filtro: any = { 
      activa: true,
      $or: [
        { fechaFin: { $gte: new Date() } },
        { fechaFin: null }
      ]
    };

    if (locatarioId) {
      filtro.locatarioId = new Types.ObjectId(locatarioId);
    }

    const promociones = await this.promocionModel
      .find(filtro)
      .populate('comidas.comidaId', 'nombre precio')
      .sort({ createdAt: -1 })
      .lean();

    return promociones;
  }

  async actualizarPromocion(promocionId: string, dto: ActualizarPromocionDto, locatarioId: string) {
    console.log(`🔄 Actualizando promoción: ${promocionId}`);

    // Si se actualizan las comidas, validar que pertenezcan al locatario
    if (dto.comidas) {
      const comidasIds = dto.comidas.map(c => c.comidaId);
      const comidasExistentes = await this.comidaModel.find({
        _id: { $in: comidasIds },
        locatarioId: new Types.ObjectId(locatarioId)
      });

      if (comidasExistentes.length !== comidasIds.length) {
        throw new BadRequestException('Una o más comidas no pertenecen a tu local');
      }

      // Convertir IDs a ObjectId
      dto.comidas = dto.comidas.map(comida => ({
        ...comida,
        comidaId: new Types.ObjectId(comida.comidaId) as any
      }));
    }

    const updateData: any = { ...dto };
    if (dto.fechaInicio) updateData.fechaInicio = new Date(dto.fechaInicio);
    if (dto.fechaFin) updateData.fechaFin = new Date(dto.fechaFin);

    const promocion = await this.promocionModel.findOneAndUpdate(
      { 
        _id: promocionId, 
        locatarioId: new Types.ObjectId(locatarioId) 
      },
      updateData,
      { new: true }
    ).populate('comidas.comidaId', 'nombre precio');

    if (!promocion) {
      throw new NotFoundException('Promoción no encontrada o no autorizada');
    }

    console.log('✅ Promoción actualizada exitosamente');
    return promocion;
  }

  async eliminarPromocion(promocionId: string, locatarioId: string) {
    const result = await this.promocionModel.findOneAndDelete({
      _id: promocionId,
      locatarioId: new Types.ObjectId(locatarioId)
    });

    if (!result) {
      throw new NotFoundException('Promoción no encontrada o no autorizada');
    }

    console.log('✅ Promoción eliminada exitosamente');
    return { success: true, message: 'Promoción eliminada correctamente' };
  }

  async toggleEstadoPromocion(promocionId: string, locatarioId: string) {
    const promocion = await this.promocionModel.findOne({
      _id: promocionId,
      locatarioId: new Types.ObjectId(locatarioId)
    });

    if (!promocion) {
      throw new NotFoundException('Promoción no encontrada o no autorizada');
    }

    promocion.activa = !promocion.activa;
    await promocion.save();

    console.log(`✅ Promoción ${promocion.activa ? 'activada' : 'desactivada'}`);
    return promocion;
  }

  async obtenerEstadisticasPromociones(locatarioId: string) {
    const promociones = await this.promocionModel.find({
      locatarioId: new Types.ObjectId(locatarioId)
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
}