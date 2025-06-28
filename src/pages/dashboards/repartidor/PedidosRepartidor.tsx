import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidosRepartidor.css';

interface Pedido {
  _id: string;
  nombrePedido: string;
  nombreLocal: string;
  direccionLocal: string;
  direccionEntrega: string;
  precioPedido: number;
  propina: boolean;
  cantidadPropina?: number;
  comidas: { nombre: string; cantidad: number }[];
  dealer: boolean;
  enCamino: boolean;
  pedidoEntregado: boolean;
}

const PedidosRepartidor: React.FC = () => {
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

      const resPedidos = await fetch(`http://localhost:3002/pedidos/delivery/disponibles`, {
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

  const handleAceptarPedido = async (pedidoId: string) => {
    const token = localStorage.getItem('token');
    const resUser = await fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await resUser.json();
    const idRepartidor = userData.userId || userData._id;

    await fetch(`http://localhost:3002/pedidos/${pedidoId}/aceptar-repartidor`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ idRepartidor }),
    });

    setPedidos(pedidos => pedidos.filter(p => p._id !== pedidoId));
  };

  return (
    <div className="pedidos-repartidor-root">
      <div className="pedidos-repartidor-header">
        <button className="pedidos-repartidor-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-repartidor-title">Pedidos Delivery Disponibles</span>
        <div style={{ width: 32 }}></div>
      </div>
      {loading ? (
        <div className="pedidos-repartidor-loading">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="pedidos-repartidor-empty">No hay pedidos delivery disponibles.</div>
      ) : (
        <div className="pedidos-repartidor-list">
          {pedidos.map((pedido) => (
            <div className="pedido-repartidor-card" key={pedido._id}>
              <div className="pedido-repartidor-header">
                <span className="pedido-repartidor-nombre">{pedido.nombrePedido}</span>
                <span className="pedido-repartidor-local">{pedido.nombreLocal}</span>
              </div>
              <div className="pedido-repartidor-info">
                <span><b>Retirar en:</b> {pedido.direccionLocal}</span>
                <span><b>Entregar en:</b> {pedido.direccionEntrega}</span>
                <span><b>Total:</b> ${pedido.precioPedido.toLocaleString()}</span>
                {pedido.propina && pedido.cantidadPropina && (
                  <span><b>Propina:</b> ${pedido.cantidadPropina}</span>
                )}
                <div className="comidas-lista">
                  <b>Comidas:</b>
                  {pedido.comidas.map((c, idx) => (
                    <div key={idx} className="comida-item">
                      {c.nombre} x{c.cantidad}
                    </div>
                  ))}
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