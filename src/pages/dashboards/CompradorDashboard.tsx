// CompradorDashboard.tsx (Unificado y Funcional)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompradorDashboard.css';

// Define las interfaces para Local y Producto
// Asegúrate de que estos tipos coincidan con la estructura de datos que tu backend retorna.
interface Local {
  _id: string; // El ID de MongoDB para el local
  nombreLocal: string; // El nombre del local
  // Si tu backend retorna más campos para un local, añádelos aquí.
}

interface Producto {
  _id: string; // El ID de MongoDB para el producto
  nombre: string;
  localNombre: string; // Nombre del local al que pertenece el producto (asumo que tu producto tiene esto)
  imagenURL: string; // URL de la imagen del producto
  precio: number; // Ejemplo, asumiendo que los productos tienen un precio
  // Agrega aquí otros campos que tu backend retorne para un producto (ej. descripcion, categoria)
}

const CompradorDashboard: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [localSeleccionado, setLocalSeleccionado] = useState<string | null>(null); // Guarda el nombre del local
  const [locales, setLocales] = useState<Local[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Protección de ruta: redirige si no hay token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Función para obtener los locales del backend
  const fetchLocales = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/locatarios'); // URL de tu API para locales
      if (!response.ok) {
        throw new Error(`Error al cargar locales: ${response.status} ${response.statusText}`);
      }
      const data: Local[] = await response.json();
      setLocales(data);
    } catch (err: any) {
      console.error("Error al cargar locales:", err);
      setError(err.message || "Error al cargar locales disponibles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para obtener los productos del backend
  const fetchProductos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Asumo que tienes un endpoint para obtener todos los productos, o un endpoint para productos por local
      // Si tienes productos asociados a locales, tu API debería exponerlos.
      const response = await fetch('http://localhost:3000/productos'); // URL de tu API para productos
      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
      }
      const data: Producto[] = await response.json();
      setProductos(data);
    } catch (err: any) {
      console.error("Error al cargar productos:", err);
      setError(err.message || "Error al cargar productos disponibles.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    fetchLocales();
    fetchProductos();
  }, [fetchLocales, fetchProductos]); // Se ejecutará una vez al montar, y si las funciones cambian (poco probable)

  // Manejador de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario'); // Eliminar también el tipo de usuario si lo guardas
    navigate('/', { replace: true });
  };

  // Filtrado de locales por la barra de búsqueda superior (también afecta a la sidebar)
  const localesFiltrados = locales.filter((local) =>
    local.nombreLocal.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtrado de productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.localNombre.toLowerCase().includes(busqueda.toLowerCase());

    const coincideLocalSeleccionado = localSeleccionado
      ? producto.localNombre === localSeleccionado
      : true; // Si no hay local seleccionado, todos los productos son válidos por local

    return coincideBusqueda && coincideLocalSeleccionado;
  });

  return (
    <div className="comprador-dashboard">
      {/* Barra superior */}
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
          <button className="icon-btn" onClick={() => navigate('/perfil')} title="Perfil">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/user.png" alt="Perfil" />
          </button>
          <button className="icon-btn logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/exit.png" alt="Cerrar sesión" />
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* Barra lateral */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Locales del Vecindario</h3>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Filtrar locales..."
            value={busqueda} // Este input también filtra la lista de locales en la sidebar
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <ul className="lista-locales">
            {isLoading ? (
              <li><p className="loading-message">Cargando locales...</p></li>
            ) : error ? (
              <li><p className="error-message">{error}</p></li>
            ) : localesFiltrados.length > 0 ? (
              localesFiltrados.map((local) => (
                <li key={local._id}> {/* Usa _id de MongoDB */}
                  <button
                    className={`local-button ${localSeleccionado === local.nombreLocal ? 'selected' : ''}`}
                    onClick={() => setLocalSeleccionado(local.nombreLocal)}
                  >
                    {local.nombreLocal}
                  </button>
                </li>
              ))
            ) : (
              <li><p className="no-data-message">No hay locales disponibles.</p></li>
            )}
          </ul>
          {localSeleccionado && (
            <button
              className="local-button clear-selection-button"
              onClick={() => setLocalSeleccionado(null)}
            >
              Ver todos los productos
            </button>
          )}
        </aside>

        {/* Zona principal de productos */}
        <main className="productos-section">
          <h2 className="productos-title">
            {localSeleccionado ? `Menú de ${localSeleccionado}` : 'Productos disponibles'}
          </h2>
          <div className="productos-grid">
            {isLoading ? (
              <p className="loading-message">Cargando productos...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div className="producto-card" key={producto._id}> {/* Usa _id de MongoDB */}
                  {/* Asegúrate de que `producto.imagenURL` sea la URL correcta */}
                  <img src={producto.imagenURL} alt={producto.nombre} className="producto-imagen" />
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-local-info">De: {producto.localNombre}</p>
                    <p className="producto-precio">${producto.precio ? producto.precio.toLocaleString('es-CL') : 'N/A'}</p> {/* Formato de precio Chile */}
                    <button className="add-to-cart-button">Agregar al Carrito</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products-message">
                {localSeleccionado
                  ? `No se encontraron productos para "${localSeleccionado}".`
                  : `No se encontraron productos que coincidan con tu búsqueda.`}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompradorDashboard;