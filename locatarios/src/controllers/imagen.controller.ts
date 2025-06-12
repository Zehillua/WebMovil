import { Controller, Post, UploadedFile, UseInterceptors, Res, Get, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { MongoClient, ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';

const storage = new GridFsStorage({
  url: process.env.MONGO_URI || 'mongodb://localhost:27017/locatarios',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'uploads',
  }),
});

@Controller('imagenes')
export class ImagenController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file: any) {
    return { fileId: file.id, filename: file.filename };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const conn = await mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost:27017/locatarios');
    if (!conn.db) {
      res.status(500).send('No se pudo conectar a la base de datos');
      return;
    }
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
    const _id = new ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string, @Res() res: Response) {
    const conn = await mongoose.createConnection(process.env.MONGO_URI || 'mongodb://localhost:27017/locatarios');
    if (!conn.db) {
      res.status(500).send('No se pudo conectar a la base de datos');
      return;
    }
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
    const _id = new ObjectId(id);
    try {
      await bucket.delete(_id);
      res.status(200).send('Imagen eliminada correctamente');
    } catch (err) {
      res.status(500).send('Error al eliminar la imagen');
    }
  }
}
