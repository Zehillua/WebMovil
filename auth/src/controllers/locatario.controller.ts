import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { LocatarioService } from '../services/locatario.service';

@Controller('locatarios')
export class LocatarioController {
  constructor(private readonly locatarioService: LocatarioService) {}

  @Get()
  async getLocatarios() {
    return this.locatarioService.obtenerLocatarios();
  }

  @Get(':id')
  async obtenerUsuarioPorId(@Param('id') id: string) {
    const usuario = await this.locatarioService.obtenerLocatarioPorId(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    // Puedes filtrar los campos que quieres devolver:
    return {
      _id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      nombreLocal: usuario.nombreLocal,
      numeroLocal: usuario.numeroLocal,
      correo: usuario.correo,
      tipoUsuario: usuario.tipoUsuario,
      direccion: usuario.direccion,
    };
  }

  

}