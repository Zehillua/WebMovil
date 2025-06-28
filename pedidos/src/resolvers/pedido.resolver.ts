import { Resolver, Query, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { PedidoService } from '../services/pedido.service';
import { PedidoType, LocalType } from '../types/pedido.types';
import axios from 'axios';

@Resolver(() => PedidoType)
export class PedidoResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  // Reemplaza: GET /pedidos/usuario/:id
  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoType])
  async pedidosPorUsuario(@Args('userId') userId: string): Promise<any[]> {
    return this.pedidoService.obtenerPedidosPorUsuario(userId);
  }

  // Reemplaza: GET /pedidos/local/:id  
  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoType])
  async pedidosPorLocal(@Args('localId') localId: string): Promise<any[]> {
    return this.pedidoService.obtenerPedidosPorLocal(localId);
  }

  // Reemplaza: GET /pedidos/delivery/disponibles
  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoType])
  async pedidosDeliveryDisponibles(): Promise<any[]> {
    return this.pedidoService.obtenerPedidosDeliveryDisponibles();
  }

  // Resolver automático para Local (evita N+1 queries)
  @ResolveField(() => LocalType)
  async local(@Parent() pedido: any): Promise<LocalType> {
    try {
      const res = await axios.get(`http://localhost:3000/locatarios/${pedido.idLocal}`);
      return {
        _id: pedido.idLocal,
        nombreLocal: res.data.nombreLocal || '',
        direccion: Array.isArray(res.data.direccion) 
          ? res.data.direccion.join(', ') 
          : (res.data.direccion || '')
      };
    } catch (e) {
      return {
        _id: pedido.idLocal,
        nombreLocal: 'Local no disponible',
        direccion: 'Dirección no disponible'
      };
    }
  }

  // Mutations para reemplazar PATCH endpoints
  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async actualizarEstadoPedido(
    @Args('id') id: string,
    @Args('estado') estado: boolean
  ): Promise<any> {
    return this.pedidoService.actualizarEstado(id, estado);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async rechazarPedido(@Args('id') id: string): Promise<any> {
    return this.pedidoService.rechazarPedido(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async marcarPedidoListo(@Args('id') id: string): Promise<any> {
    return this.pedidoService.marcarListo(id);
  }
}