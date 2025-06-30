import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './src/strategies/jwt.strategy';
import { Comida, ComidaSchema } from './src/schemas/comida.schema';
import { Promocion, PromocionSchema } from './src/schemas/promocion.schema';
import { ComidaService } from './src/services/comida.service';
import { PromocionService } from './src/services/promocion.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ComidaController } from './src/controllers/comidas.controller';
import { PromocionesController } from './src/controllers/promociones.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Comida.name, schema: ComidaSchema },
      { name: Promocion.name, schema: PromocionSchema },
    ]),
  ],
  controllers: [ComidaController, PromocionesController],
  providers: [ComidaService, PromocionService, JwtStrategy],
})
export class AppModule {}