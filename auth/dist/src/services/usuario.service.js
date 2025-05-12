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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usuario_schema_1 = require("../schemas/usuario.schema");
const bcrypt = __importStar(require("bcrypt"));
let UsuarioService = class UsuarioService {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
    }
    async crearUsuario(createUsuarioDto) {
        const hash = await bcrypt.hash(createUsuarioDto.contraseña, 10);
        let usuarioData = {
            ...createUsuarioDto,
            contraseña: hash,
        };
        if (createUsuarioDto.tipoUsuario === 'usuario') {
            usuarioData = {
                tipoUsuario: 'usuario',
                nombre: createUsuarioDto.nombre,
                apellido: createUsuarioDto.apellido,
                nombreUsuario: createUsuarioDto.nombreUsuario,
                correo: createUsuarioDto.correo,
                contraseña: hash,
                pais: createUsuarioDto.pais,
                ciudad: createUsuarioDto.ciudad,
                numeroTelefono: createUsuarioDto.numeroTelefono,
                numeroCasaDepto: createUsuarioDto.numeroCasaDepto,
            };
        }
        else if (createUsuarioDto.tipoUsuario === 'locatario') {
            usuarioData = {
                tipoUsuario: 'locatario',
                nombre: createUsuarioDto.nombre,
                apellido: createUsuarioDto.apellido,
                nombreLocal: createUsuarioDto.nombreLocal,
                correo: createUsuarioDto.correo,
                contraseña: hash,
                pais: createUsuarioDto.pais,
                ciudad: createUsuarioDto.ciudad,
                numeroTelefono: createUsuarioDto.numeroTelefono,
                numeroLocal: createUsuarioDto.numeroLocal,
                comidasStock: createUsuarioDto.comidasStock || [],
                ventas: createUsuarioDto.ventas || [],
            };
        }
        else if (createUsuarioDto.tipoUsuario === 'repartidor') {
            usuarioData = {
                tipoUsuario: 'repartidor',
                nombre: createUsuarioDto.nombre,
                apellido: createUsuarioDto.apellido,
                nombreUsuario: createUsuarioDto.nombreUsuario, // ahora requerido
                correo: createUsuarioDto.correo,
                contraseña: hash,
                pais: createUsuarioDto.pais,
                ciudad: createUsuarioDto.ciudad,
                numeroTelefono: createUsuarioDto.numeroTelefono,
                vehiculo: createUsuarioDto.vehiculo,
                patente: createUsuarioDto.patente,
            };
        }
        // Eliminar nombreUsuario si es null o undefined
        if (usuarioData.nombreUsuario === null || usuarioData.nombreUsuario === undefined) {
            delete usuarioData.nombreUsuario;
        }
        const usuario = new this.usuarioModel(usuarioData);
        return usuario.save();
    }
    async loginUsuario(loginDto) {
        const { nombreUsuario, correo, contraseña } = loginDto;
        let filtro = {};
        if (nombreUsuario) {
            filtro = { nombreUsuario };
        }
        else if (correo) {
            filtro = { correo };
        }
        else {
            throw new common_1.UnauthorizedException('Debe ingresar nombre de usuario o correo');
        }
        const usuario = await this.usuarioModel.findOne(filtro);
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const passwordOk = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!passwordOk) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        return usuario;
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsuarioService);
