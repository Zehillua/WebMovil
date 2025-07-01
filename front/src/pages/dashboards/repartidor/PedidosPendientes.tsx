import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_PENDIENTES_REPARTIDOR, MARCAR_PEDIDO_EN_CAMINO } from '../../../apollo/queries';
import './PedidosPendientes.css';

interface Usuario {
  nombre: string;
  apellido: string;
  nombreUsuario?: string;
  direccion: string;
  numeroCasaDepto?: string;
}

interface Local {
  nombreLocal: string;
  direccion: string;
}

interface Pedido {
  _id: string;
  nombrePedido: string;
  precioPedido: number;
  direccionEntrega: string;
  propina?: boolean;
  cantidadPropina?: number;
  comidas: { nombre: string; cantidad: number }[];
  enCamino: boolean;
  pedidoEntregado: boolean;
  usuario: Usuario;
  local: Local;
}

const PedidosPendientes: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  // GraphQL Query con auto-refresh
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_PENDIENTES_REPARTIDOR, {
    variables: { idRepartidor: userId },
    skip: !userId,
    pollInterval: 5000, // Auto-refresh cada 5 segundos
    errorPolicy: 'all'
  });

  // GraphQL Mutation para marcar en camino
  const [marcarEnCaminoMutation] = useMutation(MARCAR_PEDIDO_EN_CAMINO, {
    onCompleted: () => {
      refetch(); // Refrescar datos automáticamente
    },
    onError: (error) => {
      console.error('Error marcando en camino:', error);
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

  const handleMarcarEnCamino = async (pedidoId: string) => {
    try {
      await marcarEnCaminoMutation({
        variables: { id: pedidoId }
      });
    } catch (error) {
      console.error('Error marcando como en camino:', error);
    }
  };

  if (loading) return <div className="pedidos-pendientes-loading">Cargando pedidos pendientes...</div>;
  if (error) return <div className="pedidos-pendientes-error">Error: {error.message}</div>;

  const pedidos: Pedido[] = data?.pedidosPendientesRepartidor || [];

  return (
    <div className="pedidos-pendientes-root">
      <div className="pedidos-pendientes-header">
                <button
          onClick={() => navigate(-1)}
          className="pedidos-pendientes-volver nav-action-btn" // Añadimos la clase nav-action-btn
          title="Volver"
        >
          <img src="https://img.icons8.com/ios-filled/28/ffffff/back.png" alt="Volver" />
          <span className="btn-text">Volver</span>
        </button>

        <span className="pedidos-pendientes-title">Mis Pedidos Pendientes</span>
        <div style={{ width: 32 }}></div>
      </div>
      
      {pedidos.length === 0 ? (
        <div className="pedidos-pendientes-empty">No tienes pedidos pendientes.</div>
      ) : (
        <div className="pedidos-pendientes-list">
          {pedidos.map((pedido) => (
            <div className="pedido-pendiente-card" key={pedido._id}>
              <div className="pedido-pendiente-header">
                <span className="pedido-pendiente-nombre">{pedido.nombrePedido}</span>
                <span className={`pedido-pendiente-estado ${pedido.enCamino ? 'en-camino' : 'pendiente'}`}>
                  {pedido.enCamino ? 'En Camino' : 'Pendiente'}
                </span>
              </div>
              
              <div className="pedido-pendiente-info">
                <div className="seccion-cliente">
                  <h4>👤 Cliente</h4>
                  <span><b>Nombre:</b> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}</span>
                  <span><b>Dirección:</b> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}</span>
                  <span><b>Entregar en:</b> {pedido.direccionEntrega}</span>
                </div>

                <div className="seccion-local">
                  <h4>🏪 Local</h4>
                  <span><b>Retirar en:</b> {pedido.local.nombreLocal}</span>
                  <span><b>Dirección:</b> {pedido.local.direccion}</span>
                </div>

                <div className="seccion-pedido">
                  <h4>📦 Pedido</h4>
                  <span><b>Total:</b> ${pedido.precioPedido.toLocaleString()}</span>
                  {pedido.propina && pedido.cantidadPropina && (
                    <span><b>Propina:</b> ${pedido.cantidadPropina.toLocaleString()}</span>
                  )}
                  
                  <div className="comidas-lista">
                    <b>Comidas:</b>
                    {pedido.comidas.map((c, idx) => (
                      <div key={idx} className="comida-item">
                        {c.nombre} x{c.cantidad}
                      </div>
                    ))}
                  </div>
                </div>

                {!pedido.enCamino && (
                  <button
                    className="btn-en-camino"
                    onClick={() => handleMarcarEnCamino(pedido._id)}
                  >
                    🚚 Marcar En Camino
                  </button>
                )}

                {pedido.enCamino && (
                  <div className="estado-en-camino">
                    <span>🚚 Pedido en camino - Puedes marcar como entregado cuando llegues</span>
                    <button
                      className="btn-entregado"
                      onClick={() => {/* TODO: Implementar con GraphQL también */}}
                    >
                      ✅ Marcar Entregado
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosPendientes;