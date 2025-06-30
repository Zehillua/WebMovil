// PedidosPendientes.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_PENDIENTES_REPARTIDOR, MARCAR_PEDIDO_EN_CAMINO } from '../../../apollo/queries'; // Asegúrate que la ruta sea correcta
import './PedidosPendientes.css'; // Asegúrate que la ruta sea correcta

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
      alert('Error al marcar pedido en camino. Inténtalo de nuevo.'); // Notificación al usuario
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
        // IMPORTANTE: Asegúrate de que el puerto del backend sea correcto (3000 o 3001)
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

  // Asumimos que los estilos de loading/empty ya están definidos globalmente o en PedidosRepartidor.css
  if (loading) return <div className="loading">Cargando pedidos pendientes...</div>;
  if (error) return <div className="error">Error: {error.message}</div>; // Cambiado a clase error genérica

  const pedidos: Pedido[] = data?.pedidosPendientesRepartidor || [];

  return (
    <div className="pedidos-pendientes-root">
      {/* Header adaptado al estilo top-banner */}
      <div className="top-banner">
        <button className="icon-btn" onClick={() => navigate(-1)} title="Volver">
          <img src="https://img.icons8.com/ios-filled/28/ffffff/left.png" alt="Volver" />
        </button>
        <span className="top-banner-text">Mis Pedidos Pendientes</span>
        <div style={{ width: 28, height: 28 }}></div> {/* Espaciador para centrar el título */}
      </div>
      
      <main className="pedidos-pendientes-main-content"> {/* Nuevo contenedor para el contenido principal */}
        {pedidos.length === 0 ? (
          <div className="no-pedidos">No tienes pedidos pendientes.</div>
        ) : (
          <div className="pedidos-grid"> 
            {pedidos.map((pedido) => (
              <div className="pedido-card" key={pedido._id}> {/* Reutilizar clase pedido-card */}
                <h3>{pedido.nombrePedido}</h3>
                <span className={`estado ${pedido.enCamino ? 'en-camino' : 'pendiente'}`}> {/* Clase 'estado' y sub-clases */}
                  {pedido.enCamino ? 'En Camino' : 'Pendiente'}
                </span>
                
                <div className="pedido-info-sections"> {/* Contenedor para las secciones de info */}
                  <div className="seccion-cliente info-section-card"> {/* Clase general y especifica */}
                    <h4>👤 Cliente</h4>
                    <p><strong>Nombre:</strong> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}</p>
                    <p><strong>Dirección:</strong> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}</p>
                    <p><strong>Entrega:</strong> {pedido.direccionEntrega}</p>
                  </div>

                  <div className="seccion-local info-section-card"> {/* Clase general y especifica */}
                    <h4>🏪 Local</h4>
                    <p><strong>Nombre:</strong> {pedido.local.nombreLocal}</p>
                    <p><strong>Retiro:</strong> {pedido.local.direccion}</p>
                  </div>

                  <div className="seccion-pedido info-section-card"> {/* Clase general y especifica */}
                    <h4>📦 Detalles del Pedido</h4>
                    <p><strong>Total:</strong> ${pedido.precioPedido.toLocaleString('es-CL')}</p>
                    {pedido.propina && pedido.cantidadPropina && (
                      <p><strong>Propina:</strong> ${pedido.cantidadPropina.toLocaleString('es-CL')}</p>
                    )}
                    
                    <div className="comidas-lista">
                      <p><strong>Comidas:</strong></p>
                      <ul>
                        {pedido.comidas.map((c, idx) => (
                          <li key={idx}>
                            {c.nombre} x{c.cantidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div> {/* Fin de pedido-info-sections */}

                {!pedido.enCamino && (
                  <button
                    className="card-button primary-button" // Usar card-button y una clase adicional para color
                    onClick={() => handleMarcarEnCamino(pedido._id)}
                  >
                    🚚 Marcar En Camino
                  </button>
                )}

                {pedido.enCamino && (
                  <div className="estado-en-camino-accion"> {/* Nueva clase para el div */}
                    <p className="en-camino-message">🚚 Pedido en camino - Puedes marcar como entregado cuando llegues</p>
                    <button
                      className="card-button secondary-button" // Usar card-button y una clase adicional para color
                      onClick={() => {/* TODO: Implementar con GraphQL también */}}
                    >
                      ✅ Marcar Entregado
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PedidosPendientes;