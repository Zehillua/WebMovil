import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './src/strategies/jwt.strategy';
import { Comida, ComidaSchema } from './src/schemas/comida.schema';
import { ComidaService } from './src/services/comida.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ComidaController } from './src/controllers/comidas.controller';

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
    ]),
  ],
  controllers: [ComidaController],
  providers: [ComidaService, JwtStrategy],
})
export class AppModule {}