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
exports.PedidoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = __importDefault(require("axios"));
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const mongoose_3 = require("mongoose");
const pedido_schema_1 = require("../schemas/pedido.schema");
const carrito_schema_1 = require("../schemas/carrito.schema");
let PedidoService = class PedidoService {
    constructor(pedidoModel, carritoModel) {
        this.pedidoModel = pedidoModel;
        this.carritoModel = carritoModel;
    }
    async crearPedido(createPedidoDto) {
        // 1. Obtener dirección del local
        let direccionLocal = '';
        try {
            const res = await axios_1.default.get(`http://localhost:3000/locatarios/${createPedidoDto.idLocal}`);
            const dir = res.data.direccion;
            direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
        }
        catch (e) {
            direccionLocal = '';
        }
        // 2. Si es delivery, guardar dirección de entrega del usuario
        let direccionEntrega = '';
        if (createPedidoDto.esDelivery) {
            const dir = createPedidoDto.direccionEntrega;
            direccionEntrega = Array.isArray(dir) ? dir.join(', ') : (dir || '');
        }
        // 3. Crear el pedido con todos los datos
        const pedidoData = {
            ...createPedidoDto,
            idComprador: new mongoose_3.Types.ObjectId(createPedidoDto.idComprador),
            idLocal: new mongoose_3.Types.ObjectId(createPedidoDto.idLocal),
            idRepartidor: createPedidoDto.idRepartidor ? new mongoose_3.Types.ObjectId(createPedidoDto.idRepartidor) : undefined,
            estado: false,
            dealer: false,
            repartidor: null,
            direccionLocal,
            direccionEntrega,
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
        return this.pedidoModel
            .find({ idComprador: new mongoose_3.Types.ObjectId(idComprador) })
            .lean()
            .exec();
    }
    async obtenerPedidosPorLocal(idLocal) {
        return this.pedidoModel
            .find({ idLocal: new mongoose_3.Types.ObjectId(idLocal) })
            .lean()
            .exec();
    }
    async obtenerPedidosDeliveryDisponibles() {
        return this.pedidoModel
            .find({
            esDelivery: true,
            estado: true,
            listo: true,
            dealer: false
        })
            .lean()
            .exec();
    }
    async actualizarEstado(id, estado) {
        return this.pedidoModel.findByIdAndUpdate(id, { estado }, { new: true });
    }
    async rechazarPedido(id) {
        return this.pedidoModel.findByIdAndUpdate(id, {
            estadoRechazado: true,
            fechaRechazo: new Date()
        }, { new: true });
    }
    // Método para eliminar un pedido específico
    async eliminarPedido(id) {
        return this.pedidoModel.findByIdAndDelete(id);
    }
    // Tarea programada que se ejecuta cada 10 segundos para eliminar pedidos rechazados antiguos
    async eliminarPedidosRechazadosAntiguos() {
        const fechaLimite = new Date();
        fechaLimite.setSeconds(fechaLimite.getSeconds() - 30); // 30 segundos atrás
        const resultado = await this.pedidoModel.deleteMany({
            estadoRechazado: true,
            fechaRechazo: { $lt: fechaLimite }
        });
        if (resultado.deletedCount > 0) {
            console.log(`Eliminados ${resultado.deletedCount} pedidos rechazados antiguos (más de 30 segundos)`);
        }
    }
    async marcarListo(id) {
        return this.pedidoModel.findByIdAndUpdate(id, { listo: true }, { new: true });
    }
    async aceptarPorRepartidor(id, idRepartidor) {
        return this.pedidoModel.findByIdAndUpdate(id, {
            dealer: true,
            repartidor: new mongoose_3.Types.ObjectId(idRepartidor)
        }, { new: true });
    }
    async marcarEnCamino(id) {
        return this.pedidoModel.findByIdAndUpdate(id, { enCamino: true }, { new: true });
    }
    async marcarEntregado(id) {
        return this.pedidoModel.findByIdAndUpdate(id, { pedidoEntregado: true }, { new: true });
    }
};
exports.PedidoService = PedidoService;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *') // Cada 10 segundos (formato: segundos minutos horas día mes año)
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PedidoService.prototype, "eliminarPedidosRechazadosAntiguos", null);
exports.PedidoService = PedidoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pedido_schema_1.Pedido.name)),
    __param(1, (0, mongoose_1.InjectModel)(carrito_schema_1.Carrito.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PedidoService);
