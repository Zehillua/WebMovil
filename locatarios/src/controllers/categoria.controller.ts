import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { CategoriaService } from '../services/categoria.service';
import { CreateCategoriaDto } from '../dtos/create-categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post('crear')
  async crear(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.crearCategoria(dto);
  }

  @Get()
  async obtenerTodas(@Query('locatario') locatario?: string) {
    if (locatario) {
      return this.categoriaService.obtenerCategoriasPorLocatario(locatario);
    }
    return this.categoriaService.obtenerCategorias();
  }
}
