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
exports.CarritoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const carrito_schema_1 = require("../schemas/carrito.schema");
let CarritoService = class CarritoService {
    constructor(carritoModel) {
        this.carritoModel = carritoModel;
    }
    async agregarComidaAlCarrito(idComprador, dto) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const locatarioId = new mongoose_2.Types.ObjectId(dto.idLocatario);
        const item = {
            ...dto,
            idLocatario: locatarioId,
        };
        let carrito = await this.carritoModel.findOne({ idComprador: compradorId });
        if (!carrito) {
            carrito = new this.carritoModel({ idComprador: compradorId, items: [item] });
        }
        else {
            carrito.items.push(item);
        }
        return carrito.save();
    }
    async calcularTotalCarrito(idComprador) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
        if (!carrito || !carrito.items)
            return { total: 0 };
        const total = carrito.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        return { total };
    }
    async obtenerCarrito(idComprador) {
        const compradorId = new mongoose_2.Types.ObjectId(idComprador);
        const carrito = await this.carritoModel.findOne({ idComprador: compradorId }).lean();
        return carrito || { items: [] };
    }
    async eliminarItem(idComprador, itemId) {
        return this.carritoModel.updateOne({ idComprador: new mongoose_2.Types.ObjectId(idComprador) }, { $pull: { items: { _id: new mongoose_2.Types.ObjectId(itemId) } } });
    }
    async vaciarCarrito(idComprador) {
        return this.carritoModel.updateOne({ idComprador: new mongoose_2.Types.ObjectId(idComprador) }, { $set: { items: [] } });
    }
};
exports.CarritoService = CarritoService;
exports.CarritoService = CarritoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(carrito_schema_1.Carrito.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CarritoService);
