import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carga las variables de entorno desde el archivo .env
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27018/default_db'), // Valor predeterminado
  ],
})
export class AppModule {}