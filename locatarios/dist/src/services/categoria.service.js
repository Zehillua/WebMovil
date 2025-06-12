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
exports.CategoriaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const categoria_schema_1 = require("../schemas/categoria.schema");
let CategoriaService = class CategoriaService {
    constructor(categoriaModel) {
        this.categoriaModel = categoriaModel;
    }
    async crearCategoria(dto) {
        const nueva = new this.categoriaModel(dto);
        return nueva.save();
    }
    async obtenerCategoriasPorLocatario(locatarioId) {
        return this.categoriaModel.find({ locatario: locatarioId }).exec();
    }
    async obtenerCategorias() {
        return this.categoriaModel.find().exec();
    }
};
exports.CategoriaService = CategoriaService;
exports.CategoriaService = CategoriaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(categoria_schema_1.Categoria.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoriaService);
