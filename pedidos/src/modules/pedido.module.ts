import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from '../schemas/pedido.schema';
import { Carrito, CarritoSchema } from '../schemas/carrito.schema'; // <-- Importa aquí
import { PedidoService } from '../services/pedido.service';
import { PedidoController } from '../controllers/pedido.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pedido.name, schema: PedidoSchema },
      { name: Carrito.name, schema: CarritoSchema },
    ]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}