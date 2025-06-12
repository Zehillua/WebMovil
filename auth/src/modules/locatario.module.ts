import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';
import { LocatarioService } from '../services/locatario.service';
import { LocatarioController } from '../controllers/locatario.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [LocatarioController],
  providers: [LocatarioService],
  exports: [LocatarioService],
})
export class LocatarioModule {}