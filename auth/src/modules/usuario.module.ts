import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioController } from '../controllers/usuario.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}