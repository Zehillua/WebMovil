import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { PedidoService } from '../services/pedido.service';
import { PedidoRealizadoType, ValoracionInput } from '../types/pedido.types';

@Resolver(() => PedidoRealizadoType)
export class PedidoRealizadoResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoRealizadoType])
  async pedidosRealizadosPorUsuario(@Args('userId') userId: string): Promise<any[]> {
    console.log(`🚀 GraphQL Query: pedidosRealizadosPorUsuario para ${userId}`);
    return this.pedidoService.obtenerPedidosRealizadosPorUsuario(userId);
  }

  // ✅ NUEVA QUERY para pedidos pendientes de valoración:
  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoRealizadoType])
  async pedidosPendientesValoracion(@Args('userId') userId: string): Promise<any[]> {
    console.log(`🚀 GraphQL Query: pedidosPendientesValoracion para ${userId}`);
    return this.pedidoService.obtenerPedidosPendientesValoracion(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoRealizadoType])
  async todosPedidosRealizados(): Promise<any[]> {
    console.log(`🚀 GraphQL Query: todosPedidosRealizados`);
    return this.pedidoService.obtenerTodosPedidosRealizados();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async estadisticasPedidosRealizados(): Promise<string> {
    console.log(`🚀 GraphQL Query: estadisticasPedidosRealizados`);
    const stats = await this.pedidoService.obtenerEstadisticasPedidosRealizados();
    return JSON.stringify(stats);
  }

  // ✅ NUEVA MUTATION para valorar pedido:
  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoRealizadoType)
  async valorarPedidoRealizado(
    @Args('pedidoRealizadoId') pedidoRealizadoId: string,
    @Args('valoraciones') valoraciones: ValoracionInput
  ): Promise<any> {
    console.log(`🚀 GraphQL Mutation: valorarPedidoRealizado ${pedidoRealizadoId}`);
    return this.pedidoService.valorarPedidoRealizado(pedidoRealizadoId, valoraciones);
  }

  // Mutation existente para testing:
  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoRealizadoType)
  async transferirPedidoARealizado(@Args('pedidoId') pedidoId: string): Promise<any> {
    console.log(`🚀 GraphQL Mutation: transferirPedidoARealizado ${pedidoId}`);
    const pedido = await this.pedidoService['pedidoModel'].findById(pedidoId).lean().exec();
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    return this.pedidoService['transferirAPedidosRealizados'](pedido);
  }
}