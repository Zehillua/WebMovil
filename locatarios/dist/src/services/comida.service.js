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
exports.ComidaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comida_schema_1 = require("../schemas/comida.schema");
let ComidaService = class ComidaService {
    constructor(comidaModel) {
        this.comidaModel = comidaModel;
    }
    async crearComida(locatarioId, dto) {
        const nuevaComida = new this.comidaModel({
            ...dto,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId),
        });
        return nuevaComida.save();
    }
    async obtenerComidasPorLocatario(locatarioId) {
        return this.comidaModel.find({ locatarioId: new mongoose_2.Types.ObjectId(locatarioId) });
    }
    async obtenerComidaPorId(comidaId, locatarioId) {
        const comida = await this.comidaModel.findOne({
            _id: comidaId,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId),
        });
        if (!comida)
            throw new common_1.NotFoundException('Comida no encontrada o no autorizada');
        return comida;
    }
    async actualizarComida(comidaId, dto, locatarioId) {
        const comida = await this.comidaModel.findOneAndUpdate({ _id: comidaId, locatarioId: new mongoose_2.Types.ObjectId(locatarioId) }, dto, { new: true });
        if (!comida)
            throw new common_1.NotFoundException('Comida no encontrada o no autorizada');
        return comida;
    }
    async eliminarComida(comidaId, locatarioId) {
        const result = await this.comidaModel.findOneAndDelete({
            _id: comidaId,
            locatarioId: new mongoose_2.Types.ObjectId(locatarioId),
        });
        if (!result)
            throw new common_1.NotFoundException('Comida no encontrada o no autorizada');
        return { success: true };
    }
};
exports.ComidaService = ComidaService;
exports.ComidaService = ComidaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comida_schema_1.Comida.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ComidaService);
