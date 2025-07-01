import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocatarioDashboard.css';

interface Producto {
  id: number;
  _id?: string;
  nombre: string;
  ingredientes: string[];
  descripcion: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

interface ComidaPromocion {
  comidaId: string;
  nombre: string;
  cantidad: number;
  precioOriginal: number;
}

interface Promocion {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  comidas: ComidaPromocion[];
  activa?: boolean;
  cantidadDisponible?: number;
}

const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [vistaActual, setVistaActual] = useState<'productos' | 'promociones'>('productos');
  
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    ingredientes: '',
    descripcion: '',
    imagenUrl: '',
  });

  const [formularioPromo, setFormularioPromo] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidadDisponible: '',
    comidasSeleccionadas: [] as ComidaPromocion[]
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPromoFile, setImagenPromoFile] = useState<File | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioPromo, setMostrarFormularioPromo] = useState(false);
  const [mostrarSelectorComidas, setMostrarSelectorComidas] = useState(false);
  
  const navigate = useNavigate();

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    window.location.href = '/';
  };

  useEffect(() => {
    cargarProductos();
    cargarPromociones();
  }, []);

  const cargarProductos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3001/comidas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarPromociones = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3001/promociones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPromociones(data);
      }
    } catch (error) {
      console.error('Error cargando promociones:', error);
    }
  };

  // Handlers para productos (mantener los existentes)
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

  // Handlers para promociones
  const handlePromoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormularioPromo({ ...formularioPromo, [e.target.name]: e.target.value });
  };

  const handlePromoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenPromoFile(file);
    }
  };

  const agregarComidaAPromocion = (producto: Producto) => {
    const yaExiste = formularioPromo.comidasSeleccionadas.find(c => c.comidaId === producto._id);
    if (yaExiste) {
      alert('Esta comida ya está en la promoción');
      return;
    }

    const cantidad = prompt('¿Cuántas unidades de este producto incluir en la promoción?', '1');
    if (!cantidad || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      alert('Cantidad inválida');
      return;
    }

    const nuevaComida: ComidaPromocion = {
      comidaId: producto._id || '',
      nombre: producto.nombre,
      cantidad: Number(cantidad),
      precioOriginal: producto.precio
    };

    setFormularioPromo({
      ...formularioPromo,
      comidasSeleccionadas: [...formularioPromo.comidasSeleccionadas, nuevaComida]
    });
  };

  const eliminarComidaDePromocion = (comidaId: string) => {
    setFormularioPromo({
      ...formularioPromo,
      comidasSeleccionadas: formularioPromo.comidasSeleccionadas.filter(c => c.comidaId !== comidaId)
    });
  };

  const calcularPrecioOriginalTotal = () => {
    return formularioPromo.comidasSeleccionadas.reduce((total, comida) => {
      return total + (comida.precioOriginal * comida.cantidad);
    }, 0);
  };

  const subirImagen = async (file: File, tipo: 'producto' | 'promocion' = 'producto'): Promise<string> => {
    const formData = new FormData();
    formData.append('imagen', file);

    const token = localStorage.getItem('token');
    const endpoint = tipo === 'promocion' 
      ? 'http://localhost:3001/promociones/upload'
      : 'http://localhost:3001/comidas/upload';

    const response = await fetch(endpoint, {
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

  // Mantener función de agregar producto existente
  const agregarProducto = async (producto: any) => {
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

  const agregarPromocion = async (promocion: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('🎉 Enviando promoción:', promocion);

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
      throw new Error(error.message || 'Error al crear promoción');
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
    if (imagenFile) {
      try {
        imagenUrl = await subirImagen(imagenFile, 'producto');
      } catch (err: any) {
        alert('Error al subir la imagen: ' + err.message);
        return;
      }
    }

    try {
      await agregarProducto({
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad, 10),
        ingredientes: ingredientesArray,
        descripcion,
        imagenUrl: imagenUrl || undefined,
      });
      alert('Producto agregado correctamente');
      limpiarFormulario();
      setMostrarFormulario(false);
      setImagenFile(null);
      cargarProductos();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAgregarPromocion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { nombre, descripcion, precio, cantidadDisponible } = formularioPromo;
    
    if (!nombre || !descripcion || !precio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formularioPromo.comidasSeleccionadas.length === 0) {
      alert('Debes agregar al menos una comida a la promoción');
      return;
    }

    const precioPromo = parseFloat(precio);
    const precioOriginalTotal = calcularPrecioOriginalTotal();

    if (precioPromo >= precioOriginalTotal) {
      alert(`El precio de la promoción ($${precioPromo.toLocaleString('es-CL')}) debe ser menor al precio original total ($${precioOriginalTotal.toLocaleString('es-CL')})`);
      return;
    }

    let imagenUrl = '';
    if (imagenPromoFile) {
      try {
        imagenUrl = await subirImagen(imagenPromoFile, 'promocion');
      } catch (err: any) {
        alert('Error al subir la imagen: ' + err.message);
        return;
      }
    }

    try {
      await agregarPromocion({
        nombre,
        descripcion,
        precio: precioPromo,
        cantidadDisponible: cantidadDisponible ? parseInt(cantidadDisponible, 10) : 0,
        comidas: formularioPromo.comidasSeleccionadas,
        imagenUrl: imagenUrl || undefined,
      });
      
      alert('Promoción creada correctamente');
      limpiarFormularioPromo();
      setMostrarFormularioPromo(false);
      setImagenPromoFile(null);
      cargarPromociones();
    } catch (err: any) {
      alert('Error al crear promoción: ' + err.message);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      precio: '',
      cantidad: '',
      ingredientes: '',
      descripcion: '',
      imagenUrl: '',
    });
    setImagenFile(null);
  };

  const limpiarFormularioPromo = () => {
    setFormularioPromo({
      nombre: '',
      descripcion: '',
      precio: '',
      cantidadDisponible: '',
      comidasSeleccionadas: []
    });
    setImagenPromoFile(null);
  };

  return (
    <div className="locatario-dashboard">
      {/* Barra superior */}
      <nav className="navbar-locatario">
        <div className="logo-centered">Panel Locatario</div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      {/* Pestañas de navegación */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${vistaActual === 'productos' ? 'active' : ''}`}
          onClick={() => setVistaActual('productos')}
        >
          🍽️ Productos
        </button>
        <button 
          className={`tab-btn ${vistaActual === 'promociones' ? 'active' : ''}`}
          onClick={() => setVistaActual('promociones')}
        >
          🎉 Promociones
        </button>
      </div>

      {/* Botones principales */}
      <div className="main-actions">
        {vistaActual === 'productos' ? (
          <>
            <button onClick={() => setMostrarFormulario(true)}>Agregar Producto</button>
            {/* <button onClick={() => setVistaActual('promociones')}>Ver Promociones</button> */} {/* Este botón ya no es necesario aquí */}
          </>
        ) : (
          <>
            <button onClick={() => setMostrarFormularioPromo(true)}>Agregar Promoción</button>
            {/* <button onClick={() => setVistaActual('productos')}>Ver Productos</button> */} {/* Este botón ya no es necesario aquí */}
          </>
        )}
        <button onClick={() => navigate('/locatario/edicion-productos')}>Edición de productos</button>
        <button>Top Ventas</button>
        <button>Top Deliverys</button>
        <button onClick={() => navigate('/locatario/pedidos')}>Pedidos</button>
      </div>

      {/* Contenido según la vista activa */}
      <div className="contenido">
        {vistaActual === 'productos' ? (
          // Vista de productos
          productos.length === 0 ? (
            <div className="no-products">No hay productos registrados.</div>
          ) : (
            <div className="productos-grid">
              {productos.map((producto) => (
                <div className="producto-card" key={producto.id || producto._id}>
                  <img
                    src={
                      producto.imagenUrl
                        ? producto.imagenUrl.startsWith('/uploads/')
                          ? `http://localhost:3001${producto.imagenUrl}`
                          : producto.imagenUrl
                        : 'https://placehold.co/200x140/fef4e8/8d5c3d?text=Sin+Imagen' // Placeholder con colores de la paleta
                    }
                    alt={producto.nombre}
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <h3>{producto.nombre}</h3>
                  <p><strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')}</p>
                  <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                  <p><strong>Ingredientes:</strong> {producto.ingredientes?.join(', ')}</p>
                  <p>{producto.descripcion}</p>
                </div>
              ))}
            </div>
          )
        ) : (
          // Vista de promociones
          promociones.length === 0 ? (
            <div className="no-products">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3>🎉 No hay promociones creadas</h3>
                <p>Crea tu primera promoción para atraer más clientes</p>
                <button 
                  className="btn-primary"
                  onClick={() => setMostrarFormularioPromo(true)}
                >
                  Crear Primera Promoción
                </button>
              </div>
            </div>
          ) : (
            <div className="promociones-grid">
              {promociones.map((promocion) => (
                <div className="promocion-card" key={promocion._id}>
                  <div className="promocion-header">
                    <img
                      src={
                        promocion.imagenUrl
                          ? promocion.imagenUrl.startsWith('/uploads/')
                            ? `http://localhost:3001${promocion.imagenUrl}`
                            : promocion.imagenUrl
                          : 'https://placehold.co/200x140/fef4e8/8d5c3d?text=Promoción' // Placeholder con colores de la paleta
                      }
                      alt={promocion.nombre}
                      style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <span className={`promocion-estado ${promocion.activa ? 'activa' : 'inactiva'}`}>
                      {promocion.activa ? '✅ Activa' : '❌ Inactiva'}
                    </span>
                  </div>
                  
                  <div className="promocion-content">
                    <h3>{promocion.nombre}</h3>
                    <p className="promocion-descripcion">{promocion.descripcion}</p>
                    
                    <div className="promocion-precio">
                      <span className="precio-promo">${promocion.precio.toLocaleString('es-CL')}</span>
                      <span className="precio-original">
                        ${promocion.comidas.reduce((total, c) => total + (c.precioOriginal * c.cantidad), 0).toLocaleString('es-CL')}
                      </span>
                    </div>

                    <div className="promocion-comidas">
                      <h4>Incluye:</h4>
                      {promocion.comidas.map((comida, idx) => (
                        <div key={idx} className="comida-incluida">
                          <span>{comida.nombre} x{comida.cantidad}</span>
                        </div>
                      ))}
                    </div>

                    {promocion.cantidadDisponible !== undefined && (
                      <p className="cantidad-disponible">
                        <strong>Disponibles:</strong> {promocion.cantidadDisponible}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

    {/* ✅ FORMULARIO PARA AGREGAR PRODUCTO (ORIGINAL) */}
    {mostrarFormulario && (
        <div className="overlay" onClick={() => setMostrarFormulario(false)}>
          <form className="formulario-flotante" onClick={(e) => e.stopPropagation()} onSubmit={handleAgregarProducto}>
            <button className="cerrar" onClick={() => setMostrarFormulario(false)}>×</button>
            <h3>Agregar Producto</h3>
            <input type="text" name="nombre" placeholder="Nombre del producto" value={formulario.nombre} onChange={handleInputChange} className="form-input" />
            <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={handleInputChange} className="form-input" />
            <input type="number" name="cantidad" placeholder="Cantidad" value={formulario.cantidad} onChange={handleInputChange} className="form-input" />
            <input type="text" name="ingredientes" placeholder="Ingredientes (separados por coma)" value={formulario.ingredientes} onChange={handleInputChange} className="form-input" />
            <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleTextareaChange} className="form-textarea" />
            
            {/* INICIO DE LA SECCIÓN PARA SUBIR IMAGEN DEL PRODUCTO */}
            <div className="form-section"> {/* Puedes reutilizar form-section o crear uno nuevo */}
                <div className="section-header">
                    <span className="step-number">📸</span> {/* Puedes usar un número o un icono */}
                    <h3>Imagen del Producto</h3>
                </div>
                <div className="image-upload-container"> {/* Reutiliza la clase del contenedor de imagen */}
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="file-input" 
                        id="imagen-producto-add" // Asegúrate de que el ID sea único y coincida con el 'htmlFor' del label
                    />
                    <label htmlFor="imagen-producto-add" className="file-upload-label">
                        <div className="upload-content">
                            {imagenFile ? (
                                <div className="file-selected">
                                    <span className="file-icon">📸</span>
                                    <span className="file-name">{imagenFile.name}</span>
                                    <span className="file-size">
                                        ({(imagenFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <span className="upload-icon">📷</span>
                                    <span className="upload-text">Subir imagen del producto</span>
                                    <span className="upload-subtitle">PNG, JPG hasta 3MB</span>
                                </div>
                            )}
                        </div>
                    </label>
                </div>
            </div>
            {/* FIN DE LA SECCIÓN PARA SUBIR IMAGEN DEL PRODUCTO */}

            <button type="submit" className="btn-submit">Agregar</button>
          </form>
        </div>
    )}


      {/* ✅ MODAL MEJORADO PARA AGREGAR PROMOCIÓN */}
      {mostrarFormularioPromo && (
        <div className="modal-overlay-promo" onClick={() => setMostrarFormularioPromo(false)}>
          <div className="modal-promocion" onClick={(e) => e.stopPropagation()}>
            
            {/* Header del modal */}
            <div className="modal-header">
              <div className="modal-title">
                <span className="promo-icon">🎉</span>
                <h2>Crear Nueva Promoción</h2>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setMostrarFormularioPromo(false)}
                type="button"
              >
                ×
              </button>
            </div>

            {/* Contenido del modal */}
            <form className="modal-content" onSubmit={handleAgregarPromocion}>
              
              {/* Paso 1: Información básica */}
              <div className="form-section">
                <div className="section-header">
                  <span className="step-number">1</span>
                  <h3>Información Básica</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nombre-promo">Nombre de la Promoción</label>
                  <input 
                    id="nombre-promo"
                    type="text" 
                    name="nombre" 
                    placeholder="Ej: Combo Familiar, Oferta del Día..." 
                    value={formularioPromo.nombre} 
                    onChange={handlePromoInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="descripcion-promo">Descripción</label>
                  <textarea 
                    id="descripcion-promo"
                    name="descripcion" 
                    placeholder="Describe tu promoción de manera atractiva para los clientes..."
                    value={formularioPromo.descripcion} 
                    onChange={handlePromoInputChange}
                    className="form-textarea"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="precio-promo">Precio Promocional</label>
                    <div className="price-input-container">
                      <span className="currency-symbol">$</span>
                      <input 
                        id="precio-promo"
                        type="number" 
                        name="precio" 
                        placeholder="0" 
                        value={formularioPromo.precio} 
                        onChange={handlePromoInputChange}
                        className="form-input price-input"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cantidad-promo">Cantidad Disponible</label>
                    <input 
                      id="cantidad-promo"
                      type="number" 
                      name="cantidadDisponible" 
                      placeholder="Sin límite" 
                      value={formularioPromo.cantidadDisponible} 
                      onChange={handlePromoInputChange}
                      className="form-input"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Paso 2: Selección de comidas */}
              <div className="form-section">
                <div className="section-header">
                  <span className="step-number">2</span>
                  <h3>Comidas Incluidas</h3>
                </div>
                
                <div className="comidas-preview">
                  {formularioPromo.comidasSeleccionadas.length === 0 ? (
                    <div className="empty-selection">
                      <div className="empty-icon">🍽️</div>
                      <p>No hay comidas seleccionadas</p>
                      <span className="empty-subtitle">Agrega comidas para crear tu promoción</span>
                    </div>
                  ) : (
                    <div className="selected-items">
                      {formularioPromo.comidasSeleccionadas.map((comida, idx) => (
                        <div key={idx} className="selected-item">
                          <div className="item-info">
                            <span className="item-name">{comida.nombre}</span>
                            <span className="item-details">
                              x{comida.cantidad} • ${(comida.precioOriginal * comida.cantidad).toLocaleString('es-CL')}
                            </span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => eliminarComidaDePromocion(comida.comidaId)}
                            className="remove-item-btn"
                            title="Eliminar comida"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      
                      <div className="price-summary">
                        <div className="original-price">
                          <span>Precio original total:</span>
                          <strong>${calcularPrecioOriginalTotal().toLocaleString('es-CL')}</strong>
                        </div>
                        {formularioPromo.precio && (
                          <div className="promo-price">
                            <span>Precio promocional:</span>
                            <strong className="promo-value">${parseFloat(formularioPromo.precio || '0').toLocaleString('es-CL')}</strong>
                          </div>
                        )}
                        {formularioPromo.precio && calcularPrecioOriginalTotal() > 0 && (
                          <div className="savings">
                            <span>Ahorro:</span>
                            <strong className="savings-value">
                              ${(calcularPrecioOriginalTotal() - parseFloat(formularioPromo.precio || '0')).toLocaleString('es-CL')}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    type="button" 
                    className="add-items-btn"
                    onClick={() => setMostrarSelectorComidas(true)}
                  >
                    <span className="btn-icon">➕</span>
                    {formularioPromo.comidasSeleccionadas.length === 0 ? 'Agregar Comidas' : 'Agregar Más Comidas'}
                  </button>
                </div>
              </div>

              {/* Paso 3: Imagen */}
              <div className="form-section">
                <div className="section-header">
                  <span className="step-number">3</span>
                  <h3>Imagen de la Promoción</h3>
                </div>
                
                <div className="image-upload-container">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePromoFileChange}
                    className="file-input"
                    id="imagen-promo"
                  />
                  <label htmlFor="imagen-promo" className="file-upload-label">
                    <div className="upload-content">
                      {imagenPromoFile ? (
                        <div className="file-selected">
                          <span className="file-icon">📸</span>
                          <span className="file-name">{imagenPromoFile.name}</span>
                          <span className="file-size">
                            ({(imagenPromoFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <span className="upload-icon">📷</span>
                          <span className="upload-text">Subir imagen de la promoción</span>
                          <span className="upload-subtitle">PNG, JPG hasta 3MB</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Validación y botones */}
              <div className="modal-footer">
                {formularioPromo.precio && calcularPrecioOriginalTotal() > 0 && 
                parseFloat(formularioPromo.precio) >= calcularPrecioOriginalTotal() && (
                  <div className="validation-error">
                    ⚠️ El precio promocional debe ser menor al precio original total
                  </div>
                )}
                
                <div className="footer-buttons">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setMostrarFormularioPromo(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="create-btn"
                    disabled={
                      formularioPromo.comidasSeleccionadas.length === 0 ||
                      formularioPromo.nombre.trim() === '' ||
                      formularioPromo.descripcion.trim() === '' ||
                      formularioPromo.precio.trim() === '' ||
                      (formularioPromo.precio.trim() !== '' && calcularPrecioOriginalTotal() > 0 && 
                      parseFloat(formularioPromo.precio) >= calcularPrecioOriginalTotal())
                    }
                  >
                    <span className="btn-icon">✨</span>
                    Crear Promoción
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ SELECTOR DE COMIDAS CON Z-INDEX CORREGIDO */}
      {mostrarSelectorComidas && (
        <div className="overlay selector-overlay" onClick={() => setMostrarSelectorComidas(false)}>
          <div className="selector-comidas" onClick={(e) => e.stopPropagation()}>
            <div className="selector-header">
              <h3>🍽️ Seleccionar Comidas para la Promoción</h3>
              <button 
                className="cerrar" 
                onClick={() => setMostrarSelectorComidas(false)}
                type="button"
                title="Cerrar selector"
              >
                ×
              </button>
            </div>
            
            <div className="comidas-disponibles">
              {productos.length === 0 ? (
                <p>
                  🍽️ No tienes productos disponibles.<br/>
                  <strong>Crea productos primero para poder agregarlos a tu promoción.</strong>
                </p>
              ) : (
                productos.map((producto) => (
                  <div key={producto._id} className="comida-disponible">
                    <img
                      src={
                        producto.imagenUrl
                          ? producto.imagenUrl.startsWith('/uploads/')
                            ? `http://localhost:3001${producto.imagenUrl}`
                            : producto.imagenUrl
                          : 'https://placehold.co/80x60/fef4e8/8d5c3d?text=Sin+Imagen' // Placeholder con colores de la paleta
                      }
                      alt={producto.nombre}
                      className="comida-mini-img"
                    />
                    <div className="comida-info">
                      <h4>{producto.nombre}</h4>
                      <p><strong>${producto.precio.toLocaleString('es-CL')}</strong></p>
                      <p className="stock">📦 Stock: {producto.cantidad} disponibles</p>
                      <p style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
                        {producto.ingredientes?.slice(0, 3).join(', ')}
                        {producto.ingredientes && producto.ingredientes.length > 3 && '...'}
                      </p>
                    </div>
                    <button 
                      className="btn-agregar-comida"
                      onClick={() => agregarComidaAPromocion(producto)}
                      disabled={formularioPromo.comidasSeleccionadas.some(c => c.comidaId === producto._id)}
                    >
                      {formularioPromo.comidasSeleccionadas.some(c => c.comidaId === producto._id) 
                        ? '✅ Ya agregado' 
                        : '➕ Agregar'
                      }
                    </button>
                  </div>
                ))
              )}
            </div>
            
              <button 
              className="btn-finalizar-seleccion"
              onClick={() => setMostrarSelectorComidas(false)}
            >
              <span style={{ marginRight: '0.5rem' }}>✨</span>
              Finalizar Selección 
              {formularioPromo.comidasSeleccionadas.length > 0 && 
                `(${formularioPromo.comidasSeleccionadas.length} seleccionadas)`
              }
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default LocatarioDashboard;
