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
    console.log(`🔍 GraphQL Query: pedidosPorUsuario para userId: ${userId}`);
    
    try {
      const pedidos = await this.pedidoService.obtenerPedidosPorUsuario(userId);
      console.log(`✅ Pedidos encontrados: ${pedidos.length}`);
      
      return pedidos.map((pedido: any) => ({
        ...pedido,
        _id: pedido._id ? pedido._id.toString() : '',
        fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedido.comidas || [],
        promociones: pedido.promociones || [], // ✅ YA TIENES ESTO
        local: pedido.local || { 
          nombreLocal: 'Local no disponible', 
          direccion: 'Dirección no disponible' 
        },
        repartidor: pedido.repartidor ? {
          _id: pedido.repartidor.toString(),
          usuarioRepartidor: pedido.datosRepartidor?.usuarioRepartidor || 'N/A',
          vehiculo: pedido.datosRepartidor?.vehiculo || 'N/A',
          patente: pedido.datosRepartidor?.patente || 'N/A',
          valoracion: pedido.datosRepartidor?.valoracion || 0,
          telefono: pedido.datosRepartidor?.telefono || ''
        } : null,
        datosRepartidor: pedido.datosRepartidor || null
      }));
      
    } catch (error) {
      console.error('❌ Error en pedidosPorUsuario:', error);
      throw new Error(`Error obteniendo pedidos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoType])
  async pedidosPorLocal(@Args('localId') localId: string): Promise<any[]> {
    console.log(`🏪 GraphQL Query: pedidosPorLocal para localId: ${localId}`);
    
    try {
      const pedidos = await this.pedidoService.obtenerPedidosPorLocal(localId);
      
      return pedidos.map((pedido: any) => ({
        ...pedido,
        _id: pedido._id ? pedido._id.toString() : '',
        fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedido.comidas || [],
        promociones: pedido.promociones || [], // ✅ YA TIENES ESTO
      }));
      
    } catch (error) {
      console.error('❌ Error en pedidosPorLocal:', error);
      return [];
    }
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PedidoRepartidorType])
  async pedidosDeliveryDisponibles(): Promise<any[]> {
    console.log('🚀 GraphQL Query: pedidosDeliveryDisponibles ejecutada');
    try {
      const pedidos = await this.pedidoService.obtenerPedidosDeliveryParaGraphQL();
      console.log(`📊 Retornando ${pedidos.length} pedidos al frontend`);
      
      return pedidos.map((pedido: any) => ({
        ...pedido,
        _id: pedido._id ? pedido._id.toString() : '',
        comidas: pedido.comidas || [],
        promociones: pedido.promociones || [], // ✅ YA TIENES ESTO
      }));
      
    } catch (error) {
      console.error('❌ Error en pedidosDeliveryDisponibles:', error);
      return [];
    }
  }

  // ✅ AGREGAR MUTATION PARA ACEPTAR PEDIDO REPARTIDOR (FALTA PROMOCIONES)
 @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async aceptarPedidoRepartidor(
    @Args('id') id: string,
    @Args('idRepartidor') idRepartidor: string
  ): Promise<any> {
    console.log(`🚗 GraphQL Mutation: aceptarPedidoRepartidor ${id} por ${idRepartidor}`);
    
    try {
      const pedidoActualizado = await this.pedidoService.aceptarPedidoRepartidor(id, idRepartidor); // ✅ CAMBIO AQUÍ
      
      if (!pedidoActualizado) {
        throw new Error('Pedido no encontrado');
      }
      
      // ✅ MAPEO SEGURO DEL OBJETO
      const pedidoObj = pedidoActualizado.toObject ? pedidoActualizado.toObject() : pedidoActualizado;
      
      return {
        ...pedidoObj,
        _id: pedidoObj._id ? pedidoObj._id.toString() : id,
        fechaPedido: pedidoObj.fechaPedido ? new Date(pedidoObj.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedidoObj.comidas || [],
        promociones: pedidoObj.promociones || [], // ✅ INCLUIR PROMOCIONES
        local: pedidoObj.idLocal || { 
          nombreLocal: 'Local no disponible', 
          direccion: 'Dirección no disponible' 
        },
        dealer: true,
        repartidor: pedidoObj.repartidor || idRepartidor,
        datosRepartidor: pedidoObj.datosRepartidor || null,
        estado: pedidoObj.estado || false,
        listo: pedidoObj.listo || false,
        enCamino: pedidoObj.enCamino || false,
        estadoRechazado: pedidoObj.estadoRechazado || false
      };
      
    } catch (error) {
      console.error('❌ Error en aceptarPedidoRepartidor:', error);
      throw new Error(`Error aceptando pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // ✅ ResolveFields sin cambios
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
    } catch (error: unknown) {
      console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
      return {
        _id: pedido.idLocal,
        nombreLocal: 'Local no disponible',
        direccion: 'Dirección no disponible'
      };
    }
  }

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
    } catch (error: unknown) {
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

  // ✅ Mutations con promociones incluidas
   @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async actualizarEstadoPedido(
    @Args('id') id: string,
    @Args('estado') estado: boolean
  ): Promise<any> {
    console.log(`🔄 GraphQL Mutation: actualizarEstadoPedido ${id} a ${estado}`);
    
    try {
      const pedidoActualizado = await this.pedidoService.actualizarEstado(id, estado);
      
      if (!pedidoActualizado) {
        throw new Error('Pedido no encontrado');
      }
      
      // ✅ MAPEO SEGURO
      const pedidoObj = pedidoActualizado.toObject ? pedidoActualizado.toObject() : pedidoActualizado;
      
      return {
        ...pedidoObj,
        _id: pedidoObj._id ? pedidoObj._id.toString() : id,
        fechaPedido: pedidoObj.fechaPedido ? new Date(pedidoObj.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedidoObj.comidas || [],
        promociones: pedidoObj.promociones || [],
        local: pedidoObj.idLocal || { 
          nombreLocal: 'Local no disponible', 
          direccion: 'Dirección no disponible' 
        },
        estado: pedidoObj.estado !== undefined ? pedidoObj.estado : estado,
        listo: pedidoObj.listo || false,
        enCamino: pedidoObj.enCamino || false,
        estadoRechazado: pedidoObj.estadoRechazado || false
      };
      
    } catch (error) {
      console.error('❌ Error en actualizarEstadoPedido:', error);
      throw new Error(`Error actualizando estado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

 @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async rechazarPedido(@Args('id') id: string): Promise<any> {
    console.log(`🚫 GraphQL Mutation: rechazarPedido para id: ${id}`);
    
    try {
      const pedidoActualizado = await this.pedidoService.rechazarPedido(id);
      
      if (!pedidoActualizado) {
        throw new Error('Pedido no encontrado');
      }
      
      console.log(`✅ Pedido rechazado exitosamente: ${id}`);
      
      // ✅ MAPEO SEGURO
      const pedidoObj = pedidoActualizado.toObject ? pedidoActualizado.toObject() : pedidoActualizado;
      
      return {
        ...pedidoObj,
        _id: pedidoObj._id ? pedidoObj._id.toString() : id,
        fechaPedido: pedidoObj.fechaPedido ? new Date(pedidoObj.fechaPedido).toISOString() : new Date().toISOString(),
        fechaRechazo: pedidoObj.fechaRechazo ? new Date(pedidoObj.fechaRechazo).toISOString() : new Date().toISOString(),
        comidas: pedidoObj.comidas || [],
        promociones: pedidoObj.promociones || [],
        local: pedidoObj.idLocal || { 
          nombreLocal: 'Local no disponible', 
          direccion: 'Dirección no disponible' 
        },
        estadoRechazado: true,
        estado: pedidoObj.estado || false,
        listo: pedidoObj.listo || false,
        enCamino: pedidoObj.enCamino || false
      };
      
    } catch (error) {
      console.error('❌ Error rechazando pedido:', error);
      throw new Error(`Error rechazando pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoType)
  async marcarPedidoListo(@Args('id') id: string): Promise<any> {
    console.log(`✅ GraphQL Mutation: marcarPedidoListo ${id}`);
    
    try {
      const pedidoActualizado = await this.pedidoService.marcarListo(id);
      
      if (!pedidoActualizado) {
        throw new Error('Pedido no encontrado');
      }
      
      // ✅ MAPEO SEGURO
      const pedidoObj = pedidoActualizado.toObject ? pedidoActualizado.toObject() : pedidoActualizado;
      
      return {
        ...pedidoObj,
        _id: pedidoObj._id ? pedidoObj._id.toString() : id,
        fechaPedido: pedidoObj.fechaPedido ? new Date(pedidoObj.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedidoObj.comidas || [],
        promociones: pedidoObj.promociones || [],
        local: pedidoObj.idLocal || { 
          nombreLocal: 'Local no disponible', 
          direccion: 'Dirección no disponible' 
        },
        listo: true,
        estado: pedidoObj.estado || false,
        enCamino: pedidoObj.enCamino || false,
        estadoRechazado: pedidoObj.estadoRechazado || false
      };
      
    } catch (error) {
      console.error('❌ Error marcando pedido listo:', error);
      throw new Error(`Error marcando pedido listo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}

// ✅ RESOLVER PARA REPARTIDORES - AGREGAR aceptarPedidoRepartidor si no está
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    const pedidos = await this.pedidoService.obtenerPedidosPendientesRepartidorGraphQL(idRepartidor);
    
    return pedidos.map((pedido: any) => ({
      ...pedido,
      _id: pedido._id ? pedido._id.toString() : '',
      comidas: pedido.comidas || [],
      promociones: pedido.promociones || []
    }));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoPendienteRepartidorType)
  async marcarPedidoEnCamino(@Args('id') id: string): Promise<any> {
    console.log(`🚚 GraphQL Mutation: marcarPedidoEnCamino ${id}`);
    
    try {
      const pedidoActualizado = await this.pedidoService.marcarEnCamino(id);
      
      if (!pedidoActualizado) {
        throw new Error('Pedido no encontrado');
      }
      
      // ✅ MAPEO SEGURO - VERIFICAR SI ES OBJETO MONGOOSE O PLAIN OBJECT
      const pedidoObj = pedidoActualizado.toObject ? pedidoActualizado.toObject() : pedidoActualizado;
      
      return {
        ...pedidoObj,
        _id: pedidoObj._id ? pedidoObj._id.toString() : id,
        fechaPedido: pedidoObj.fechaPedido ? new Date(pedidoObj.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedidoObj.comidas || [],
        promociones: pedidoObj.promociones || [],
        enCamino: true,
        listo: pedidoObj.listo || false,
        estado: pedidoObj.estado || false,
        estadoRechazado: pedidoObj.estadoRechazado || false,
        dealer: pedidoObj.dealer || false,
        repartidor: pedidoObj.repartidor || null,
        datosRepartidor: pedidoObj.datosRepartidor || null,
        codigoPedido: pedidoObj.codigoPedido || null
      };
      
    } catch (error) {
      console.error('❌ Error marcando pedido en camino:', error);
      throw new Error(`Error marcando en camino: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }


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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    const pedidos = await this.pedidoService.obtenerPedidosEnCaminoRepartidorGraphQL(idRepartidor);
    
    return pedidos.map((pedido: any) => ({
      ...pedido,
      _id: pedido._id ? pedido._id.toString() : '',
      comidas: pedido.comidas || [],
      promociones: pedido.promociones || []
    }));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PedidoEnCaminoType)
  async entregarPedido(
    @Args('id') id: string,
    @Args('codigoPedido', { type: () => Int }) codigoPedido: number
  ): Promise<any> {
    console.log(`📦 GraphQL Mutation: entregarPedido ${id} con código ${codigoPedido}`);
    
    try {
      const pedidoActualizado = await this.pedidoService.entregarPedido(id, codigoPedido);
      
      if (!pedidoActualizado) {
        throw new Error('Pedido no encontrado o código incorrecto');
      }
      
      // ✅ MAPEO SEGURO - EL SERVICE PUEDE DEVOLVER DIFERENTES TIPOS
      let pedidoObj: any;
      
      if (typeof pedidoActualizado === 'object' && pedidoActualizado !== null) {
        // Si tiene método toObject (Mongoose Document)
        if ('toObject' in pedidoActualizado && typeof pedidoActualizado.toObject === 'function') {
          pedidoObj = pedidoActualizado.toObject();
        } else {
          // Si es un objeto plano
          pedidoObj = pedidoActualizado;
        }
      } else {
        throw new Error('Respuesta inválida del servicio');
      }
      
      return {
        ...pedidoObj,
        _id: pedidoObj._id ? pedidoObj._id.toString() : id,
        fechaPedido: pedidoObj.fechaPedido ? new Date(pedidoObj.fechaPedido).toISOString() : new Date().toISOString(),
        comidas: pedidoObj.comidas || [],
        promociones: pedidoObj.promociones || [],
        pedidoEntregado: true,
        enCamino: pedidoObj.enCamino || false,
        listo: pedidoObj.listo || false,
        estado: pedidoObj.estado || false,
        estadoRechazado: pedidoObj.estadoRechazado || false,
        dealer: pedidoObj.dealer || false,
        repartidor: pedidoObj.repartidor || null,
        datosRepartidor: pedidoObj.datosRepartidor || null,
        codigoPedido: pedidoObj.codigoPedido || null
      };
      
    } catch (error) {
      console.error('❌ Error entregando pedido:', error);
      throw new Error(`Error entregando pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error('Error obteniendo datos del local:', error instanceof Error ? error.message : error);
      return {
        _id: pedido.idLocal,
        nombreLocal: 'Local no disponible',
        direccion: 'Dirección no disponible'
      };
    }
  }
}

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
    } catch (error: unknown) {
      console.error('Error en registro múltiple:', error instanceof Error ? error.message : error);
      throw new Error(`Error registrando pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}