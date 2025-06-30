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

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
      return {
        _id: pedido.idLocal,
        nombreLocal: 'Local no disponible',
        direccion: 'Dirección no disponible'
      };
    }
  }

  // ✅ CORREGIR MANEJO DE ERRORES:
  @ResolveField(() => RepartidorType, { nullable: true })
  async repartidor(@Parent() pedido: any): Promise<RepartidorType | null> {
    if (!pedido.repartidor || !pedido.dealer) {
      return null;
    }

    try {
      const res = await axios.get(`http://localhost:3000/usuarios/${pedido.repartidor}`);
      return {
        _id: pedido.repartidor,
        usuarioRepartidor: res.data.nombreUsuario || `${res.data.nombre} ${res.data.apellido}`,
        vehiculo: res.data.vehiculo || 'No especificado',
        patente: res.data.patente || 'No especificada',
        valoracion: res.data.valoracion || 0,
        telefono: res.data.telefono || ''
      };
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del repartidor:', error instanceof Error ? error.message : error);
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

@Resolver(() => PedidoRepartidorType)
export class PedidoRepartidorResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del usuario:', error instanceof Error ? error.message : error);
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

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
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

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoPendienteRepartidorType])
  async pedidosPendientesRepartidor(@Args('idRepartidor') idRepartidor: string): Promise<any[]> {
    console.log(`🚀 GraphQL Query: pedidosPendientesRepartidor para ${idRepartidor}`);
    return this.pedidoService.obtenerPedidosPendientesRepartidorGraphQL(idRepartidor);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoPendienteRepartidorType)
  async marcarPedidoEnCamino(@Args('id') id: string): Promise<any> {
    console.log(`🚚 GraphQL Mutation: marcarPedidoEnCamino ${id}`);
    return this.pedidoService.marcarEnCamino(id);
  }

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del usuario:', error instanceof Error ? error.message : error);
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

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
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

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoEnCaminoType])
  async pedidosEnCaminoRepartidor(@Args('idRepartidor') idRepartidor: string): Promise<any[]> {
    console.log(`🚀 GraphQL Query: pedidosEnCaminoRepartidor para ${idRepartidor}`);
    return this.pedidoService.obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoEnCaminoType)
  async entregarPedido(
    @Args('id') id: string,
    @Args('codigoPedido', { type: () => Int }) codigoPedido: number
  ): Promise<any> {
    console.log(`📦 GraphQL Mutation: entregarPedido ${id} con código ${codigoPedido}`);
    return this.pedidoService.entregarPedido(id, codigoPedido);
  }

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del usuario:', error instanceof Error ? error.message : error);
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

  // ✅ CORREGIR MANEJO DE ERRORES:
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
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
      return {
        _id: pedido.idLocal,
        nombreLocal: 'Local no disponible',
        direccion: 'Dirección no disponible'
      };
    }
  }
}

// ✅ AGREGAR EL NUEVO RESOLVER PARA MÚLTIPLES BD:
@Resolver()
export class RegistroMultipleBDResolver {
  constructor(private readonly pedidoService: PedidoService) {}

  @Mutation(() => String)
  async registrarPedidoEnMultiplesBD(
    @Args('pedidoId') pedidoId: string
  ): Promise<string> {
    console.log(`📝 GraphQL: Registrando pedido ${pedidoId} en múltiples BD`);
    
    try {
      await this.pedidoService.guardarPedidoEnMultiplesBDPublico(pedidoId);
      return 'Pedido registrado exitosamente en todas las bases de datos';
    } catch (error: unknown) { // ✅ ESPECIFICAR TIPO
      console.error('Error en registro múltiple:', error instanceof Error ? error.message : error);
      throw new Error(`Error registrando pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}