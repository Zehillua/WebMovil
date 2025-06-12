import { Controller, Post, Body, Param, Get, Delete, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CarritoService } from '../services/carrito.service';
import { CreateComidaCarritoDto } from '../dtos/create-comidaCarrito.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  // Agregar comida al carrito de un usuario
  @UseGuards(JwtAuthGuard)
  @Post(':idComprador/agregar')
  async agregarComida(
    @Param('idComprador') idComprador: string,
    @Body() dto: CreateComidaCarritoDto,
    @Req() req: any
  ) {
    // Seguridad: solo el dueño puede modificar su carrito
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes modificar el carrito de otro usuario');
    }
    return this.carritoService.agregarComidaAlCarrito(idComprador, dto);
  }

  // Obtener el carrito de un usuario
  @UseGuards(JwtAuthGuard)
  @Get(':idComprador')
  async obtener(@Param('idComprador') idComprador: string, @Req() req: any) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes ver el carrito de otro usuario');
    }
    return this.carritoService.obtenerCarrito(idComprador);
  }

  // Eliminar un item del carrito
  @UseGuards(JwtAuthGuard)
  @Delete(':idComprador/item/:itemId')
  async eliminarItem(
    @Param('idComprador') idComprador: string,
    @Param('itemId') itemId: string,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes modificar el carrito de otro usuario');
    }
    return this.carritoService.eliminarItem(idComprador, itemId);
  }

  // Vaciar el carrito
  @UseGuards(JwtAuthGuard)
    @Get(':idComprador')
    async obtenerCarrito(@Param('idComprador') idComprador: string, @Req() req: any) {
    if (req.user?.sub !== idComprador) {
        throw new UnauthorizedException('No puedes ver el carrito de otro usuario');
    }
    return this.carritoService.obtenerCarrito(idComprador);
    }
}