import React, { useState } from 'react';
import './RepartidorDashboard.css';

interface Pedido {
  id: number;
  local: string;
  direccion: string;
  estado: 'Pendiente' | 'En camino' | 'Entregado';
  productos: string[];
}

const RepartidorDashboard: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1,
      local: 'Don Gusto',
      direccion: 'Av. Los Pinos 123',
      estado: 'Pendiente',
      productos: ['Pizza Margarita', 'Pizza Napolitana'],
    },
    {
      id: 2,
      local: 'La Picá de Juan',
      direccion: 'Calle O’Higgins 45',
      estado: 'En camino',
      productos: ['Empanada de pino', 'Empanada de queso'],
    },
    {
      id: 3,
      local: 'Kiosco Anita',
      direccion: 'Pasaje El Sol 789',
      estado: 'Pendiente',
      productos: ['Completo italiano', 'Jugo natural'],
    },
  ]);

  const avanzarEstado = (id: number) => {
    setPedidos(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              estado:
                p.estado === 'Pendiente'
                  ? 'En camino'
                  : p.estado === 'En camino'
                  ? 'Entregado'
                  : p.estado,
            }
          : p
      )
    );
  };

  return (
    <div className="repartidor-dashboard">
      <h1>Panel Repartidor</h1>

      {pedidos.map(pedido => (
        <div key={pedido.id} className="card-pedido">
          <h3>Local: {pedido.local}</h3>
          <p><strong>Dirección:</strong> {pedido.direccion}</p>
          <p><strong>Estado:</strong> <span className={`estado ${pedido.estado.replace(' ', '-').toLowerCase()}`}>{pedido.estado}</span></p>
          <p><strong>Productos:</strong></p>
          <ul>
            {pedido.productos.map((prod, index) => (
              <li key={index}>{prod}</li>
            ))}
          </ul>

          {pedido.estado !== 'Entregado' && (
            <button onClick={() => avanzarEstado(pedido.id)}>
              {pedido.estado === 'Pendiente' ? 'Aceptar Pedido' : 'Marcar como Entregado'}
            </button>
          )}
        </div>
      ))}

      {pedidos.length === 0 && <p>No hay pedidos disponibles.</p>}
    </div>
  );
};

export default RepartidorDashboard;
