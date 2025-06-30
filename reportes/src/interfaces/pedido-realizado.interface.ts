import { Types } from 'mongoose';

export interface PedidoRealizadoData {
  pedidoId: string;
  nombrePedido: string;
  precio: number;
  fechaEntrega: Date;
  fechaRegistro?: Date;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
  };
  local: {
    id: string;
    nombreLocal: string;
  };
  repartidor: {
    id: string;
    nombre: string;
  };
  comidas: Array<{
    nombre: string;
    cantidad: number;
  }>;
  propina: number;
  totalConPropina: number;
}

export interface PedidoRealizadoDocument {
  _id: Types.ObjectId;
  pedidoId: Types.ObjectId;
  nombrePedido: string;
  precio: number;
  fechaEntrega: Date;
  fechaRegistro: Date;
  usuario: {
    id: Types.ObjectId;
    nombre: string;
    apellido: string;
  };
  local: {
    id: Types.ObjectId;
    nombreLocal: string;
  };
  repartidor: {
    id: Types.ObjectId;
    nombre: string;
  };
  comidas: Array<{
    nombre: string;
    cantidad: number;
  }>;
  propina: number;
  totalConPropina: number;
}

export interface EstadisticasGenerales {
  resumenGeneral: {
    totalPedidos: number;
    totalVentas: number;
    totalPropinas: number;
    totalCompleto: number;
    promedioVentaPorPedido: number;
  };
  ventasPorLocal: VentasPorLocal[];
  entregasPorRepartidor: EntregasPorRepartidor[];
}

export interface VentasPorLocal {
  nombreLocal: string;
  cantidadPedidos: number;
  totalVentas: number;
  totalPropinas: number;
}

export interface EntregasPorRepartidor {
  nombreRepartidor: string;
  cantidadEntregas: number;
  totalPropinas: number;
}

export interface VentasPorDia {
  fecha: string;
  cantidadPedidos: number;
  totalVentas: number;
  totalPropinas: number;
}

export interface EstadisticasPorFecha {
  resumenPeriodo: {
    fechaInicio: string;
    fechaFin: string;
    totalPedidos: number;
    totalVentas: number;
    totalPropinas: number;
  };
  ventasPorDia: VentasPorDia[];
}