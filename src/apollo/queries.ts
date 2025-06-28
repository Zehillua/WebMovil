import { gql } from '@apollo/client';

export const GET_PEDIDOS_USUARIO = gql`
  query PedidosPorUsuario($userId: String!) {
    pedidosPorUsuario(userId: $userId) {
      _id
      nombrePedido
      estado
      listo
      estadoRechazado
      precioPedido
      pago
      fechaPedido
      esDelivery
      direccionEntrega
      comidas {
        nombre
        cantidad
      }
      local {
        nombreLocal
        direccion
      }
      propina
      cantidadPropina
      dealer
      repartidor
    }
  }
`;

export const GET_PEDIDOS_LOCAL = gql`
  query PedidosPorLocal($localId: String!) {
    pedidosPorLocal(localId: $localId) {
      _id
      nombrePedido
      estado
      listo
      estadoRechazado
      precioPedido
      pago
      fechaPedido
      direccionEntrega
      comidas {
        nombre
        cantidad
      }
      propina
      cantidadPropina
      dealer
      repartidor
    }
  }
`;

export const GET_PEDIDOS_DELIVERY = gql`
  query PedidosDeliveryDisponibles {
    pedidosDeliveryDisponibles {
      _id
      nombrePedido
      direccionEntrega
      precioPedido
      propina
      cantidadPropina
      comidas {
        nombre
        cantidad
      }
      local {
        nombreLocal
        direccion
      }
    }
  }
`;

export const ACTUALIZAR_ESTADO_PEDIDO = gql`
  mutation ActualizarEstadoPedido($id: String!, $estado: Boolean!) {
    actualizarEstadoPedido(id: $id, estado: $estado) {
      _id
      estado
    }
  }
`;

export const RECHAZAR_PEDIDO = gql`
  mutation RechazarPedido($id: String!) {
    rechazarPedido(id: $id) {
      _id
      estadoRechazado
    }
  }
`;

export const MARCAR_PEDIDO_LISTO = gql`
  mutation MarcarPedidoListo($id: String!) {
    marcarPedidoListo(id: $id) {
      _id
      listo
    }
  }
`;