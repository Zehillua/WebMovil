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
            fechaPedido: new Date(), // ✅ ASEGURAR FECHA ACTUAL
        };
        const pedido = new this.pedidoModel(pedidoData);
        const pedidoGuardado = await pedido.save();
        await this.carritoModel.deleteOne({ idComprador: pedidoData.idComprador });
        return pedidoGuardado;
    }
    async obtenerPedidos() {
        return this.pedidoModel.find().exec();
    }
    async obtenerPedidosPorUsuario(idComprador) {
        const pedidos = await this.pedidoModel
            .find({ idComprador: new mongoose_3.Types.ObjectId(idComprador) })
            .lean()
            .exec();
        return pedidos.map(pedido => ({
            ...pedido,
            fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
            fechaRechazo: pedido.fechaRechazo ? new Date(pedido.fechaRechazo).toISOString() : undefined
        }));
    }
    async obtenerPedidosPorLocal(idLocal) {
        return this.pedidoModel
            .find({ idLocal: new mongoose_3.Types.ObjectId(idLocal) })
            .lean()
            .exec();
    }
    async obtenerPedidosDeliveryBasicos() {
        return this.pedidoModel
            .find({
            esDelivery: true,
            estado: true, // Aceptado por el local
            dealer: false // No tomado por repartidor aún
        })
            .lean()
            .exec();
    }
    // MANTENER el método existente para REST:
    async obtenerPedidosDeliveryDisponibles() {
        const pedidos = await this.pedidoModel
            .find({
            esDelivery: true,
            estado: true, // Aceptado por el local
            dealer: false // No tomado por repartidor aún
        })
            .lean()
            .exec();
        // Obtener datos adicionales del local y usuario
        const pedidosConDatos = await Promise.all(pedidos.map(async (pedido) => {
            let nombreLocal = '';
            let direccionLocal = '';
            let nombreUsuario = '';
            try {
                // Obtener datos del local
                const resLocal = await axios_1.default.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
                nombreLocal = resLocal.data.nombreLocal || '';
                const dir = resLocal.data.direccion;
                direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
            }
            catch (e) {
                console.error('Error obteniendo datos del local:', e);
            }
            try {
                // Obtener datos del usuario
                const resUsuario = await axios_1.default.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
                nombreUsuario = resUsuario.data.nombreUsuario || `${resUsuario.data.nombre} ${resUsuario.data.apellido}`;
            }
            catch (e) {
                console.error('Error obteniendo datos del usuario:', e);
            }
            return {
                ...pedido,
                nombreLocal,
                direccionLocal,
                nombreUsuario,
            };
        }));
        return pedidosConDatos;
    }
    async obtenerPedidosDeliveryParaGraphQL() {
        console.log('🔍 Buscando pedidos con filtros:');
        console.log('- esDelivery: true');
        console.log('- estado: true (aceptado por local)');
        console.log('- listo: true (preparado)');
        console.log('- dealer: false (no tomado por repartidor)');
        const pedidos = await this.pedidoModel
            .find({
            esDelivery: true,
            estado: true, // ✅ ACEPTADO por el local
            dealer: false // ✅ NO tomado por repartidor aún
        })
            .lean()
            .exec();
        console.log(`📦 Encontrados ${pedidos.length} pedidos que cumplen criterios`);
        return pedidos;
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
    // ACTUALIZAR método marcarEnCamino para generar código:
    async marcarEnCamino(id) {
        // Generar código aleatorio de 4 dígitos
        const codigoPedido = Math.floor(1000 + Math.random() * 9000);
        console.log(`🚚 Generando código ${codigoPedido} para pedido ${id}`);
        return this.pedidoModel.findByIdAndUpdate(id, {
            enCamino: true,
            codigoPedido: codigoPedido // ✅ GUARDAR CÓDIGO
        }, { new: true });
    }
    async marcarEntregado(id) {
        return this.pedidoModel.findByIdAndUpdate(id, { pedidoEntregado: true }, { new: true });
    }
    // NUEVO MÉTODO - Obtener pedidos pendientes de un repartidor específico
    async obtenerPedidosPendientesRepartidor(idRepartidor) {
        console.log(`🚚 Buscando pedidos pendientes para repartidor: ${idRepartidor}`);
        const pedidos = await this.pedidoModel
            .find({
            dealer: true, // Tomado por repartidor
            repartidor: new mongoose_3.Types.ObjectId(idRepartidor), // ID del repartidor específico
            enCamino: false, // AÚN NO está en camino
            pedidoEntregado: false // AÚN NO entregado
        })
            .lean()
            .exec();
        console.log(`📦 Encontrados ${pedidos.length} pedidos pendientes para el repartidor`);
        // Obtener datos adicionales del local y usuario
        const pedidosConDatos = await Promise.all(pedidos.map(async (pedido) => {
            let nombreLocal = '';
            let direccionLocal = '';
            let nombreUsuario = '';
            let direccionUsuario = '';
            try {
                // Obtener datos del local
                const resLocal = await axios_1.default.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
                nombreLocal = resLocal.data.nombreLocal || '';
                const dir = resLocal.data.direccion;
                direccionLocal = Array.isArray(dir) ? dir.join(', ') : (dir || '');
            }
            catch (e) {
                console.error('Error obteniendo datos del local:', e);
            }
            try {
                // Obtener datos del usuario
                const resUsuario = await axios_1.default.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
                nombreUsuario = resUsuario.data.nombreUsuario || `${resUsuario.data.nombre} ${resUsuario.data.apellido}`;
                const dirUsuario = resUsuario.data.direccion;
                direccionUsuario = Array.isArray(dirUsuario) ? dirUsuario.join(', ') : (dirUsuario || '');
            }
            catch (e) {
                console.error('Error obteniendo datos del usuario:', e);
            }
            return {
                ...pedido,
                nombreLocal,
                direccionLocal,
                nombreUsuario,
                direccionUsuario,
            };
        }));
        return pedidosConDatos;
    }
    async obtenerPedidosPendientesRepartidorGraphQL(idRepartidor) {
        console.log(`🚚 GraphQL: Buscando pedidos pendientes para repartidor: ${idRepartidor}`);
        const pedidos = await this.pedidoModel
            .find({
            dealer: true, // Tomado por repartidor
            repartidor: new mongoose_3.Types.ObjectId(idRepartidor), // ID del repartidor específico
            enCamino: false, // AÚN NO está en camino
            pedidoEntregado: false // AÚN NO entregado
        })
            .lean()
            .exec();
        console.log(`📦 GraphQL: Encontrados ${pedidos.length} pedidos pendientes`);
        // NO hacer queries adicionales aquí - los resolvers se encargan
        return pedidos;
    }
    // NUEVO MÉTODO - Obtener pedidos en camino del repartidor:
    async obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor) {
        console.log(`🚚 GraphQL: Buscando pedidos en camino para repartidor: ${idRepartidor}`);
        const pedidos = await this.pedidoModel
            .find({
            dealer: true, // Tomado por repartidor
            repartidor: new mongoose_3.Types.ObjectId(idRepartidor), // ID del repartidor específico
            enCamino: true, // ✅ YA está en camino
            pedidoEntregado: false // ✅ AÚN NO entregado
        })
            .lean()
            .exec();
        console.log(`📦 GraphQL: Encontrados ${pedidos.length} pedidos en camino`);
        return pedidos;
    }
    // NUEVO MÉTODO - Entregar pedido con código:
    async entregarPedido(id, codigoIngresado) {
        // 1. Obtener el pedido
        const pedido = await this.pedidoModel.findById(id).lean().exec();
        if (!pedido) {
            throw new common_1.BadRequestException('Pedido no encontrado');
        }
        // 2. Verificar código
        if (pedido.codigoPedido !== codigoIngresado) {
            throw new common_1.BadRequestException('Código incorrecto');
        }
        // 3. Marcar como entregado
        const pedidoEntregado = await this.pedidoModel.findByIdAndUpdate(id, {
            pedidoEntregado: true,
            fechaEntrega: new Date()
        }, { new: true }).lean().exec();
        // 4. Guardar en múltiples bases de datos
        await this.guardarPedidoEnMultiplesBD(pedidoEntregado);
        return pedidoEntregado;
    }
    // MÉTODO PRIVADO - Guardar en múltiples bases de datos:
    async guardarPedidoEnMultiplesBD(pedido) {
        console.log('💾 Guardando pedido entregado en múltiples bases de datos...');
        try {
            // Obtener datos adicionales
            const [datosUsuario, datosLocal, datosRepartidor] = await Promise.all([
                this.obtenerDatosUsuario(pedido.idComprador),
                this.obtenerDatosLocal(pedido.idLocal),
                this.obtenerDatosRepartidor(pedido.repartidor)
            ]);
            // Preparar datos completos
            const pedidoCompleto = {
                ...pedido,
                fechaEntrega: new Date(),
                usuario: datosUsuario,
                local: datosLocal,
                repartidor: datosRepartidor
            };
            // 1. Guardar en reportes (puerto 3004)
            await this.guardarEnReportes(pedidoCompleto);
            // 2. Guardar en locatarios/ventas (puerto 3001)
            await this.guardarEnVentas(pedidoCompleto);
            // 3. Guardar en repartidores/entregas (puerto 3003)
            await this.guardarEnEntregas(pedidoCompleto);
            console.log('✅ Pedido guardado exitosamente en todas las bases de datos');
        }
        catch (error) {
            console.error('❌ Error guardando en múltiples BD:', error);
            // No fallar la entrega por errores de guardado
        }
    }
    async obtenerDatosUsuario(idUsuario) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/usuarios/${idUsuario}`);
            return res.data;
        }
        catch (e) {
            return { nombre: 'Usuario no disponible', _id: idUsuario };
        }
    }
    async obtenerDatosLocal(idLocal) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/locatarios/${idLocal}`);
            return res.data;
        }
        catch (e) {
            return { nombreLocal: 'Local no disponible', _id: idLocal };
        }
    }
    async obtenerDatosRepartidor(idRepartidor) {
        try {
            const res = await axios_1.default.get(`http://localhost:3000/usuarios/${idRepartidor}`);
            return res.data;
        }
        catch (e) {
            return { nombreUsuario: 'Repartidor no disponible', _id: idRepartidor };
        }
    }
    async guardarEnReportes(pedido) {
        try {
            await axios_1.default.post('http://localhost:3004/stats/pedido-realizado', {
                pedidoId: pedido._id,
                nombrePedido: pedido.nombrePedido,
                precio: pedido.precioPedido,
                fechaEntrega: pedido.fechaEntrega,
                usuario: {
                    id: pedido.usuario._id,
                    nombre: pedido.usuario.nombre,
                    apellido: pedido.usuario.apellido
                },
                local: {
                    id: pedido.local._id,
                    nombreLocal: pedido.local.nombreLocal
                },
                repartidor: {
                    id: pedido.repartidor._id,
                    nombre: pedido.repartidor.nombreUsuario
                },
                comidas: pedido.comidas,
                propina: pedido.cantidadPropina || 0
            });
            console.log('✅ Guardado en reportes (3004)');
        }
        catch (e) {
            console.error('❌ Error guardando en reportes:', e instanceof Error ? e.message : e);
        }
    }
    async guardarEnVentas(pedido) {
        try {
            await axios_1.default.post('http://localhost:3001/locatarios/venta', {
                localId: pedido.local._id,
                pedidoId: pedido._id,
                nombrePedido: pedido.nombrePedido,
                precio: pedido.precioPedido,
                fechaVenta: pedido.fechaEntrega,
                cliente: {
                    id: pedido.usuario._id,
                    nombre: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`
                },
                comidas: pedido.comidas,
                esDelivery: pedido.esDelivery,
                propina: pedido.cantidadPropina || 0
            });
            console.log('✅ Guardado en ventas locatarios (3001)');
        }
        catch (e) {
            console.error('❌ Error guardando en ventas:', e instanceof Error ? e.message : e);
        }
    }
    async guardarEnEntregas(pedido) {
        try {
            await axios_1.default.post('http://localhost:3003/repartidores/entrega', {
                repartidorId: pedido.repartidor._id,
                pedidoId: pedido._id,
                nombrePedido: pedido.nombrePedido,
                valorEntrega: pedido.precioPedido,
                propina: pedido.cantidadPropina || 0,
                fechaEntrega: pedido.fechaEntrega,
                cliente: {
                    id: pedido.usuario._id,
                    nombre: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,
                    direccion: pedido.direccionEntrega
                },
                local: {
                    id: pedido.local._id,
                    nombreLocal: pedido.local.nombreLocal,
                    direccion: pedido.direccionLocal
                },
                distancia: 'No calculada', // TODO: calcular distancia real
                tiempoEntrega: 'No calculado' // TODO: calcular tiempo real
            });
            console.log('✅ Guardado en entregas repartidores (3003)');
        }
        catch (e) {
            console.error('❌ Error guardando en entregas:', e instanceof Error ? e.message : e);
        }
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
