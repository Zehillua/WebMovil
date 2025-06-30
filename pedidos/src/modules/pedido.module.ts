import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from '../schemas/pedido.schema';
import { Carrito, CarritoSchema } from '../schemas/carrito.schema';
import { PedidoRealizado, PedidoRealizadoSchema } from '../schemas/pedido-realizado.schema';
import { PedidoService } from '../services/pedido.service';
import { PedidoController } from '../controllers/pedido.controller';
import { 
  PedidoResolver, 
  PedidoRepartidorResolver,
  PedidoPendienteRepartidorResolver,
  PedidoEnCaminoResolver,
  RegistroMultipleBDResolver
} from '../resolvers/pedido.resolver';
import { PedidoRealizadoResolver } from '../resolvers/pedido-realizado.resolver';

@Module({
  imports: [
    // ✅ SOLO MONGODB - NO GRAPHQL (YA ESTÁ EN APP.MODULE)
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Carrito.name, schema: CarritoSchema },
      { name: PedidoRealizado.name, schema: PedidoRealizadoSchema },
    ]),
  ],
  controllers: [PedidoController],
  providers: [
    PedidoService, 
    PedidoResolver, 
    PedidoRepartidorResolver,
    PedidoPendienteRepartidorResolver,
    PedidoEnCaminoResolver,
    RegistroMultipleBDResolver,
    PedidoRealizadoResolver
  ],
  exports: [PedidoService], // ✅ EXPORTAR PARA OTROS MÓDULOS
})
export class PedidoModule {}