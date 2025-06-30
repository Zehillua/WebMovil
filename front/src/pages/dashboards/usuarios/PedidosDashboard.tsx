import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_USUARIO, RECHAZAR_PEDIDO } from '../../../apollo/queries';
import './PedidosDashboard.css';

interface Comida {
  nombre: string;
  cantidad: number;
  tipo?: string;
}

// ✅ NUEVA INTERFAZ PARA PROMOCIONES EN PEDIDOS
interface PromocionPedido {
  nombrePromocion: string;
  cantidad: number;
  precio: number;
  comidas: { nombre: string; cantidad: number }[];
  tipo?: string;
}

interface Local {
  nombreLocal: string;
  direccion: string;
}

interface Repartidor {
  _id: string;
  nombreUsuario: string;
  usuarioRepartidor: string;
  vehiculo: string;
  patente: string;
  valoracion: number;
  telefono?: string;
}

interface Pedido {
  _id: string;
  estado: boolean;
  fechaPedido: string;
  nombrePedido: string;
  precioPedido: number;
  pago: string;
  esDelivery: boolean;
  direccionEntrega?: string;
  comidas: Comida[];
  promociones?: PromocionPedido[]; // ✅ NUEVO CAMPO
  local: Local;
  propina?: boolean;
  cantidadPropina?: number;
  dealer?: boolean;
  repartidor?: string;
  datosRepartidor?: Repartidor | null;
  estadoRechazado?: boolean;
  listo?: boolean;
  enCamino?: boolean;
  codigoPedido?: number;
}

const PedidosDashboard: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  // ✅ USAR GRAPHQL DESDE EL SERVICIO CORRECTO (3002)
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_USUARIO, {
    variables: { userId },
    skip: !userId,
    pollInterval: 5000,
    errorPolicy: 'all',
    // ✅ USAR CONTEXT PARA ESPECIFICAR EL ENDPOINT CORRECTO
    context: {
      uri: 'http://localhost:3002/graphql'
    }
  });

  const [rechazarPedidoMutation] = useMutation(RECHAZAR_PEDIDO, {
    // ✅ USAR CONTEXT PARA ESPECIFICAR EL ENDPOINT CORRECTO
    context: {
      uri: 'http://localhost:3002/graphql'
    },
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error al cancelar pedido:', error);
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }
      
      try {
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!resUser.ok) {
          navigate('/', { replace: true });
          return;
        }
        
        const userData = await resUser.json();
        const idUsuario = userData.userId || userData._id;
        console.log('👤 User ID obtenido:', idUsuario);
        setUserId(idUsuario);
      } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        navigate('/', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  // ✅ FALLBACK: SI GRAPHQL FALLA, USAR REST
  const [pedidosRest, setPedidosRest] = useState<Pedido[]>([]);
  const [loadingRest, setLoadingRest] = useState(false);

  useEffect(() => {
    if (error && userId) {
      console.log('⚠️ GraphQL falló, usando REST como fallback');
      fetchPedidosRest();
    }
  }, [error, userId]);

  const fetchPedidosRest = async () => {
    if (!userId) return;
    
    setLoadingRest(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3002/pedidos/usuario/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const pedidos = await response.json();
        setPedidosRest(pedidos);
        console.log('✅ Pedidos obtenidos por REST:', pedidos);
      } else {
        console.error('❌ Error obteniendo pedidos por REST:', response.status);
      }
    } catch (error) {
      console.error('❌ Error en fetch REST:', error);
    } finally {
      setLoadingRest(false);
    }
  };

  const handleEliminarPedido = async (pedidoId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Actualizar tanto GraphQL como REST
        if (data?.pedidosPorUsuario) {
          refetch();
        } else {
          fetchPedidosRest();
        }
      }
    } catch (error) {
      console.error('Error eliminando pedido:', error);
    }
  };

  const handleCancelarPedido = async (pedidoId: string) => {
    try {
      if (data?.pedidosPorUsuario) {
        // Usar GraphQL si está disponible
        await rechazarPedidoMutation({
          variables: { id: pedidoId }
        });
      } else {
        // Usar REST como fallback
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}/rechazar`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          fetchPedidosRest();
        }
      }
    } catch (error) {
      console.error('Error cancelando pedido:', error);
    }
  };

  // ✅ DETERMINAR QUÉ DATOS USAR
  const isLoadingData = loading || loadingRest;
  const pedidos: Pedido[] = data?.pedidosPorUsuario || pedidosRest || [];
  const hasError = error && pedidosRest.length === 0;

  if (isLoadingData) {
    return <div className="pedidos-dashboard-loading">Cargando pedidos...</div>;
  }

  if (hasError) {
    return (
      <div className="pedidos-dashboard-error">
        <h3>Error cargando pedidos</h3>
        <p>No se pudieron cargar los pedidos. Intenta recargar la página.</p>
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    );
  }

  console.log('📊 Pedidos finales a mostrar:', pedidos);

  return (
    <div className="pedidos-dashboard-root">
      <div className="pedidos-dashboard-header">
        <button className="pedidos-dashboard-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-dashboard-title">VeciMarket - Mis Pedidos</span>
        <div style={{ width: 32 }}></div>
      </div>
      
      {pedidos.length === 0 ? (
        <div className="pedidos-dashboard-empty">No tienes pedidos registrados.</div>
      ) : (
        <div className="pedidos-dashboard-list">
          {pedidos.map((pedido: Pedido) => (
            <div className="pedido-card" key={pedido._id}>
              <div className="pedido-header">
                <span className="pedido-nombre">
                  {pedido.nombrePedido}
                  {pedido.local?.nombreLocal && (
                    <span className="pedido-local"> — {pedido.local.nombreLocal}</span>
                  )}
                </span>
                <div className="pedido-header-right">
                  <span className={`pedido-estado pedido-estado-${
                    pedido.estadoRechazado
                      ? 'rechazado'
                      : pedido.enCamino
                        ? 'en-camino'
                        : pedido.listo
                          ? 'listo'
                          : pedido.estado
                            ? 'preparando'
                            : 'en-espera'
                  }`}>
                    {pedido.estadoRechazado
                      ? 'Pedido Rechazado'
                      : pedido.enCamino
                        ? 'En Camino 🚚'
                        : pedido.listo
                          ? 'Pedido Listo'
                          : pedido.estado
                            ? 'Preparando pedido'
                            : 'En espera'}
                  </span>
                  
                  {pedido.estadoRechazado && (
                    <button
                      className="btn-eliminar-pedido"
                      onClick={() => handleEliminarPedido(pedido._id)}
                      title="Eliminar pedido"
                    >
                      ❌
                    </button>
                  )}
                  
                  {!pedido.estadoRechazado && !pedido.estado && (
                    <button
                      className="btn-cancelar-pedido"
                      onClick={() => handleCancelarPedido(pedido._id)}
                      title="Cancelar pedido"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>
              
              <div className="pedido-info">
                <span><b>Fecha:</b> {new Date(pedido.fechaPedido).toLocaleString()}</span>
                <span><b>Total:</b> ${pedido.precioPedido.toLocaleString()}</span>
                <span><b>Método:</b> {pedido.pago}</span>
                
                {pedido.local?.nombreLocal && (
                  <span><b>Local:</b> {pedido.local.nombreLocal}</span>
                )}
                {pedido.local?.direccion && (
                  <span><b>Dirección local:</b> {pedido.local.direccion}</span>
                )}
                
                {pedido.esDelivery && pedido.direccionEntrega && (
                  <span><b>Dirección entrega:</b> {pedido.direccionEntrega}</span>
                )}
                
                {/* ✅ SECCIÓN DE COMIDAS */}
                {pedido.comidas && pedido.comidas.length > 0 && (
                  <div className="comidas-lista">
                    <b>🍽️ Comidas:</b>
                    {pedido.comidas.map((comida: Comida, idx: number) => (
                      <div key={idx} className="comida-item">
                        {comida.nombre} x{comida.cantidad}
                      </div>
                    ))}
                  </div>
                )}

                {/* ✅ SECCIÓN DE PROMOCIONES */}
                {pedido.promociones && pedido.promociones.length > 0 && (
                  <div className="promociones-lista">
                    <b>🎉 Promociones:</b>
                    {pedido.promociones.map((promocion: PromocionPedido, idx: number) => (
                      <div key={idx} className="promocion-item">
                        <div className="promocion-header">
                          <span className="promocion-nombre">{promocion.nombrePromocion}</span>
                          <span className="promocion-cantidad">x{promocion.cantidad}</span>
                          <span className="promocion-precio">${promocion.precio.toLocaleString()}</span>
                        </div>
                        <div className="promocion-comidas">
                          <span>Incluye: </span>
                          {promocion.comidas.map((comida, cidx) => (
                            <span key={cidx} className="promocion-comida-item">
                              {comida.nombre} x{comida.cantidad}
                              {cidx < promocion.comidas.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {pedido.propina && pedido.cantidadPropina && (
                  <span><b>Propina:</b> ${pedido.cantidadPropina}</span>
                )}
                <span>
                  <b>Estado:</b> {
                    pedido.estadoRechazado
                      ? 'Rechazado'
                      : pedido.enCamino
                        ? 'En camino - Repartidor viene hacia ti'
                        : pedido.listo
                          ? 'Listo para recoger/entrega'
                          : pedido.estado
                            ? 'Preparando'
                            : 'En espera'
                  }
                </span>
                
                {/* INFORMACIÓN DETALLADA DEL REPARTIDOR */}
                {pedido.dealer && pedido.datosRepartidor ? (
                  <div className="repartidor-info">
                    <b>🚗 Repartidor asignado:</b>
                    <div className="repartidor-detalles">
                      <span><b>Nombre:</b> {pedido.datosRepartidor.usuarioRepartidor}</span>
                      <span><b>Vehículo:</b> {pedido.datosRepartidor.vehiculo}</span>
                      <span><b>Patente:</b> {pedido.datosRepartidor.patente}</span>
                      <span><b>⭐ Valoración:</b> {pedido.datosRepartidor.valoracion.toFixed(1)}/5</span>
                      {pedido.datosRepartidor.telefono && (
                        <span><b>📱 Teléfono:</b> {pedido.datosRepartidor.telefono}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span><b>Repartidor:</b> {pedido.dealer ? 'En camino' : 'Sin asignar'}</span>
                )}
                
                {/* MOSTRAR CÓDIGO DE ENTREGA CUANDO ESTÁ EN CAMINO */}
                {pedido.enCamino && pedido.codigoPedido && pedido.codigoPedido > 0 && (
                  <div className="codigo-entrega-info">
                    <b>🔑 Código de entrega:</b>
                    <span className="codigo-entrega-numero">{pedido.codigoPedido}</span>
                    <small>Proporciona este código al repartidor cuando llegue</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* ✅ MOSTRAR INFORMACIÓN DE DEBUG */}
      <div style={{ padding: '1rem', background: '#f8f9fa', margin: '2rem 0', borderRadius: '8px' }}>
        <h4>🔍 Debug Info:</h4>
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Usando GraphQL:</strong> {data ? 'Sí' : 'No'}</p>
        <p><strong>Usando REST:</strong> {pedidosRest.length > 0 ? 'Sí' : 'No'}</p>
        <p><strong>Total pedidos:</strong> {pedidos.length}</p>
        <p><strong>Error GraphQL:</strong> {error ? error.message : 'No'}</p>
      </div>
    </div>
  );
};

export default PedidosDashboard;