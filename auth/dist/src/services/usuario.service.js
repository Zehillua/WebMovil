"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usuario_schema_1 = require("../schemas/usuario.schema");
const axios_1 = __importDefault(require("axios"));
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let UsuarioService = class UsuarioService {
    constructor(usuarioModel, jwtService) {
        this.usuarioModel = usuarioModel;
        this.jwtService = jwtService;
    }
    async crearUsuario(createUsuarioDto) {
        const hash = await bcrypt.hash(createUsuarioDto.clave, 10);
        const direccionArray = createUsuarioDto.direccion
            ? [createUsuarioDto.direccion]
            : [];
        let usuarioData = {
            ...createUsuarioDto,
            clave: hash,
            isAdmin: !!createUsuarioDto.isAdmin,
            cartera: createUsuarioDto.cartera ?? 0,
            direccion: direccionArray,
        };
        if (createUsuarioDto.tipoUsuario === 'usuario') {
            usuarioData = {
                tipoUsuario: 'usuario',
                nombre: createUsuarioDto.nombre,
                apellido: createUsuarioDto.apellido,
                correo: createUsuarioDto.correo,
                clave: hash,
                direccion: createUsuarioDto.direccion,
                telefono: createUsuarioDto.telefono,
                nombreUsuario: createUsuarioDto.nombreUsuario,
                numeroCasaDepto: createUsuarioDto.numeroCasaDepto,
                cartera: createUsuarioDto.cartera ?? 0,
            };
        }
        else if (createUsuarioDto.tipoUsuario === 'locatario') {
            const dto = createUsuarioDto;
            usuarioData = {
                tipoUsuario: 'locatario',
                nombre: dto.nombre,
                apellido: dto.apellido,
                nombreUsuario: dto.nombreUsuario,
                correo: dto.correo,
                clave: hash,
                direccion: dto.direccion,
                telefono: dto.telefono,
                nombreLocal: dto.nombreLocal,
                numeroLocal: dto.numeroLocal,
                comidasStock: dto.comidasStock ?? [],
                ventas: dto.ventas ?? [],
                ventasPromo: dto.ventasPromo ?? [],
                valoracion: dto.valoracion ?? 0,
                // agrega aquí cualquier otro campo que uses en locatarios
            };
        }
        else if (createUsuarioDto.tipoUsuario === 'repartidor') {
            const dto = createUsuarioDto;
            usuarioData = {
                tipoUsuario: 'repartidor',
                nombre: dto.nombre,
                apellido: dto.apellido,
                correo: dto.correo,
                clave: hash,
                direccion: dto.direccion,
                telefono: dto.telefono,
                usuarioRepartidor: dto.usuarioRepartidor,
                vehiculo: dto.vehiculo,
                patente: dto.patente,
                valoracionRepartidor: dto.valoracionRepartidor ?? 0,
                // agrega aquí cualquier otro campo que uses en repartidores
            };
        }
        if (usuarioData.nombreUsuario === null || usuarioData.nombreUsuario === undefined) {
            delete usuarioData.nombreUsuario;
        }
        try {
            const usuario = new this.usuarioModel(usuarioData);
            const savedUser = await usuario.save();
            // Sincronizar con microservicio locatarios
            if (savedUser.tipoUsuario === 'locatario') {
                try {
                    await axios_1.default.post('http://localhost:3001/locatarios/sync', {
                        _id: savedUser._id,
                        ...usuarioData, // envía todos los campos del locatario
                    });
                }
                catch (err) {
                    console.error('Error sincronizando locatario:', err.message);
                }
            }
            // Sincronizar con microservicio repartidores
            if (savedUser.tipoUsuario === 'repartidor') {
                try {
                    await axios_1.default.post('http://localhost:3002/repartidores/sync', {
                        _id: savedUser._id,
                        ...usuarioData, // envía todos los campos del repartidor
                    });
                }
                catch (err) {
                    console.error('Error sincronizando repartidor:', err.message);
                }
            }
            return savedUser;
        }
        catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.correo) {
                throw new common_1.BadRequestException('El correo ya está registrado');
            }
            throw error;
        }
    }
    async loginUsuario(loginDto) {
        const { correo, clave } = loginDto;
        if (!correo) {
            throw new common_1.UnauthorizedException('Debe ingresar correo electrónico');
        }
        const usuario = await this.usuarioModel.findOne({ correo });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const passwordOk = await bcrypt.compare(clave, usuario.clave);
        if (!passwordOk) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = { sub: usuario._id, correo: usuario.correo, tipoUsuario: usuario.tipoUsuario };
        const access_token = this.jwtService.sign(payload);
        return { access_token, tipoUsuario: usuario.tipoUsuario };
    }
    async obtenerSaldo(userId) {
        const usuario = await this.usuarioModel.findById(userId);
        if (!usuario)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        return usuario.cartera ?? 0;
    }
    async recargarSaldo(userId, monto) {
        const usuario = await this.usuarioModel.findById(userId);
        if (!usuario)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        usuario.cartera = (usuario.cartera ?? 0) + monto;
        await usuario.save();
        return usuario.cartera;
    }
    async obtenerDireccion(userId) {
        const usuario = await this.usuarioModel.findById(userId);
        if (!usuario)
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        return usuario.direccion;
    }
    async findById(id) {
        return this.usuarioModel.findById(id);
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], UsuarioService);
