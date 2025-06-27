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
            direccionLocal, // <-- SIEMPRE guarda la dirección del local
            direccionEntrega, // <-- Si es delivery, guarda la dirección de entrega
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
        const pedidos = await this.pedidoModel
            .find({ idComprador: new mongoose_3.Types.ObjectId(idComprador) })
            .exec();
        // Por cada pedido, consulta el microservicio de auth/locatarios
        const pedidosConLocal = await Promise.all(pedidos.map(async (pedido) => {
            let nombreLocal = '';
            let direccionLocal = '';
            try {
                const res = await axios_1.default.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
                nombreLocal = res.data.nombreLocal || '';
                direccionLocal = res.data.direccion || '';
            }
            catch (e) {
                // Si falla, deja vacío
            }
            return {
                ...pedido.toObject(),
                nombreLocal,
                direccionLocal,
            };
        }));
        return pedidosConLocal;
    }
    async obtenerPedidosPorLocal(idLocal) {
        const pedidos = await this.pedidoModel
            .find({ idLocal: new mongoose_3.Types.ObjectId(idLocal) })
            .exec();
        // Si quieres agregar nombreLocal y direccionLocal desde el microservicio de locales:
        const pedidosConLocal = await Promise.all(pedidos.map(async (pedido) => {
            let nombreLocal = '';
            let direccionLocal = '';
            try {
                const res = await axios_1.default.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
                nombreLocal = res.data.nombreLocal || '';
                const dir = res.data.direccion;
                direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
            }
            catch (e) {
                // Si falla, deja vacío
            }
            return {
                ...pedido.toObject(),
                nombreLocal,
                direccionLocal,
            };
        }));
        return pedidosConLocal;
    }
    async actualizarEstado(id, estado) {
        return this.pedidoModel.findByIdAndUpdate(id, { estado }, { new: true });
    }
    async rechazarPedido(id) {
        return this.pedidoModel.findByIdAndUpdate(id, { estadoRechazado: true }, { new: true });
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
