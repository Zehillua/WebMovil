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
    <div className="repartidor-dashboard">
      <nav className="navbar-repartidor">
        <div className="logo-centered">Panel Repartidor</div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      <div className="main-actions">
        <button onClick={() => navigate('/repartidor/pedidos')}>Pedidos Disponibles</button>
        <button onClick={() => navigate('/repartidor/pendientes')}>Pedidos Pendientes</button>
        <button onClick={() => navigate('/repartidor/en-camino')}>Pedidos En Camino</button> {/* ✅ NUEVO BOTÓN */}
        <button>Historial de Entregas</button>
        <button>Estadísticas</button>
      </div>
    </div>
  );
};

export default RepartidorDashboard;