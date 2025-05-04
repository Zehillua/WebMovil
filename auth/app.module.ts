import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './src/schemas/test.schema';
import { TestService } from './src/services/test.service';
import { TestController } from './src/controllers/test.controller';
import { TestModule } from './src/modules/test.module'; // Importación del módulo de Test
import { TestControllerr } from './src/controllers/prueba.controller';

@Module({
  imports: [
    // Conexión a la base de datos (URI ajustada a tu caso)
    MongooseModule.forRoot('mongodb://db_auth:27017/auth'),

    // Registro del módulo de Test
    TestModule,

    // Registro del schema (si aún quieres mantenerlo aquí)
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestController, TestControllerr], // Puedes quitar esto si el controlador ya está registrado en TestModule
  providers: [TestService], // Puedes quitar esto si el servicio ya está registrado en TestModule
})
export class AppModule {}