import { ObjectType, Field, ID, Int, Float, InputType } from '@nestjs/graphql';

// ✅ 1. DEFINIR TIPOS BÁSICOS PRIMERO:
@ObjectType()
export class ComidaType {
  @Field()
  nombre: string;

  @Field(() => Int)
  cantidad: number;
}

@ObjectType()
export class LocalType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombreLocal: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class UsuarioType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field({ nullable: true })
  nombreUsuario?: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  numeroCasaDepto?: string;
}

// ✅ 2. DEFINIR TIPOS DE REPARTIDOR ANTES DE USARLOS:
@ObjectType()
export class RepartidorType {
  @Field(() => ID)
  _id: string;

  @Field()
  usuarioRepartidor: string;

  @Field()
  vehiculo: string;

  @Field()
  patente: string;

  @Field(() => Float)
  valoracion: number;

  @Field({ nullable: true })
  telefono?: string;
}

// ✅ 3. DEFINIR DatosRepartidorPedidoType ANTES DE USARLO:
@ObjectType()
export class DatosRepartidorPedidoType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombreUsuario: string;

  @Field()
  usuarioRepartidor: string;

  @Field()
  vehiculo: string;

  @Field()
  patente: string;

  @Field(() => Float)
  valoracion: number;

  @Field({ nullable: true })
  telefono?: string;
}

// ✅ 4. DEFINIR TIPOS DE DATOS DENORMALIZADOS:
@ObjectType()
export class DatosUsuarioType {
  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field()
  nombreUsuario: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class DatosLocalType {
  @Field()
  nombreLocal: string;

  @Field()
  direccion: string;
}

@ObjectType()
export class DatosRepartidorType {
  @Field()
  nombreUsuario: string;

  @Field()
  vehiculo: string;

  @Field()
  patente: string;

  @Field(() => Float)
  valoracion: number;
}

// ✅ 5. AHORA DEFINIR TIPOS DE PEDIDO (que usan los anteriores):
@ObjectType()
export class PedidoType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field()
  estado: boolean;

  @Field({ nullable: true })
  listo?: boolean;

  @Field({ nullable: true })
  enCamino?: boolean;

  @Field({ nullable: true })
  estadoRechazado?: boolean;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  pago: string;

  @Field(() => String)
  fechaPedido: string;

  @Field()
  esDelivery: boolean;

  @Field({ nullable: true })
  direccionEntrega?: string;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field(() => LocalType)
  local: LocalType;

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field({ nullable: true })
  dealer?: boolean;

  @Field(() => RepartidorType, { nullable: true })
  repartidor?: RepartidorType;

  // ✅ AHORA SÍ SE PUEDE USAR DatosRepartidorPedidoType:
  @Field(() => DatosRepartidorPedidoType, { nullable: true })
  datosRepartidor?: DatosRepartidorPedidoType;

  @Field(() => Int, { nullable: true })
  codigoPedido?: number;
}

@ObjectType()
export class PedidoRepartidorType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  direccionEntrega: string;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => LocalType) 
  local: LocalType;
}

@ObjectType()
export class PedidoPendienteRepartidorType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  direccionEntrega: string;

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field()
  enCamino: boolean;

  @Field()
  pedidoEntregado: boolean;

  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => LocalType) 
  local: LocalType;
}

@ObjectType()
export class PedidoEnCaminoType {
  @Field(() => ID)
  _id: string;

  @Field()
  nombrePedido: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  direccionEntrega: string;

  @Field({ nullable: true })
  propina?: boolean;

  @Field(() => Float, { nullable: true })
  cantidadPropina?: number;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field(() => Boolean, { defaultValue: false })
  enCamino: boolean;

  @Field(() => Boolean, { defaultValue: false })
  pedidoEntregado: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  codigoPedido?: number;

  @Field(() => UsuarioType)
  usuario: UsuarioType;

  @Field(() => LocalType) 
  local: LocalType;
}

// ✅ 6. TIPOS DE PEDIDOS REALIZADOS:
@ObjectType()
export class PedidoRealizadoType {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  pedidoOriginalId: string;

  @Field()
  nombrePedido: string;

  @Field(() => ID)
  idComprador: string;

  @Field(() => ID)
  idLocal: string;

  @Field(() => Float)
  precioPedido: number;

  @Field()
  pago: string;

  @Field()
  fechaPedido: string;

  @Field()
  fechaEntrega: string;

  @Field()
  fechaRegistro: string;

  @Field()
  esDelivery: boolean;

  @Field({ nullable: true })
  direccionEntrega?: string;

  @Field(() => [ComidaType])
  comidas: ComidaType[];

  @Field()
  propina: boolean;

  @Field(() => Float)
  cantidadPropina: number;

  @Field(() => ID)
  repartidor: string;

  @Field(() => Int)
  codigoPedido: number;

  @Field({ nullable: true })
  direccionLocal?: string;

  // ✅ CAMPOS DE VALORACIÓN:
  @Field(() => Float, { defaultValue: 0 })
  valoracionPedido: number;

  @Field(() => Float, { defaultValue: 0 })
  valoracionDelivery: number;

  @Field(() => Float, { defaultValue: 0 })
  valoracionLocal: number;

  @Field(() => Boolean, { defaultValue: false })
  valoracionCompletada: boolean;

  @Field(() => DatosUsuarioType)
  datosUsuario: DatosUsuarioType;

  @Field(() => DatosLocalType)
  datosLocal: DatosLocalType;

  @Field(() => DatosRepartidorType)
  datosRepartidor: DatosRepartidorType;
}

// ✅ 7. INPUT TYPES AL FINAL:
@InputType()
export class ValoracionInput {
  @Field(() => Float, { description: 'Valoración del pedido (0-5)' })
  valoracionPedido: number;

  @Field(() => Float, { description: 'Valoración del delivery (0-5)' })
  valoracionDelivery: number;

  @Field(() => Float, { description: 'Valoración del local (0-5)' })
  valoracionLocal: number;
}