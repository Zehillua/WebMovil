import { Resolver, Query, Args, ResolveField, Parent, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { PedidoService } from '../services/pedido.service';
import { 
  PedidoType, 
  LocalType, 
  PedidoRepartidorType, 
  UsuarioType, 
  RepartidorType,
  PedidoPendienteRepartidorType,
  PedidoEnCaminoType
} from '../types/pedido.types';
import axios from 'axios';

@Resolver(() => PedidoType)
export class PedidoResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoType])
  async pedidosPorUsuario(@Args('userId') userId: string): Promise<any[]> {
    return this.pedidoService.obtenerPedidosPorUsuario(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoType])
  async pedidosPorLocal(@Args('localId') localId: string): Promise<any[]> {
    return this.pedidoService.obtenerPedidosPorLocal(localId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoRepartidorType])
  async pedidosDeliveryDisponibles(): Promise<any[]> {
    console.log('🚀 GraphQL Query: pedidosDeliveryDisponibles ejecutada');
    const pedidos = await this.pedidoService.obtenerPedidosDeliveryParaGraphQL();
    console.log(`📊 Retornando ${pedidos.length} pedidos al frontend`);
    return pedidos;
  }

  // Resolver para local (existente)
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

  // NUEVO RESOLVER para datos del repartidor:
  @ResolveField(() => RepartidorType, { nullable: true })
  async repartidor(@Parent() pedido: any): Promise<RepartidorType | null> {
    // Solo si el pedido tiene repartidor asignado
    if (!pedido.repartidor || !pedido.dealer) {
      return null;
    }

    try {
      // Llamar al microservicio de usuarios para obtener datos del repartidor
      const res = await axios.get(`http://localhost:3000/usuarios/${pedido.repartidor}`);
      return {
        _id: pedido.repartidor,
        usuarioRepartidor: res.data.nombreUsuario || `${res.data.nombre} ${res.data.apellido}`,
        vehiculo: res.data.vehiculo || 'No especificado',
        patente: res.data.patente || 'No especificada',
        valoracion: res.data.valoracion || 0,
        telefono: res.data.telefono || ''
      };
    } catch (e) {
      console.error('Error obteniendo datos del repartidor:', e);
      return {
        _id: pedido.repartidor,
        usuarioRepartidor: 'Repartidor no disponible',
        vehiculo: 'No especificado',
        patente: 'No especificada',
        valoracion: 0,
        telefono: ''
      };
    }
  }

  // Mutations existentes...
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

// Resolver para repartidor (sin cambios)
@Resolver(() => PedidoRepartidorType)
export class PedidoRepartidorResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  @ResolveField(() => UsuarioType)
  async usuario(@Parent() pedido: any): Promise<UsuarioType> {
    try {
      const res = await axios.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
      return {
        _id: pedido.idComprador,
        nombre: res.data.nombre || '',
        apellido: res.data.apellido || '',
        nombreUsuario: res.data.nombreUsuario || '',
        direccion: Array.isArray(res.data.direccion) 
          ? res.data.direccion.join(', ') 
          : (res.data.direccion || ''),
        numeroCasaDepto: res.data.numeroCasaDepto || ''
      };
    } catch (e) {
      return {
        _id: pedido.idComprador,
        nombre: 'Usuario no disponible',
        apellido: '',
        nombreUsuario: '',
        direccion: '',
        numeroCasaDepto: ''
      };
    }
  }

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
}

  @Resolver(() => PedidoPendienteRepartidorType)
  export class PedidoPendienteRepartidorResolver {
    constructor(private readonly pedidoService: PedidoService) {}

    // NUEVA QUERY para pedidos pendientes del repartidor:
    @UseGuards(GqlAuthGuard)
    @Query(() => [PedidoPendienteRepartidorType])
    async pedidosPendientesRepartidor(@Args('idRepartidor') idRepartidor: string): Promise<any[]> {
      console.log(`🚀 GraphQL Query: pedidosPendientesRepartidor para ${idRepartidor}`);
      return this.pedidoService.obtenerPedidosPendientesRepartidorGraphQL(idRepartidor);
    }

    // NUEVA MUTATION para marcar en camino:
    @UseGuards(GqlAuthGuard)
    @Mutation(() => PedidoPendienteRepartidorType)
    async marcarPedidoEnCamino(@Args('id') id: string): Promise<any> {
      console.log(`🚚 GraphQL Mutation: marcarPedidoEnCamino ${id}`);
      return this.pedidoService.marcarEnCamino(id);
    }

  // Resolver para obtener datos del usuario
  @ResolveField(() => UsuarioType)
  async usuario(@Parent() pedido: any): Promise<UsuarioType> {
    try {
      const res = await axios.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
      return {
        _id: pedido.idComprador,
        nombre: res.data.nombre || '',
        apellido: res.data.apellido || '',
        nombreUsuario: res.data.nombreUsuario || '',
        direccion: Array.isArray(res.data.direccion) 
          ? res.data.direccion.join(', ') 
          : (res.data.direccion || ''),
        numeroCasaDepto: res.data.numeroCasaDepto || ''
      };
    } catch (e) {
      return {
        _id: pedido.idComprador,
        nombre: 'Usuario no disponible',
        apellido: '',
        nombreUsuario: '',
        direccion: '',
        numeroCasaDepto: ''
      };
    }
  }

  // Resolver para obtener datos del local
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

  
}

@Resolver(() => PedidoEnCaminoType)
export class PedidoEnCaminoResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  // NUEVA QUERY para pedidos en camino del repartidor:
  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoEnCaminoType])
  async pedidosEnCaminoRepartidor(@Args('idRepartidor') idRepartidor: string): Promise<any[]> {
    console.log(`🚀 GraphQL Query: pedidosEnCaminoRepartidor para ${idRepartidor}`);
    return this.pedidoService.obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor);
  }

  // NUEVA MUTATION para entregar pedido con código:
  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoEnCaminoType)
  async entregarPedido(
    @Args('id') id: string,
    @Args('codigoPedido', { type: () => Int }) codigoPedido: number
  ): Promise<any> {
    console.log(`📦 GraphQL Mutation: entregarPedido ${id} con código ${codigoPedido}`);
    return this.pedidoService.entregarPedido(id, codigoPedido);
  }

  // Resolver para obtener datos del usuario
  @ResolveField(() => UsuarioType)
  async usuario(@Parent() pedido: any): Promise<UsuarioType> {
    try {
      const res = await axios.get(`http://localhost:3000/usuarios/${pedido.idComprador}`);
      return {
        _id: pedido.idComprador,
        nombre: res.data.nombre || '',
        apellido: res.data.apellido || '',
        nombreUsuario: res.data.nombreUsuario || '',
        direccion: Array.isArray(res.data.direccion) 
          ? res.data.direccion.join(', ') 
          : (res.data.direccion || ''),
        numeroCasaDepto: res.data.numeroCasaDepto || ''
      };
    } catch (e) {
      return {
        _id: pedido.idComprador,
        nombre: 'Usuario no disponible',
        apellido: '',
        nombreUsuario: '',
        direccion: '',
        numeroCasaDepto: ''
      };
    }
  }

  // Resolver para obtener datos del local
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
}