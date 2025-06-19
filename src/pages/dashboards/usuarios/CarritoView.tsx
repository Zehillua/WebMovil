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
}

const CarritoView: React.FC = () => {
  const [comidas, setComidas] = useState<ComidaCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBack, setTotalBack] = useState<number>(0);
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

      const resCarrito = await fetch(`http://localhost:3002/carrito/${idComprador}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resCarrito.ok) {
        const data = await resCarrito.json();
        setComidas(data?.items || []);
      }
      // Obtener total seguro desde el backend
      const resTotal = await fetch(`http://localhost:3002/carrito/${idComprador}/total`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resTotal.ok) {
        const data = await resTotal.json();
        setTotalBack(data.total || 0);
      }

      setLoading(false);
    };
    fetchCarrito();
  }, [navigate]);

  const handleEliminar = async (itemId: string) => {
    const token = localStorage.getItem('token');
    const resUser = await fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await resUser.json();
    const idComprador = userData.userId || userData._id;

    const res = await fetch(`http://localhost:3002/carrito/${idComprador}/item/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setComidas(comidas.filter(c => c._id !== itemId));
      const resTotal = await fetch(`http://localhost:3002/carrito/${idComprador}/total`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resTotal.ok) {
      const data = await resTotal.json();
      setTotalBack(data.total || 0);
    }
    }
  };

  const handleAbrirPago = async () => {
    const token = localStorage.getItem('token');
    const resUser = await fetch('http://localhost:3000/usuarios/me/direccion', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (resUser.ok) {
      const userData = await resUser.json();
      console.log('Datos del usuario:', userData);
      setDireccionUsuario(userData.direccion || '');
      setDireccionEntrega(userData.direccion || ''); // Por defecto, usa la dirección del usuario
    }
    setShowPago(true);
  };

  const handleCrearPedido = async () => {
    setPagoLoading(true);
    setPagoError('');
    setPagoOk('');
    const token = localStorage.getItem('token');
    const resUser = await fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await resUser.json();
    const idComprador = userData.userId || userData._id;

    // Agrupa por local (puedes ajustar si solo hay un local)
    const locales = [...new Set(comidas.map(c => c.idLocatario))];
    for (const idLocal of locales) {
      const comidasLocal = comidas.filter(c => c.idLocatario === idLocal);
      const pedidoBody = {
        idComprador,
        idLocal,
        nombrePedido: comidasLocal.map(c => c.nombreComida).join(', '),
        pago: metodoPago,
        precioPedido: comidasLocal.reduce((acc, c) => acc + c.precio * c.cantidad, 0) +
          (metodoPago === 'tarjeta' && propina && cantidadPropina ? Number(cantidadPropina) : 0),
        comidas: comidasLocal.map(c => ({ nombre: c.nombreComida })),
        esDelivery: false,
        propina: !!propina,
        cantidadPropina: propina && cantidadPropina ? Number(cantidadPropina) : undefined
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
        setPagoError('Error al crear el pedido');
        setPagoLoading(false);
        return;
      }
    }
    setPagoOk('¡Pedido realizado con éxito!');
    setPagoLoading(false);
    setShowPago(false);
    setComidas([]);
    setTotalBack(0);
  };

  const handleVerificarSaldoYCrear = async () => {
    setPagoLoading(true);
    setPagoError('');
    const token = localStorage.getItem('token');
    // Verifica saldo
    const resSaldo = await fetch('http://localhost:3000/usuarios/me/saldo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resSaldo.ok) {
      setPagoError('No se pudo verificar el saldo');
      setPagoLoading(false);
      return;
    }
    const dataSaldo = await resSaldo.json();
    if (dataSaldo.saldo < (totalBack + (propina && cantidadPropina ? Number(cantidadPropina) : 0))) {
      setPagoError('Saldo insuficiente');
      setPagoLoading(false);
      return;
    }
    // Si tiene saldo suficiente, crea el pedido
    await handleCrearPedido();
  };

  if (loading) return <div className="carrito-loading">Cargando carrito...</div>;

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
      {comidas.length === 0 ? (
        <div className="carrito-empty">No hay productos en el carrito.</div>
      ) : (
        <div className="carrito-list">
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
                onClick={() => handleEliminar(comida._id)}
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
        </div>
      )}
    </div>

    {/* Barra inferior con total y botón pagar */}
    {comidas.length > 0 && (
      <div className="carrito-footer">
        <button className="carrito-pagar" onClick={handleAbrirPago}>Pagar</button>
        <div className="carrito-total-footer">
          <span>Total:</span>
          <span className="carrito-total-num">${totalBack.toLocaleString()}</span>
        </div>
      </div>
    )}

    {/* Modal de pago */}
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

          {/* Si es delivery, pide dirección y número */}
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

          {/* Solo si es delivery, muestra la opción de propina */}
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

          <div style={{ margin: '1rem 0' }}>
            <strong>Total a pagar: </strong>
            ${(
              metodoPago === 'tarjeta' && esDelivery && propina && cantidadPropina
                ? totalBack + Number(cantidadPropina)
                : totalBack
            ).toLocaleString()}
          </div>
          {pagoError && <div className="pago-error">{pagoError}</div>}
          {pagoOk && <div className="pago-ok">{pagoOk}</div>}
          <div className="pago-modal-btns">
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