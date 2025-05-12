import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Usuario, UsuarioSchema } from './src/schemas/usuario.schema';
import { UsuarioService } from './src/services/usuario.service';
import { UsuarioController } from './src/controllers/usuario.controller';
import { UsuarioModule } from './src/modules/usuario.module';

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
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    UsuarioModule,
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class AppModule {}