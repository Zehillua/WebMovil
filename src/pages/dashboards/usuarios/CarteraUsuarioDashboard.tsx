import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarteraUsuarioDashboard.css';

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
      .catch(() => setSaldo(0));
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
        setTimeout(() => setMensaje(''), 2000);
      } else {
        setMensaje('Error al recargar');
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div className="cartera-dashboard">
      <nav className="cartera-navbar">
        <button
          className="cartera-volver-btn"
          onClick={() => navigate(-1)}
          title="Volver"
        >
          <img
            src="https://img.icons8.com/ios-filled/28/d87a9c/left.png"
            alt="Volver"
          />
        </button>
        <span className="cartera-logo">VeciMarket</span>
      </nav>
      <div className="cartera-content">
        <div className="cartera-card">
          <h2>Mi Cartera</h2>
          <div className="saldo-box modern-blue">
            <img
              src="https://img.icons8.com/ios-filled/48/d87a9c/wallet-app.png"
              alt="Cartera"
              className="cartera-icon"
            />
            <div>
              <span className="saldo-label">Saldo actual</span>
              <span className="saldo-monto">
                {saldo !== null ? `$${saldo.toLocaleString()}` : 'Cargando...'}
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
              className="recarga-input"
            />
            <button type="submit" className="recarga-btn modern-green">
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