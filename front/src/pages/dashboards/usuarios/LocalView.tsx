import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './LocalView.css';

interface Comida {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  ingredientes: string[];
  imagenUrl?: string;
  disponible?: boolean;
  categoria?: string;
}

interface ComidaPromocion {
  comidaId: string;
  nombre: string;
  cantidad: number;
  precioOriginal: number;
}

interface Promocion {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  comidas: ComidaPromocion[];
  activa?: boolean;
  cantidadDisponible?: number;
  fechaInicio?: string;
  fechaFin?: string;
  cantidadVendida?: number;
}

interface Local {
  _id: string;
  nombre?: string;
  apellido?: string;
  nombreLocal: string;
  numeroLocal?: string;
  descripcion?: string;
  valoracion?: number;
  tiempoEntrega?: string;
  categorias?: string[];
  estado?: string;
  direccion?: string;
}

const LocalView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados existentes
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [local, setLocal] = useState<Local | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedComida, setSelectedComida] = useState<Comida | null>(null);
  const [cantidad, setCantidad] = useState(1);

  // ✅ NUEVOS ESTADOS PARA PESTAÑAS Y PROMOCIONES
  const [vistaActual, setVistaActual] = useState<'comidas' | 'promociones'>('comidas');
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loadingPromociones, setLoadingPromociones] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null);
  const [cantidadPromo, setCantidadPromo] = useState(1);

  useEffect(() => {
    if (id) {
      cargarDatosLocal();
    } else {
      setError('ID de local no proporcionado');
      setLoading(false);
    }
  }, [id]);

  // ✅ CARGAR PROMOCIONES CUANDO CAMBIA LA VISTA
  useEffect(() => {
    if (id && vistaActual === 'promociones') {
      cargarPromociones();
    }
  }, [id, vistaActual]);

  const cargarDatosLocal = async () => {
    if (!id) {
      setError('ID de local no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`🏪 Cargando datos del local: ${id}`);

      // ✅ CARGAR DATOS DEL LOCAL
      const localResponse = await fetch(`http://localhost:3000/locatarios/${id}`);
      
      if (!localResponse.ok) {
        throw new Error('Local no encontrado');
      }

      const localData = await localResponse.json();
      console.log('📍 Datos del local:', localData);
      setLocal(localData);

      // ✅ CARGAR COMIDAS - ID YA ESTÁ VERIFICADO
      await cargarComidas(id);

    } catch (error) {
      console.error('Error cargando local:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN CORREGIDA - PARÁMETRO SIEMPRE STRING
  const cargarComidas = async (localId: string) => {
    try {
      const endpoints = [
        `http://localhost:3001/comidas/locatario/${localId}`,
        `http://localhost:3001/comidas/local/${localId}`,
        `http://localhost:3000/comidas/locatario/${localId}`,
      ];

      let comidasData = [];
      let success = false;

      for (const endpoint of endpoints) {
        try {
          console.log(`🍕 Intentando cargar comidas desde: ${endpoint}`);
          const comidasResponse = await fetch(endpoint);
          
          if (comidasResponse.ok) {
            comidasData = await comidasResponse.json();
            console.log(`✅ Comidas cargadas desde ${endpoint}:`, comidasData);
            success = true;
            break;
          } else {
            console.log(`❌ Error ${comidasResponse.status} en ${endpoint}`);
          }
        } catch (endpointError) {
          console.log(`❌ Error de conexión en ${endpoint}:`, endpointError);
        }
      }

      if (!success) {
        console.log('⚠️ No se pudieron cargar las comidas desde ningún endpoint');
        setComidas([]);
      } else {
        setComidas(comidasData);
      }

    } catch (error) {
      console.error('Error cargando comidas:', error);
      setComidas([]);
    }
  };

  // ✅ FUNCIÓN CORREGIDA PARA PROMOCIONES
  const cargarPromociones = async () => {
    if (!id) {
      console.warn('⚠️ No hay ID para cargar promociones');
      return;
    }
    
    try {
      setLoadingPromociones(true);
      console.log(`🎉 Cargando promociones del local: ${id}`);

      const endpoints = [
        `http://localhost:3001/promociones/locatario/${id}`,
        `http://localhost:3001/promociones/activas?locatario=${id}`,
      ];

      let promocionesData = [];
      let success = false;

      for (const endpoint of endpoints) {
        try {
          console.log(`🎯 Intentando cargar promociones desde: ${endpoint}`);
          const promocionesResponse = await fetch(endpoint);
          
          if (promocionesResponse.ok) {
            promocionesData = await promocionesResponse.json();
            console.log(`✅ Promociones cargadas desde ${endpoint}:`, promocionesData);
            success = true;
            break;
          } else {
            console.log(`❌ Error ${promocionesResponse.status} en ${endpoint}`);
          }
        } catch (endpointError) {
          console.log(`❌ Error de conexión en ${endpoint}:`, endpointError);
        }
      }

      if (!success) {
        console.log('⚠️ No se pudieron cargar las promociones desde ningún endpoint');
        setPromociones([]);
      } else {
        // Filtrar solo promociones activas
        const promocionesActivas = promocionesData.filter((promo: Promocion) => promo.activa);
        setPromociones(promocionesActivas);
      }

    } catch (error) {
      console.error('Error cargando promociones:', error);
      setPromociones([]);
    } finally {
      setLoadingPromociones(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star-filled">★</span>);
    }
    
    // Media estrella
    if (hasHalfStar) {
      stars.push(<span key="half" className="star-half">★</span>);
    }
    
    // Estrellas vacías
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">☆</span>);
    }
    
    return stars;
  };

  // ✅ FUNCIÓN FALTANTE - MANEJAR CLICK EN COMIDA
  const handleAgregarClick = (comida: Comida) => {
    console.log('🛒 Click en agregar comida:', comida.nombre);
    setSelectedComida(comida);
    setCantidad(1);
    setShowModal(true);
  };

  // ✅ FUNCIÓN FALTANTE - MANEJAR CLICK EN PROMOCIÓN
  const handleAgregarPromocionClick = (promocion: Promocion) => {
    console.log('🎉 Click en agregar promoción:', promocion.nombre);
    setSelectedPromocion(promocion);
    setCantidadPromo(1);
    setShowPromoModal(true);
  };


  // ✅ FUNCIONES CORREGIDAS - VERIFICAR ID Y TOKEN
 const handleAceptar = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesión expirada');
      navigate('/', { replace: true });
      return;
    }
    
    if (!selectedComida || !id || !local) {
      alert('Faltan datos necesarios');
      return;
    }
    
    console.log('🛒 Iniciando handleAceptar');

    let idComprador = localStorage.getItem('idUsuario');
    try {
      const res = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('👤 Respuesta de /usuarios/me:', data);
        idComprador = data.userId || data._id;
      } else {
        alert('No se pudo obtener el usuario');
        return;
      }
    } catch {
      alert('Error de conexión');
      return;
    }

    const body = {
      idComida: selectedComida._id,
      idLocatario: id,
      nombreLocal: local.nombreLocal,
      nombreComida: selectedComida.nombre,
      cantidad,
      precio: selectedComida.precio,
      imagenUrl: selectedComida.imagenUrl
    };

    console.log('🛒 idComprador:', idComprador);
    console.log('🛒 Body enviado al carrito:', body);

    try {
      const response = await fetch(`http://localhost:3002/carrito/${idComprador}/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        // ✅ QUITAR VARIABLE result NO USADA
        await response.json();
        alert('✅ Producto agregado al carrito');
        setShowModal(false);
      } else {
        const error = await response.json();
        alert('❌ Error al agregar al carrito: ' + (error.message || 'Error'));
      }
    } catch {
      alert('❌ Error de conexión al agregar al carrito');
    }
  };

  const handleAceptarPromocion = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesión expirada');
      navigate('/', { replace: true });
      return;
    }
    
    if (!selectedPromocion || !id || !local) {
      alert('Faltan datos necesarios');
      return;
    }
    
    console.log('🎉 Iniciando handleAceptarPromocion');

    let idComprador = localStorage.getItem('idUsuario');
    try {
      const res = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        idComprador = data.userId || data._id;
      } else {
        alert('No se pudo obtener el usuario');
        return;
      }
    } catch {
      alert('Error de conexión');
      return;
    }

    const body = {
      idPromocion: selectedPromocion._id,
      idLocatario: id,
      nombreLocal: local.nombreLocal,
      nombrePromocion: selectedPromocion.nombre,
      cantidad: cantidadPromo,
      precio: selectedPromocion.precio,
      imagenUrl: selectedPromocion.imagenUrl,
      tipo: 'promocion',
      comidas: selectedPromocion.comidas
    };

    console.log('🎉 Body promoción enviado al carrito:', body);

    try {
      const response = await fetch(`http://localhost:3002/carrito/${idComprador}/agregar-promocion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        // ✅ QUITAR VARIABLE result NO USADA
        await response.json();
        alert('✅ Promoción agregada al carrito');
        setShowPromoModal(false);
      } else {
        const error = await response.json();
        alert('❌ Error al agregar promoción al carrito: ' + (error.message || 'Error'));
      }
    } catch {
      alert('❌ Error de conexión al agregar promoción al carrito');
    }
  };

  // ✅ VALIDACIÓN TEMPRANA - SI NO HAY ID, MOSTRAR ERROR
  if (!id) {
    return (
      <div className="local-view-error">
        <h2>❌ Error</h2>
        <p>ID de local no válido</p>
        <button onClick={() => navigate('/comprador')} className="btn-volver">
          ← Volver al inicio
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="local-view-loading">
        <div className="loading-spinner">Cargando local...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="local-view-error">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/comprador')} className="btn-volver">
          ← Volver al inicio
        </button>
      </div>
    );
  }

  if (!local) {
    return (
      <div className="local-view-error">
        <h2>🏪 Local no encontrado</h2>
        <p>El local que buscas no existe o no está disponible.</p>
        <button onClick={() => navigate('/comprador')} className="btn-volver">
          ← Volver al inicio
        </button>
      </div>
    );
  }


  return (
    <div className="local-view">
      {/* ✅ NAVBAR */}
      <nav className="local-navbar">
        <button className="volver-btn" onClick={() => navigate('/comprador')}>
          <span>←</span> Volver
        </button>
        <span className="local-nombre">{local.nombreLocal}</span>
      </nav>

      {/* ✅ INFO DEL LOCAL */}
      <div className="local-info-section">
        {local.descripcion && <p className="local-descripcion">{local.descripcion}</p>}
        
        <div className="local-meta">
          {local.valoracion !== undefined && (
            <div className="local-rating">
              {renderStars(local.valoracion)}
              <span className="rating-number">({local.valoracion.toFixed(1)})</span>
            </div>
          )}
          
          {local.tiempoEntrega && (
            <span className="tiempo-entrega">⏱️ {local.tiempoEntrega}</span>
          )}
          
          {local.estado && (
            <span className={`estado ${local.estado.toLowerCase()}`}>
              {local.estado === 'abierto' ? '🟢 Abierto' : '🔴 Cerrado'}
            </span>
          )}
        </div>

        {local.direccion && (
          <p className="local-direccion">📍 {local.direccion}</p>
        )}
      </div>

      {/* ✅ PESTAÑAS DE NAVEGACIÓN (NUEVA) */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${vistaActual === 'comidas' ? 'active' : ''}`}
          onClick={() => setVistaActual('comidas')}
        >
          🍽️ Comidas
        </button>
        <button 
          className={`tab-btn ${vistaActual === 'promociones' ? 'active' : ''}`}
          onClick={() => setVistaActual('promociones')}
        >
          🎉 Promociones
        </button>
      </div>

      {/* ✅ CONTENIDO SEGÚN LA VISTA ACTUAL */}
      <div className="contenido-local">
        {vistaActual === 'comidas' ? (
          // ✅ VISTA DE COMIDAS (ORIGINAL)
          <div className="productos-grid">
            {comidas.length === 0 ? (
              <div className="no-productos">
                <div className="no-productos-icon">🍽️</div>
                <h3>No hay comidas disponibles</h3>
                <p>Este local aún no tiene comidas en su menú.</p>
              </div>
            ) : (
              comidas.map((comida) => (
                <div className="producto-card" key={comida._id}>
                  <img
                    src={
                      comida.imagenUrl
                        ? comida.imagenUrl.startsWith('/uploads/')
                          ? `http://localhost:3001${comida.imagenUrl}`
                          : comida.imagenUrl
                        : 'https://via.placeholder.com/200x140?text=Sin+Imagen'
                    }
                    alt={comida.nombre}
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <h3>{comida.nombre}</h3>
                  <p><strong>Precio:</strong> ${comida.precio.toLocaleString()}</p>
                  <p><strong>Stock:</strong> {comida.cantidad}</p>
                  {comida.ingredientes && comida.ingredientes.length > 0 && (
                    <p><strong>Ingredientes:</strong> {comida.ingredientes.join(', ')}</p>
                  )}
                  <p>{comida.descripcion}</p>
                  <button
                    className="agregar-btn"
                    onClick={() => handleAgregarClick(comida)}
                    disabled={comida.cantidad <= 0 || local.estado === 'cerrado'}
                  >
                    {comida.cantidad <= 0 ? 'Sin stock' : 
                     local.estado === 'cerrado' ? 'Local cerrado' : 
                     '+ Agregar'}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          // ✅ VISTA DE PROMOCIONES (NUEVA)
          <div className="promociones-grid">
            {loadingPromociones ? (
              <div className="no-productos">
                <div className="loading-spinner">Cargando promociones...</div>
              </div>
            ) : promociones.length === 0 ? (
              <div className="no-productos">
                <div className="no-productos-icon">🎉</div>
                <h3>No hay promociones disponibles</h3>
                <p>Este local no tiene promociones activas en este momento.</p>
              </div>
            ) : (
              promociones.map((promocion) => (
                <div className="promocion-card" key={promocion._id}>
                  <div className="promocion-header">
                    <img
                      src={
                        promocion.imagenUrl
                          ? promocion.imagenUrl.startsWith('/uploads/')
                            ? `http://localhost:3001${promocion.imagenUrl}`
                            : promocion.imagenUrl
                          : 'https://via.placeholder.com/200x140?text=Promoción'
                      }
                      alt={promocion.nombre}
                      style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <span className="promocion-estado activa">
                      🔥 Oferta Especial
                    </span>
                  </div>
                  
                  <div className="promocion-content">
                    <h3>{promocion.nombre}</h3>
                    <p className="promocion-descripcion">{promocion.descripcion}</p>
                    
                    <div className="promocion-precio">
                      <span className="precio-promo">${promocion.precio.toLocaleString()}</span>
                      <span className="precio-original">
                        ${promocion.comidas.reduce((total, c) => total + (c.precioOriginal * c.cantidad), 0).toLocaleString()}
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

                    {promocion.cantidadDisponible !== undefined && promocion.cantidadDisponible > 0 && (
                      <p className="cantidad-disponible">
                        <strong>Disponibles:</strong> {promocion.cantidadDisponible}
                      </p>
                    )}

                    <button
                      className="agregar-btn promo-btn"
                      onClick={() => handleAgregarPromocionClick(promocion)}
                      disabled={
                        local.estado === 'cerrado' || 
                        (promocion.cantidadDisponible !== undefined && promocion.cantidadDisponible <= 0)
                      }
                    >
                      {local.estado === 'cerrado' ? 'Local cerrado' :
                       (promocion.cantidadDisponible !== undefined && promocion.cantidadDisponible <= 0) ? 'Agotado' :
                       '🎉 Agregar Promoción'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ✅ MODAL COMIDAS (ORIGINAL) */}
      {showModal && selectedComida && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-cantidad" onClick={e => e.stopPropagation()}>
            <h3>¿Cuántos deseas agregar?</h3>
            <div className="modal-producto-nombre">{selectedComida.nombre}</div>
            <input
              type="number"
              min={1}
              max={selectedComida.cantidad}
              value={cantidad}
              onChange={e => setCantidad(Number(e.target.value))}
              className="input-cantidad"
            />
            <div className="modal-btns">
              <button
                className="aceptar-btn"
                onClick={() => { 
                  console.log('🛒 Click aceptar'); 
                  handleAceptar(); 
                }}
              >
                Aceptar
              </button>
              <button
                className="cancelar-btn"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL PROMOCIONES (NUEVO) */}
      {showPromoModal && selectedPromocion && (
        <div className="modal-overlay" onClick={() => setShowPromoModal(false)}>
          <div className="modal-cantidad promo-modal" onClick={e => e.stopPropagation()}>
            <h3>🎉 ¿Cuántas promociones deseas?</h3>
            <div className="modal-producto-nombre">{selectedPromocion.nombre}</div>
            
            <div className="promo-resumen">
              <p><strong>Precio por promoción:</strong> ${selectedPromocion.precio.toLocaleString()}</p>
              <p><strong>Ahorro por promoción:</strong> ${(selectedPromocion.comidas.reduce((total, c) => total + (c.precioOriginal * c.cantidad), 0) - selectedPromocion.precio).toLocaleString()}</p>
            </div>
            
            <input
              type="number"
              min={1}
              max={selectedPromocion.cantidadDisponible || 99}
              value={cantidadPromo}
              onChange={e => setCantidadPromo(Number(e.target.value))}
              className="input-cantidad"
            />
            
            <div className="total-promo">
              <strong>Total: ${(selectedPromocion.precio * cantidadPromo).toLocaleString()}</strong>
            </div>
            
            <div className="modal-btns">
              <button
                className="aceptar-btn promo-aceptar"
                onClick={() => { 
                  console.log('🎉 Click aceptar promoción'); 
                  handleAceptarPromocion(); 
                }}
              >
                🎉 Agregar al Carrito
              </button>
              <button
                className="cancelar-btn"
                onClick={() => setShowPromoModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ DEBUG INFO */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '1rem', 
        margin: '2rem 0', 
        borderRadius: '8px',
        fontSize: '0.9rem' 
      }}>
        <p><strong>🔍 Debug Info:</strong></p>
        <p>Local ID: {id}</p>
        <p>Usuario: {user?.nombreUsuario || user?.nombre}</p>
        <p>Vista actual: {vistaActual}</p>
        <p>Comidas encontradas: {comidas.length}</p>
        <p>Promociones encontradas: {promociones.length}</p>
        <p>Estado del local: {local?.estado}</p>
      </div>
    </div>
  );
};

export default LocalView;