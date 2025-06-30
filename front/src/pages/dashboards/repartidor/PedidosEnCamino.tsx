// PedidosEnCamino.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEDIDOS_EN_CAMINO_REPARTIDOR, ENTREGAR_PEDIDO } from '../../../apollo/queries'; // Asegúrate que la ruta sea correcta
import './PedidosEnCamino.css'; // Asegúrate que la ruta sea correcta

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
      alert('¡Pedido entregado exitosamente!'); // Confirmación de éxito
    },
    onError: (error) => {
      console.error('Error entregando pedido:', error);
      alert(`Error al entregar pedido: ${error.message}`); // Mensaje de error más descriptivo
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
        // IMPORTANTE: Asegúrate de que el puerto del backend sea correcto (3000 o 3001)
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
    
    if (isNaN(codigoIngresado) || codigoIngresado.toString().length !== 4) {
      alert('Por favor ingresa un código de 4 dígitos válido.');
      return;
    }

    try {
      await entregarPedidoMutation({
        variables: { 
          id: pedidoId, 
          codigoPedido: codigoIngresado 
        }
      });
    } catch (error) {
      // El error ya se maneja en onError de useMutation
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

  // Reutilizamos las clases globales para mensajes de estado
  if (loading) return <div className="loading">Cargando pedidos en camino...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const pedidos: Pedido[] = data?.pedidosEnCaminoRepartidor || [];

  return (
    <div className="pedidos-en-camino-root">
      {/* Header adaptado al estilo top-banner */}
      <div className="top-banner">
        <button className="icon-btn" onClick={() => navigate(-1)} title="Volver">
          <img src="https://img.icons8.com/ios-filled/28/ffffff/left.png" alt="Volver" /> {/* Icono de flecha */}
        </button>
        <span className="top-banner-text">Pedidos En Camino</span> {/* Título más conciso */}
        <div style={{ width: 28, height: 28 }}></div> {/* Espaciador para centrar el título */}
      </div>
      
      <main className="pedidos-en-camino-main-content"> {/* Nuevo contenedor para el contenido principal */}
        {pedidos.length === 0 ? (
          <div className="no-pedidos">No tienes pedidos en camino.</div>
        ) : (
          <div className="pedidos-grid"> {/* Reutilizar clase pedidos-grid */}
            {pedidos.map((pedido) => (
              <div className="pedido-card en-camino-card-border" key={pedido._id}> {/* Reutilizar clase pedido-card y añadir modificador de borde */}
                <h3>{pedido.nombrePedido}</h3>
                <span className="codigo-pedido-display">Código: {pedido.codigoPedido}</span> {/* Clase para mostrar el código */}
                
                <div className="pedido-info-sections"> {/* Contenedor para las secciones de info */}
                  <div className="seccion-cliente info-section-card"> {/* Clase general y especifica */}
                    <h4>👤 Cliente</h4>
                    <p><strong>Nombre:</strong> {pedido.usuario.nombreUsuario || `${pedido.usuario.nombre} ${pedido.usuario.apellido}`}</p>
                    <p><strong>Dirección:</strong> {pedido.usuario.direccion} {pedido.usuario.numeroCasaDepto}</p>
                    <p><strong>Entregar en:</strong> {pedido.direccionEntrega}</p>
                  </div>

                  <div className="seccion-local info-section-card"> {/* Clase general y especifica */}
                    <h4>🏪 Local</h4>
                    <p><strong>Retirado de:</strong> {pedido.local.nombreLocal}</p>
                    <p><strong>Dirección:</strong> {pedido.local.direccion}</p>
                  </div>

                  <div className="seccion-pedido info-section-card"> {/* Clase general y especifica */}
                    <h4>📦 Detalles del Pedido</h4>
                    <p><strong>Total:</strong> ${pedido.precioPedido.toLocaleString('es-CL')}</p>
                    {pedido.propina && pedido.cantidadPropina && (
                      <p><strong>Propina:</strong> ${pedido.cantidadPropina.toLocaleString('es-CL')}</p>
                    )}
                    
                    <div className="comidas-lista">
                      <p><strong>Comidas:</strong></p>
                      <ul>
                        {pedido.comidas.map((c, idx) => (
                          <li key={idx}>
                            {c.nombre} x{c.cantidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div> {/* Fin de pedido-info-sections */}

                <div className="seccion-entrega-confirmacion info-section-card"> {/* Nueva clase para esta sección */}
                  <h4>🔑 Confirmar Entrega</h4>
                  <p>El cliente debe proporcionarte el código de 4 dígitos para completar la entrega:</p>
                  <div className="codigo-input-group"> {/* Agrupador para el input y botón */}
                    <input
                      type="text"
                      inputMode="numeric" // Sugiere teclado numérico en móviles
                      pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                      placeholder="0000"
                      value={codigoInput[pedido._id] || ''}
                      onChange={(e) => handleCodigoChange(pedido._id, e.target.value)}
                      className="text-input code-input" // Clases reutilizadas y específica
                      maxLength={4}
                    />
                    <button
                      className="card-button primary-button" // Usar card-button y primary-button para el estilo
                      onClick={() => handleEntregarPedido(pedido._id)}
                      disabled={!codigoInput[pedido._id] || codigoInput[pedido._id].length !== 4}
                    >
                      ✅ Entregar Pedido
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PedidosEnCamino;