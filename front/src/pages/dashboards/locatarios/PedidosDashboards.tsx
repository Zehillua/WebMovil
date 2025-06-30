import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidosDashboards.css';

interface Pedido {
  _id: string;
  nombrePedido: string;
  estado: boolean; // true = aceptado/en preparación, false = en espera
  fechaPedido: string;
  direccionEntrega?: string;
  precioPedido: number;
  pago: string;
  propina?: boolean;
  cantidadPropina?: number;
  dealer?: boolean; // true = repartidor asignado, false = sin asignar
  repartidor?: string | null;
  comidas?: { nombre: string; cantidad: number }[];
  estadoRechazado?: boolean; // true = rechazado por el local
  listo?: boolean; // true = pedido listo para retiro/envío
}

const PedidosDashboards: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }
      try {
        setLoading(true);
        // Obtener el id del locatario logeado
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) {
          navigate('/', { replace: true });
          return;
        }
        const userData = await resUser.json();
        const idLocal = userData.userId || userData._id;

        // Obtener pedidos relacionados a este local
        const resPedidos = await fetch(`http://localhost:3002/pedidos/local/${idLocal}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resPedidos.ok) {
          const data = await resPedidos.json();
          setPedidos(data);
        } else {
          console.error('Error al cargar pedidos:', resPedidos.statusText);
          showMessage('error', 'Error al cargar los pedidos.');
        }
      } catch (error) {
        console.error('Error cargando pedidos:', error);
        showMessage('error', 'Error de conexión al cargar pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
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

  const handleActualizarEstado = async (pedidoId: string, nuevoEstado: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('error', 'No autorizado. Por favor, inicie sesión.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (response.ok) {
        setPedidos(pedidos =>
          pedidos.map(p =>
            p._id === pedidoId ? { ...p, estado: nuevoEstado } : p
          )
        );
        showMessage('success', 'Estado del pedido actualizado correctamente.');
      } else {
        const errorData = await response.json();
        showMessage('error', `Error al actualizar estado: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      showMessage('error', 'Error de conexión al actualizar estado.');
    }
  };

  const handleRechazarPedido = async (pedidoId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('error', 'No autorizado. Por favor, inicie sesión.');
      return;
    }
    handleConfirm('¿Estás seguro de que quieres rechazar este pedido? Esta acción no se puede deshacer.', async () => {
      try {
        const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}/rechazar`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setPedidos(pedidos =>
            pedidos.map(p =>
              p._id === pedidoId ? { ...p, estadoRechazado: true } : p
            )
          );
          showMessage('success', 'Pedido rechazado correctamente.');
        } else {
          const errorData = await response.json();
          showMessage('error', `Error al rechazar pedido: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error rechazando pedido:', error);
        showMessage('error', 'Error de conexión al rechazar pedido.');
      } finally {
        closeConfirm();
      }
    });
  };

  const handleMarcarListo = async (pedidoId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showMessage('error', 'No autorizado. Por favor, inicie sesión.');
      return;
    }
    handleConfirm('¿Estás seguro de que quieres marcar este pedido como listo?', async () => {
      try {
        const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}/listo`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setPedidos(pedidos =>
            pedidos.map(p =>
              p._id === pedidoId ? { ...p, listo: true } : p
            )
          );
          showMessage('success', 'Pedido marcado como listo.');
        } else {
          const errorData = await response.json();
          showMessage('error', `Error al marcar pedido como listo: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error marcando pedido como listo:', error);
        showMessage('error', 'Error de conexión al marcar pedido como listo.');
      } finally {
        closeConfirm();
      }
    });
  };

  return (
    <div className="pedidos-dashboard-root">
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

      <div className="pedidos-dashboard-header">
        <button className="pedidos-dashboard-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-dashboard-title">Pedidos de mi Local</span>
        <div style={{ width: 32 }}></div> {/* Placeholder for alignment */}
      </div>
      {loading ? (
        <div className="pedidos-dashboard-loading">
          <div className="loading-spinner">🔄</div>
          <p>Cargando pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="pedidos-dashboard-empty">
          <span className="empty-icon">📦</span>
          <h3>No hay pedidos para tu local.</h3>
          <p>Cuando los clientes realicen un pedido, aparecerán aquí.</p>
        </div>
      ) : (
        <div className="pedidos-dashboard-list">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id}>
              <div className="pedido-header">
                <span className="pedido-nombre">{pedido.nombrePedido}</span>
                <span className={`pedido-estado pedido-estado-${
                  pedido.estadoRechazado
                    ? 'cancelado'
                    : pedido.listo
                      ? 'completado'
                      : pedido.estado // 'estado' true means accepted/in preparation
                        ? 'preparando' // If accepted, it's preparing
                        : 'en-espera' // If not accepted, it's en espera
                }`}>
                  {pedido.estadoRechazado
                    ? 'Cancelado'
                    : pedido.listo
                      ? 'Completado'
                      : pedido.estado
                        ? 'Preparando'
                        : 'En Espera'}
                </span>
              </div>
              <div className="pedido-details">
                <div className="detail-item">
                  <b>Fecha:</b> {pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString('es-CL') : 'Sin fecha'}
                </div>
                <div className="detail-item">
                  <b>Total:</b> {typeof pedido.precioPedido === 'number'
                    ? `$${pedido.precioPedido.toLocaleString('es-CL')}`
                    : 'Sin total'}
                </div>
                <div className="detail-item">
                  <b>Método:</b> {pedido.pago}
                </div>
                {pedido.comidas && pedido.comidas.length > 0 && (
                  <div className="detail-item meals-list">
                    <b>Comidas:</b>
                    <ul>
                      {pedido.comidas.map((c, idx) => (
                        <li key={idx}>
                          {c.nombre} x{c.cantidad}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pedido.direccionEntrega && (
                  <div className="detail-item">
                    <b>Dirección:</b> {pedido.direccionEntrega}
                  </div>
                )}
                {pedido.propina && typeof pedido.cantidadPropina === 'number' ? (
                  <div className="detail-item">
                    <b>Propina:</b> ${pedido.cantidadPropina.toLocaleString('es-CL')}
                  </div>
                ) : null}
                <div className="detail-item">
                  <b>Repartidor:</b> {pedido.dealer ? 'Asignado' : 'Sin asignar'}
                </div>
                {pedido.repartidor && (
                  <div className="detail-item">
                    <b>ID Repartidor:</b> {pedido.repartidor}
                  </div>
                )}
              </div>
              <div className="pedido-acciones">
                {pedido.estadoRechazado ? (
                  <span className="action-message-cancelado">Pedido cancelado por el local.</span>
                ) : pedido.listo ? (
                  <span className="action-message-completado">Pedido completado.</span>
                ) : pedido.estado ? ( // Pedido aceptado y en preparación
                  <button
                    className="btn-pedido-listo"
                    onClick={() => handleMarcarListo(pedido._id)}
                  >
                    Marcar como Listo
                  </button>
                ) : ( // Pedido en espera
                  <>
                    <button
                      className="btn-aceptar"
                      onClick={() => handleActualizarEstado(pedido._id, true)}
                    >
                      Aceptar Pedido
                    </button>
                    <button
                      className="btn-rechazar"
                      onClick={() => handleRechazarPedido(pedido._id)}
                    >
                      Rechazar Pedido
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosDashboards;
