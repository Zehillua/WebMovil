import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  GET_PEDIDOS_REALIZADOS_USUARIO, 
  GET_PEDIDOS_PENDIENTES_VALORACION 
} from '../../../apollo/queries';
import ValoracionModal from '../../../components/ValoracionModal';
import './HistorialPedidos.css';

interface PedidoRealizado {
  _id: string;
  pedidoOriginalId: string;
  nombrePedido: string;
  precioPedido: number;
  pago: string;
  fechaPedido: string;
  fechaEntrega: string;
  esDelivery: boolean;
  direccionEntrega?: string;
  comidas: { nombre: string; cantidad: number }[];
  propina: boolean;
  cantidadPropina: number;
  codigoPedido: number;
  valoracionPedido: number;
  valoracionDelivery: number;
  valoracionLocal: number;
  valoracionCompletada: boolean;
  datosUsuario: {
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    direccion: string;
  };
  datosLocal: {
    nombreLocal: string;
    direccion: string;
  };
  datosRepartidor: {
    nombreUsuario: string;
    vehiculo: string;
    patente: string;
    valoracion: number;
  };
}

const HistorialPedidos: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [modalPedido, setModalPedido] = useState<PedidoRealizado | null>(null);
  const navigate = useNavigate();

  // Query para pedidos realizados
  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS_REALIZADOS_USUARIO, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all'
  });

  // Query para pedidos pendientes de valoración
  const { data: dataPendientes, refetch: refetchPendientes } = useQuery(GET_PEDIDOS_PENDIENTES_VALORACION, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all'
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

  const handleValoracionSuccess = () => {
    refetch();
    refetchPendientes();
  };

  if (loading) return <div className="historial-loading">Cargando historial...</div>;
  if (error) return <div className="historial-error">Error: {error.message}</div>;

  const pedidosRealizados: PedidoRealizado[] = data?.pedidosRealizadosPorUsuario || [];
  const pedidosPendientes: PedidoRealizado[] = dataPendientes?.pedidosPendientesValoracion || [];

  // ✅ FUNCIÓN PARA RENDERIZAR ESTRELLAS DE VALORACIÓN:
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<span key={i} className="star-display star-filled">★</span>);
      } else if (rating >= i - 0.5) {
        stars.push(<span key={i} className="star-display star-half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star-display star-empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className="historial-pedidos-root">
      <div className="historial-pedidos-header">
        <button className="historial-volver" onClick={() => navigate(-1)} title="Volver">⬅️</button>
        <span className="historial-title">📋 Historial de Pedidos</span>
        <div style={{ width: 32 }}></div>
      </div>

      {/* ✅ SECCIÓN DE PEDIDOS PENDIENTES DE VALORACIÓN: */}
      {pedidosPendientes.length > 0 && (
        <div className="historial-section">
          <h3 className="historial-section-title">⭐ Pendientes de valoración</h3>
          <div className="historial-list">
            {pedidosPendientes.map((pedido: PedidoRealizado) => (
              <div className="historial-card historial-card-pendiente" key={pedido._id}>
                <div className="historial-header">
                  <span className="historial-nombre">{pedido.nombrePedido}</span>
                  <button 
                    className="valoracion-btn"
                    onClick={() => setModalPedido(pedido)}
                  >
                    ⭐ Valorar
                  </button>
                </div>
                
                <div className="historial-info">
                  <span><b>Local:</b> {pedido.datosLocal.nombreLocal}</span>
                  <span><b>Entregado:</b> {new Date(pedido.fechaEntrega).toLocaleString()}</span>
                  <span><b>Total:</b> ${pedido.precioPedido.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ SECCIÓN DE PEDIDOS CON VALORACIÓN COMPLETADA: */}
      <div className="historial-section">
        <h3 className="historial-section-title">✅ Pedidos completados</h3>
        {pedidosRealizados.length === 0 ? (
          <div className="historial-empty">No tienes pedidos completados aún.</div>
        ) : (
          <div className="historial-list">
            {pedidosRealizados.map((pedido: PedidoRealizado) => (
              <div className="historial-card" key={pedido._id}>
                <div className="historial-header">
                  <span className="historial-nombre">{pedido.nombrePedido}</span>
                  <span className="historial-estado">✅ Entregado</span>
                </div>
                
                <div className="historial-info">
                  <span><b>Local:</b> {pedido.datosLocal.nombreLocal}</span>
                  <span><b>Fecha pedido:</b> {new Date(pedido.fechaPedido).toLocaleString()}</span>
                  <span><b>Fecha entrega:</b> {new Date(pedido.fechaEntrega).toLocaleString()}</span>
                  <span><b>Total:</b> ${pedido.precioPedido.toLocaleString()}</span>
                  <span><b>Método pago:</b> {pedido.pago}</span>
                  
                  {pedido.esDelivery && pedido.direccionEntrega && (
                    <span><b>Entregado en:</b> {pedido.direccionEntrega}</span>
                  )}
                  
                  <div className="comidas-lista">
                    <b>Comidas:</b>
                    {pedido.comidas.map((comida, idx) => (
                      <div key={idx} className="comida-item">
                        {comida.nombre} x{comida.cantidad}
                      </div>
                    ))}
                  </div>
                  
                  {pedido.propina && pedido.cantidadPropina > 0 && (
                    <span><b>Propina:</b> ${pedido.cantidadPropina.toLocaleString()}</span>
                  )}
                  
                  <div className="repartidor-info">
                    <h6><b>🚗 Información del Repartidor:</b></h6>
                    <div className="repartidor-detalles">
                      <span><b>Nombre:</b> {pedido.datosRepartidor.nombreUsuario}</span>
                      <span><b>🚗 Vehículo:</b> {pedido.datosRepartidor.vehiculo}</span>
                      <span><b>🏷️ Patente:</b> {pedido.datosRepartidor.patente}</span>
                      <div className="repartidor-valoracion">
                        <b>⭐ Valoración del repartidor:</b>
                        <div className="stars-container">
                          {renderStars(pedido.datosRepartidor.valoracion)}
                          <span className="rating-number">({pedido.datosRepartidor.valoracion.toFixed(1)}/5)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <span><b>Código usado:</b> {pedido.codigoPedido}</span>

                  {/* ✅ MOSTRAR VALORACIONES SI ESTÁN COMPLETADAS: */}
                  {pedido.valoracionCompletada && (
                    <div className="valoraciones-completadas">
                      <h6>⭐ Tus valoraciones:</h6>
                      <div className="valoracion-item">
                        <span>Pedido:</span>
                        <div className="stars-container">
                          {renderStars(pedido.valoracionPedido)}
                          <span className="rating-number">({pedido.valoracionPedido.toFixed(1)})</span>
                        </div>
                      </div>
                      <div className="valoracion-item">
                        <span>Local:</span>
                        <div className="stars-container">
                          {renderStars(pedido.valoracionLocal)}
                          <span className="rating-number">({pedido.valoracionLocal.toFixed(1)})</span>
                        </div>
                      </div>
                      {pedido.esDelivery && (
                        <div className="valoracion-item">
                          <span>Delivery:</span>
                          <div className="stars-container">
                            {renderStars(pedido.valoracionDelivery)}
                            <span className="rating-number">({pedido.valoracionDelivery.toFixed(1)})</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ MODAL DE VALORACIÓN: */}
      {modalPedido && (
        <ValoracionModal
          pedido={modalPedido}
          isOpen={!!modalPedido}
          onClose={() => setModalPedido(null)}
          onSuccess={handleValoracionSuccess}
        />
      )}
    </div>
  );
};

export default HistorialPedidos;