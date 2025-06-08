import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioModule } from './usuario.module';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto', // Usa variable de entorno en producción
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, UsuarioService],
  exports: [JwtModule],
})
export class AuthModule {}