import { Controller, Post, Body, Param, Get, Delete, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CarritoService } from '../services/carrito.service';
import { CreateComidaCarritoDto } from '../dtos/create-comidaCarrito.dto';
import { CreatePromocionCarritoDto } from '../dtos/create-promocionCarrito.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  // ✅ ENDPOINT PARA COMIDAS (YA FUNCIONA)
  @UseGuards(JwtAuthGuard)
  @Post(':idComprador/agregar')
  async agregarComida(
    @Param('idComprador') idComprador: string,
    @Body() dto: CreateComidaCarritoDto,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes modificar el carrito de otro usuario');
    }
    console.log('🛒 Agregando comida al carrito:', dto);
    return this.carritoService.agregarComidaAlCarrito(idComprador, dto);
  }

  // ✅ NUEVO ENDPOINT PARA PROMOCIONES
  @UseGuards(JwtAuthGuard)
  @Post(':idComprador/agregar-promocion')
  async agregarPromocion(
    @Param('idComprador') idComprador: string,
    @Body() dto: CreatePromocionCarritoDto,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes modificar el carrito de otro usuario');
    }
    console.log('🎉 Agregando promoción al carrito:', dto);
    return this.carritoService.agregarPromocionAlCarrito(idComprador, dto);
  }

  // ✅ OBTENER CARRITO
  @UseGuards(JwtAuthGuard)
  @Get(':idComprador')
  async obtenerCarrito(
    @Param('idComprador') idComprador: string,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes ver el carrito de otro usuario');
    }
    return this.carritoService.obtenerCarrito(idComprador);
  }

  // ✅ ELIMINAR ITEM DE COMIDA
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

  // ✅ NUEVO: ELIMINAR PROMOCIÓN
  @UseGuards(JwtAuthGuard)
  @Delete(':idComprador/promocion/:promocionId')
  async eliminarPromocion(
    @Param('idComprador') idComprador: string,
    @Param('promocionId') promocionId: string,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes modificar el carrito de otro usuario');
    }
    return this.carritoService.eliminarPromocion(idComprador, promocionId);
  }

  // ✅ VACIAR CARRITO
  @UseGuards(JwtAuthGuard)
  @Delete(':idComprador/vaciar')
  async vaciarCarrito(
    @Param('idComprador') idComprador: string,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes modificar el carrito de otro usuario');
    }
    return this.carritoService.vaciarCarrito(idComprador);
  }

  // ✅ OBTENER TOTAL DEL CARRITO
  @UseGuards(JwtAuthGuard)
  @Get(':idComprador/total')
  async obtenerTotal(
    @Param('idComprador') idComprador: string,
    @Req() req: any
  ) {
    if (req.user?.sub !== idComprador) {
      throw new UnauthorizedException('No puedes ver el carrito de otro usuario');
    }
    return this.carritoService.calcularTotalCarrito(idComprador);
  }
}