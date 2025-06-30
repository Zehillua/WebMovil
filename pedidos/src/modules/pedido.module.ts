import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from '../schemas/pedido.schema';
import { Carrito, CarritoSchema } from '../schemas/carrito.schema';
import { PedidoRealizado, PedidoRealizadoSchema } from '../schemas/pedido-realizado.schema'; // ✅ NUEVO
import { PedidoService } from '../services/pedido.service';
import { PedidoController } from '../controllers/pedido.controller';
import { 
  PedidoResolver, 
  PedidoRepartidorResolver,
  PedidoPendienteRepartidorResolver,
  PedidoEnCaminoResolver,
  RegistroMultipleBDResolver
} from '../resolvers/pedido.resolver';
import { PedidoRealizadoResolver } from '../resolvers/pedido-realizado.resolver'; // ✅ NUEVO

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Carrito.name, schema: CarritoSchema },
      { name: PedidoRealizado.name, schema: PedidoRealizadoSchema }, // ✅ AGREGAR
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
    PedidoRealizadoResolver // ✅ AGREGAR
  ],
})
export class PedidoModule {}