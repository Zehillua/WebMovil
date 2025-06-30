// RepartidorDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RepartidorDashboard.css';

const RepartidorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <div className="repartidor-root">
      {/* Banner superior al estilo de Home.tsx */}
      <div className="top-banner">
        <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
          <img src="https://img.icons8.com/ios-filled/28/ffffff/user.png" alt="Perfil" />
        </button>
        <span className="top-banner-text">Panel Repartidor</span> {/* Título en el centro */}
        <button className="icon-btn" onClick={handleLogout} title="Cerrar sesión">
          <img src="https://img.icons8.com/ios-filled/28/ffffff/exit.png" alt="Salir" />
        </button>
      </div>

      <main className="repartidor-dashboard-body">
        <h2 className="dashboard-title">Panel de Repartidor</h2> {/* Título principal más descriptivo */}
        <button className="repartidor-action-btn" onClick={() => navigate('/repartidor/pedidos')}>
          📦 Pedidos Disponibles
        </button>
        <button className="repartidor-action-btn" onClick={() => navigate('/repartidor/pendientes')}>
          🕒 Pedidos Pendientes
        </button>
        <button className="repartidor-action-btn" onClick={() => navigate('/repartidor/en-camino')}>
          🚚 Pedidos en Camino
        </button>
        <button className="repartidor-action-btn" disabled>
          📜 Historial de Entregas
        </button>
        <button className="repartidor-action-btn" disabled>
          📊 Estadísticas
        </button>
      </main>
    </div>
  );
};

export default RepartidorDashboard;