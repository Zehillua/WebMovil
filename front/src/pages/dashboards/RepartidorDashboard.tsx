import React, { useState, useEffect } from 'react';
import './RepartidorDashboard.css';

interface Pedido {
  _id: string;
  direccion: string;
  estado: 'Pendiente' | 'En camino' | 'Entregado';
  comprador?: {
    nombre: string;
  };
  productos: {
    producto: {
      nombre: string;
      precio?: number;
      descripcion?: string;
    };
    cantidad: number;
  }[];
}

const RepartidorDashboard: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3002/pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        alert("Error al cargar pedidos.");
      }
    } catch (err) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const avanzarEstado = async (pedido: Pedido) => {
    const nuevoEstado =
      pedido.estado === 'Pendiente'
        ? 'En camino'
        : pedido.estado === 'En camino'
        ? 'Entregado'
        : pedido.estado;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/pedidos/${pedido._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        fetchPedidos();
      } else {
        alert("Error al actualizar estado.");
      }
    } catch (err) {
      alert("Error de conexión al actualizar.");
    }
  };

  return (
    <div className="repartidor-dashboard">
      <div className="top-banner">
        <span className="top-banner-text">Panel Repartidor - Entregas en curso</span>
      </div>

      <h2 className="dashboard-title">Tus Pedidos</h2>

      {loading ? (
        <p className="loading">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="no-pedidos">No hay pedidos asignados por ahora.</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id}>
              <h3>{pedido.comprador?.nombre || 'Local desconocido'}</h3>
              <p><strong>Dirección:</strong> {pedido.direccion}</p>
              <p><strong>Estado:</strong>{' '}
                <span className={`estado ${pedido.estado.replace(' ', '-').toLowerCase()}`}>
                  {pedido.estado}
                </span>
              </p>
              <p><strong>Productos:</strong></p>
              <ul>
                {pedido.productos.map((item, index) => (
                  <li key={index}>
                    {item.cantidad} × {item.producto?.nombre || 'Producto'}
                  </li>
                ))}
              </ul>
              {pedido.estado !== 'Entregado' && (
                <button onClick={() => avanzarEstado(pedido)}>
                  {pedido.estado === 'Pendiente' ? 'Aceptar Pedido' : 'Marcar como Entregado'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepartidorDashboard;
