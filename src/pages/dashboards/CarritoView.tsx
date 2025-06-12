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
    }
  };

  const total = comidas.reduce((acc, comida) => acc + comida.precio * comida.cantidad, 0);

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
                    src={comida.imagenUrl || 'https://img.icons8.com/ios-filled/80/cccccc/meal.png'}
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
            <button className="carrito-pagar">Pagar</button>
            <div className="carrito-total-footer">
            <span>Total:</span>
            <span className="carrito-total-num">${total.toLocaleString()}</span>
            </div>
        </div>
        )}
    </div>
    );
};

export default CarritoView;