import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarritoView.css'; // Asegúrate de que este archivo existe y está actualizado

interface ComidaCarrito {
  _id: string;
  idLocatario: string;
  nombreLocal: string;
  nombreComida: string;
  cantidad: number;
  precio: number;
  imagenUrl?: string;
}

const CarritoView: React.FC = () => {
  const [comidas, setComidas] = useState<ComidaCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBack, setTotalBack] = useState<number>(0); // Total desde el backend
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false); // Para el modal de confirmación de eliminación
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Estados del modal de pago (que ahora estarán en la barra lateral)
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | ''>('');
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState('');
  const [pagoOk, setPagoOk] = useState(''); // Mensaje de éxito de pago

  const [propina, setPropina] = useState(false);
  const [cantidadPropina, setCantidadPropina] = useState<number | ''>('');
  const [esDelivery, setEsDelivery] = useState<boolean | null>(null);
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [numeroCasaDepto, setNumeroCasaDepto] = useState('');
  const [direccionUsuario, setDireccionUsuario] = useState(''); // Dirección del usuario para el placeholder

  const navigate = useNavigate();

  // Costos fijos (pueden venir del backend o configurarse globalmente)
  const envioCosto = 0; // Se mantiene gratis por ahora
  const ivaPorcentaje = 0.19; // IVA en Chile

  useEffect(() => {
    const fetchCarrito = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      try {
        // Obtener datos del usuario para el ID y la dirección
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) {
          throw new Error('No se pudo obtener el usuario');
        }
        const userData = await resUser.json();
        const idComprador = userData.userId || userData._id;
        setDireccionUsuario(userData.direccion || ''); // Guarda la dirección del usuario
        setDireccionEntrega(userData.direccion || ''); // Por defecto, usa la dirección del usuario para delivery

        // Obtener ítems del carrito
        const resCarrito = await fetch(`http://localhost:3002/carrito/${idComprador}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resCarrito.ok) {
          throw new Error('Error al obtener el carrito');
        }
        const data = await resCarrito.json();
        setComidas(data?.items || []);

        // Obtener total seguro desde el backend
        const resTotal = await fetch(`http://localhost:3002/carrito/${idComprador}/total`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resTotal.ok) {
          throw new Error('Error al obtener el total del carrito');
        }
        const totalData = await resTotal.json();
        setTotalBack(totalData.total || 0);

      } catch (err: any) {
        console.error(err);
        // Puedes mostrar un alert o un mensaje en la UI
        // alert(err.message || "Error al cargar el carrito.");
        setComidas([]); // Limpiar carrito en caso de error
        setTotalBack(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCarrito();
  }, [navigate]);

  const abrirModalEliminar = (itemId: string) => {
    setItemToDelete(itemId);
    setModalEliminarVisible(true);
  };

  const cancelarEliminar = () => {
    setModalEliminarVisible(false);
    setItemToDelete(null);
  };

  const confirmarEliminar = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('token');

    try {
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await resUser.json();
      const idComprador = userData.userId || userData._id;

      const res = await fetch(`http://localhost:3002/carrito/${idComprador}/item/${itemToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setComidas(comidas.filter(c => c._id !== itemToDelete));
        setModalEliminarVisible(false);
        setItemToDelete(null);

        // Recalcular total del backend
        const resTotal = await fetch(`http://localhost:3002/carrito/${idComprador}/total`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const totalData = await resTotal.json();
        setTotalBack(totalData.total || 0);
      } else {
        throw new Error('Error al eliminar producto');
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto del carrito.");
    }
  };

  const handleCrearPedido = async () => {
    setPagoLoading(true);
    setPagoError('');
    setPagoOk('');

    const token = localStorage.getItem('token');
    if (!token) {
      setPagoError('No autenticado. Por favor, inicia sesión.');
      setPagoLoading(false);
      return;
    }

    try {
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resUser.ok) {
        throw new Error('No se pudo obtener la información del usuario.');
      }
      const userData = await resUser.json();
      const idComprador = userData.userId || userData._id;

      // Agrupa por local para crear un pedido por cada local
      const localesEnCarrito = [...new Set(comidas.map(c => c.idLocatario))];

      for (const idLocal of localesEnCarrito) {
        const comidasLocal = comidas.filter(c => c.idLocatario === idLocal);
        const subtotalLocal = comidasLocal.reduce((acc, c) => acc + c.precio * c.cantidad, 0);
        const ivaLocal = subtotalLocal * ivaPorcentaje;
        let precioFinalPedido = subtotalLocal + ivaLocal + envioCosto;

        // Añadir propina solo si es delivery y se selecciona propina
        if (esDelivery && propina && typeof cantidadPropina === 'number' && cantidadPropina > 0) {
            precioFinalPedido += cantidadPropina;
        }

        const pedidoBody = {
          idComprador,
          idLocal,
          nombrePedido: comidasLocal.map(c => c.nombreComida).join(', '),
          pago: metodoPago,
          precioPedido: precioFinalPedido, // Usa el total calculado aquí
          comidas: comidasLocal.map(c => ({
            nombre: c.nombreComida,
            cantidad: c.cantidad
          })),
          esDelivery: !!esDelivery,
          direccionEntrega: esDelivery ? direccionEntrega : undefined,
          numeroCasaDepto: esDelivery ? numeroCasaDepto : undefined,
          propina: esDelivery ? !!propina : false,
          cantidadPropina: esDelivery && propina && typeof cantidadPropina === 'number' ? cantidadPropina : undefined
        };

        const res = await fetch('http://localhost:3002/pedidos/crear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(pedidoBody)
        });

        if (!res.ok) {
          throw new Error(`Error al crear pedido para el local ${comidasLocal[0]?.nombreLocal || idLocal}`);
        }
      }

      // Limpiar carrito después de crear todos los pedidos exitosamente
      // Esto debería hacerse en el backend después de crear los pedidos
      // O hacer una llamada DELETE /carrito/:idComprador para vaciarlo
      const resVaciarCarrito = await fetch(`http://localhost:3002/carrito/${idComprador}/vaciar`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resVaciarCarrito.ok) {
        console.warn("Advertencia: No se pudo vaciar el carrito en el backend después de la compra.");
      }

      setPagoOk('¡Pedido(s) realizado(s) con éxito!');
      setComidas([]); // Vacía el carrito en el frontend
      setTotalBack(0); // Reinicia el total
      setEsDelivery(null); // Reinicia opciones de delivery/pago
      setMetodoPago('');
      setPropina(false);
      setCantidadPropina('');

    } catch (error: any) {
      setPagoError(error.message || 'Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setPagoLoading(false);
    }
  };


  const handleVerificarSaldoYCrear = async () => {
    setPagoLoading(true);
    setPagoError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setPagoError('No autenticado. Por favor, inicia sesión.');
      setPagoLoading(false);
      return;
    }

    try {
      // Calcular el total con IVA, envío y propina
      const subtotalConIva = totalBack + (totalBack * ivaPorcentaje) + envioCosto;
      const totalAPagar = subtotalConIva + (esDelivery && propina && typeof cantidadPropina === 'number' ? cantidadPropina : 0);

      // Verificar saldo
      const resSaldo = await fetch('http://localhost:3000/usuarios/me/saldo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resSaldo.ok) {
        throw new Error('No se pudo verificar el saldo de la cartera.');
      }
      const dataSaldo = await resSaldo.json();
      if (dataSaldo.saldo < totalAPagar) {
        setPagoError('Saldo insuficiente en tu cartera.');
        setPagoLoading(false);
        return;
      }

      // Si tiene saldo suficiente, procede a crear el pedido
      await handleCrearPedido();

    } catch (error: any) {
      setPagoError(error.message || 'Error al verificar el saldo. Intenta de nuevo.');
    } finally {
      setPagoLoading(false);
    }
  };

  const totalConIva = totalBack + (totalBack * ivaPorcentaje) + envioCosto;
  const totalFinalConPropina = esDelivery && propina && typeof cantidadPropina === 'number' && cantidadPropina >= 0
    ? totalConIva + cantidadPropina
    : totalConIva;

  if (loading) {
    return (
      <div className="carrito-root">
        <div className="navbar-dashboard"> {/* Usa la clase de la navbar general */}
            <button className="icon-btn" onClick={() => navigate(-1)} title="Volver">
                <img src="https://img.icons8.com/ios-filled/28/ffffff/left.png" alt="Volver" />
            </button>
            <span className="logo">VeciMarket</span> {/* Clase del logo */}
        </div>
        <div className="dashboard-body">
            <div className="loading-message">Cargando carrito...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-root">
      {/* Barra superior (Navbar del CompradorDashboard) */}
      <nav className="navbar-dashboard">
        <button className="icon-btn" onClick={() => navigate(-1)} title="Volver">
            <img src="https://img.icons8.com/ios-filled/28/ffffff/left.png" alt="Volver" />
        </button>
        <span className="logo">VeciMarket</span>
      </nav>

      <div className="dashboard-body"> {/* Contenedor principal de 2 columnas */}
        <div className="carrito-product-list-column">
          <h2 className="productos-title">Mi Carrito ({comidas.length} productos)</h2> 
          {comidas.length === 0 ? (
            <div className="no-data-message">No hay productos en el carrito. ¡Añade algunos!</div> 
          ) : (
            <div className="carrito-list">
              {comidas.map((comida) => (
                <div className="producto-card" key={comida._id}> 
                  <img
                    src={
                      comida.imagenUrl
                        ? comida.imagenUrl.startsWith('http')
                          ? comida.imagenUrl
                          : `http://localhost:3001${comida.imagenUrl}`
                        : 'https://img.icons8.com/ios-filled/80/cccccc/meal.png'
                    }
                    alt={comida.nombreComida}
                    className="producto-imagen" // Reutiliza la imagen del producto
                  />
                  <div className="producto-info"> 
                    <div className="producto-nombre">{comida.nombreComida}</div>
                    <div className="producto-local-info">Local: {comida.nombreLocal}</div>
                    <div className="carrito-cantidad-precio">
                        <span>Cantidad: {comida.cantidad}</span>
                        <span>Precio unitario: ${comida.precio.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="carrito-total-item-price">
                        Total: ${(comida.precio * comida.cantidad).toLocaleString('es-CL')}
                    </div>
                    <button
                      className="add-to-cart-button" // Usamos el botón de añadir al carrito como eliminar
                      onClick={() => abrirModalEliminar(comida._id)}
                      title="Eliminar"
                      style={{ backgroundColor: 'var(--color-danger)' }} // Color rojo para eliminar
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna de resumen del pedido / pago (barra lateral) */}
        <div className="sidebar"> {/* Reutiliza la clase sidebar */}
          <h2 className="sidebar-title">Resumen y Pago</h2>

          <div className="carrito-summary-section">
            <div className="carrito-summary-row">
              <span>Subtotal</span>
              <span>${totalBack.toLocaleString('es-CL')}</span>
            </div>
            <div className="carrito-summary-row">
              <span>Envío</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>GRATIS</span>
            </div>
            <div className="carrito-summary-row">
              <span>IVA (19%)</span>
              <span>${(totalBack * ivaPorcentaje).toLocaleString('es-CL')}</span>
            </div>
            {esDelivery && propina && typeof cantidadPropina === 'number' && cantidadPropina > 0 && (
              <div className="carrito-summary-row">
                <span>Propina</span>
                <span>${cantidadPropina.toLocaleString('es-CL')}</span>
              </div>
            )}
            <div className="carrito-summary-row total">
              <span>Total a pagar</span>
              <span>${totalFinalConPropina.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <hr style={{ margin: '1.5rem 0', borderTop: '1px solid var(--color-card-border)' }}/> {/* Separador */}

          {/* Opciones de delivery */}
          <h3 className="sidebar-subtitle">¿Desea delivery?</h3>
          <div className="sidebar-buttons-group">
            <button
              className={esDelivery === true ? 'local-button selected' : 'local-button'}
              onClick={() => setEsDelivery(true)}
              type="button"
            >
              Sí
            </button>
            <button
              className={esDelivery === false ? 'local-button selected' : 'local-button'}
              onClick={() => setEsDelivery(false)}
              type="button"
            >
              No
            </button>
          </div>

          {esDelivery && (
            <div className="delivery-details">
              <label className="sidebar-label">
                Dirección de entrega:
                <input
                  type="text"
                  value={direccionEntrega}
                  onChange={e => setDireccionEntrega(e.target.value)}
                  className="sidebar-search-input" // Reutiliza el input de la sidebar
                  placeholder={direccionUsuario ? `Ej: ${direccionUsuario}` : 'Ingrese dirección'}
                />
              </label>
              <label className="sidebar-label">
                N° Casa/Depto:
                <input
                  type="text"
                  value={numeroCasaDepto}
                  onChange={e => setNumeroCasaDepto(e.target.value)}
                  className="sidebar-search-input small-input" // Añade clase para input pequeño
                />
              </label>
            </div>
          )}

          <hr style={{ margin: '1.5rem 0', borderTop: '1px solid var(--color-card-border)' }}/> {/* Separador */}

          {/* Método de pago */}
          <h3 className="sidebar-subtitle">Selecciona método de pago:</h3>
          <div className="sidebar-buttons-group">
            <button
              className={metodoPago === 'efectivo' ? 'local-button selected' : 'local-button'}
              onClick={() => setMetodoPago('efectivo')}
            >
              Efectivo
            </button>
            <button
              className={metodoPago === 'tarjeta' ? 'local-button selected' : 'local-button'}
              onClick={() => setMetodoPago('tarjeta')}
            >
              Tarjeta
            </button>
          </div>

          {/* Opción de propina (solo si es delivery) */}
          {esDelivery && (
            <>
              <hr style={{ margin: '1.5rem 0', borderTop: '1px solid var(--color-card-border)' }}/>
              <h3 className="sidebar-subtitle">¿Desea agregar propina?</h3>
              <div className="sidebar-buttons-group">
                <button
                  className={propina ? 'local-button selected' : 'local-button'}
                  onClick={() => setPropina(true)}
                  type="button"
                >
                  Sí
                </button>
                <button
                  className={!propina ? 'local-button selected' : 'local-button'}
                  onClick={() => { setPropina(false); setCantidadPropina(''); }}
                  type="button"
                >
                  No
                </button>
              </div>
              {propina && (
                <div className="propina-input-group">
                  <label className="sidebar-label">
                    <span>Monto propina (entero): </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={cantidadPropina}
                      onChange={e => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setCantidadPropina(val === '' ? '' : parseInt(val));
                      }}
                      className="sidebar-search-input small-input"
                      disabled={!propina}
                    />
                  </label>
                </div>
              )}
            </>
          )}

          {/* Mensajes de error y éxito */}
          {pagoError && <div className="error-message" style={{ marginTop: '1.5rem' }}>{pagoError}</div>}
          {pagoOk && <div className="success-message" style={{ marginTop: '1.5rem' }}>{pagoOk}</div>}

          {/* Botón de confirmar pago */}
          <button
            className="add-to-cart-button" // Reutilizamos este botón para confirmar
            onClick={() => {
              if (metodoPago === 'efectivo') handleCrearPedido();
              else if (metodoPago === 'tarjeta') handleVerificarSaldoYCrear();
            }}
            disabled={
              !metodoPago ||
              pagoLoading ||
              esDelivery === null ||
              (esDelivery && (!direccionEntrega || !numeroCasaDepto)) ||
              (esDelivery && propina && (cantidadPropina === '' || isNaN(Number(cantidadPropina)) || Number(cantidadPropina) < 0)) ||
              comidas.length === 0 // No permitir pagar si el carrito está vacío
            }
            style={{ marginTop: '2rem', backgroundColor: 'var(--color-success)' }} // Color verde para pagar
          >
            {pagoLoading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
          <p className="carrito-security-text">Paga con rapidez y seguridad.</p>
        </div>
      </div>

      {/* Modal de confirmación de eliminación (EXISTENTE) */}
      {modalEliminarVisible && (
        <div className="carrito-modal-overlay">
          <div className="carrito-modal-content">
            <h3>¿Estás seguro de eliminar este producto?</h3>
            <div className="carrito-modal-actions">
              <button className="confirm-button" onClick={confirmarEliminar}>Eliminar</button>
              <button className="cancel-button" onClick={cancelarEliminar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoView;