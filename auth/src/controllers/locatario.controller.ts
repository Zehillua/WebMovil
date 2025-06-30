import { Controller, Get, Param, NotFoundException, Patch, Body, BadRequestException } from '@nestjs/common';
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

  @Patch(':id/valoracion')
  async actualizarValoracion(
    @Param('id') id: string, 
    @Body() body: { nuevaValoracion: number }
  ) {
    const { nuevaValoracion } = body;
    
    if (nuevaValoracion < 0 || nuevaValoracion > 5) {
      throw new BadRequestException('Valoración debe estar entre 0 y 5');
    }

    const locatario = await this.locatarioService.actualizarValoracion(id, nuevaValoracion);
    return locatario;
  }

  

}