import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_USUARIO, RECHAZAR_PEDIDO } from '../../../apollo/queries';
import './PedidosDashboard.css';

// Define las interfaces correctamente
interface Comida {
  nombre: string;
  cantidad: number;
}

interface Local {
  nombreLocal: string;
  direccion: string;
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
  local: Local;
  propina?: boolean;
  cantidadPropina?: number;
  dealer?: boolean;
  repartidor?: string | null;
  estadoRechazado?: boolean;
  listo?: boolean;
}

const PedidosDashboard: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  // GraphQL Query - Reemplaza el fetch
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_USUARIO, {
    variables: { userId },
    skip: !userId,
    pollInterval: 5000,
    errorPolicy: 'all'
  });

  // GraphQL Mutation - Reemplaza handleCancelarPedido
  const [rechazarPedidoMutation] = useMutation(RECHAZAR_PEDIDO, {
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
        setUserId(userData.userId || userData._id);
      } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        navigate('/', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEliminarPedido = async (pedidoId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3002/pedidos/${pedidoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      refetch();
    } catch (error) {
      console.error('Error eliminando pedido:', error);
    }
  };

  const handleCancelarPedido = async (pedidoId: string) => {
    try {
      await rechazarPedidoMutation({
        variables: { id: pedidoId }
      });
    } catch (error) {
      console.error('Error cancelando pedido:', error);
    }
  };

  if (loading) return <div className="pedidos-dashboard-loading">Cargando pedidos...</div>;
  if (error) return <div className="pedidos-dashboard-error">Error: {error.message}</div>;

  const pedidos: Pedido[] = data?.pedidosPorUsuario || [];

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
                      : pedido.listo
                        ? 'listo'
                        : pedido.estado
                          ? 'preparando'
                          : 'en-espera'
                  }`}>
                    {pedido.estadoRechazado
                      ? 'Pedido Rechazado'
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
                <span>
                  <b>Fecha:</b> {new Date(pedido.fechaPedido).toLocaleString()}
                </span>
                <span>
                  <b>Total:</b> ${pedido.precioPedido.toLocaleString()}
                </span>
                <span>
                  <b>Método:</b> {pedido.pago}
                </span>
                
                {pedido.local?.nombreLocal && (
                  <span>
                    <b>Local:</b> {pedido.local.nombreLocal}
                  </span>
                )}
                {pedido.local?.direccion && (
                  <span>
                    <b>Dirección local:</b> {pedido.local.direccion}
                  </span>
                )}
                
                {pedido.esDelivery && pedido.direccionEntrega && (
                  <span>
                    <b>Dirección entrega:</b> {pedido.direccionEntrega}
                  </span>
                )}
                
                {pedido.comidas && pedido.comidas.length > 0 && (
                  <div className="comidas-lista">
                    <b>Comidas:</b>
                    {pedido.comidas.map((comida: Comida, idx: number) => (
                      <div key={idx} className="comida-item">
                        {comida.nombre} x{comida.cantidad}
                      </div>
                    ))}
                  </div>
                )}
                
                {pedido.propina && pedido.cantidadPropina && (
                  <span>
                    <b>Propina:</b> ${pedido.cantidadPropina}
                  </span>
                )}
                
                <span>
                  <b>Estado:</b> {
                    pedido.estadoRechazado
                      ? 'Rechazado'
                      : pedido.listo
                        ? 'Listo para recoger/entrega'
                        : pedido.estado
                          ? 'Preparando'
                          : 'En espera'
                  }
                </span>
                
                <span>
                  <b>Repartidor:</b> {pedido.dealer ? 'En camino' : 'Sin asignar'}
                </span>
                
                {pedido.repartidor && (
                  <span>
                    <b>ID Repartidor:</b> {pedido.repartidor}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosDashboard;