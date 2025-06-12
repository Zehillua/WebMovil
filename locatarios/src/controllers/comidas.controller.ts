import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, UploadedFile, UseInterceptors} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ComidaService } from '../services/comida.service';
import { CrearComidaDto } from '../dto/comida.input';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('comidas')
export class ComidaController {
  constructor(private readonly comidaService: ComidaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async crearComida(@Body() dto: CrearComidaDto, @Req() req: Request) {
    const usuario = req.user as any;
    return this.comidaService.crearComida(usuario._id, dto);
  }


  //AGREGA LIMITE DE PESOO**** - aws podria servir para el tema de imagenes

  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No se recibió ningún archivo');
    }
    return { url: `/uploads/${file.filename}` };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerMisComidas(@Req() req: Request) {
    const usuario = req.user as any;
    return this.comidaService.obtenerComidasPorLocatario(usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obtenerComida(@Param('id') id: string, @Req() req: Request) {
    const usuario = req.user as any;
    return this.comidaService.obtenerComidaPorId(id, usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async actualizarComida(
    @Param('id') id: string,
    @Body() dto: Partial<CrearComidaDto>,
    @Req() req: Request
  ) {
    const usuario = req.user as any;
    return this.comidaService.actualizarComida(id, dto, usuario._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminarComida(@Param('id') id: string, @Req() req: Request) {
    const usuario = req.user as any;
    return this.comidaService.eliminarComida(id, usuario._id);
  }

  @Get('/locatario/:id')
  async obtenerComidasPorLocatarioId(@Param('id') id: string) {
    return this.comidaService.obtenerComidasPorLocatario(id);
  }
}