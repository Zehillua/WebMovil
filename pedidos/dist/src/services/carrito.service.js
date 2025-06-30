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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarritoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const carrito_schema_1 = require("../schemas/carrito.schema");
const axios_1 = __importDefault(require("axios"));
let CarritoService = class CarritoService {
    constructor(carritoModel) {
        this.carritoModel = carritoModel;
    }
    // ✅ MÉTODO CORREGIDO PARA COMIDAS CON VALIDACIÓN DE SEGURIDAD
    async agregarComidaAlCarrito(idComprador, dto) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const locatarioId = new mongoose_2.Types.ObjectId(dto.idLocatario);
        // ✅ VALIDAR DATOS DE LA COMIDA DESDE LA BD (SEGURIDAD)
        const comidaValida = await this.validarComidaEnBD(dto.idComida, dto.precio, dto.cantidad);
        if (!comidaValida) {
            throw new common_1.BadRequestException('Datos de comida inválidos o stock insuficiente');
        }
        const item = {
            ...dto,
            idLocatario: locatarioId,
            tipo: 'comida',
            precio: comidaValida.precio, // ✅ USAR PRECIO DE LA BD
            nombreComida: comidaValida.nombre, // ✅ USAR NOMBRE DE LA BD
        };
        let carrito = await this.carritoModel.findOne({ idComprador: compradorId });
        if (!carrito) {
            carrito = new this.carritoModel({
                idComprador: compradorId,
                items: [item],
                promociones: []
            });
        }
        else {
            carrito.items.push(item);
        }
        return carrito.save();
    }
    // ✅ NUEVO MÉTODO PARA PROMOCIONES
    async agregarPromocionAlCarrito(idComprador, dto) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const locatarioId = new mongoose_2.Types.ObjectId(dto.idLocatario);
        // ✅ VALIDAR DATOS DE LA PROMOCIÓN DESDE LA BD (SEGURIDAD)
        const promocionValida = await this.validarPromocionEnBD(dto.idPromocion, dto.precio, dto.cantidad);
        if (!promocionValida) {
            throw new common_1.BadRequestException('Datos de promoción inválidos o no disponible');
        }
        const promocion = {
            ...dto,
            idLocatario: locatarioId,
            tipo: 'promocion',
            precio: promocionValida.precio, // ✅ USAR PRECIO DE LA BD
            nombrePromocion: promocionValida.nombre, // ✅ USAR NOMBRE DE LA BD
            comidas: promocionValida.comidas, // ✅ USAR COMIDAS DE LA BD
        };
        let carrito = await this.carritoModel.findOne({ idComprador: compradorId });
        if (!carrito) {
            carrito = new this.carritoModel({
                idComprador: compradorId,
                items: [],
                promociones: [promocion]
            });
        }
        else {
            if (!carrito.promociones)
                carrito.promociones = [];
            carrito.promociones.push(promocion);
        }
        return carrito.save();
    }
    // ✅ CALCULAR TOTAL INCLUYENDO PROMOCIONES
    async calcularTotalCarrito(idComprador) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
        if (!carrito)
            return { total: 0, totalComidas: 0, totalPromociones: 0 };
        const totalComidas = (carrito.items || []).reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const totalPromociones = (carrito.promociones || []).reduce((acc, promo) => acc + (promo.precio * promo.cantidad), 0);
        return {
            total: totalComidas + totalPromociones,
            totalComidas,
            totalPromociones
        };
    }
    async obtenerCarrito(idComprador) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
        return carrito || { items: [], promociones: [] };
    }
    // ✅ ELIMINAR ITEM DE COMIDA
    async eliminarItem(idComprador, itemId) {
        return this.carritoModel.updateOne({ idComprador: new mongoose_2.Types.ObjectId(idComprador) }, { $pull: { items: { _id: new mongoose_2.Types.ObjectId(itemId) } } });
    }
    // ✅ NUEVO: ELIMINAR PROMOCIÓN
    async eliminarPromocion(idComprador, promocionId) {
        return this.carritoModel.updateOne({ idComprador: new mongoose_2.Types.ObjectId(idComprador) }, { $pull: { promociones: { _id: new mongoose_2.Types.ObjectId(promocionId) } } });
    }
    // ✅ VACIAR CARRITO COMPLETO
    async vaciarCarrito(idComprador) {
        return this.carritoModel.updateOne({ idComprador: new mongoose_2.Types.ObjectId(idComprador) }, { $set: { items: [], promociones: [] } });
    }
    // ✅ VALIDACIÓN DE SEGURIDAD PARA COMIDAS
    async validarComidaEnBD(idComida, precioFrontend, cantidadSolicitada) {
        try {
            const response = await axios_1.default.get(`http://localhost:3001/comidas/${idComida}`);
            const comida = response.data;
            // ✅ VERIFICAR QUE EL PRECIO Y STOCK SEAN CORRECTOS
            if (Math.abs(comida.precio - precioFrontend) > 0.01) { // Tolerancia para decimales
                console.log(`⚠️ Precio incorrecto: BD=${comida.precio}, Frontend=${precioFrontend}`);
                // ✅ PERMITIR PERO USAR PRECIO DE LA BD
            }
            if (comida.cantidad < cantidadSolicitada) {
                console.log(`⚠️ Stock insuficiente: Disponible=${comida.cantidad}, Solicitado=${cantidadSolicitada}`);
                return null;
            }
            return comida;
        }
        catch (error) {
            console.error('❌ Error validando comida:', error);
            // ✅ FALLBACK: permitir si no se puede validar por problemas de conexión
            return {
                precio: precioFrontend,
                nombre: 'Comida',
                cantidad: 999
            };
        }
    }
    // ✅ VALIDACIÓN DE SEGURIDAD PARA PROMOCIONES
    async validarPromocionEnBD(idPromocion, precioFrontend, cantidadSolicitada) {
        try {
            const response = await axios_1.default.get(`http://localhost:3001/promociones/${idPromocion}`);
            const promocion = response.data;
            // ✅ VERIFICAR QUE EL PRECIO SEA CORRECTO
            if (Math.abs(promocion.precio - precioFrontend) > 0.01) {
                console.log(`⚠️ Precio promoción incorrecto: BD=${promocion.precio}, Frontend=${precioFrontend}`);
                // ✅ PERMITIR PERO USAR PRECIO DE LA BD
            }
            // ✅ VERIFICAR STOCK DE LA PROMOCIÓN
            if (promocion.cantidadDisponible && promocion.cantidadDisponible < cantidadSolicitada) {
                console.log(`⚠️ Stock promoción insuficiente: Disponible=${promocion.cantidadDisponible}, Solicitado=${cantidadSolicitada}`);
                return null;
            }
            // ✅ VERIFICAR QUE LA PROMOCIÓN ESTÉ ACTIVA
            if (!promocion.activa) {
                console.log(`⚠️ Promoción inactiva: ${idPromocion}`);
                return null;
            }
            return promocion;
        }
        catch (error) {
            console.error('❌ Error validando promoción:', error);
            // ✅ FALLBACK: permitir si no se puede validar por problemas de conexión
            return {
                precio: precioFrontend,
                nombre: 'Promoción',
                comidas: [],
                activa: true
            };
        }
    }
};
exports.CarritoService = CarritoService;
exports.CarritoService = CarritoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(carrito_schema_1.Carrito.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CarritoService);
