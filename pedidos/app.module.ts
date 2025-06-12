import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PedidoModule } from './src/modules/pedido.module';
import { CarritoModule } from './src/modules/carrito.module';
import { JwtStrategy } from './src/strategies/jwt.strategy'; // <--- IMPORTA LA ESTRATEGIA

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
    PedidoModule,
    CarritoModule
  ],
  providers: [JwtStrategy], // <--- AGREGA LA ESTRATEGIA COMO PROVIDER
})
export class AppModule {}