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
exports.ImagenController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const mongodb_1 = require("mongodb");
const mongoose = __importStar(require("mongoose"));
const storage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/locatarios',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'uploads',
    }),
});
let ImagenController = class ImagenController {
    uploadFile(file) {
        return { fileId: file.id, filename: file.filename };
    }
    async getFile(id, res) {
        const conn = await mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost:27017/locatarios');
        if (!conn.db) {
            res.status(500).send('No se pudo conectar a la base de datos');
            return;
        }
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
        const _id = new mongodb_1.ObjectId(id);
        const downloadStream = bucket.openDownloadStream(_id);
        downloadStream.pipe(res);
    }
    async deleteFile(id, res) {
        const conn = await mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost:27017/locatarios');
        if (!conn.db) {
            res.status(500).send('No se pudo conectar a la base de datos');
            return;
        }
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
        const _id = new mongodb_1.ObjectId(id);
        try {
            await bucket.delete(_id);
            res.status(200).send('Imagen eliminada correctamente');
        }
        catch (err) {
            res.status(500).send('Error al eliminar la imagen');
        }
    }
};
exports.ImagenController = ImagenController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ImagenController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "getFile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImagenController.prototype, "deleteFile", null);
exports.ImagenController = ImagenController = __decorate([
    (0, common_1.Controller)('imagenes')
], ImagenController);
