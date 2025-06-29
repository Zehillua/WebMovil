import { gql } from '@apollo/client';


export const ACEPTAR_PEDIDO_REPARTIDOR = gql`
  mutation AceptarPedidoRepartidor($id: String!, $idRepartidor: String!) {
    aceptarPedidoRepartidor(id: $id, idRepartidor: $idRepartidor) {
      _id
      dealer
      repartidor
    }
  }
`;



export const GET_PEDIDOS_USUARIO = gql`
  query PedidosPorUsuario($userId: String!) {
    pedidosPorUsuario(userId: $userId) {
      _id
      nombrePedido
      estado
      listo
      enCamino
      estadoRechazado
      precioPedido
      pago
      fechaPedido
      esDelivery
      direccionEntrega
      codigoPedido
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
      repartidor {
        _id
        usuarioRepartidor
        vehiculo
        patente
        valoracion
        telefono
      }
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

export const GET_PEDIDOS_DELIVERY_COMPLETO = gql`
  query PedidosDeliveryDisponibles {
    pedidosDeliveryDisponibles {
      _id
      nombrePedido
      precioPedido
      direccionEntrega
      propina
      cantidadPropina
      comidas {
        nombre
        cantidad
      }
      usuario {
        nombre
        apellido
        nombreUsuario
        direccion
        numeroCasaDepto
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

export const GET_PEDIDOS_PENDIENTES_REPARTIDOR = gql`
  query PedidosPendientesRepartidor($idRepartidor: String!) {
    pedidosPendientesRepartidor(idRepartidor: $idRepartidor) {
      _id
      nombrePedido
      precioPedido
      direccionEntrega
      propina
      cantidadPropina
      enCamino
      pedidoEntregado
      comidas {
        nombre
        cantidad
      }
      usuario {
        nombre
        apellido
        nombreUsuario
        direccion
        numeroCasaDepto
      }
      local {
        nombreLocal
        direccion
      }
    }
  }
`;

// NUEVA MUTATION PARA MARCAR EN CAMINO:
export const MARCAR_PEDIDO_EN_CAMINO = gql`
  mutation MarcarPedidoEnCamino($id: String!) {
    marcarPedidoEnCamino(id: $id) {
      _id
      enCamino
    }
  }
`;


// NUEVA QUERY PARA PEDIDOS EN CAMINO:
export const GET_PEDIDOS_EN_CAMINO_REPARTIDOR = gql`
  query PedidosEnCaminoRepartidor($idRepartidor: String!) {
    pedidosEnCaminoRepartidor(idRepartidor: $idRepartidor) {
      _id
      nombrePedido
      precioPedido
      direccionEntrega
      propina
      cantidadPropina
      enCamino
      pedidoEntregado
      codigoPedido
      comidas {
        nombre
        cantidad
      }
      usuario {
        nombre
        apellido
        nombreUsuario
        direccion
        numeroCasaDepto
      }
      local {
        nombreLocal
        direccion
      }
    }
  }
`;

// NUEVA MUTATION PARA ENTREGAR PEDIDO:
export const ENTREGAR_PEDIDO = gql`
  mutation EntregarPedido($id: String!, $codigoPedido: Int!) {
    entregarPedido(id: $id, codigoPedido: $codigoPedido) {
      _id
      pedidoEntregado
      codigoPedido
    }
  }
`;