import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComidaController } from '../controllers/comidas.controller';
import { Comida, ComidaSchema } from '../schemas/comida.schema';
import { ComidaService } from '../services/comida.service';
import { ComidaResolver } from '../resolvers/comida.resolver';
import { VentaResolver } from '../resolvers/venta.resolver';
import { VentaService } from '../services/venta.service';
import { Venta, VentaSchema } from '../schemas/venta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comida.name, schema: ComidaSchema },
      { name: Venta.name, schema: VentaSchema },
    ]),
  ],
  controllers: [ComidaController],
  providers: [
    ComidaService, 
    ComidaResolver,
    VentaService,
    VentaResolver
  ],
  exports: [ComidaService, VentaService],
})
export class ComidaModule {}