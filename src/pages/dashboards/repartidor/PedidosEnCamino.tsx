import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_EN_CAMINO_REPARTIDOR, ENTREGAR_PEDIDO } from '../../../apollo/queries';
import './PedidosEnCamino.css';

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
  enCamino: boolean;
  pedidoEntregado: boolean;
  codigoPedido: number;
  usuario: Usuario;
  local: Local;
}

const PedidosEnCamino: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [codigoInput, setCodigoInput] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // GraphQL Query con auto-refresh
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_EN_CAMINO_REPARTIDOR, {
    variables: { idRepartidor: userId },
    skip: !userId,
    pollInterval: 5000,
    errorPolicy: 'all'
  });

  // GraphQL Mutation para entregar pedido
  const [entregarPedidoMutation] = useMutation(ENTREGAR_PEDIDO, {
    onCompleted: () => {
      refetch();
      setCodigoInput({}); // Limpiar inputs
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }
      
      try {
        const resUser = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!resUser.ok) {
          navigate('/', { replace: true });
          return;
        }
        
        const userData = await resUser.json();
        setUserId(userData.userId || userData._id);
      } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        navigate('/', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEntregarPedido = async (pedidoId: string) => {
    const codigoIngresado = parseInt(codigoInput[pedidoId]);
    
    if (!codigoIngresado || codigoIngresado.toString().length !== 4) {
      alert('Por favor ingresa un código de 4 dígitos válido');
      return;
    }

    try {
      await entregarPedidoMutation({
        variables: { 
          id: pedidoId, 
          codigoPedido: codigoIngresado 
        }
      });
      alert('¡Pedido entregado exitosamente!');
    } catch (error) {
      console.error('Error entregando pedido:', error);
    }
  };

  const handleCodigoChange = (pedidoId: string, valor: string) => {
    // Solo permitir números y máximo 4 dígitos
    const numeroLimpio = valor.replace(/\D/g, '').slice(0, 4);
    setCodigoInput(prev => ({
      ...prev,
      [pedidoId]: numeroLimpio
    }));
  };

  if (loading) return <div className="pedidos-en-camino-loading">Cargando pedidos en camino...</div>;
  if (error) return <div className="pedidos-en-camino-error">Error: {error.message}</div>;

  const pedidos: Pedido[] = data?.pedidosEnCaminoRepartidor || [];

  return (
    <div className="pedidos-en-camino-root">
      <div className="pedidos-en-camino-header">
        <button className="pedidos-en-camino-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="pedidos-en-camino-title">Pedidos En Camino</span>
        <div style={{ width: 32 }}></div>
      </div>
      
      {pedidos.length === 0 ? (
        <div className="pedidos-en-camino-empty">No tienes pedidos en camino.</div>
      ) : (
        <div className="pedidos-en-camino-list">
          {pedidos.map((pedido) => (
            <div className="pedido-en-camino-card" key={pedido._id}>
              <div className="pedido-en-camino-header">
                <span className="pedido-en-camino-nombre">{pedido.nombrePedido}</span>
              </div>
              
              <div className="pedido-en-camino-info">
                <div className="seccion-cliente">
                  <h4>👤 Cliente</h4>
                  <span><b>Nombre:</b> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}</span>
                  <span><b>Dirección:</b> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}</span>
                  <span><b>Entregar en:</b> {pedido.direccionEntrega}</span>
                </div>

                <div className="seccion-local">
                  <h4>🏪 Local</h4>
                  <span><b>Retirado de:</b> {pedido.local.nombreLocal}</span>
                  <span><b>Dirección:</b> {pedido.local.direccion}</span>
                </div>

                <div className="seccion-pedido">
                  <h4>📦 Pedido</h4>
                  <span><b>Total:</b> ${pedido.precioPedido.toLocaleString()}</span>
                  {pedido.propina && pedido.cantidadPropina && (
                    <span><b>Propina:</b> ${pedido.cantidadPropina.toLocaleString()}</span>
                  )}
                  
                  <div className="comidas-lista">
                    <b>Comidas:</b>
                    {pedido.comidas.map((c, idx) => (
                      <div key={idx} className="comida-item">
                        {c.nombre} x{c.cantidad}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="seccion-entrega">
                  <h4>🔑 Confirmar Entrega</h4>
                  <p>El cliente debe proporcionarte el código de 4 dígitos:</p>
                  <div className="codigo-input-container">
                    <input
                      type="text"
                      placeholder="0000"
                      value={codigoInput[pedido._id] || ''}
                      onChange={(e) => handleCodigoChange(pedido._id, e.target.value)}
                      className="codigo-input"
                      maxLength={4}
                    />
                    <button
                      className="btn-entregar"
                      onClick={() => handleEntregarPedido(pedido._id)}
                      disabled={!codigoInput[pedido._id] || codigoInput[pedido._id].length !== 4}
                    >
                      ✅ Entregar Pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosEnCamino;