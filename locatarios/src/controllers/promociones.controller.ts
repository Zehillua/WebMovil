import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req, 
  UploadedFile, 
  UseInterceptors,
  Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PromocionService } from '../services/promocion.service';
import { CrearPromocionDto, ActualizarPromocionDto } from '../dto/promocion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionService: PromocionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crearPromocion(@Body() dto: CrearPromocionDto, @Req() req: Request) {
    const usuario = req.user as any;
    console.log('🎉 Solicitud para crear promoción:', dto.nombre);
    return this.promocionService.crearPromocion(usuario._id, dto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'promo-' + uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB para promociones
  }))
  async uploadImagenPromocion(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No se recibió ningún archivo');
    }
    console.log('📸 Imagen de promoción subida:', file.filename);
    return { url: `/uploads/${file.filename}` };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerMisPromociones(@Req() req: Request) {
    const usuario = req.user as any;
    return this.promocionService.obtenerPromocionesPorLocatario(usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('estadisticas')
  async obtenerEstadisticas(@Req() req: Request) {
    const usuario = req.user as any;
    return this.promocionService.obtenerEstadisticasPromociones(usuario._id);
  }

  @Get('activas')
  async obtenerPromocionesActivas(@Query('locatario') locatarioId?: string) {
    return this.promocionService.obtenerPromocionesActivas(locatarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obtenerPromocion(@Param('id') id: string, @Req() req: Request) {
    const usuario = req.user as any;
    return this.promocionService.obtenerPromocionPorId(id, usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async actualizarPromocion(
    @Param('id') id: string,
    @Body() dto: ActualizarPromocionDto,
    @Req() req: Request
  ) {
    const usuario = req.user as any;
    return this.promocionService.actualizarPromocion(id, dto, usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/toggle')
  async toggleEstadoPromocion(@Param('id') id: string, @Req() req: Request) {
    const usuario = req.user as any;
    return this.promocionService.toggleEstadoPromocion(id, usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminarPromocion(@Param('id') id: string, @Req() req: Request) {
    const usuario = req.user as any;
    return this.promocionService.eliminarPromocion(id, usuario._id);
  }

  @Get('locatario/:id')
  async obtenerPromocionesPorLocatarioId(@Param('id') id: string) {
    return this.promocionService.obtenerPromocionesPorLocatario(id);
  }
}