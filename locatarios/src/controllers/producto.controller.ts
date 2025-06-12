import { Controller, Post, Get, Body, Query, Delete, Param } from '@nestjs/common';
import { ProductoService } from '../services/producto.service';
import { CreateProductoDto } from '../dtos/create-producto.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post('crear')
  async crear(@Body() dto: CreateProductoDto) {
    return this.productoService.crearProducto(dto);
  }

  @Get()
  async obtenerTodos(@Query('locatario') locatario?: string) {
    if (locatario) {
      return this.productoService.obtenerProductosPorLocatario(locatario);
    }
    return this.productoService.obtenerProductos();
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return this.productoService.eliminarProducto(id);
  }
}
