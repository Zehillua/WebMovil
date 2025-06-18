// LocatarioDashboard.tsx (Completo con Edición y Eliminación de Productos, y Promociones)
import React, { useState, useEffect } from 'react';
import './LocatarioDashboard.css';
import { useNavigate } from 'react-router-dom';

interface Producto {
  id?: number;
  _id?: string; // ID de MongoDB (preferido si usas MongoDB)
  nombre: string;
  ingredientes: string[];
  descripcion: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

interface Promocion {
  _id?: string;
  nombre: string;
  descripcion: string;
  tipoDescuento: 'porcentaje';
  valorDescuento: number;
  productosAplicables: string[];
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    ingredientes: '',
    descripcion: '',
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Para agregar/editar producto
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [mostrarTopVentas, setMostrarTopVentas] = useState(false);
  const [mostrarTopDeliverys, setMostrarTopDeliverys] = useState(false);

  // Estados para el formulario de Promoción
  const [mostrarFormularioPromocion, setMostrarFormularioPromocion] = useState(false);
  const [formularioPromocion, setFormularioPromocion] = useState({
    nombre: '',
    descripcion: '',
    valorDescuento: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [availableProductsForPromo, setAvailableProductsForPromo] = useState<Producto[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // ESTADO para el producto que se está editando
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    fetchComidas();
  }, [navigate]);

  // Cargar productos disponibles para la promoción cuando el formulario de promoción se abre
  useEffect(() => {
    const fetchAllProductsForPromo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No autenticado para cargar productos de promoción.');
        return;
      }
      try {
        const response = await fetch('http://localhost:3001/comidas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAvailableProductsForPromo(data);
        } else {
          console.error('Error al cargar productos para la promoción:', await response.json());
          alert('Error al cargar productos disponibles para la promoción.');
        }
      } catch (error) {
        console.error('Error de red al cargar productos para la promoción:', error);
        alert('Error de red al cargar productos disponibles para la promoción.');
      }
    };

    if (mostrarFormularioPromocion) {
      fetchAllProductsForPromo();
    } else {
      setAvailableProductsForPromo([]);
      setSelectedProductIds([]);
    }
  }, [mostrarFormularioPromocion]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    navigate('/', { replace: true });
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

  // ----- Manejadores del Formulario de Producto (Agregar/Editar) -----
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
    const response = await fetch('http://localhost:3001/comidas/upload', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir la imagen');
    }
    const data = await response.json();
    return data.url;
  };

  const agregarProducto = async (producto: Omit<Producto, '_id' | 'id'>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No autenticado');
    }
    const response = await fetch('http://localhost:3001/comidas', {
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

  // Función para actualizar producto
  const actualizarProducto = async (productId: string, updatedProduct: Partial<Omit<Producto, '_id' | 'id'>>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No autenticado');
    }
    const response = await fetch(`http://localhost:3001/comidas/${productId}`, {
      method: 'PUT', // Usamos PUT para actualizar, aunque PATCH también sería válido si solo se envían los campos modificados
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar producto');
    }
    return response.json();
  };


  // Función unificada para manejar el envío del formulario (Agregar/Editar)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, precio, cantidad, ingredientes, descripcion } = formulario;
    const ingredientesArray = ingredientes.split(',').map(i => i.trim()).filter(i => i);

    const parsedPrecio = parseFloat(precio);
    const parsedCantidad = parseInt(cantidad, 10);

    if (!nombre || !precio || !cantidad || !ingredientes || !descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    if (isNaN(parsedPrecio) || parsedCantidad < 0) { // Cantidad no puede ser negativa
      alert('Precio y Cantidad deben ser números válidos y Cantidad no puede ser negativa.');
      return;
    }

    let finalImagenUrl = editingProduct?.imagenUrl; // Mantiene la imagen existente si no se cambia

    if (imagenFile) { // Si se seleccionó un nuevo archivo de imagen
      try {
        finalImagenUrl = await subirImagen(imagenFile);
      } catch (err: any) {
        alert('Error al subir la nueva imagen: ' + err.message);
        return;
      }
    }

    const productData = {
      nombre,
      precio: parsedPrecio,
      cantidad: parsedCantidad,
      ingredientes: ingredientesArray,
      descripcion,
      imagenUrl: finalImagenUrl || undefined,
    };

    try {
      if (editingProduct && editingProduct._id) { // Si estamos editando un producto existente
        await actualizarProducto(editingProduct._id, productData);
        alert('Producto actualizado correctamente');
      } else { // Si estamos agregando un nuevo producto
        await agregarProducto(productData);
        alert('Producto agregado correctamente');
      }
      limpiarFormulario(); // Limpia el formulario y el estado de edición
      setMostrarFormulario(false);
      fetchComidas(); // Refresca la lista de productos
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Función para limpiar el formulario de producto y el estado de edición
  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      precio: '',
      cantidad: '',
      ingredientes: '',
      descripcion: '',
    });
    setImagenFile(null);
    setEditingProduct(null); // MUY IMPORTANTE: Resetear el producto en edición
  };

  // Función para manejar la acción de "Editar" en una tarjeta de producto
  const handleEditProduct = (product: Producto) => {
    setEditingProduct(product); // Establece el producto que se va a editar
    setFormulario({ // Pre-llena el formulario con los datos del producto
      nombre: product.nombre,
      precio: product.precio.toString(),
      cantidad: product.cantidad.toString(),
      ingredientes: product.ingredientes.join(', '),
      descripcion: product.descripcion,
    });
    setImagenFile(null); // No hay nuevo archivo seleccionado aún
    setMostrarFormulario(true); // Abre el modal de formulario
    // Cierra cualquier otro modal que pudiera estar abierto
    setMostrarFormularioPromocion(false);
    setMostrarTopVentas(false);
    setMostrarTopDeliverys(false);
  };

  // NUEVA Función para manejar la eliminación de un producto
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
      return; // El usuario canceló la eliminación
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No autenticado. Por favor, inicia sesión de nuevo.');
      navigate('/', { replace: true });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/comidas/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert(`"${productName}" eliminado correctamente.`);
        fetchComidas(); // Refrescar la lista de productos
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el producto.');
      }
    } catch (err: any) {
      console.error("Error al eliminar producto:", err);
      alert('Error al eliminar el producto: ' + err.message);
    }
  };


  // ----- Manejadores del Formulario de Promoción -----
  const handlePromocionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormularioPromocion({ ...formularioPromocion, [e.target.name]: e.target.value });
  };

  const handleProductSelection = (productId: string) => {
    setSelectedProductIds(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const limpiarFormularioPromocion = () => {
    setFormularioPromocion({
      nombre: '',
      descripcion: '',
      valorDescuento: '',
      fechaInicio: '',
      fechaFin: '',
    });
    setSelectedProductIds([]);
  };

  const agregarPromocion = async (promocion: Omit<Promocion, '_id'>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No autenticado');
    }
    const response = await fetch('http://localhost:3001/promociones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(promocion),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al agregar promoción');
    }
    return response.json();
  };

  const handleAgregarPromocion = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, descripcion, valorDescuento, fechaInicio, fechaFin } = formularioPromocion;

    if (!nombre || !descripcion || !valorDescuento || !fechaInicio || !fechaFin) {
      alert('Por favor completa todos los campos obligatorios para la promoción.');
      return;
    }

    const parsedValorDescuento = parseFloat(valorDescuento);
    if (isNaN(parsedValorDescuento) || parsedValorDescuento <= 0 || parsedValorDescuento > 100) {
      alert('El porcentaje de descuento debe ser un número válido entre 0.01 y 100.');
      return;
    }

    if (selectedProductIds.length === 0) {
      alert('Por favor selecciona al menos un producto para aplicar la promoción.');
      return;
    }

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    if (startDate >= endDate) {
      alert('La fecha de fin debe ser posterior o igual a la fecha de inicio.');
      return;
    }

    try {
      await agregarPromocion({
        nombre,
        descripcion,
        tipoDescuento: 'porcentaje',
        valorDescuento: parsedValorDescuento,
        productosAplicables: selectedProductIds,
        fechaInicio,
        fechaFin,
        activo: true,
      });
      alert('Promoción agregada correctamente');
      limpiarFormularioPromocion();
      setMostrarFormularioPromocion(false);
    } catch (err: any) {
      alert(err.message);
    }
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

      <h2 className="dashboard-title">Tus Productos</h2>

      <div className="main-actions-container">
        <button onClick={() => {
          setMostrarFormulario(true); // Abre el modal de producto para agregar
          limpiarFormulario(); // Asegura que el formulario esté limpio y en modo agregar
          setMostrarFormularioPromocion(false);
          setMostrarTopVentas(false);
          setMostrarTopDeliverys(false);
        }}>Agregar Producto</button>
        <button onClick={() => {
          setMostrarFormularioPromocion(true);
          setMostrarFormulario(false);
          setMostrarTopVentas(false);
          setMostrarTopDeliverys(false);
          limpiarFormularioPromocion();
        }}>Agregar Promoción</button>
        {/* El botón "Edición de productos" ahora está cubierto por el botón "Editar" en cada tarjeta */}
        <button>Gestión avanzada</button> {/* Puedes renombrarlo o darle otra función */}
        <button onClick={() => {
          setMostrarTopVentas(true);
          setMostrarFormulario(false);
          setMostrarFormularioPromocion(false);
          setMostrarTopDeliverys(false);
        }}>Top Ventas</button>
        <button onClick={() => {
          setMostrarTopDeliverys(true);
          setMostrarFormulario(false);
          setMostrarFormularioPromocion(false);
          setMostrarTopVentas(false);
        }}>Top Deliverys</button>
      </div>

      <div className="products-section-wrapper">
        {loadingProducts ? (
          <div className="no-products">Cargando productos...</div>
        ) : productsError ? (
          <div className="no-products error-message">Error: {productsError}</div>
        ) : productos.length === 0 ? (
          <div className="no-products">No hay productos registrados. ¡Agrega uno!</div>
        ) : (
          <div className="productos-grid">
            {productos.map((product) => (
              <div className="producto-card" key={product._id || product.id}>
                <img
                  src={
                    product.imagenUrl
                      ? product.imagenUrl.startsWith('/uploads/')
                        ? `http://localhost:3001${product.imagenUrl}`
                        : product.imagenUrl
                      : 'https://via.placeholder.com/200x140?text=Sin+Imagen'
                  }
                  alt={product.nombre}
                />
                <h3>{product.nombre}</h3>
                <p><strong>Precio:</strong> ${product.precio.toLocaleString('es-CL')}</p>
                <p><strong>Cantidad:</strong> {product.cantidad}</p>
                <p><strong>Ingredientes:</strong> {product.ingredientes?.join(', ')}</p>
                <p>{product.descripcion}</p>
                <div className="card-buttons">
                    <button onClick={() => handleEditProduct(product)}>Editar</button>
                    <button onClick={() => handleDeleteProduct(product._id!, product.nombre)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario emergente (Modal) para Agregar/Editar Producto */}
      {mostrarFormulario && (
        <div className="modal-overlay" onClick={() => { setMostrarFormulario(false); limpiarFormulario(); }}>
          <div className="add-product-form" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => { setMostrarFormulario(false); limpiarFormulario(); }}>×</button>
            <h2>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
            <form onSubmit={handleProductSubmit}>
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

              <label htmlFor="imagenFile">Imagen del Producto (opcional):</label>
              <input type="file" id="imagenFile" accept="image/*" onChange={handleFileChange} />
              {editingProduct?.imagenUrl && !imagenFile && (
                <p style={{ fontSize: '0.8em', color: 'var(--color-info-text)' }}>
                  Imagen actual: <a href={editingProduct.imagenUrl.startsWith('/uploads/') ? `http://localhost:3001${editingProduct.imagenUrl}` : editingProduct.imagenUrl} target="_blank" rel="noopener noreferrer">Ver</a> (Selecciona un nuevo archivo para cambiarla)
                </p>
              )}


              <button type="submit">{editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Panel emergente para Agregar Promoción */}
      {mostrarFormularioPromocion && (
        <div className="modal-overlay" onClick={() => { setMostrarFormularioPromocion(false); limpiarFormularioPromocion(); }}>
          <div className="add-product-form" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => { setMostrarFormularioPromocion(false); limpiarFormularioPromocion(); }}>×</button>
            <h2>Crear Nueva Promoción</h2>
            <form onSubmit={handleAgregarPromocion}>
              <label htmlFor="promoNombre">Nombre de la Promoción:</label>
              <input
                type="text"
                id="promoNombre"
                name="nombre"
                placeholder="Ej: Descuento de Temporada"
                value={formularioPromocion.nombre}
                onChange={handlePromocionInputChange}
                required
              />

              <label htmlFor="promoDescripcion">Descripción:</label>
              <textarea
                id="promoDescripcion"
                name="descripcion"
                placeholder="Detalles de la oferta, ej: 15% de descuento en pizzas seleccionadas."
                value={formularioPromocion.descripcion}
                onChange={handlePromocionInputChange}
                rows={2}
                required
              />

              <label htmlFor="valorDescuento">Porcentaje de Descuento (%):</label>
              <input
                type="number"
                id="valorDescuento"
                name="valorDescuento"
                placeholder="Ej: 15 (para 15%)"
                value={formularioPromocion.valorDescuento}
                onChange={handlePromocionInputChange}
                min="0.01"
                max="100"
                step="0.01"
                required
              />

              <label htmlFor="fechaInicioPromo">Fecha de Inicio:</label>
              <input
                type="date"
                id="fechaInicioPromo"
                name="fechaInicio"
                value={formularioPromocion.fechaInicio}
                onChange={handlePromocionInputChange}
                required
              />

              <label htmlFor="fechaFinPromo">Fecha de Fin:</label>
              <input
                type="date"
                id="fechaFinPromo"
                name="fechaFin"
                value={formularioPromocion.fechaFin}
                onChange={handlePromocionInputChange}
                required
              />

              <label className="products-selection-label">Seleccionar Productos para la Promoción:</label>
              <div className="promo-product-list">
                {availableProductsForPromo.length === 0 ? (
                  <p>Cargando productos o no hay productos disponibles.</p>
                ) : (
                  availableProductsForPromo.map(product => (
                    <div key={product._id} className="promo-product-item">
                      <input
                        type="checkbox"
                        id={`promo-product-${product._id}`}
                        checked={selectedProductIds.includes(product._id || '')}
                        onChange={() => handleProductSelection(product._id || '')}
                      />
                      <label htmlFor={`promo-product-${product._id}`}>
                        {product.nombre} (Precio: ${product.precio.toLocaleString('es-CL')})
                      </label>
                    </div>
                  ))
                )}
              </div>

              <button type="submit">Crear Promoción</button>
            </form>
          </div>
        </div>
      )}

      {/* Panel emergente para Top Ventas */}
      {mostrarTopVentas && (
        <div className="modal-overlay" onClick={() => setMostrarTopVentas(false)}>
          <div className="add-product-form" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setMostrarTopVentas(false)}>×</button>
            <h2>Top de Productos Más Vendidos</h2>
            <div className="panel-content">
              <p>Contenido del Top Ventas. Por ejemplo, una lista de productos ordenados por cantidad vendida.</p>
              <ul>
                <li>Producto A: 150 ventas</li>
                <li>Producto B: 120 ventas</li>
                <li>Producto C: 90 ventas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Panel emergente para Top Deliverys */}
      {mostrarTopDeliverys && (
        <div className="modal-overlay" onClick={() => setMostrarTopDeliverys(false)}>
          <div className="add-product-form" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setMostrarTopDeliverys(false)}>×</button>
            <h2>Top de Productos Más Entregados</h2>
            <div className="panel-content">
              <p>Contenido del Top Deliverys. Por ejemplo, una lista de productos más pedidos para delivery.</p>
              <ul>
                <li>Producto X: 80 entregas</li>
                <li>Producto Y: 70 entregas</li>
                <li>Producto Z: 60 entregas</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para agregar producto (siempre visible) */}
      <button className="floating-add-button" onClick={() => {
        setMostrarFormulario(true);
        limpiarFormulario(); // Asegura que el formulario esté limpio y en modo agregar
        setMostrarFormularioPromocion(false);
        setMostrarTopVentas(false);
        setMostrarTopDeliverys(false);
      }}>
        +
      </button>
    </div>
  );
};

export default LocatarioDashboard;