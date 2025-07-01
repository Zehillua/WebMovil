import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_EN_CAMINO_REPARTIDOR, ENTREGAR_PEDIDO } from '../../../apollo/queries';
import './PedidosEnCamino.css';

// Interface for User data
interface Usuario {
  nombre: string;
  apellido: string;
  nombreUsuario?: string; // Optional username
  direccion: string;
  numeroCasaDepto?: string; // Optional apartment/house number
}

// Interface for Local data
interface Local {
  nombreLocal: string;
  direccion: string;
}

// Interface for Pedido (Order) data
interface Pedido {
  _id: string;
  nombrePedido: string;
  precioPedido: number;
  direccionEntrega: string;
  propina?: boolean; // Optional tip flag
  cantidadPropina?: number; // Optional tip amount
  comidas: { nombre: string; cantidad: number }[]; // Array of meals
  enCamino: boolean; // Flag if order is in transit
  pedidoEntregado: boolean; // Flag if order is delivered
  codigoPedido: number; // Order code for delivery confirmation
  usuario: Usuario; // User who placed the order
  local: Local; // Local from which the order is placed
}

const PedidosEnCamino: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  // State to store the input code for each order
  const [codigoInput, setCodigoInput] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  // State for displaying messages (success/error)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  // State for confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');


  // GraphQL Query with auto-refresh (polling every 5 seconds)
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_EN_CAMINO_REPARTIDOR, {
    variables: { idRepartidor: userId },
    skip: !userId, // Skip query if userId is not available
    pollInterval: 5000, // Auto-refresh every 5 seconds
    errorPolicy: 'all' // Continue fetching even if some errors occur
  });

  // GraphQL Mutation to deliver an order
  const [entregarPedidoMutation] = useMutation(ENTREGAR_PEDIDO, {
    onCompleted: () => {
      showMessage('success', '¡Pedido entregado exitosamente!');
      refetch(); // Refetch data automatically after mutation
      setCodigoInput({}); // Clear input fields after successful delivery
    },
    onError: (error) => {
      console.error('Error entregando pedido:', error);
      showMessage('error', `Error al entregar pedido: ${error.message}`);
    }
  });

  // Effect to fetch user data and set userId
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true }); // Redirect to home if no token
        return;
      }
      
      try {
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!resUser.ok) {
          navigate('/', { replace: true }); // Redirect if user data fetch fails
          return;
        }
        
        const userData = await resUser.json();
        setUserId(userData.userId || userData._id); // Set userId from user data
      } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        navigate('/', { replace: true }); // Redirect on any fetch error
      }
    };

    fetchUserData();
  }, [navigate]);

  // Function to display messages
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000); // Hide after 5 seconds
  };

  // Function to show confirmation modal
  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action); // Use a functional update for state
    setShowConfirm(true);
  };

  // Function to close confirmation modal
  const closeConfirm = () => {
    setShowConfirm(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  // Handler for delivering an order
  const handleEntregarPedido = async (pedidoId: string) => {
    const codigoIngresado = parseInt(codigoInput[pedidoId]);
    
    if (isNaN(codigoIngresado) || codigoIngresado.toString().length !== 4) {
      showMessage('error', 'Por favor ingresa un código de 4 dígitos válido.');
      return;
    }

    handleConfirm('¿Estás seguro de que el cliente te ha proporcionado el código correcto y deseas marcar este pedido como entregado?', async () => {
      try {
        await entregarPedidoMutation({
          variables: { 
            id: pedidoId, 
            codigoPedido: codigoIngresado 
          }
        });
      } catch (error) {
        // Error handling is done in the mutation's onError callback
      } finally {
        closeConfirm();
      }
    });
  };

  // Handler for input code changes
  const handleCodigoChange = (pedidoId: string, valor: string) => {
    // Only allow numbers and a maximum of 4 digits
    const numeroLimpio = valor.replace(/\D/g, '').slice(0, 4);
    setCodigoInput(prev => ({
      ...prev,
      [pedidoId]: numeroLimpio
    }));
  };

  // Display loading state for orders
  if (loading) {
    return (
      <div className="pedidos-en-camino-loading">
        <div className="loading-spinner">🔄</div>
        <p>Cargando tus pedidos en camino...</p>
      </div>
    );
  }

  // Display error state for orders
  if (error) {
    return (
      <div className="pedidos-en-camino-error">
        <span className="error-icon">⚠️</span>
        <h3>Error al cargar los pedidos en camino.</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()} className="btn-retry">Reintentar</button>
      </div>
    );
  }

  const pedidos: Pedido[] = data?.pedidosEnCaminoRepartidor || [];

  return (
    <div className="pedidos-en-camino-root">
      {/* Message Display */}
      {message && (
        <div className={`message-box message-box-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="message-close-btn">×</button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>{confirmMessage}</p>
            <div className="confirm-actions">
              <button onClick={closeConfirm} className="confirm-cancel-btn">Cancelar</button>
              <button onClick={confirmAction || (() => {})} className="confirm-ok-btn">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="pedidos-en-camino-header">
                <button
          onClick={() => navigate(-1)}
          className="pedidos-en-camino-volver nav-action-btn" // Añadimos la clase nav-action-btn
          title="Volver"
        >
          <img src="https://img.icons8.com/ios-filled/28/ffffff/back.png" alt="Volver" />
          <span className="btn-text">Volver</span>
        </button>

        <span className="pedidos-en-camino-title">Pedidos En Camino</span>
        <div style={{ width: 32 }}></div> {/* Placeholder for alignment */}
      </div>
      
      {pedidos.length === 0 ? (
        <div className="pedidos-en-camino-empty">
          <span className="empty-icon">🎉</span>
          <h3>¡No tienes pedidos en camino!</h3>
          <p>Una vez que aceptes un pedido, aparecerá aquí para que lo entregues.</p>
        </div>
      ) : (
        <div className="pedidos-en-camino-list">
          {pedidos.map((pedido) => (
            <div className="pedido-en-camino-card" key={pedido._id}>
              <div className="pedido-en-camino-header">
                <span className="pedido-en-camino-nombre">{pedido.nombrePedido}</span>
              </div>
              
              <div className="pedido-en-camino-info">
                <div className="seccion-cliente">
                  <h4>👤 Cliente</h4>
                  <div className="info-item">
                    <b>Nombre:</b> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}
                  </div>
                  <div className="info-item">
                    <b>Dirección:</b> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}
                  </div>
                  <div className="info-item">
                    <b>Entregar en:</b> {pedido.direccionEntrega}
                  </div>
                </div>

                <div className="seccion-local">
                  <h4>🏪 Local</h4>
                  <div className="info-item">
                    <b>Retirado de:</b> {pedido.local.nombreLocal}
                  </div>
                  <div className="info-item">
                    <b>Dirección:</b> {pedido.local.direccion}
                  </div>
                </div>

                <div className="seccion-pedido">
                  <h4>📦 Pedido</h4>
                  <div className="info-item total-price">
                    <b>Total:</b> ${pedido.precioPedido.toLocaleString('es-CL')}
                  </div>
                  {pedido.propina && typeof pedido.cantidadPropina === 'number' && (
                    <div className="info-item tip-amount">
                      <b>Propina:</b> ${pedido.cantidadPropina.toLocaleString('es-CL')}
                    </div>
                  )}
                  
                  <div className="comidas-lista">
                    <b>Comidas:</b>
                    <ul>
                      {pedido.comidas.map((c, idx) => (
                        <li key={idx} className="comida-item">
                          {c.nombre} x{c.cantidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="seccion-entrega">
                  <h4>🔑 Confirmar Entrega</h4>
                  <p>El cliente debe proporcionarte el código de 4 dígitos:</p>
                  <div className="codigo-input-container">
                    <input
                      type="text"
                      placeholder="0000"
                      value={codigoInput[pedido._id] || ''}
                      onChange={(e) => handleCodigoChange(pedido._id, e.target.value)}
                      className="codigo-input"
                      maxLength={4}
                    />
                    <button
                      className="btn-entregar"
                      onClick={() => handleEntregarPedido(pedido._id)}
                      disabled={!codigoInput[pedido._id] || codigoInput[pedido._id].length !== 4}
                    >
                      ✅ Entregar Pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosEnCamino;
