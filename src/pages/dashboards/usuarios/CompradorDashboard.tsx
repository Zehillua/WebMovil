import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client'; // ✅ APOLLO CLIENT
import { GET_PEDIDOS_PENDIENTES_VALORACION } from '../../../apollo/queries'; // ✅ QUERIES
import { useAuth } from '../../../hooks/useAuth';
import './CompradorDashboard.css';

interface Local {
  _id: string;
  nombreLocal: string;
  numeroLocal?: string;
  descripcion?: string;
  imagen?: string;
  valoracion?: number;
  tiempoEntrega?: string;
  categorias?: string[];
  estado?: string;
}

const CompradorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [locales, setLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState(''); // ✅ BÚSQUEDA
  const [userId, setUserId] = useState<string>(''); // ✅ USER ID PARA GRAPHQL

  // ✅ QUERY PARA PEDIDOS PENDIENTES DE VALORACIÓN
  const { data: dataPendientes } = useQuery(GET_PEDIDOS_PENDIENTES_VALORACION, {
    variables: { userId },
    skip: !userId,
    pollInterval: 30000, // Revisar cada 30 segundos
    errorPolicy: 'all'
  });

  // ✅ OBTENER USER ID AL CARGAR
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

  // ✅ CARGAR LOCALES (INTENTAR MÚLTIPLES ENDPOINTS)
  useEffect(() => {
    cargarLocales();
  }, []);

  const cargarLocales = async () => {
  try {
    // ✅ USAR EL ENDPOINT CORRECTO DEL AUTH
    const response = await fetch('http://localhost:3000/locatarios');
    
    if (response.ok) {
      const data = await response.json();
      console.log('Locales cargados:', data);
      setLocales(data);
    } else {
      setError('Error cargando locales');
    }
  } catch (error) {
    console.error('Error:', error);
    setError('Error de conexión');
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // ✅ FUNCIONES DE NAVEGACIÓN
  const navegarCarrito = () => {
    console.log('🛒 Navegando al carrito...');
    navigate('/comprador/carrito');
  };

  const navegarPedidos = () => {
    console.log('📦 Navegando a pedidos...');
    navigate('/comprador/pedidos');
  };

  const navegarCartera = () => {
    console.log('💰 Navegando a cartera...');
    navigate('/comprador/cartera');
  };

  const navegarHistorial = () => {
    console.log('📋 Navegando a historial...');
    navigate('/comprador/historial');
  };

  // ✅ FILTRAR LOCALES POR BÚSQUEDA
  const localesFiltrados = locales.filter((local) =>
    local.nombreLocal.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ✅ CALCULAR PEDIDOS PENDIENTES
  const pedidosPendientes = dataPendientes?.pedidosPendientesValoracion || [];
  const tieneValoracionesPendientes = pedidosPendientes.length > 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star-filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star-half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="comprador-dashboard">
      {/* NAVBAR MEJORADO */}
      <nav className="navbar-comprador">
        <div className="navbar-brand">
          🍕 VeciMarket
        </div>
        
        {/* ✅ BARRA DE BÚSQUEDA */}
        <div className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar locales..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <div className="navbar-user-info">
          {user && (
            <span className="user-greeting">
              Hola, {user.nombreUsuario || user.nombre}
            </span>
          )}
        </div>

        <div className="navbar-actions">
          <button 
            onClick={navegarCarrito}
            className="nav-btn carrito-btn"
            title="Ver carrito"
          >
            🛒 Carrito
          </button>
          
          <button 
            onClick={navegarPedidos}
            className="nav-btn pedidos-btn"
            title="Mis pedidos"
          >
            📦 Pedidos
          </button>
          
          <button 
            onClick={navegarCartera}
            className="nav-btn cartera-btn"
            title="Mi cartera"
          >
            💰 Cartera
          </button>
          
          {/* ✅ BOTÓN DE HISTORIAL CON NOTIFICACIÓN */}
          <button 
            onClick={navegarHistorial}
            className={`nav-btn historial-btn ${tieneValoracionesPendientes ? 'has-notification' : ''}`}
            title={tieneValoracionesPendientes 
              ? `Historial (${pedidosPendientes.length} pendientes de valorar)` 
              : "Historial de Pedidos"
            }
          >
            <div className="btn-content">
              📋 Historial
              {/* ✅ BADGE DE NOTIFICACIÓN */}
              {tieneValoracionesPendientes && (
                <span className="notification-badge">
                  {pedidosPendientes.length}
                </span>
              )}
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="nav-btn logout-btn"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>¡Bienvenido a VeciMarket!</h1>
          <p>Descubre los mejores locales de comida y haz tu pedido</p>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="quick-actions">
          <div className="action-card" onClick={navegarCarrito}>
            <div className="action-icon">🛒</div>
            <h3>Mi Carrito</h3>
            <p>Ver productos agregados</p>
          </div>
          
          <div className="action-card" onClick={navegarPedidos}>
            <div className="action-icon">📦</div>
            <h3>Mis Pedidos</h3>
            <p>Seguir estado de pedidos</p>
          </div>
          
          <div className="action-card" onClick={navegarCartera}>
            <div className="action-icon">💰</div>
            <h3>Mi Cartera</h3>
            <p>Gestionar saldo</p>
          </div>
          
          <div 
            className={`action-card ${tieneValoracionesPendientes ? 'has-pending' : ''}`} 
            onClick={navegarHistorial}
          >
            <div className="action-icon">📋</div>
            <h3>Historial</h3>
            <p>
              Ver pedidos anteriores
              {tieneValoracionesPendientes && (
                <span className="pending-text">
                  ({pedidosPendientes.length} por valorar)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* LOCALES DISPONIBLES */}
        <div className="locales-section">
          <h2>Locales Disponibles</h2>
          
          {loading && (
            <div className="loading">Cargando locales...</div>
          )}
          
          {error && (
            <div className="error">{error}</div>
          )}
          
          {!loading && !error && (
            <div className="locales-grid">
              {localesFiltrados.length === 0 ? (
                <div className="no-results">
                  {busqueda ? 
                    `No se encontraron locales para "${busqueda}"` : 
                    'No hay locales disponibles'
                  }
                </div>
              ) : (
                localesFiltrados.map(local => (
                  <div 
                    key={local._id} 
                    className="local-card"
                    onClick={() => navigate(`/local/${local._id}`)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={e => { if (e.key === 'Enter') navigate(`/local/${local._id}`); }}
                  >
                    <div className="local-image">
                      {local.imagen ? (
                        <img src={local.imagen} alt={local.nombreLocal} />
                      ) : (
                        <div className="local-placeholder">🏪</div>
                      )}
                    </div>
                    
                    <div className="local-info">
                      <h3>{local.nombreLocal}</h3>
                      {local.descripcion && (
                        <p className="local-descripcion">{local.descripcion}</p>
                      )}
                      
                      {local.valoracion !== undefined && (
                        <div className="local-rating">
                          {renderStars(local.valoracion)}
                          <span className="rating-number">({local.valoracion.toFixed(1)})</span>
                        </div>
                      )}
                      
                      <div className="local-details">
                        {local.tiempoEntrega && (
                          <span className="tiempo-entrega">⏱️ {local.tiempoEntrega}</span>
                        )}
                        {local.estado && (
                          <span className={`estado ${local.estado.toLowerCase()}`}>
                            {local.estado === 'abierto' ? '🟢' : '🔴'} {local.estado}
                          </span>
                        )}
                      </div>
                      
                      {local.categorias && local.categorias.length > 0 && (
                        <div className="local-categorias">
                          {local.categorias.map((categoria, index) => (
                            <span key={index} className="categoria-tag">
                              {categoria}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompradorDashboard;