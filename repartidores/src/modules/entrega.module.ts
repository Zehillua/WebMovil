import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntregaController } from '../controllers/entrega.controller';
import { EntregaService } from '../services/entrega.service';
import { EntregaResolver } from '../resolvers/entrega.resolver'; // ✅ AGREGAR
import { Entrega, EntregaSchema } from '../schemas/entrega.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entrega.name, schema: EntregaSchema }
    ]),
  ],
  controllers: [EntregaController],
  providers: [
    EntregaService,
    EntregaResolver // ✅ AGREGAR
  ],
})
export class EntregaModule {}