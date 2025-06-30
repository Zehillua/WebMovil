import React, { useState } from 'react'; // Import useState for message handling
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PEDIDOS_DELIVERY_COMPLETO } from '../../../apollo/queries';
import './PedidosRepartidor.css';

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
  usuario: Usuario; // User who placed the order
  local: Local; // Local from which the order is placed
}

const PedidosRepartidor: React.FC = () => {
  const navigate = useNavigate();
  // State for displaying messages (success/error)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  // State for confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // GraphQL Query with auto-refresh (polling every 5 seconds)
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_DELIVERY_COMPLETO, {
    pollInterval: 5000, // Auto-refresh every 5 seconds
    errorPolicy: 'all' // Continue fetching even if some errors occur
  });

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

  // Handler for accepting an order
  const handleAceptarPedido = async (pedidoId: string) => {
    handleConfirm('¿Estás seguro de que quieres aceptar este pedido? Una vez aceptado, no podrás revertirlo.', async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showMessage('error', 'No autorizado. Por favor, inicie sesión.');
          closeConfirm();
          return;
        }

        // Get the logged-in delivery person's ID
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) {
          showMessage('error', 'Error al obtener datos del repartidor.');
          closeConfirm();
          return;
        }
        const userData = await resUser.json();
        const idRepartidor = userData.userId || userData._id;

        // Call backend to accept the order
        const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}/aceptar-repartidor`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idRepartidor }),
        });

        if (response.ok) {
          showMessage('success', '¡Pedido aceptado con éxito! Dirígete al local.');
          // Automatically refresh data after successful acceptance
          refetch();
        } else {
          const errorData = await response.json();
          showMessage('error', `Error al aceptar pedido: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error aceptando pedido:', error);
        showMessage('error', 'Error de conexión al aceptar pedido.');
      } finally {
        closeConfirm(); // Close the confirmation modal regardless of success/failure
      }
    });
  };

  // Display loading state
  if (loading) {
    return (
      <div className="pedidos-repartidor-loading">
        <div className="loading-spinner">🔄</div>
        <p>Cargando pedidos disponibles...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="pedidos-repartidor-error">
        <span className="error-icon">⚠️</span>
        <h3>Error al cargar los pedidos.</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()} className="btn-retry">Reintentar</button>
      </div>
    );
  }

  const pedidos: Pedido[] = data?.pedidosDeliveryDisponibles || [];

  return (
    <div className="pedidos-repartidor-root">
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

      <div className="pedidos-repartidor-header">
        <button className="pedidos-repartidor-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-repartidor-title">Pedidos Delivery Disponibles</span>
        <div style={{ width: 32 }}></div> {/* Placeholder for alignment */}
      </div>
      
      {pedidos.length === 0 ? (
        <div className="pedidos-repartidor-empty">
          <span className="empty-icon">🎉</span>
          <h3>¡No hay pedidos delivery disponibles por ahora!</h3>
          <p>Vuelve más tarde, nuevos pedidos pueden aparecer pronto.</p>
        </div>
      ) : (
        <div className="pedidos-repartidor-list">
          {pedidos.map((pedido) => (
            <div className="pedido-repartidor-card" key={pedido._id}>
              <div className="pedido-repartidor-header">
                <span className="pedido-repartidor-nombre">{pedido.nombrePedido}</span>
                <span className="pedido-repartidor-local">{pedido.local.nombreLocal}</span>
              </div>
              <div className="pedido-repartidor-info">
                <div className="info-item">
                  <b>Cliente:</b> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}
                </div>
                <div className="info-item">
                  <b>Dirección cliente:</b> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}
                </div>
                <div className="info-item">
                  <b>Retirar en:</b> {pedido.local.nombreLocal} - {pedido.local.direccion}
                </div>
                <div className="info-item">
                  <b>Entregar en:</b> {pedido.direccionEntrega}
                </div>
                <div className="info-item total-price">
                  <b>Total:</b> ${pedido.precioPedido.toLocaleString('es-CL')}
                </div>
                {pedido.propina && typeof pedido.cantidadPropina === 'number' && (
                  <div className="info-item tip-amount">
                    <b>Propina:</b> ${pedido.cantidadPropina.toLocaleString('es-CL')}
                  </div>
                )}
                <div className="comidas-lista">
                  <b>Comidas a retirar:</b>
                  <ul>
                    {pedido.comidas.map((c, idx) => (
                      <li key={idx} className="comida-item">
                        {c.nombre} x{c.cantidad}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="btn-aceptar-pedido"
                  onClick={() => handleAceptarPedido(pedido._id)}
                >
                  Aceptar Pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosRepartidor;
