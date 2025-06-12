import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './src/schemas/test.schema';
import { TestService } from './src/services/test.service';
import { TestController } from './src/controllers/test.controller';

@Module({
  imports: [
    // Conexión a la base de datos usando variable de entorno
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pagos'),

    // Registro del schema
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class AppModule {}
