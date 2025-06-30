// CompradorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PEDIDOS_PENDIENTES_VALORACION } from '../../../apollo/queries'; // Asegúrate que la ruta es correcta
import { useAuth } from '../../../hooks/useAuth';
import './CompradorDashboard.css'; // Importa nuestro archivo CSS

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
    const { user, logout } = useAuth(); // Asumiendo que useAuth ya está bien configurado
    const [locales, setLocales] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const [userId, setUserId] = useState<string>('');

    // QUERY PARA PEDIDOS PENDIENTES DE VALORACIÓN
    const { data: dataPendientes } = useQuery(GET_PEDIDOS_PENDIENTES_VALORACION, {
        variables: { userId },
        skip: !userId,
        pollInterval: 30000,
        errorPolicy: 'all'
    });

    // OBTENER USER ID AL CARGAR
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
                    // Si el token es inválido o no se puede obtener el usuario, redirige
                    logout(); // Cierra sesión si el token no es válido
                    navigate('/', { replace: true });
                    return;
                }

                const userData = await resUser.json();
                setUserId(userData.userId || userData._id); // Asegura que obtienes el ID correcto
            } catch (error) {
                console.error('Error obteniendo datos de usuario:', error);
                logout(); // En caso de error, también cierra sesión
                navigate('/', { replace: true });
            }
        };

        fetchUserData();
    }, [navigate, logout]); // Añadir logout a dependencias para useCallback

    // CARGAR LOCALES
    useEffect(() => {
        cargarLocales();
    }, []);

    const cargarLocales = async () => {
        try {
            const response = await fetch('http://localhost:3000/locatarios'); // Usar el endpoint de Auth Service
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
        logout(); // Llama a la función logout del hook useAuth
        navigate('/', { replace: true });
    };

    // FUNCIONES DE NAVEGACIÓN
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

    // FILTRAR LOCALES POR BÚSQUEDA
    const localesFiltrados = locales.filter((local) =>
        local.nombreLocal.toLowerCase().includes(busqueda.toLowerCase())
    );

    // CALCULAR PEDIDOS PENDIENTES
    const pedidosPendientes = dataPendientes?.pedidosPendientesValoracion || [];
    const tieneValoracionesPendientes = pedidosPendientes.length > 0;

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className="star-filled">★</span>);
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
        <div className="comprador-dashboard-container"> {/* Contenedor principal de la página */}
            {/* NAVBAR MEJORADO */}
            <nav className="navbar-comprador">
                <div className="navbar-brand">
                    <span className="logo-text">VeciMarket</span>
                </div>

                {/* BARRA DE BÚSQUEDA */}
                <div className="navbar-search">
                    <input
                        type="text"
                        className="text-input search-input-navbar" // Clase para input general y específico de navbar
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
                        className="nav-action-btn" // Botón de acción general de la navbar
                        title="Ver carrito"
                    >
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/shopping-cart.png" alt="Carrito" />
                        <span className="btn-text">Carrito</span>
                    </button>

                    <button
                        onClick={navegarPedidos}
                        className="nav-action-btn"
                        title="Mis pedidos"
                    >
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/box.png" alt="Pedidos" />
                        <span className="btn-text">Pedidos</span>
                    </button>

                    <button
                        onClick={navegarCartera}
                        className="nav-action-btn"
                        title="Mi cartera"
                    >
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/wallet-app.png" alt="Cartera" />
                        <span className="btn-text">Cartera</span>
                    </button>

                    {/* BOTÓN DE HISTORIAL CON NOTIFICACIÓN */}
                    <button
                        onClick={navegarHistorial}
                        className={`nav-action-btn ${tieneValoracionesPendientes ? 'has-notification' : ''}`}
                        title={tieneValoracionesPendientes
                            ? `Historial (${pedidosPendientes.length} pendientes de valorar)`
                            : "Historial de Pedidos"
                        }
                    >
                        <div className="btn-content-icon"> {/* Contenedor para icono y texto */}
                            <img src="https://img.icons8.com/ios-filled/28/ffffff/time-machine--v1.png" alt="Historial" />
                            <span className="btn-text">Historial</span>
                            {/* BADGE DE NOTIFICACIÓN */}
                            {tieneValoracionesPendientes && (
                                <span className="notification-badge-nav">
                                    {pedidosPendientes.length}
                                </span>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="nav-action-btn logout-btn"
                        title="Cerrar sesión"
                    >
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/exit.png" alt="Cerrar sesión" />
                        <span className="btn-text">Salir</span>
                    </button>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <div className="main-content-area">
                <section className="welcome-section card-style"> {/* Usamos card-style aquí */}
                    <h1 className="welcome-title">¡Bienvenido a VeciMarket! 👋</h1>
                    <p className="welcome-subtitle">Descubre los mejores locales de comida de tu vecindario y haz tu pedido fácilmente.</p>
                </section>

                {/* ACCIONES RÁPIDAS */}
                <section className="quick-actions-section">
                    <h2 className="section-title">Acciones Rápidas</h2>
                    <div className="quick-actions-grid">
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
                            className={`action-card ${tieneValoracionesPendientes ? 'has-pending-badge' : ''}`}
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
                </section>

                {/* LOCALES DISPONIBLES */}
                <section className="locales-section">
                    <h2 className="section-title">Locales Disponibles</h2>

                    {loading && (
                        <div className="status-message loading-message">Cargando locales...</div>
                    )}

                    {error && (
                        <div className="status-message error-message">{error}</div>
                    )}

                    {!loading && !error && (
                        <div className="locales-grid">
                            {localesFiltrados.length === 0 ? (
                                <div className="no-results-message">
                                    {busqueda ?
                                        `No se encontraron locales para "${busqueda}"` :
                                        'No hay locales disponibles.'
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
                                        <div className="local-image-container">
                                            {local.imagen ? (
                                                <img src={local.imagen} alt={local.nombreLocal} className="local-image" />
                                            ) : (
                                                <div className="local-image-placeholder">
                                                    <span role="img" aria-label="tienda">🏪</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="local-info-content">
                                            <h3 className="local-name">{local.nombreLocal}</h3>
                                            {local.descripcion && (
                                                <p className="local-description">{local.descripcion}</p>
                                            )}

                                            {local.valoracion !== undefined && (
                                                <div className="local-rating">
                                                    {renderStars(local.valoracion)}
                                                    <span className="rating-number">({local.valoracion.toFixed(1)})</span>
                                                </div>
                                            )}

                                            <div className="local-status-time">
                                                {local.tiempoEntrega && (
                                                    <span className="time-badge">⏱️ {local.tiempoEntrega}</span>
                                                )}
                                                {local.estado && (
                                                    <span className={`status-badge ${local.estado.toLowerCase()}`}>
                                                        {local.estado === 'abierto' ? '🟢 Abierto' : '🔴 Cerrado'}
                                                    </span>
                                                )}
                                            </div>

                                            {local.categorias && local.categorias.length > 0 && (
                                                <div className="local-categories">
                                                    {local.categorias.map((categoria, index) => (
                                                        <span key={index} className="category-tag">
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
                </section>
            </div>
        </div>
    );
};

export default CompradorDashboard;