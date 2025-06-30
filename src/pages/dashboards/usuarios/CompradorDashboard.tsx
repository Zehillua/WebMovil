import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client'; // ✅ AGREGAR IMPORT
import { GET_PEDIDOS_PENDIENTES_VALORACION } from '../../../apollo/queries'; // ✅ AGREGAR IMPORT
import './CompradorDashboard.css';

interface Local {
  _id: string;
  nombreLocal: string;
}

const CompradorDashboard: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [locales, setLocales] = useState<Local[]>([]);
  const [userId, setUserId] = useState<string>(''); // ✅ AGREGAR STATE
  const navigate = useNavigate();

  // ✅ NUEVA QUERY para pedidos pendientes de valoración:
  const { data: dataPendientes } = useQuery(GET_PEDIDOS_PENDIENTES_VALORACION, {
    variables: { userId },
    skip: !userId,
    pollInterval: 30000, // Revisar cada 30 segundos
    errorPolicy: 'all'
  });

  // Protección de ruta: redirige si no hay token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // ✅ NUEVO USEEFFECT para obtener userId:
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }
      
      try {
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!resUser.ok) {
          navigate('/', { replace: true });
          return;
        }
        
        const userData = await resUser.json();
        setUserId(userData.userId || userData._id);
      } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        navigate('/', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  // Obtener locales tipo locatario desde el backend
  useEffect(() => {
    const fetchLocales = async () => {
      const response = await fetch('http://localhost:3000/locatarios');
      if (response.ok) {
        const data = await response.json();
        setLocales(data);
      }
    };
    fetchLocales();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    navigate('/', { replace: true });
  };

  // Filtrar locales por búsqueda
  const localesFiltrados = locales.filter((l) =>
    l.nombreLocal.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ✅ CALCULAR PEDIDOS PENDIENTES:
  const pedidosPendientes = dataPendientes?.pedidosPendientesValoracion || [];
  const tieneValoracionesPendientes = pedidosPendientes.length > 0;

  return (
    <div className="comprador-dashboard">
      {/* Barra superior */}
      <nav className="navbar-opt">
        <div className="navbar-section logo-section">
          <span className="logo">VeciMarket</span>
        </div>
        <div className="navbar-section search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar locales..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="navbar-section icons-section">
          <button
            className="icon-btn logout-btn"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <img
              src="https://img.icons8.com/ios-filled/28/d87a9c/logout-rounded-left.png"
              alt="Cerrar sesión"
            />
          </button>
          <button
            className="icon-btn"
            onClick={() => navigate('/cartera')}
            title="Cartera"
          >
            <img
              src="https://img.icons8.com/ios-filled/28/d87a9c/wallet-app.png"
              alt="Cartera"
            />
          </button>
          <button
            className="icon-btn"
            onClick={() => navigate('/pedidos')}
            title="Pedidos"
          >
            <img
              src="https://img.icons8.com/ios-filled/28/d87a9c/order-history.png"
              alt="Pedidos"
            />
          </button>
          <button className="icon-btn" onClick={() => navigate('/carrito')} title="Carrito">
            <img src="https://img.icons8.com/ios-filled/28/d87a9c/shopping-cart.png" alt="Carrito" />
          </button>
          <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
            <img src="https://img.icons8.com/ios-filled/28/d87a9c/user.png" alt="Perfil" />
          </button>
          
          {/* ✅ BOTÓN DE HISTORIAL CON BADGE DE NOTIFICACIÓN: */}
          <button
            className={`icon-btn ${tieneValoracionesPendientes ? 'icon-btn-notification' : ''}`}
            onClick={() => navigate('/historial')}
            title={tieneValoracionesPendientes 
              ? `Historial (${pedidosPendientes.length} pendientes de valorar)` 
              : "Historial de Pedidos"
            }
          >
            <div className="icon-container">
              <img
                src="https://img.icons8.com/ios-filled/28/d87a9c/clock--v1.png"
                alt="Historial"
              />
              {/* ✅ BADGE DE NOTIFICACIÓN: */}
              {tieneValoracionesPendientes && (
                <span className="notification-badge">
                  {pedidosPendientes.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Grilla central de locales */}
      <div className="locales-section">
        <h2 className="locales-title">Locales disponibles</h2>
        <div className="locales-grid">
          {localesFiltrados.length === 0 ? (
            <div style={{ color: '#888', marginTop: '2rem' }}>
              No hay locales disponibles.
            </div>
          ) : (
            localesFiltrados.map((local) => (
              <div
                className="local-card"
                key={local._id}
                onClick={() => navigate(`/local/${local._id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter') navigate(`/local/${local._id}`); }}
              >
                <span className="local-nombre">{local.nombreLocal}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompradorDashboard;