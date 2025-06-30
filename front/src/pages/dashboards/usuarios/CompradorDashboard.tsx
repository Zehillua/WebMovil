// CompradorDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompradorDashboard.css';

// Interfaces (mantener las mismas)
interface Local {
    _id: string;
    nombreLocal: string;
}

interface Producto {
    _id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    ingredientes: string[];
    descripcion: string;
    imagenUrl: string;
    locatarioId: string; // Referencia al locatario
    localNombre: string; // Agregado manualmente en el frontend
}

const CompradorDashboard: React.FC = () => {
    const [busqueda, setBusqueda] = useState('');
    const [localSeleccionado, setLocalSeleccionado] = useState<string | null>(null);
    const [locales, setLocales] = useState<Local[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Protección de ruta
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    // Obtener locales
    const fetchLocales = useCallback(async () => {
        try {
            // Asegúrate que el puerto del backend para locales sea correcto (3000)
            const response = await fetch('http://localhost:3000/locatarios');
            if (!response.ok) throw new Error(`Error al cargar locales: ${response.status} ${response.statusText}`);
            const data: Local[] = await response.json();
            setLocales(data);
            return data;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al cargar locales");
            return [];
        }
    }, []);

    // Obtener productos
    const fetchProductos = useCallback(async (localesData: Local[]) => {
        try {
            let productosAcumulados: Producto[] = [];
            for (const local of localesData) {
                // Asegúrate que el puerto del backend para comidas sea correcto (3001)
                const response = await fetch(`http://localhost:3001/comidas/locatario/${local._id}`);
                if (response.ok) {
                    const data = await response.json();
                    const productosConLocal = data.map((prod: any) => ({
                        ...prod,
                        localNombre: local.nombreLocal,
                    }));
                    productosAcumulados = [...productosAcumulados, ...productosConLocal];
                }
            }
            setProductos(productosAcumulados);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al cargar productos");
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetchLocales().then((localesData) => {
            fetchProductos(localesData).finally(() => setIsLoading(false));
        });
    }, [fetchLocales, fetchProductos]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tipoUsuario');
        navigate('/', { replace: true });
    };

    // Función para agregar al carrito
    const handleAgregarCarrito = async (producto: Producto) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            return;
        }

        try {
            // Primero obtenemos el id del comprador (usuario logueado):
            // Asegúrate que el puerto del backend para usuarios sea correcto (3000)
            const resUser = await fetch('http://localhost:3000/usuarios/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!resUser.ok) {
                const errorData = await resUser.json();
                throw new Error(errorData?.message || 'No se pudo obtener la información del usuario.');
            }
            const userData = await resUser.json();
            const idComprador = userData.userId || userData._id; // Asegura que obtienes el ID correcto

            // Construimos el DTO esperado:
            const body = {
                idLocatario: producto.locatarioId,
                nombreLocal: producto.localNombre,
                nombreComida: producto.nombre,
                cantidad: 1, // siempre 1 por ahora
                precio: producto.precio
            };

            // Asegúrate que el puerto del backend para carrito sea correcto (3002)
            const res = await fetch(`http://localhost:3002/carrito/${idComprador}/agregar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || 'Error al agregar al carrito.');
            }

            alert('Producto agregado al carrito exitosamente.');
        } catch (err: any) {
            console.error(err);
            alert(`Hubo un problema: ${err.message}`);
        }
    };

    const productosFiltrados = productos.filter((producto) => {
        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.localNombre.toLowerCase().includes(busqueda.toLowerCase());

        const coincideLocalSeleccionado = localSeleccionado
            ? producto.localNombre === localSeleccionado
            : true;

        return coincideBusqueda && coincideLocalSeleccionado;
    });

    return (
        <div className="comprador-dashboard">
            <nav className="navbar-dashboard">
                <div className="navbar-section logo-section">
                    <span className="logo">VeciMarket</span>
                </div>
                <div className="navbar-section search-section">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar locales o productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="navbar-section icons-section">
                    <button className="icon-btn" onClick={() => navigate('/carrito')} title="Carrito">
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/shopping-cart.png" alt="Carrito" />
                    </button>
                    <button
                        className="icon-btn"
                        onClick={() => navigate('/cartera')}
                        title="Cartera"
                    >
                        <img
                            src="https://img.icons8.com/ios-filled/28/ffffff/wallet-app.png" // Cambiado a icono blanco para consistencia
                            alt="Cartera"
                        />
                    </button>
                    <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/user.png" alt="Perfil" />
                    </button>
                    <button className="icon-btn logout-btn" onClick={handleLogout} title="Cerrar sesión">
                        <img src="https://img.icons8.com/ios-filled/28/ffffff/exit.png" alt="Cerrar sesión" />
                    </button>
                </div>
            </nav>

            <div className="dashboard-body">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="card-container"> {/* Contenedor de la tarjeta */}
                        <h3 className="card-title">Locales del Vecindario</h3> {/* Título usando card-title */}
                        <input
                            type="text"
                            className="text-input" /* Usar clase general de input */
                            placeholder="Filtrar locales..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <ul className="lista-locales">
                            {isLoading ? (
                                <li><p className="loading-message">Cargando locales...</p></li>
                            ) : error ? (
                                <li><p className="error-message">{error}</p></li>
                            ) : locales.map((local) => (
                                <li key={local._id}>
                                    <button
                                        className={`list-button ${localSeleccionado === local.nombreLocal ? 'selected-list-button' : ''}`} /* Clases para botones de lista */
                                        onClick={() => setLocalSeleccionado(local.nombreLocal)}
                                    >
                                        {local.nombreLocal}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {localSeleccionado && (
                            <button
                                className="clear-filter-button" /* Clase para botón de limpiar filtro */
                                onClick={() => setLocalSeleccionado(null)}
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                </aside>

                {/* Zona de productos */}
                <main className="productos-section">
                    <div className="card-container"> {/* Contenedor de la tarjeta */}
                        <h2 className="card-title"> {/* Título usando card-title */}
                            {localSeleccionado ? `Menú de ${localSeleccionado}` : 'Productos disponibles'}
                        </h2>
                        <div className="productos-grid">
                            {isLoading ? (
                                <p className="loading-message">Cargando productos...</p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <div className="product-item-card" key={producto._id}> {/* Clase para tarjeta de producto individual */}
                                        <img
                                            src={
                                                producto.imagenUrl
                                                    ? producto.imagenUrl.startsWith('/uploads/')
                                                        ? `http://localhost:3001${producto.imagenUrl}`
                                                        : producto.imagenUrl
                                                    : 'https://via.placeholder.com/200x140?text=Sin+Imagen'
                                            }
                                            alt={producto.nombre}
                                            className="product-image" /* Clase para imagen de producto */
                                        />
                                        <div className="product-details"> {/* Contenedor de detalles del producto */}
                                            <h3 className="product-name">{producto.nombre}</h3> {/* Clase para nombre de producto */}
                                            <p className="product-local-name">De: {producto.localNombre}</p> {/* Clase para nombre del local en producto */}
                                            <p className="product-price"><strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')}</p> {/* Clase para precio */}
                                            <button className="button-primary" onClick={() => handleAgregarCarrito(producto)}> {/* Clase general de botón primario */}
                                                Agregar al Carrito
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data-message">No se encontraron productos.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompradorDashboard;