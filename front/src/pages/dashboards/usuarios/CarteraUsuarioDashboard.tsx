import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarteraUsuarioDashboard.css'; // Asegúrate de que este archivo CSS existe

const CarteraUsuarioDashboard: React.FC = () => {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // Obtener saldo actual al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/usuarios/me/saldo', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSaldo(data.saldo))
      .catch(() => setSaldo(0)); // En caso de error, muestra 0
  }, []);

  const handleRecargar = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      setMensaje('Ingresa un monto válido');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/usuarios/me/recargar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ monto: montoNum })
      });
      if (res.ok) {
        setMensaje('¡Recarga exitosa!');
        setMonto('');
        // Actualiza el saldo
        const data = await res.json();
        setSaldo(data.saldo);
        setTimeout(() => setMensaje(''), 2000); // Limpia el mensaje después de 2 segundos
      } else {
        setMensaje('Error al recargar');
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div className="cartera-dashboard"> {/* Usa la clase principal del dashboard */}
      <nav className="navbar-dashboard"> {/* Usa la clase de la navbar general */}
        <button
          className="icon-btn" // Clase de botón de ícono
          onClick={() => navigate(-1)}
          title="Volver"
        >
          <img
            src="https://img.icons8.com/ios-filled/28/ffffff/left.png" // Cambiado a blanco para que se vea bien en navbar-dashboard
            alt="Volver"
          />
        </button>
        <span className="logo">VeciMarket</span> {/* Clase del logo */}
      </nav>
      <div className="dashboard-body"> {/* Contenedor principal del contenido */}
        <div className="cartera-card"> {/* Mantendremos 'cartera-card' para la tarjeta central */}
          <h2>Mi Cartera</h2>
          <div className="saldo-box"> {/* Quitamos modern-blue para usar el estilo general */}
            <img
              src="https://img.icons8.com/ios-filled/48/8D5C3D/wallet-app.png" // Color del ícono ajustado para el nuevo fondo
              alt="Cartera"
              className="cartera-icon"
            />
            <div>
              <span className="saldo-label">Saldo actual</span>
              <span className="saldo-monto">
                {saldo !== null ? `$${saldo.toLocaleString('es-CL')}` : 'Cargando...'} {/* Formato chileno */}
              </span>
            </div>
          </div>
          <form className="recarga-form" onSubmit={handleRecargar}>
            <label htmlFor="monto" className="recarga-label">
              Monto a recargar
            </label>
            <input
              id="monto"
              type="number"
              min={1}
              placeholder="Ej: 5000"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              className="search-input" // Usamos el estilo del input de búsqueda
            />
            <button type="submit" className="add-to-cart-button"> {/* Usamos el estilo del botón de añadir al carrito */}
              Recargar saldo
            </button>
          </form>
          {mensaje && <div className="recarga-mensaje">{mensaje}</div>}
        </div>
      </div>
    </div>
  );
};

export default CarteraUsuarioDashboard;