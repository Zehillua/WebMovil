import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RepartidorDashboard.css';
import { useNavigate } from 'react-router-dom';

interface Pedido {
  _id: string;
  nombreComprador: string;
  local: string;
  direccionEntrega: string;
  estado: string;
  comidas: {
    producto: { nombre: string };
    cantidad: number;
  }[];
  total: number;
}

const RepartidorDashboard: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usuarioId = localStorage.getItem('id'); // Requiere que esté almacenado

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get<Pedido[]>(`http://localhost:3000/pedidos/usuario/${usuarioId}`);
        setPedidos(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los pedidos asignados.');
      }
    };

    fetchPedidos();
  }, [usuarioId]);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      await axios.patch(`http://localhost:3000/pedidos/${id}/estado`, {
        estado: nuevoEstado,
      });
      setPedidos(prev =>
        prev.map(pedido =>
          pedido._id === id ? { ...pedido, estado: nuevoEstado } : pedido
        )
      );
    } catch (err) {
      console.error('Error al cambiar el estado:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="repartidor-dashboard">
      <header className="header-banner">
        <div className="header-left">Bienvenido, Repartidor — gestiona tus entregas</div>
        <div className="header-center">Panel Repartidor</div>
        <div className="header-right-icons">
          <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/user.png" alt="Perfil" />
          </button>
          <button className="icon-btn" onClick={() => navigate('/repartidor/pedidos')} title="Pedidos Disponibles">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/box.png" alt="Pedidos Disponibles" />
          </button>
          <button className="icon-btn logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/exit.png" alt="Salir" />
          </button>
        </div>
      </header>

      <main className="dashboard-body">
        <h2 className="seccion-titulo">Pedidos Asignados</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="pedidos-grid">
          {pedidos.map(pedido => (
            <div key={pedido._id} className="pedido-card">
              <h3 className="pedido-titulo">{pedido.nombreComprador}</h3>
              <p><strong>Local:</strong> {pedido.local}</p>
              <p><strong>Dirección:</strong> {pedido.direccionEntrega}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <ul>
                {pedido.comidas.map((item, idx) => (
                  <li key={idx}>
                    {item.producto.nombre} x{item.cantidad}
                  </li>
                ))}
              </ul>

              {pedido.estado === 'pendiente' && (
                <button
                  className="local-button"
                  onClick={() => cambiarEstado(pedido._id, 'en camino')}
                >
                  Marcar En Camino
                </button>
              )}

              {pedido.estado === 'en camino' && (
                <button
                  className="local-button"
                  onClick={() => cambiarEstado(pedido._id, 'entregado')}
                >
                  Marcar Entregado
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RepartidorDashboard;
