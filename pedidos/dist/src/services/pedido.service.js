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
exports.PedidoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
const pedido_schema_1 = require("../schemas/pedido.schema");
const carrito_schema_1 = require("../schemas/carrito.schema");
let PedidoService = class PedidoService {
    constructor(pedidoModel, carritoModel) {
        this.pedidoModel = pedidoModel;
        this.carritoModel = carritoModel;
    }
    async crearPedido(createPedidoDto) {
        // Validación de propina con tarjeta...
        const pedidoData = {
            ...createPedidoDto,
            idComprador: new mongoose_3.Types.ObjectId(createPedidoDto.idComprador),
            idLocal: new mongoose_3.Types.ObjectId(createPedidoDto.idLocal),
            idRepartidor: createPedidoDto.idRepartidor ? new mongoose_3.Types.ObjectId(createPedidoDto.idRepartidor) : undefined,
            estado: false,
            dealer: false,
            repartidor: null
        };
        const pedido = new this.pedidoModel(pedidoData);
        const pedidoGuardado = await pedido.save();
        // Elimina el carrito del usuario después de crear el pedido
        await this.carritoModel.deleteOne({ idComprador: pedidoData.idComprador });
        return pedidoGuardado;
    }
    async obtenerPedidos() {
        return this.pedidoModel.find().exec();
    }
    async obtenerPedidosPorUsuario(idComprador) {
        return this.pedidoModel.find({ idComprador: new mongoose_3.Types.ObjectId(idComprador) }).exec();
    }
};
exports.PedidoService = PedidoService;
exports.PedidoService = PedidoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pedido_schema_1.Pedido.name)),
    __param(1, (0, mongoose_1.InjectModel)(carrito_schema_1.Carrito.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PedidoService);
