// LocatarioDashboard.tsx (Actualizado con CSS y estructura)
import React, { useState, useEffect } from 'react';
import './LocatarioDashboard.css'; // Asegúrate de que esta ruta sea correcta
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la redirección

interface Producto {
  id?: number; // 'id' puede ser opcional si usas '_id' de MongoDB
  _id?: string; // ID de MongoDB
  nombre: string;
  ingredientes: string[];
  descripcion: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string; // URL de la imagen
}

const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '', // Lo mantenemos como string para el input
    cantidad: '', // Lo mantenemos como string para el input
    ingredientes: '', // string separado por comas
    descripcion: '',
    // imagenUrl: '', // No lo necesitamos en el formulario directamente, lo manejamos con el File
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true); // Nuevo estado para carga de productos
  const [productsError, setProductsError] = useState<string | null>(null); // Nuevo estado para errores de productos

  const navigate = useNavigate(); // Inicializar useNavigate

  // Protección de ruta (re-habilitada y usando navigate)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('tipoUsuario'); // Si guardas el tipo de usuario

    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    // Opcional: Si quieres que solo los locatarios accedan a este dashboard
    // if (userType !== 'locatario') {
    //   navigate('/ruta-no-autorizada', { replace: true }); // O redirigir a un dashboard genérico
    //   return;
    // }

    // Si todo está bien, fetch de productos
    fetchComidas();
  }, [navigate]); // Añadir navigate a las dependencias del useEffect

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario'); // Asegúrate de limpiar también el tipo de usuario
    navigate('/', { replace: true }); // Usar navigate para redirigir
  };

  const fetchComidas = async () => {
    setLoadingProducts(true);
    setProductsError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingProducts(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/comidas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar los productos.');
      }
    } catch (err: any) {
      console.error("Error al cargar comidas:", err);
      setProductsError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
    }
  };

  const subirImagen = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagen', file);
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/comidas/upload', { // Asegúrate que esta URL sea correcta
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined, // No Content-Type aquí para FormData
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir la imagen');
    }
    const data = await response.json();
    return data.url; // Asumo que el backend retorna { url: "..." }
  };

  const agregarProducto = async (producto: {
    nombre: string;
    precio: number;
    cantidad: number;
    ingredientes: string[];
    descripcion: string;
    imagenUrl?: string;
  }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No autenticado');
    }
    const response = await fetch('http://localhost:3001/comidas', { // Asegúrate que esta URL sea correcta
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al agregar producto');
    }
    return response.json();
  };

  const handleAgregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, precio, cantidad, ingredientes, descripcion } = formulario;
    if (!nombre || !precio || !cantidad || !ingredientes || !descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    const ingredientesArray = ingredientes.split(',').map(i => i.trim()).filter(i => i);
    let imagenUrl = '';

    // Validar y convertir valores numéricos
    const parsedPrecio = parseFloat(precio);
    const parsedCantidad = parseInt(cantidad, 10);

    if (isNaN(parsedPrecio) || isNaN(parsedCantidad)) {
        alert('Precio y Cantidad deben ser números válidos.');
        return;
    }

    if (imagenFile) {
      try {
        imagenUrl = await subirImagen(imagenFile);
      } catch (err: any) {
        alert('Error al subir la imagen: ' + err.message);
        return;
      }
    }
    try {
      await agregarProducto({
        nombre,
        precio: parsedPrecio,
        cantidad: parsedCantidad,
        ingredientes: ingredientesArray,
        descripcion,
        imagenUrl: imagenUrl || undefined,
      });
      alert('Producto agregado correctamente');
      limpiarFormulario();
      setMostrarFormulario(false);
      fetchComidas(); // Vuelve a cargar la lista de productos
    } catch (err: any) {
      alert(err.message);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      precio: '',
      cantidad: '',
      ingredientes: '',
      descripcion: '',
      // imagenUrl: '', // No necesario aquí
    });
    setImagenFile(null);
  };

  return (
    <div className="locatario-dashboard">
      <div className="top-banner">
        <span className="top-banner-text">
          Bienvenido, Locatario — gestiona tus productos y promociones
        </span>
      </div>

      <nav className="navbar-locatario">
        <div className="logo-centered">Panel Locatario</div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      {/* Título principal del dashboard */}
      <h2 className="dashboard-title">Tus Productos</h2>

      {/* Contenedor de acciones principales */}
      <div className="main-actions-container">
        <button onClick={() => setMostrarFormulario(true)}>Agregar Producto</button>
        <button>Agregar Promoción</button>
        <button>Edición de productos</button>
        <button>Top Ventas</button>
        <button>Top Deliverys</button>
      </div>

      {/* Contenedor principal de los productos */}
      <div className="products-section-wrapper">
        {loadingProducts ? (
          <div className="no-products">Cargando productos...</div>
        ) : productsError ? (
          <div className="no-products error-message">Error: {productsError}</div>
        ) : productos.length === 0 ? (
          <div className="no-products">No hay productos registrados. ¡Agrega uno!</div>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => (
              <div className="producto-card" key={producto._id || producto.id}> {/* Usar _id de MongoDB */}
                <img
                  src={
                    producto.imagenUrl
                      ? producto.imagenUrl.startsWith('/uploads/') // Si es una ruta relativa del backend
                        ? `http://localhost:3001${producto.imagenUrl}` // Concatena con la URL base del backend
                        : producto.imagenUrl // Si es una URL externa (ej. de un CDN)
                      : 'https://via.placeholder.com/200x140?text=Sin+Imagen' // Placeholder si no hay imagen
                  }
                  alt={producto.nombre}
                />
                <h3>{producto.nombre}</h3>
                <p><strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')}</p> {/* Formato CLP */}
                <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                <p><strong>Ingredientes:</strong> {producto.ingredientes?.join(', ')}</p>
                <p>{producto.descripcion}</p>
                <div className="card-buttons">
                    <button>Editar</button>
                    <button>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario emergente (Modal) */}
      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="add-product-form" onClick={(e) => e.stopPropagation()}> {/* Previene cierre al hacer clic dentro del formulario */}
            <button className="close-button" onClick={() => { setMostrarFormulario(false); limpiarFormulario(); }}>×</button>
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleAgregarProducto}>
              <label htmlFor="nombre">Nombre del Producto:</label>
              <input type="text" id="nombre" name="nombre" placeholder="Ej: Pizza Artesanal" value={formulario.nombre} onChange={handleInputChange} required />

              <label htmlFor="precio">Precio:</label>
              <input type="number" id="precio" name="precio" placeholder="Ej: 9990" value={formulario.precio} onChange={handleInputChange} min="0" step="0.01" required />

              <label htmlFor="cantidad">Cantidad Disponible:</label>
              <input type="number" id="cantidad" name="cantidad" placeholder="Ej: 50" value={formulario.cantidad} onChange={handleInputChange} min="0" required />

              <label htmlFor="ingredientes">Ingredientes (separados por coma):</label>
              <input type="text" id="ingredientes" name="ingredientes" placeholder="Ej: Harina, Tomate, Queso" value={formulario.ingredientes} onChange={handleInputChange} required />

              <label htmlFor="descripcion">Descripción:</label>
              <textarea id="descripcion" name="descripcion" placeholder="Una breve descripción de tu producto..." value={formulario.descripcion} onChange={handleTextareaChange} rows={3} required />

              <label htmlFor="imagenFile">Imagen del Producto:</label>
              <input type="file" id="imagenFile" accept="image/*" onChange={handleFileChange} />

              <button type="submit">Agregar Producto</button>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante para agregar producto */}
      <button className="floating-add-button" onClick={() => { setMostrarFormulario(true); limpiarFormulario(); }}>
        +
      </button>
    </div>
  );
};

export default LocatarioDashboard;