import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidosDashboards.css';

interface Pedido {
  _id: string;
  nombrePedido: string;
  estado: boolean;
  fechaPedido: string;
  direccionEntrega?: string;
  precioPedido: number;
  pago: string;
  propina?: boolean;
  cantidadPropina?: number;
  dealer?: boolean;
  repartidor?: string | null;
  comidas?: { nombre: string; cantidad: number }[];
  estadoRechazado?: boolean;
}

const PedidosDashboards: React.FC = () => {
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
      // Obtener el id del locatario logeado
      const resUser = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resUser.ok) {
        navigate('/', { replace: true });
        return;
      }
      const userData = await resUser.json();
      const idLocal = userData.userId || userData._id;

      // Obtener pedidos relacionados a este local
      const resPedidos = await fetch(`http://localhost:3002/pedidos/local/${idLocal}`, {
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

  const handleActualizarEstado = async (pedidoId: string, nuevoEstado: boolean) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:3002/pedidos/${pedidoId}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  setPedidos(pedidos =>
    pedidos.map(p =>
      p._id === pedidoId ? { ...p, estado: nuevoEstado } : p
    )
  );
};

const handleRechazarPedido = async (pedidoId: string) => {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:3002/pedidos/${pedidoId}/rechazar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  setPedidos(pedidos =>
    pedidos.map(p =>
      p._id === pedidoId ? { ...p, estadoRechazado: true } : p
    )
  );
};

  return (
    <div className="pedidos-dashboard-root">
      <div className="pedidos-dashboard-header">
        <button className="pedidos-dashboard-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-dashboard-title">Pedidos de mi Local</span>
        <div style={{ width: 32 }}></div>
      </div>
      {loading ? (
        <div className="pedidos-dashboard-loading">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="pedidos-dashboard-empty">No hay pedidos para tu local.</div>
      ) : (
        <div className="pedidos-dashboard-list">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido._id}>
              <div className="pedido-header">
                <span className="pedido-nombre">{pedido.nombrePedido}</span>
                <span className={`pedido-estado pedido-estado-${pedido.estado ? 'listo' : 'preparando'}`}>
                  {pedido.estado ? 'Listo' : 'Preparando'}
                </span>
              </div>
              <div className="pedido-info">
                <span>
                    <b>Fecha:</b> {pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString() : 'Sin fecha'}
                </span>
                <span>
                    <b>Total:</b> {typeof pedido.precioPedido === 'number'
                    ? `$${pedido.precioPedido.toLocaleString()}`
                    : 'Sin total'}
                </span>
                <span>
                    <b>Método:</b> {pedido.pago}
                </span>
                {/* Aquí va la lista de comidas y cantidades */}
                {pedido.comidas && pedido.comidas.map((c, idx) => (
                    <div key={idx}>
                    <b>{c.nombre}</b> x{c.cantidad}
                    </div>
                ))}
                {pedido.direccionEntrega && (
                    <span>
                    <b>Dirección entrega:</b> {pedido.direccionEntrega}
                    </span>
                )}
                {pedido.propina && pedido.cantidadPropina ? (
                    <span>
                    <b>Propina:</b> ${pedido.cantidadPropina}
                    </span>
                ) : null}
                <span>
                    <b>Repartidor:</b> {pedido.dealer ? 'En camino' : 'Sin asignar'}
                </span>
                {pedido.repartidor && (
                    <span>
                    ID Repartidor: {pedido.repartidor}
                    </span>
                )}
                <div className="pedido-acciones">
                    {pedido.estadoRechazado ? (
                    <span className="pedido-rechazado">Pedido rechazado</span>
                    ) : pedido.estado ? (
                    <span className="pedido-preparando">Preparando</span>
                    ) : (
                    <>
                        <span className="pedido-en-espera">En espera</span>
                        <button
                        className="btn-aceptar"
                        onClick={() => handleActualizarEstado(pedido._id, true)}
                        >
                        Aceptar
                        </button>
                        <button
                        className="btn-rechazar"
                        onClick={() => handleRechazarPedido(pedido._id)}
                        >
                        Rechazar
                        </button>
                    </>
                    )}
                </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosDashboards;