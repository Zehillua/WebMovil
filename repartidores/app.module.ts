import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EntregaModule } from './src/modules/entrega.module';

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
    // ✅ ARREGLAR CONFIGURACIÓN DE GRAPHQL:
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Genera el schema automáticamente
      playground: true, // Habilita GraphQL Playground
      introspection: true,
      context: ({ req }: { req: any }) => ({ req }), // ✅ TIPADO EXPLÍCITO
    }),
    EntregaModule,
  ],
})
export class AppModule {}