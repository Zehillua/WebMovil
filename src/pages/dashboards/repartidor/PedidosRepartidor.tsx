import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PEDIDOS_DELIVERY_COMPLETO } from '../../../apollo/queries';
import './PedidosRepartidor.css';

interface Usuario {
  nombre: string;
  apellido: string;
  nombreUsuario?: string;
  direccion: string;
  numeroCasaDepto?: string;
}

interface Local {
  nombreLocal: string;
  direccion: string;
}

interface Pedido {
  _id: string;
  nombrePedido: string;
  precioPedido: number;
  direccionEntrega: string;
  propina?: boolean;
  cantidadPropina?: number;
  comidas: { nombre: string; cantidad: number }[];
  usuario: Usuario;
  local: Local;
}

const PedidosRepartidor: React.FC = () => {
  const navigate = useNavigate();

  // GraphQL Query con auto-refresh
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_DELIVERY_COMPLETO, {
    pollInterval: 5000, // Auto-refresh cada 5 segundos
    errorPolicy: 'all'
  });

  const handleAceptarPedido = async (pedidoId: string) => {
    try {
      const token = localStorage.getItem('token');
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await resUser.json();
      const idRepartidor = userData.userId || userData._id;

      await fetch(`http://localhost:3002/pedidos/${pedidoId}/aceptar-repartidor`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idRepartidor }),
      });

      // Refrescar datos automáticamente
      refetch();
    } catch (error) {
      console.error('Error aceptando pedido:', error);
    }
  };

  if (loading) return <div className="pedidos-repartidor-loading">Cargando pedidos...</div>;
  if (error) return <div className="pedidos-repartidor-error">Error: {error.message}</div>;

  const pedidos: Pedido[] = data?.pedidosDeliveryDisponibles || [];

  return (
    <div className="pedidos-repartidor-root">
      <div className="pedidos-repartidor-header">
        <button className="pedidos-repartidor-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-repartidor-title">Pedidos Delivery Disponibles</span>
        <div style={{ width: 32 }}></div>
      </div>
      
      {pedidos.length === 0 ? (
        <div className="pedidos-repartidor-empty">No hay pedidos delivery disponibles.</div>
      ) : (
        <div className="pedidos-repartidor-list">
          {pedidos.map((pedido) => (
            <div className="pedido-repartidor-card" key={pedido._id}>
              <div className="pedido-repartidor-header">
                <span className="pedido-repartidor-nombre">{pedido.nombrePedido}</span>
                <span className="pedido-repartidor-local">{pedido.local.nombreLocal}</span>
              </div>
              <div className="pedido-repartidor-info">
                <span>
                  <b>Cliente:</b> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}
                </span>
                <span>
                  <b>Dirección cliente:</b> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}
                </span>
                <span>
                  <b>Retirar en:</b> {pedido.local.nombreLocal} - {pedido.local.direccion}
                </span>
                <span>
                  <b>Entregar en:</b> {pedido.direccionEntrega}
                </span>
                <span>
                  <b>Total:</b> ${pedido.precioPedido.toLocaleString()}
                </span>
                {pedido.propina && pedido.cantidadPropina && (
                  <span>
                    <b>Propina:</b> ${pedido.cantidadPropina.toLocaleString()}
                  </span>
                )}
                <div className="comidas-lista">
                  <b>Comidas a retirar:</b>
                  {pedido.comidas.map((c, idx) => (
                    <div key={idx} className="comida-item">
                      {c.nombre} x{c.cantidad}
                    </div>
                  ))}
                </div>
                <button
                  className="btn-aceptar-pedido"
                  onClick={() => handleAceptarPedido(pedido._id)}
                >
                  Aceptar Pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosRepartidor;