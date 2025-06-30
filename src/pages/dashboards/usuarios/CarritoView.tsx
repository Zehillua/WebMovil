import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarritoView.css';

interface ComidaCarrito {
  _id: string;
  idLocatario: string;
  nombreLocal: string;
  nombreComida: string;
  cantidad: number;
  precio: number;
  imagenUrl?: string;
  tipo?: string;
}

// ✅ NUEVA INTERFAZ PARA PROMOCIONES EN EL CARRITO
interface PromocionCarrito {
  _id: string;
  idLocatario: string;
  nombreLocal: string;
  nombrePromocion: string;
  cantidad: number;
  precio: number;
  imagenUrl?: string;
  tipo: string;
  comidas: {
    comidaId: string;
    nombre: string;
    cantidad: number;
    precioOriginal: number;
  }[];
}

const CarritoView: React.FC = () => {
  const [comidas, setComidas] = useState<ComidaCarrito[]>([]);
  const [promociones, setPromociones] = useState<PromocionCarrito[]>([]); // ✅ NUEVO ESTADO
  const [loading, setLoading] = useState(true);
  const [totalBack, setTotalBack] = useState<number>(0);
  const [totalComidas, setTotalComidas] = useState<number>(0); // ✅ NUEVO
  const [totalPromociones, setTotalPromociones] = useState<number>(0); // ✅ NUEVO
  const [showPago, setShowPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | ''>('');
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState('');
  const [pagoOk, setPagoOk] = useState('');
  const [propina, setPropina] = useState(false);
  const [cantidadPropina, setCantidadPropina] = useState<number | ''>('');
  const [esDelivery, setEsDelivery] = useState<boolean | null>(null);
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [numeroCasaDepto, setNumeroCasaDepto] = useState('');
  const [direccionUsuario, setDireccionUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarrito = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resUser.ok) {
        navigate('/', { replace: true });
        return;
      }
      const userData = await resUser.json();
      const idComprador = userData.userId || userData._id;

      // ✅ OBTENER CARRITO COMPLETO (COMIDAS Y PROMOCIONES)
      const resCarrito = await fetch(`http://localhost:3002/carrito/${idComprador}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resCarrito.ok) {
        const data = await resCarrito.json();
        console.log('🛒 Datos del carrito:', data);
        setComidas(data?.items || []);
        setPromociones(data?.promociones || []); // ✅ CARGAR PROMOCIONES
      }

      // ✅ OBTENER TOTALES CALCULADOS DESDE EL BACKEND
      const resTotal = await fetch(`http://localhost:3002/carrito/${idComprador}/total`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resTotal.ok) {
        const data = await resTotal.json();
        console.log('💰 Totales del backend:', data);
        setTotalBack(data.total || 0);
        setTotalComidas(data.totalComidas || 0);
        setTotalPromociones(data.totalPromociones || 0);
      }

      setLoading(false);
    };
    fetchCarrito();
  }, [navigate]);

  // ✅ FUNCIÓN PARA ELIMINAR COMIDAS
  const handleEliminarComida = async (itemId: string) => {
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
    const idComprador = userData.userId || userData._id;

    const res = await fetch(`http://localhost:3002/carrito/${idComprador}/item/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.ok) {
      setComidas(comidas.filter(c => c._id !== itemId));
      await actualizarTotales(idComprador, token);
    } else {
      console.error('Error eliminando comida del carrito');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
  // ✅ NUEVA FUNCIÓN PARA ELIMINAR PROMOCIONES
  const handleEliminarPromocion = async (promocionId: string) => {
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
    const idComprador = userData.userId || userData._id;

    const res = await fetch(`http://localhost:3002/carrito/${idComprador}/promocion/${promocionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.ok) {
      setPromociones(promociones.filter(p => p._id !== promocionId));
      await actualizarTotales(idComprador, token);
    } else {
      console.error('Error eliminando promoción del carrito');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  // ✅ FUNCIÓN HELPER PARA ACTUALIZAR TOTALES
  const actualizarTotales = async (idComprador: string, token: string) => {
  try {
    const resTotal = await fetch(`http://localhost:3002/carrito/${idComprador}/total`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (resTotal.ok) {
      const data = await resTotal.json();
      setTotalBack(data.total || 0);
      setTotalComidas(data.totalComidas || 0);
      setTotalPromociones(data.totalPromociones || 0);
    }
  } catch (error) {
    console.error('Error actualizando totales:', error);
  }
};

  const handleAbrirPago = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/', { replace: true });
    return;
  }

  try {
    const resUser = await fetch('http://localhost:3000/usuarios/me/direccion', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (resUser.ok) {
      const userData = await resUser.json();
      console.log('Datos del usuario:', userData);
      setDireccionUsuario(userData.direccion || '');
      setDireccionEntrega(userData.direccion || '');
    }
    setShowPago(true);
  } catch (error) {
    console.error('Error obteniendo dirección:', error);
    setShowPago(true); // Abrir modal aunque falle obtener dirección
  }
};

  // ✅ FUNCIÓN handleCrearPedido CORREGIDA
const handleCrearPedido = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sesión expirada');
    navigate('/login');
    return;
  }

  // ✅ OBTENER ID DEL USUARIO Y DIRECCIÓN
  let direccionUsuario = '';
  let idComprador = '';
  
  try {
    const userResponse = await fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      idComprador = userData.userId || userData._id; // ✅ OBTENER ID DEL USUARIO
      
      // ✅ TRANSFORMAR DIRECCIÓN ARRAY A STRING
      if (userData.direccion) {
        if (Array.isArray(userData.direccion)) {
          // Si es array, unir con comas
          direccionUsuario = userData.direccion
            .filter((item: string) => item && item.trim()) // ✅ TIPAR ITEM
            .join(', ');
        } else if (typeof userData.direccion === 'string') {
          // Si ya es string, usar directamente
          direccionUsuario = userData.direccion.trim();
        } else {
          // Si es objeto u otro tipo, convertir a string
          direccionUsuario = String(userData.direccion);
        }
      }
      
      if (!direccionUsuario) {
        direccionUsuario = 'Dirección no especificada';
      }
      
      console.log('📍 Dirección transformada:', direccionUsuario);
      
    } else {
      console.error('Error obteniendo datos del usuario');
      direccionUsuario = 'Dirección no disponible';
      alert('Error obteniendo datos del usuario');
      return;
    }
  } catch (error) {
    console.error('Error de conexión obteniendo usuario:', error);
    alert('Error de conexión al obtener datos del usuario');
    return;
  }

  // ✅ OBTENER idLocal DESDE LAS COMIDAS O PROMOCIONES
  let idLocal = '';
  if (comidas.length > 0) {
    idLocal = comidas[0].idLocatario;
  } else if (promociones.length > 0) {
    idLocal = promociones[0].idLocatario;
  } else {
    alert('Error: No hay items en el carrito');
    return;
  }

  // ✅ CREAR PEDIDO CON VARIABLES CORRECTAS
  const pedidoData = {
    idComprador: idComprador, // ✅ USAR VARIABLE CORRECTA
    idLocal: idLocal, // ✅ USAR VARIABLE CORRECTA
    nombrePedido: `Pedido ${Date.now()}`,
    pago: metodoPago,
    precioPedido: totalBack, // ✅ USAR totalBack EN LUGAR DE calcularTotal()
    comidas: comidas.map((item: ComidaCarrito) => ({ // ✅ TIPAR ITEM
      nombre: item.nombreComida,
      cantidad: item.cantidad,
      tipo: 'comida'
    })),
    promociones: promociones.map((promo: PromocionCarrito) => ({ // ✅ TIPAR PROMO
      nombrePromocion: promo.nombrePromocion,
      cantidad: promo.cantidad,
      precio: promo.precio,
      comidas: promo.comidas?.map((c: any) => ({ // ✅ TIPAR C
        nombre: c.nombre,
        cantidad: c.cantidad
      })) || [],
      tipo: 'promocion'
    })),
    esDelivery: esDelivery,
    direccionEntrega: esDelivery ? direccionUsuario : null, // ✅ DIRECCIÓN COMO STRING
    numeroCasaDepto: numeroCasaDepto || null, // ✅ USAR VARIABLE CORRECTA
    propina: propina, // ✅ USAR VARIABLE CORRECTA
    cantidadPropina: propina ? cantidadPropina : 0 // ✅ USAR VARIABLE CORRECTA
  };

  console.log('🎯 Datos del pedido a enviar:', pedidoData);
  console.log('🔍 Tipo de direccionEntrega:', typeof pedidoData.direccionEntrega);

  try {
    const response = await fetch('http://localhost:3002/pedidos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(pedidoData)
    });

    if (response.ok) {
      const pedidoCreado = await response.json();
      console.log('✅ Pedido creado exitosamente:', pedidoCreado);
      
      // ✅ LIMPIAR ESTADOS CORRECTOS
      setComidas([]); // ✅ LIMPIAR COMIDAS
      setPromociones([]); // ✅ LIMPIAR PROMOCIONES
      setTotalBack(0); // ✅ LIMPIAR TOTALES
      setTotalComidas(0);
      setTotalPromociones(0);
      
      alert('✅ Pedido creado exitosamente');
      navigate('/comprador/pedidos');
    } else {
      const error = await response.json();
      console.error('❌ Error creando pedido:', error);
      
      if (error.message && Array.isArray(error.message)) {
        alert('❌ Error de validación: ' + error.message.join(', '));
      } else {
        alert('❌ Error al crear el pedido: ' + (error.message || 'Error desconocido'));
      }
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    alert('❌ Error de conexión al crear el pedido');
  }
};


  // ✅ FUNCIÓN handleVerificarSaldoYCrear CORREGIDA
const handleVerificarSaldoYCrear = async () => {
  setPagoLoading(true);
  setPagoError('');
  
  const token = localStorage.getItem('token');
  if (!token) {
    setPagoError('Sesión expirada');
    setPagoLoading(false);
    navigate('/', { replace: true });
    return;
  }

  try {
    const resSaldo = await fetch('http://localhost:3000/usuarios/me/saldo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!resSaldo.ok) {
      setPagoError('No se pudo verificar el saldo');
      setPagoLoading(false);
      return;
    }
    
    const dataSaldo = await resSaldo.json();
    
    // ✅ CALCULAR TOTAL CORRECTO
    const totalConPropina = totalBack + (propina && cantidadPropina ? Number(cantidadPropina) : 0);
    
    if (dataSaldo.saldo < totalConPropina) {
      setPagoError('Saldo insuficiente');
      setPagoLoading(false);
      return;
    }
    
    await handleCrearPedido();
  } catch (error) {
    console.error('Error verificando saldo:', error);
    setPagoError('Error de conexión');
  } finally {
    setPagoLoading(false); // ✅ SIEMPRE DESACTIVAR LOADING
  }
};


  if (loading) return <div className="carrito-loading">Cargando carrito...</div>;

  // ✅ VERIFICAR SI EL CARRITO ESTÁ VACÍO (COMIDAS Y PROMOCIONES)
  const carritoVacio = comidas.length === 0 && promociones.length === 0;

  return (
    <div className="carrito-root">
      {/* Barra superior */}
      <div className="carrito-header">
        <button className="carrito-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <div className="carrito-header-right">
          <span>🛒 Mi Carrito</span>
        </div>
      </div>

      <div className="carrito-content">
        {carritoVacio ? (
          <div className="carrito-empty">No hay productos en el carrito.</div>
        ) : (
          <div className="carrito-list">
            {/* ✅ SECCIÓN DE COMIDAS */}
            {comidas.length > 0 && (
              <>
                <div className="carrito-section-header">
                  <h3>🍽️ Comidas (${totalComidas.toLocaleString()})</h3>
                </div>
                {comidas.map((comida) => (
                  <div className="carrito-item" key={comida._id}>
                    <div className="carrito-img">
                      <img
                        src={
                          comida.imagenUrl
                            ? comida.imagenUrl.startsWith('http')
                              ? comida.imagenUrl
                              : `http://localhost:3001${comida.imagenUrl}`
                            : 'https://img.icons8.com/ios-filled/80/cccccc/meal.png'
                        }
                        alt={comida.nombreComida}
                      />
                    </div>
                    <div className="carrito-info">
                      <div className="carrito-nombre">{comida.nombreComida}</div>
                      <div className="carrito-local">Local: {comida.nombreLocal}</div>
                      <div className="carrito-cantidad">Cantidad: {comida.cantidad}</div>
                      <div className="carrito-precio-unit">
                        Precio unitario: ${comida.precio.toLocaleString()}
                      </div>
                      <div className="carrito-total">
                        Total: ${(comida.precio * comida.cantidad).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="carrito-eliminar"
                      onClick={() => handleEliminarComida(comida._id)}
                      title="Eliminar"
                    >
                      <span className="carrito-eliminar-bg"></span>
                      <img
                        src="https://img.icons8.com/ios-filled/40/fa314a/delete-sign.png"
                        alt="Eliminar"
                      />
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* ✅ SECCIÓN DE PROMOCIONES (NUEVA) */}
            {promociones.length > 0 && (
              <>
                <div className="carrito-section-header promo-section">
                  <h3>🎉 Promociones (${totalPromociones.toLocaleString()})</h3>
                </div>
                {promociones.map((promocion) => (
                  <div className="carrito-item promocion-item" key={promocion._id}>
                    <div className="carrito-img">
                      <img
                        src={
                          promocion.imagenUrl
                            ? promocion.imagenUrl.startsWith('http')
                              ? promocion.imagenUrl
                              : `http://localhost:3001${promocion.imagenUrl}`
                            : 'https://img.icons8.com/ios-filled/80/ff6b6b/gift.png'
                        }
                        alt={promocion.nombrePromocion}
                      />
                      <div className="promo-badge">🔥</div>
                    </div>
                    <div className="carrito-info">
                      <div className="carrito-nombre promo-nombre">
                        {promocion.nombrePromocion}
                        <span className="promo-tag">PROMOCIÓN</span>
                      </div>
                      <div className="carrito-local">Local: {promocion.nombreLocal}</div>
                      <div className="carrito-cantidad">Cantidad: {promocion.cantidad}</div>
                      
                      {/* ✅ MOSTRAR COMIDAS INCLUIDAS */}
                      <div className="promo-comidas-incluidas">
                        <strong>Incluye:</strong>
                        {promocion.comidas.map((comida, idx) => (
                          <div key={idx} className="comida-incluida-item">
                            • {comida.nombre} x{comida.cantidad}
                          </div>
                        ))}
                      </div>
                      
                      <div className="carrito-precio-unit promo-precio">
                        Precio promocional: ${promocion.precio.toLocaleString()}
                      </div>
                      
                      {/* ✅ MOSTRAR AHORRO */}
                      <div className="promo-ahorro">
                        Precio normal: ${promocion.comidas.reduce((total, c) => 
                          total + (c.precioOriginal * c.cantidad), 0
                        ).toLocaleString()}
                        <span className="ahorro-amount">
                          ¡Ahorras ${(promocion.comidas.reduce((total, c) => 
                            total + (c.precioOriginal * c.cantidad), 0
                          ) - promocion.precio).toLocaleString()}!
                        </span>
                      </div>
                      
                      <div className="carrito-total promo-total">
                        Total: ${(promocion.precio * promocion.cantidad).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="carrito-eliminar"
                      onClick={() => handleEliminarPromocion(promocion._id)}
                      title="Eliminar promoción"
                    >
                      <span className="carrito-eliminar-bg"></span>
                      <img
                        src="https://img.icons8.com/ios-filled/40/fa314a/delete-sign.png"
                        alt="Eliminar"
                      />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ✅ BARRA INFERIOR ACTUALIZADA CON DESGLOSE */}
      {!carritoVacio && (
        <div className="carrito-footer">
          <button className="carrito-pagar" onClick={handleAbrirPago}>Pagar</button>
          <div className="carrito-total-footer">
            <div className="total-desglose">
              {totalComidas > 0 && (
                <div className="subtotal-line">Comidas: ${totalComidas.toLocaleString()}</div>
              )}
              {totalPromociones > 0 && (
                <div className="subtotal-line promo-line">Promociones: ${totalPromociones.toLocaleString()}</div>
              )}
            </div>
            <div className="total-principal">
              <span>Total:</span>
              <span className="carrito-total-num">${totalBack.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL DE PAGO (SIN CAMBIOS - FUNCIONA PARA AMBOS) */}
      {showPago && (
        <div className="modal-pago-overlay" onClick={() => setShowPago(false)}>
          <div className="modal-pago" onClick={e => e.stopPropagation()}>
            <h3>¿Desea delivery?</h3>
            <div className="pago-metodos">
              <button
                className={esDelivery === true ? 'pago-btn selected' : 'pago-btn'}
                onClick={() => setEsDelivery(true)}
                type="button"
              >
                Sí
              </button>
              <button
                className={esDelivery === false ? 'pago-btn selected' : 'pago-btn'}
                onClick={() => setEsDelivery(false)}
                type="button"
              >
                No
              </button>
            </div>

            {esDelivery && (
              <div style={{ margin: '1rem 0' }}>
                <label>
                  Dirección de entrega:
                  <input
                    type="text"
                    value={direccionEntrega}
                    onChange={e => setDireccionEntrega(e.target.value)}
                    style={{ marginLeft: 8, borderRadius: 6, border: '1px solid #ccc', padding: '0.2rem 0.5rem' }}
                    placeholder={direccionUsuario ? `Ej: ${direccionUsuario}` : 'Ingrese dirección'}
                  />
                </label>
                <label style={{ marginLeft: 12 }}>
                  N° Casa/Depto:
                  <input
                    type="text"
                    value={numeroCasaDepto}
                    onChange={e => setNumeroCasaDepto(e.target.value)}
                    style={{ marginLeft: 8, borderRadius: 6, border: '1px solid #ccc', padding: '0.2rem 0.5rem', width: 60 }}
                  />
                </label>
              </div>
            )}

            <h3>Selecciona método de pago</h3>
            <div className="pago-metodos">
              <button
                className={metodoPago === 'efectivo' ? 'pago-btn selected' : 'pago-btn'}
                onClick={() => setMetodoPago('efectivo')}
              >
                Efectivo
              </button>
              <button
                className={metodoPago === 'tarjeta' ? 'pago-btn selected' : 'pago-btn'}
                onClick={() => setMetodoPago('tarjeta')}
              >
                Tarjeta
              </button>
            </div>

            {esDelivery && (
              <>
                <div style={{ margin: '1rem 0 0.5rem 0' }}>
                  <strong>¿Desea agregar propina?</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                      className={propina ? 'pago-btn selected' : 'pago-btn'}
                      onClick={() => setPropina(true)}
                      type="button"
                    >
                      Sí
                    </button>
                    <button
                      className={!propina ? 'pago-btn selected' : 'pago-btn'}
                      onClick={() => { setPropina(false); setCantidadPropina(''); }}
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
                {propina && (
                  <div style={{ margin: '0.7rem 0' }}>
                    <label>
                      <span>Ingrese propina (solo números enteros): </span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={cantidadPropina}
                        onChange={e => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) setCantidadPropina(val === '' ? '' : parseInt(val));
                        }}
                        style={{ width: 80, marginLeft: 8, borderRadius: 6, border: '1px solid #ccc', padding: '0.2rem 0.5rem' }}
                        disabled={!propina}
                      />
                    </label>
                  </div>
                )}
              </>
            )}

            {/* ✅ DESGLOSE EN EL MODAL */}
            <div style={{ margin: '1rem 0', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              {totalComidas > 0 && (
                <div><strong>Comidas:</strong> ${totalComidas.toLocaleString()}</div>
              )}
              {totalPromociones > 0 && (
                <div><strong>Promociones:</strong> ${totalPromociones.toLocaleString()}</div>
              )}
              {esDelivery && propina && cantidadPropina && (
                <div><strong>Propina:</strong> ${Number(cantidadPropina).toLocaleString()}</div>
              )}
              <hr style={{ margin: '0.5rem 0' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                <strong>Total a pagar: </strong>
                ${(
                  metodoPago === 'tarjeta' && esDelivery && propina && cantidadPropina // ✅ USAR propina
                    ? totalBack + Number(cantidadPropina)
                    : totalBack
                ).toLocaleString()}
              </div>
            </div>

            {pagoError && <div className="pago-error">{pagoError}</div>}
            {pagoOk && <div className="pago-ok">{pagoOk}</div>}
            <div className="pago-modal-btns">
              // ✅ EN LA VALIDACIÓN DEL BOTÓN CONFIRMAR:
              <button
                className="pago-btn-confirm"
                disabled={
                  !metodoPago ||
                  pagoLoading ||
                  esDelivery === null ||
                  (esDelivery && (!direccionEntrega || !numeroCasaDepto)) ||
                  (esDelivery && propina && (cantidadPropina === '' || isNaN(Number(cantidadPropina)) || Number(cantidadPropina) < 0))
                }
                onClick={() => {
                  if (metodoPago === 'efectivo') handleCrearPedido();
                  else if (metodoPago === 'tarjeta') handleVerificarSaldoYCrear();
                }}
              >
                {pagoLoading ? 'Procesando...' : 'Confirmar'}
              </button>
              <button className="pago-btn-cancel" onClick={() => setShowPago(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pago exitoso */}
      {pagoOk && (
        <div className="modal-pago-overlay" onClick={() => setPagoOk('')}>
          <div className="modal-pago" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#27ae60', marginBottom: '1rem' }}>✅ ¡Pago exitoso!</h2>
            <div>{pagoOk}</div>
            <button
              className="pago-btn-confirm"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setPagoOk('')}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoView;