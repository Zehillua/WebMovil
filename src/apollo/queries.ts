import { gql } from '@apollo/client';


export const ACEPTAR_PEDIDO_REPARTIDOR = gql`
  mutation AceptarPedidoRepartidor($id: String!, $idRepartidor: String!) {
    aceptarPedidoRepartidor(id: $id, idRepartidor: $idRepartidor) {
      _id
      dealer
      repartidor
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
        }
        tipo
      }
    }
  }
`;


export const GET_PEDIDOS_USUARIO = gql`
  query GetPedidosUsuario($userId: String!) {
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
      comidas {
        nombre
        cantidad
        tipo
      }
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
        }
        tipo
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
      datosRepartidor {
        _id
        nombreUsuario
        usuarioRepartidor
        vehiculo
        patente
        valoracion
        telefono
      }
      codigoPedido
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
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
        }
        tipo
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
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
        }
        tipo
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
      fechaRechazo
    }
  }
`;


export const GET_CARRITO_COMPLETO = gql`
  query GetCarritoCompleto($userId: String!) {
    obtenerCarrito(userId: $userId) {
      items {
        _id
        nombreComida
        cantidad
        precio
        imagenUrl
        nombreLocal
      }
      promociones {
        _id
        nombrePromocion
        cantidad
        precio
        imagenUrl
        nombreLocal
        comidas {
          nombre
          cantidad
          precioOriginal
        }
      }
      total
      totalComidas
      totalPromociones
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
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
        }
        tipo
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
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
        }
        tipo
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

// ✅ NUEVA MUTATION para registro en múltiples BD:
export const REGISTRAR_PEDIDO_MULTIPLE_BD = gql`
  mutation RegistrarPedidoMultipleBD($pedidoId: String!) {
    registrarPedidoEnMultiplesBD(pedidoId: $pedidoId)
  }
`;

// ✅ QUERY para obtener ventas del local:
export const GET_VENTAS_LOCAL = gql`
  query VentasPorLocal($localId: String!) {
    ventasPorLocal(localId: $localId) {
      _id
      nombrePedido
      precio
      fechaVenta
      cliente {
        nombre
      }
      comidas {
        nombre
        cantidad
      }
      esDelivery
      propina
      totalConPropina
    }
  }
`;

// ✅ QUERY para estadísticas del local:
export const GET_ESTADISTICAS_LOCAL = gql`
  query EstadisticasLocal($localId: String!) {
    estadisticasLocal(localId: $localId)
  }
`;
// ✅ QUERY para pedidos pendientes de valoración:
export const GET_PEDIDOS_PENDIENTES_VALORACION = gql`
  query PedidosPendientesValoracion($userId: String!) {
    pedidosPendientesValoracion(userId: $userId) {
      _id
      pedidoOriginalId
      nombrePedido
      precioPedido
      pago
      fechaPedido
      fechaEntrega
      esDelivery
      direccionEntrega
      comidas {
        nombre
        cantidad
      }
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
          precioOriginal
        }
        tipo
      }
      propina
      cantidadPropina
      codigoPedido
      valoracionPedido
      valoracionDelivery
      valoracionLocal
      valoracionCompletada
      datosUsuario {
        nombre
        apellido
        nombreUsuario
        direccion
      }
      datosLocal {
        nombreLocal
        direccion
      }
      datosRepartidor {
        nombreUsuario
        vehiculo
        patente
        valoracion
      }
    }
  }
`;

// ✅ MUTATION para valorar pedido:
export const VALORAR_PEDIDO_REALIZADO = gql`
  mutation ValorarPedidoRealizado(
    $pedidoRealizadoId: String!
    $valoraciones: ValoracionInput!
  ) {
    valorarPedidoRealizado(
      pedidoRealizadoId: $pedidoRealizadoId
      valoraciones: $valoraciones
    ) {
      _id
      pedidoOriginalId
      nombrePedido
      valoracionPedido
      valoracionDelivery
      valoracionLocal
      valoracionCompletada
      datosLocal {
        nombreLocal
      }
      datosRepartidor {
        nombreUsuario
        vehiculo
      }
    }
  }
`;

// ✅ ACTUALIZAR QUERY existente con valoraciones:
// ✅ CORREGIR QUERY CON PROMOCIONES
export const GET_PEDIDOS_REALIZADOS_USUARIO = gql`
  query PedidosRealizadosPorUsuario($userId: String!) {
    pedidosRealizadosPorUsuario(userId: $userId) {
      _id
      pedidoOriginalId
      nombrePedido
      precioPedido
      pago
      fechaPedido
      fechaEntrega
      fechaRegistro
      esDelivery
      direccionEntrega
      comidas {
        nombre
        cantidad
      }
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
          precioOriginal
        }
        tipo
      }
      propina
      cantidadPropina
      codigoPedido
      valoracionPedido
      valoracionDelivery
      valoracionLocal
      valoracionCompletada
      datosUsuario {
        nombre
        apellido
        nombreUsuario
        direccion
      }
      datosLocal {
        nombreLocal
        direccion
      }
      datosRepartidor {
        nombreUsuario
        vehiculo
        patente
        valoracion
      }
    }
  }
`;

// ✅ CORREGIR QUERY PARA TODOS LOS PEDIDOS CON PROMOCIONES
export const GET_TODOS_PEDIDOS_REALIZADOS = gql`
  query TodosPedidosRealizados {
    todosPedidosRealizados {
      _id
      pedidoOriginalId
      nombrePedido
      precioPedido
      pago
      fechaPedido
      fechaEntrega
      comidas {
        nombre
        cantidad
      }
      promociones {
        nombrePromocion
        cantidad
        precio
        comidas {
          nombre
          cantidad
          precioOriginal
        }
        tipo
      }
      cantidadPropina
      datosUsuario {
        nombre
        apellido
        nombreUsuario
      }
      datosLocal {
        nombreLocal
      }
      datosRepartidor {
        nombreUsuario
        vehiculo
      }
    }
  }
`;
// ✅ QUERY para estadísticas:
export const GET_ESTADISTICAS_PEDIDOS_REALIZADOS = gql`
  query EstadisticasPedidosRealizados {
    estadisticasPedidosRealizados
  }
`;

