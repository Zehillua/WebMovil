import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './src/schemas/test.schema';
import { TestService } from './src/services/test.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestController } from './src/controllers/test.controller';
import { TestModule } from './src/modules/test.module'; 
import { TestControllerr } from './src/controllers/prueba.controller';
import { CategoriaModule } from './src/modules/categoria.module';
import { ProductoModule } from './src/modules/producto.module';
import { ImagenController } from './src/controllers/imagen.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Hace que las variables estén disponibles globalmente
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),  // Obtener la URI desde la variable de entorno
      }),
      inject: [ConfigService],  // Inyecta el servicio de configuración
    }),
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    CategoriaModule,
    ProductoModule,
  ],
  controllers: [TestController, TestControllerr, ImagenController], 
  providers: [TestService], 
})
export class AppModule {}