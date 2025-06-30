import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; 
import { PedidoModule } from './src/modules/pedido.module';
import { CarritoModule } from './src/modules/carrito.module';
import { JwtStrategy } from './src/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    // ✅ GRAPHQL SIN CORS - SE MANEJA EN MAIN.TS
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req }: { req: any }) => ({ req }),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/pedidos',
      }),
      inject: [ConfigService],
    }),
    PedidoModule,
    CarritoModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}