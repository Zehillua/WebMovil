// PedidosRepartidor.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidosRepartidor.css'; // Asegúrate de que esta ruta sea correcta

interface Pedido {
  _id: string;
  nombrePedido: string;
  nombreLocal: string;
  direccionLocal: string;
  direccionEntrega: string;
  precioPedido: number;
  propina: boolean;
  cantidadPropina?: number;
  comidas: { nombre: string; cantidad: number }[];
  dealer: boolean;
  enCamino: boolean;
  pedidoEntregado: boolean;
}

const PedidosRepartidor: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      // IMPORTANTE: Asegúrate de que el puerto del backend sea correcto (3002 o 3001)
      const resPedidos = await fetch(`http://localhost:3002/pedidos/delivery/disponibles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resPedidos.ok) {
        const data = await resPedidos.json();
        setPedidos(data);
      }
      setLoading(false);
    };
    fetchPedidos();
  }, [navigate]);

  const handleAceptarPedido = async (pedidoId: string) => {
    const token = localStorage.getItem('token');
    const resUser = await fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await resUser.json();
    const idRepartidor = userData.userId || userData._id;

    const response = await fetch(`http://localhost:3002/pedidos/${pedidoId}/aceptar-repartidor`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ idRepartidor }),
    });

    if (response.ok) {
      // Si el pedido fue aceptado con éxito, lo filtramos de la lista
      setPedidos(pedidos => pedidos.filter(p => p._id !== pedidoId));
    } else {
      // Manejar errores, por ejemplo, mostrar una notificación
      alert('Error al aceptar el pedido. Inténtalo de nuevo.');
      console.error('Error al aceptar el pedido:', response.statusText);
    }
  };

  return (
    <div className="pedidos-repartidor-root">
      {/* Header adaptado al estilo top-banner */}
      <div className="top-banner">
        <button className="icon-btn" onClick={() => navigate(-1)} title="Volver">
          <img src="https://img.icons8.com/ios-filled/28/ffffff/left.png" alt="Volver" /> {/* Icono de flecha */}
        </button>
        <span className="top-banner-text">Pedidos Disponibles</span> {/* Título más conciso */}
        <div style={{ width: 28, height: 28 }}></div> {/* Espaciador para centrar el título */}
      </div>

      <main className="pedidos-repartidor-main-content"> {/* Nuevo contenedor para el contenido principal */}
        {loading ? (
          <div className="loading">Cargando pedidos...</div> // Reutilizar clase loading
        ) : pedidos.length === 0 ? (
          <div className="no-pedidos">No hay pedidos delivery disponibles.</div> // Reutilizar clase no-pedidos
        ) : (
          <div className="pedidos-grid"> {/* Reutilizar clase pedidos-grid para las cards */}
            {pedidos.map((pedido) => (
              <div className="pedido-card" key={pedido._id}> {/* Reutilizar clase pedido-card */}
                <h3>{pedido.nombrePedido}</h3> {/* Usar h3 como en pedido-card */}
                <p><strong>Local:</strong> {pedido.nombreLocal}</p>
                <p><strong>Retirar en:</strong> {pedido.direccionLocal}</p>
                <p><strong>Entregar en:</strong> {pedido.direccionEntrega}</p>
                <p><strong>Total:</strong> ${pedido.precioPedido.toLocaleString('es-CL')}</p> {/* Formato de moneda chilena */}
                {pedido.propina && pedido.cantidadPropina && (
                  <p><strong>Propina:</strong> ${pedido.cantidadPropina.toLocaleString('es-CL')}</p>
                )}
                <div className="comidas-lista">
                  <p><strong>Comidas:</strong></p>
                  <ul> {/* Usar lista para las comidas */}
                    {pedido.comidas.map((c, idx) => (
                      <li key={idx}>
                        {c.nombre} x{c.cantidad}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="card-button" // Usar la clase de botón general
                  onClick={() => handleAceptarPedido(pedido._id)}
                >
                  Aceptar Pedido
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PedidosRepartidor;