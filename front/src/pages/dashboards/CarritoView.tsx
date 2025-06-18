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
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarrito = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resUser.ok) throw new Error('No se pudo obtener el usuario');
        const userData = await resUser.json();
        const idComprador = userData.userId || userData._id;

        const resCarrito = await fetch(`http://localhost:3002/carrito/${idComprador}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resCarrito.ok) throw new Error('Error al obtener el carrito');

        const data = await resCarrito.json();
        setComidas(data?.items || []);
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Error al obtener el carrito");
      }
      setLoading(false);
    };

    fetchCarrito();
  }, [navigate]);

  const abrirModalEliminar = (itemId: string) => {
    setItemToDelete(itemId);
    setModalVisible(true);
  };

  const cancelarEliminar = () => {
    setModalVisible(false);
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
        setModalVisible(false);
        setItemToDelete(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto");
    }
  };

  const total = comidas.reduce((acc, comida) => acc + comida.precio * comida.cantidad, 0);
  const envioCosto = 0;
  const ivaPorcentaje = 0.19;
  const ivaMonto = total * ivaPorcentaje;
  const totalEstimado = total + envioCosto + ivaMonto;

  if (loading) return <div className="carrito-loading">Cargando carrito...</div>;

  return (
    <div className="carrito-root">
      <div className="carrito-header">
        <button className="carrito-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="header-title">VeciMarket - Mi Carrito</span>
        <div></div>
      </div>

      <div className="carrito-main-container">
        <div className="carrito-product-list-column">
          <h2 className="carrito-list-title">Mi Carrito ({comidas.length} productos)</h2>
          {comidas.length === 0 ? (
            <div className="carrito-empty">No hay productos en el carrito. ¡Añade algunos!</div>
          ) : (
            <div className="carrito-list">
              {comidas.map((comida) => (
                <div className="carrito-item" key={comida._id}>
                  <div className="carrito-img">
                    <img src={comida.imagenUrl || 'https://via.placeholder.com/90x90?text=Producto'} alt={comida.nombreComida} />
                  </div>
                  <div className="carrito-info">
                    <div className="carrito-nombre">{comida.nombreComida}</div>
                    <div className="carrito-local">Vendido por: {comida.nombreLocal}</div>
                    <div className="carrito-cantidad">Cantidad: {comida.cantidad}</div>
                    <div className="carrito-precio-unit">Precio unitario: ${comida.precio.toLocaleString('es-CL')}</div>
                    <div className="carrito-item-actions">
                      <button onClick={() => abrirModalEliminar(comida._id)} className="carrito-eliminar">Eliminar</button>
                    </div>
                  </div>
                  <div className="carrito-total-item-price">
                    ${(comida.precio * comida.cantidad).toLocaleString('es-CL')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="carrito-summary-column">
          <h2 className="carrito-summary-title">Resumen del Pedido</h2>
          <div className="carrito-summary-row">
            <span>Subtotal</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>
          <div className="carrito-summary-row">
            <span>Envío</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>GRATIS</span>
          </div>
          <div className="carrito-summary-row">
            <span>IVA (19%)</span>
            <span>${ivaMonto.toLocaleString('es-CL')}</span>
          </div>
          <div className="carrito-summary-row total">
            <span>Total Estimado</span>
            <span>${totalEstimado.toLocaleString('es-CL')}</span>
          </div>

          <div className="carrito-payment-buttons">
            <button className="carrito-pagar">Pagar</button>
          </div>

          <p className="carrito-security-text">Paga con rapidez y seguridad.</p>
        </div>
      </div>

      {/* Modal Overlay de Confirmación */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Estás seguro de eliminar este producto?</h2>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={confirmarEliminar}>Eliminar</button>
              <button className="modal-cancel" onClick={cancelarEliminar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoView;
