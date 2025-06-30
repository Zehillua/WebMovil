import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EdicionProductos.css';

interface Producto {
  _id: string;
  nombre: string;
  ingredientes: string[];
  descripcion: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

const EdicionProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  
  const [formularioEdicion, setFormularioEdicion] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    ingredientes: '',
    descripcion: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    try {
      setCargando(true);
      const response = await fetch('http://localhost:3001/comidas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarProducto = async (productoId: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/comidas/${productoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProductos(productos.filter(p => p._id !== productoId));
        alert(`✅ "${nombre}" eliminado correctamente`);
      } else {
        const error = await response.json();
        alert(`❌ Error eliminando producto: ${error.message}`);
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('❌ Error de conexión al eliminar producto');
    }
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoAEditar(producto);
    setFormularioEdicion({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      cantidad: producto.cantidad.toString(),
      ingredientes: producto.ingredientes.join(', '),
      descripcion: producto.descripcion,
    });
    setImagenFile(null);
    setMostrarModalEdicion(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormularioEdicion({ 
      ...formularioEdicion, 
      [e.target.name]: e.target.value 
    });
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
      throw new Error('Error al subir la imagen');
    }
    const data = await response.json();
    return data.url;
  };

  const handleConfirmarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productoAEditar) return;

    const { nombre, precio, cantidad, ingredientes, descripcion } = formularioEdicion;
    
    if (!nombre.trim() || !precio || !cantidad || !ingredientes.trim() || !descripcion.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const ingredientesArray = ingredientes.split(',').map(i => i.trim()).filter(i => i);
      
      let datosActualizacion: any = {
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad, 10),
        ingredientes: ingredientesArray,
        descripcion: descripcion.trim(),
      };

      // Si hay nueva imagen, subirla
      if (imagenFile) {
        try {
          const nuevaImagenUrl = await subirImagen(imagenFile);
          datosActualizacion.imagenUrl = nuevaImagenUrl;
        } catch (err: any) {
          alert('Error al subir la imagen: ' + err.message);
          return;
        }
      }

      const response = await fetch(`http://localhost:3001/comidas/${productoAEditar._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosActualizacion),
      });

      if (response.ok) {
        const productoActualizado = await response.json();
        
        // Actualizar la lista de productos
        setProductos(productos.map(p => 
          p._id === productoAEditar._id ? productoActualizado : p
        ));
        
        alert(`✅ "${nombre}" actualizado correctamente`);
        cerrarModalEdicion();
      } else {
        const error = await response.json();
        alert(`❌ Error actualizando producto: ${error.message}`);
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
      alert('❌ Error de conexión al actualizar producto');
    }
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setProductoAEditar(null);
    setImagenFile(null);
    setFormularioEdicion({
      nombre: '',
      precio: '',
      cantidad: '',
      ingredientes: '',
      descripcion: '',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    window.location.href = '/';
  };

  return (
    <div className="edicion-productos">
      {/* Navbar */}
      <nav className="navbar-locatario">
        <button 
          className="back-btn"
          onClick={() => navigate('/locatario/dashboard')}
          title="Volver al dashboard"
        >
          ← Volver
        </button>
        <div className="logo-centered">✏️ Edición de Productos</div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      {/* Contenido principal */}
      <div className="contenido-edicion">
        {cargando ? (
          <div className="loading-container">
            <div className="loading-spinner">🔄</div>
            <p>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="no-products">
            <div className="empty-state">
              <span className="empty-icon">🍽️</span>
              <h3>No tienes productos registrados</h3>
              <p>Crea productos desde el dashboard principal para poder editarlos aquí</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/locatario/dashboard')}
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="productos-header">
              <h2>📦 Todos tus productos ({productos.length})</h2>
              <p>Edita o elimina los productos de tu local</p>
            </div>

            <div className="productos-edicion-grid">
              {productos.map((producto) => (
                <div className="producto-edicion-card" key={producto._id}>
                  <div className="producto-imagen-container">
                    <img
                      src={
                        producto.imagenUrl
                          ? producto.imagenUrl.startsWith('/uploads/')
                            ? `http://localhost:3001${producto.imagenUrl}`
                            : producto.imagenUrl
                          : 'https://placehold.co/200x140/fef4e8/8d5c3d?text=Sin+Imagen' // Updated placeholder
                      }
                      alt={producto.nombre}
                      className="producto-imagen"
                    />
                    <div className="producto-overlay">
                      <span className="producto-precio">${producto.precio.toLocaleString('es-CL')}</span> {/* Added es-CL */}
                    </div>
                  </div>

                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <div className="producto-detalles">
                      <span className="producto-cantidad">📦 Stock: {producto.cantidad}</span>
                      <span className="producto-ingredientes">
                        🥘 {producto.ingredientes?.slice(0, 2).join(', ')}
                        {producto.ingredientes && producto.ingredientes.length > 2 && '...'}
                      </span>
                    </div>
                  </div>

                  <div className="producto-acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditarProducto(producto)}
                      title="Editar producto"
                    >
                      <span className="btn-icon">✏️</span>
                      Editar
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminarProducto(producto._id, producto.nombre)}
                      title="Eliminar producto"
                    >
                      <span className="btn-icon">🗑️</span>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de edición */}
      {mostrarModalEdicion && productoAEditar && (
        <div className="modal-overlay-edicion" onClick={cerrarModalEdicion}>
          <div className="modal-edicion" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-edicion">
              <div className="modal-title-edicion">
                <span className="edit-icon">✏️</span>
                <h3>Editar Producto</h3>
              </div>
              <button 
                className="modal-close-btn-edicion" 
                onClick={cerrarModalEdicion}
                type="button"
              >
                ×
              </button>
            </div>

            <form className="modal-content-edicion" onSubmit={handleConfirmarEdicion}>
              <div className="form-group-edicion">
                <label htmlFor="nombre-edit">Nombre del Producto</label>
                <input 
                  id="nombre-edit"
                  type="text" 
                  name="nombre" 
                  placeholder="Nombre del producto" 
                  value={formularioEdicion.nombre} 
                  onChange={handleInputChange}
                  className="form-input-edicion"
                  required
                />
              </div>

              <div className="form-row-edicion">
                <div className="form-group-edicion">
                  <label htmlFor="precio-edit">Precio</label>
                  <div className="price-input-container-edicion">
                    <span className="currency-symbol-edicion">$</span>
                    <input 
                      id="precio-edit"
                      type="number" 
                      name="precio" 
                      placeholder="0" 
                      value={formularioEdicion.precio} 
                      onChange={handleInputChange}
                      className="form-input-edicion price-input-edicion"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group-edicion">
                  <label htmlFor="cantidad-edit">Stock</label>
                  <input 
                    id="cantidad-edit"
                    type="number" 
                    name="cantidad" 
                    placeholder="Cantidad disponible" 
                    value={formularioEdicion.cantidad} 
                    onChange={handleInputChange}
                    className="form-input-edicion"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group-edicion">
                <label htmlFor="ingredientes-edit">Ingredientes</label>
                <input 
                  id="ingredientes-edit"
                  type="text" 
                  name="ingredientes" 
                  placeholder="Ingredientes separados por coma" 
                  value={formularioEdicion.ingredientes} 
                  onChange={handleInputChange}
                  className="form-input-edicion"
                  required
                />
                <small className="form-help">Separa cada ingrediente con una coma</small>
              </div>

              <div className="form-group-edicion">
                <label htmlFor="descripcion-edit">Descripción</label>
                <textarea 
                  id="descripcion-edit"
                  name="descripcion" 
                  placeholder="Describe tu producto..."
                  value={formularioEdicion.descripcion} 
                  onChange={handleInputChange}
                  className="form-textarea-edicion"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group-edicion">
                <label htmlFor="imagen-edit">Nueva Imagen (opcional)</label>
                <div className="image-upload-container-edicion">
                  <input 
                    id="imagen-edit"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="file-input-edicion"
                  />
                  <label htmlFor="imagen-edit" className="file-upload-label-edicion">
                    <div className="upload-content-edicion">
                      {imagenFile ? (
                        <div className="file-selected-edicion">
                          <span className="file-icon-edicion">📸</span>
                          <span className="file-name-edicion">{imagenFile.name}</span>
                          <span className="file-size-edicion">
                            ({(imagenFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ) : (
                        <div className="upload-placeholder-edicion">
                          <span className="upload-icon-edicion">📷</span>
                          <span className="upload-text-edicion">Cambiar imagen</span>
                          <span className="upload-subtitle-edicion">PNG, JPG hasta 2MB</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                
                {productoAEditar.imagenUrl && !imagenFile && (
                  <div className="imagen-actual">
                    <small>Imagen actual:</small>
                    <img 
                      src={
                        productoAEditar.imagenUrl.startsWith('/uploads/')
                          ? `http://localhost:3001${productoAEditar.imagenUrl}`
                          : productoAEditar.imagenUrl
                      }
                      alt="Imagen actual"
                      className="imagen-preview"
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer-edicion">
                <button 
                  type="button" 
                  className="btn-cancelar-edicion"
                  onClick={cerrarModalEdicion}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-confirmar-edicion"
                >
                  <span className="btn-icon">✅</span>
                  Confirmar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdicionProductos;
