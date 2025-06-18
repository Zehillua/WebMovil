import React, { useEffect, useState } from 'react';
import './PedidosView.css';

interface Pedido {
  _id: string;
  estado: string;
  fecha: string;
  items: {
    nombreComida: string;
    cantidad: number;
    precio: number;
    imagenUrl?: string;
  }[];
}

const PedidosView: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resUser.ok) return;
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
  }, []);

  return (
    <div className="pedidos-root">
      <h2 className="pedidos-title">Mis pedidos pendientes</h2>
      {loading ? (
        <div className="pedidos-loading">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="pedidos-empty">No tienes pedidos pendientes.</div>
      ) : (
        <div className="pedidos-list">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id}>
              <div className="pedido-header">
                <span className="pedido-estado">{pedido.estado}</span>
                <span className="pedido-fecha">{new Date(pedido.fecha).toLocaleString()}</span>
              </div>
              <div className="pedido-items">
                {pedido.items.map((item, idx) => (
                  <div className="pedido-item" key={idx}>
                    <img
                      src={item.imagenUrl || 'https://img.icons8.com/ios-filled/40/cccccc/meal.png'}
                      alt={item.nombreComida}
                      className="pedido-item-img"
                    />
                    <div className="pedido-item-info">
                      <div className="pedido-item-nombre">{item.nombreComida}</div>
                      <div className="pedido-item-cantidad">Cantidad: {item.cantidad}</div>
                      <div className="pedido-item-precio">
                        Precio: ${(item.precio * item.cantidad).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosView;