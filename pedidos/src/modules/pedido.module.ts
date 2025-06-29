import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from '../schemas/pedido.schema';
import { Carrito, CarritoSchema } from '../schemas/carrito.schema';
import { PedidoService } from '../services/pedido.service';
import { PedidoController } from '../controllers/pedido.controller';
import { 
  PedidoResolver, 
  PedidoRepartidorResolver,
  PedidoPendienteRepartidorResolver,
  PedidoEnCaminoResolver // ✅ NUEVA IMPORTACIÓN
} from '../resolvers/pedido.resolver'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Carrito.name, schema: CarritoSchema },
    ]),
  ],
  controllers: [PedidoController],
  providers: [
    PedidoService, 
    PedidoResolver, 
    PedidoRepartidorResolver,
    PedidoPendienteRepartidorResolver,
    PedidoEnCaminoResolver
  ],
})
export class PedidoModule {}