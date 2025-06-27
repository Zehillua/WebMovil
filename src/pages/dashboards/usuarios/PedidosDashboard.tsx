import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidosDashboard.css';

interface Pedido {
  _id: string;
  estado: boolean;
  fechaPedido: string;
  nombrePedido: string;
  nombreLocal?: string; 
  direccionLocal?: string;
  precioPedido: number;
  pago: string;
  propina?: boolean;
  cantidadPropina?: number;
  dealer?: boolean;
  repartidor?: string | null;
}

const PedidosDashboard: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resUser.ok) {
        navigate('/', { replace: true });
        return;
      }
      const userData = await resUser.json();
      const idComprador = userData.userId || userData._id;

      const resPedidos = await fetch(`http://localhost:3002/pedidos/usuario/${idComprador}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resPedidos.ok) {
        const data = await resPedidos.json();
        setPedidos(data);
      }
      setLoading(false);
    };
    fetchPedidos();
  }, [navigate]);

  return (
    <div className="pedidos-dashboard-root">
      <div className="pedidos-dashboard-header">
        <button className="pedidos-dashboard-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-dashboard-title">VeciMarket - Mis Pedidos</span>
        <div style={{ width: 32 }}></div>
      </div>
      {loading ? (
        <div className="pedidos-dashboard-loading">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="pedidos-dashboard-empty">No tienes pedidos registrados.</div>
      ) : (
        <div className="pedidos-dashboard-list">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id}>
              <div className="pedido-header">
                <span className="pedido-nombre">
                  {pedido.nombrePedido}
                  {pedido.nombreLocal && (
                    <span className="pedido-local"> — {pedido.nombreLocal}</span>
                  )}
                  </span>
                <span className={`pedido-estado pedido-estado-${pedido.estado ? 'listo' : 'preparando'}`}>
                  {pedido.estado ? 'Listo' : 'Preparando'}
                </span>
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
                {pedido.nombreLocal && pedido.direccionLocal && (
                  <span>
                    <b>Dirección local:</b> {pedido.direccionLocal}
                  </span>
                )}
                {pedido.propina && pedido.cantidadPropina ? (
                  <span>
                    <b>Propina:</b> ${pedido.cantidadPropina}
                  </span>
                ) : null}
                <span>
                  <b>Estado:</b> {pedido.estado ? 'Listo' : 'Preparando'}
                </span>
                <span>
                  <b>Repartidor:</b> {pedido.dealer ? 'En camino' : 'Sin asignar'}
                </span>
                {pedido.repartidor && (
                  <span>
                    ID Repartidor: {pedido.repartidor}
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