import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; // ✅ IMPORTAR EL HOOK
import './RepartidorDashboard.css';

const RepartidorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ USAR EL HOOK

  const handleLogout = () => {
    logout(); // ✅ USAR FUNCIÓN DEL HOOK
    navigate('/', { replace: true });
  };

  return (
    <div className="repartidor-dashboard">
      <nav className="navbar-repartidor">
        <div className="logo-centered">
          🚗 Panel Repartidor
          {/* ✅ MOSTRAR INFORMACIÓN DEL REPARTIDOR */}
          {user && (
            <small style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>
              {user.usuarioRepartidor || `${user.nombre} ${user.apellido}`}
            </small>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      <div className="main-actions">
        <button onClick={() => navigate('/repartidor/pedidos')}>Pedidos Disponibles</button>
        <button onClick={() => navigate('/repartidor/pendientes')}>Pedidos Pendientes</button>
        <button onClick={() => navigate('/repartidor/en-camino')}>Pedidos En Camino</button>
        <button onClick={() => navigate('/repartidor/historial')}>Historial de Entregas</button>
        <button>Estadísticas</button>
      </div>
    </div>
  );
};

export default RepartidorDashboard;