import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; // Importar el hook de autenticación
import './RepartidorDashboard.css';

const RepartidorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Usar el hook para acceder al usuario y la función de logout

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout(); // Llama a la función de logout del hook de autenticación
    navigate('/', { replace: true }); // Redirige al usuario a la página de inicio
  };

  return (
    <div className="repartidor-dashboard">
      {/* Barra de navegación del repartidor */}
      <nav className="navbar-repartidor">
        <div className="logo-centered">
          🚗 Panel Repartidor
          {/* Muestra el nombre de usuario o el nombre completo del repartidor si está disponible */}
          {user && (
            <small style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>
              Bienvenido, {user.usuarioRepartidor || `${user.nombre} ${user.apellido}`}
            </small>
          )}
        </div>
        {/* Botón para cerrar sesión */}
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      {/* Sección principal de acciones del repartidor */}
      <div className="main-actions">
        {/* Botones de navegación a diferentes secciones de pedidos */}
        <button className="action-btn" onClick={() => navigate('/repartidor/pedidos')}>
          Pedidos Disponibles
        </button>
        <button className="action-btn" onClick={() => navigate('/repartidor/pendientes')}>
          Mis Pedidos Pendientes
        </button>
        <button className="action-btn" onClick={() => navigate('/repartidor/en-camino')}>
          Pedidos En Camino
        </button>
        <button className="action-btn" onClick={() => navigate('/repartidor/historial')}>
          Historial de Entregas
        </button>
        {/* Botón para la sección de estadísticas (funcionalidad no implementada en este TSX) */}
        <button className="action-btn" onClick={() => navigate('/repartidor/estadisticas')}>
          Estadísticas
        </button>
      </div>
    </div>
  );
};

export default RepartidorDashboard;
