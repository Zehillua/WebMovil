import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HistorialEntregas.css';

interface Entrega {
  _id: string;
  pedidoId: string;
  nombrePedido: string;
  valorEntrega: number;
  propina: number;
  fechaEntrega: string;
  valoracionRecibida: number;
  valoracionRegistrada: boolean;
  fechaValoracion?: string;
  cliente: {
    id: string;
    nombre: string;
    direccion: string;
  };
  local: {
    id: string;
    nombreLocal: string;
    direccion: string;
  };
  distancia: string;
  tiempoEntrega: string;
}

interface Estadisticas {
  totalEntregas: number;
  totalGanancias: number;
  totalPropinas: number;
  promedioGananciaPorEntrega: number;
  valoracionPromedio: number;
}

const HistorialEntregas: React.FC = () => {
  const navigate = useNavigate();
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repartidorId, setRepartidorId] = useState<string | null>(null);

  useEffect(() => {
    const obtenerIdRepartidor = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/', { replace: true });
          return;
        }

        // Obtener datos del usuario actual
        const response = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Error obteniendo datos del usuario');
        }

        const userData = await response.json();
        const id = userData.userId || userData._id;
        
        console.log('🔍 ID del repartidor obtenido:', id);
        setRepartidorId(id);

      } catch (error) {
        console.error('Error obteniendo ID del repartidor:', error);
        setError('Error de autenticación');
        setLoading(false);
      }
    };

    obtenerIdRepartidor();
  }, [navigate]);

  useEffect(() => {
    if (repartidorId) {
      cargarDatos();
    }
  }, [repartidorId]);

  const cargarDatos = async () => {
    if (!repartidorId) return;

    try {
      setLoading(true);
      console.log(`📦 Cargando datos para repartidor: ${repartidorId}`);
      
      // Cargar entregas y estadísticas en paralelo
      const [entregasResponse, estadisticasResponse] = await Promise.all([
        fetch(`http://localhost:3003/repartidores/entregas/${repartidorId}`),
        fetch(`http://localhost:3003/repartidores/estadisticas/${repartidorId}`)
      ]);

      console.log(`📊 Status entregas: ${entregasResponse.status}`);
      console.log(`📊 Status estadísticas: ${estadisticasResponse.status}`);

      if (!entregasResponse.ok) {
        const errorText = await entregasResponse.text();
        console.error('Error en entregas:', errorText);
        throw new Error(`Error cargando entregas: ${entregasResponse.status}`);
      }

      if (!estadisticasResponse.ok) {
        const errorText = await estadisticasResponse.text();
        console.error('Error en estadísticas:', errorText);
        throw new Error(`Error cargando estadísticas: ${estadisticasResponse.status}`);
      }

      const entregasData = await entregasResponse.json();
      const estadisticasData = await estadisticasResponse.json();

      console.log('📦 Entregas recibidas:', entregasData);
      console.log('📊 Estadísticas recibidas:', estadisticasData);

      // Obtener valoración promedio via GraphQL
      const valoracionPromedio = await obtenerValoracionPromedio();

      setEntregas(entregasData);
      setEstadisticas({
        ...estadisticasData,
        valoracionPromedio
      });

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(`Error al cargar el historial de entregas: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const obtenerValoracionPromedio = async (): Promise<number> => {
    if (!repartidorId) return 0;

    try {
      const query = `
        query PromedioValoracionRepartidor($repartidorId: String!) {
          promedioValoracionRepartidor(repartidorId: $repartidorId)
        }
      `;

      const response = await fetch('http://localhost:3003/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { repartidorId }
        })
      });

      const data = await response.json();
      return data.data?.promedioValoracionRepartidor || 0;
    } catch (error) {
      console.error('Error obteniendo valoración promedio:', error);
      return 0;
    }
  };

  // ...resto del código permanece igual
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star-filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star-half-filled">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">★</span>);
    }

    return stars;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="historial-entregas-root">
        <div className="loading">Cargando historial de entregas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-entregas-root">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/repartidor')} className="btn-volver">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="historial-entregas-root">
      {/* HEADER */}
      <div className="historial-header">
        <button 
          onClick={() => navigate('/repartidor')} 
          className="btn-volver"
        >
          ← Volver
        </button>
        <h1 className="historial-title">Mi Historial de Entregas</h1>
      </div>

      {/* DEBUG INFO - Remover en producción */}
      <div style={{ background: '#f0f0f0', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
        <p><strong>🔍 Debug Info:</strong></p>
        <p>Repartidor ID: {repartidorId}</p>
        <p>Total entregas: {entregas.length}</p>
        <p>Estadísticas: {estadisticas ? 'Cargadas' : 'No cargadas'}</p>
      </div>

      {/* ESTADÍSTICAS PRINCIPALES */}
      {estadisticas && (
        <div className="estadisticas-container">
          <div className="estadisticas-grid">
            <div className="stat-card entregas">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{estadisticas.totalEntregas}</h3>
                <p>Entregas Realizadas</p>
              </div>
            </div>

            <div className="stat-card valoracion">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{estadisticas.valoracionPromedio.toFixed(1)}/5</h3>
                <p>Valoración Promedio</p>
                <div className="stars-display">
                  {renderStars(estadisticas.valoracionPromedio)}
                </div>
              </div>
            </div>

            <div className="stat-card ganancias">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>{formatearMoneda(estadisticas.totalGanancias)}</h3>
                <p>Ganancias Totales</p>
              </div>
            </div>

            <div className="stat-card propinas">
              <div className="stat-icon">🎁</div>
              <div className="stat-content">
                <h3>{formatearMoneda(estadisticas.totalPropinas)}</h3>
                <p>Propinas Recibidas</p>
              </div>
            </div>
          </div>

          <div className="estadisticas-adicionales">
            <div className="stat-adicional">
              <span className="label">Promedio por entrega:</span>
              <span className="value">{formatearMoneda(estadisticas.promedioGananciaPorEntrega)}</span>
            </div>
            <div className="stat-adicional">
              <span className="label">Entregas con valoración:</span>
              <span className="value">
                {entregas.filter(e => e.valoracionRegistrada).length} de {estadisticas.totalEntregas}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE ENTREGAS */}
      <div className="entregas-section">
        <h2 className="section-title">
          Historial Detallado ({entregas.length} entregas)
        </h2>

        {entregas.length === 0 ? (
          <div className="no-entregas">
            <div className="no-entregas-icon">📭</div>
            <h3>No hay entregas registradas</h3>
            <p>Cuando realices tu primera entrega aparecerá aquí</p>
            {repartidorId && (
              <p><small>ID del repartidor: {repartidorId}</small></p>
            )}
          </div>
        ) : (
          <div className="entregas-lista">
            {entregas.map((entrega) => (
              <div key={entrega._id} className="entrega-card">
                <div className="entrega-header">
                  <h3 className="pedido-nombre">{entrega.nombrePedido}</h3>
                  <div className="entrega-fecha">
                    {formatearFecha(entrega.fechaEntrega)}
                  </div>
                </div>

                <div className="entrega-detalles">
                  <div className="detalle-cliente">
                    <strong>👤 Cliente:</strong> {entrega.cliente.nombre}
                    <br />
                    <span className="direccion">📍 {entrega.cliente.direccion}</span>
                  </div>

                  <div className="detalle-local">
                    <strong>🏪 Local:</strong> {entrega.local.nombreLocal}
                    <br />
                    <span className="direccion">📍 {entrega.local.direccion}</span>
                  </div>

                  <div className="detalle-valores">
                    <div className="valor-item">
                      <span className="label">Valor entrega:</span>
                      <span className="value">{formatearMoneda(entrega.valorEntrega)}</span>
                    </div>
                    {entrega.propina > 0 && (
                      <div className="valor-item propina">
                        <span className="label">Propina:</span>
                        <span className="value">+{formatearMoneda(entrega.propina)}</span>
                      </div>
                    )}
                    <div className="valor-item total">
                      <span className="label">Total ganado:</span>
                      <span className="value">{formatearMoneda(entrega.valorEntrega + entrega.propina)}</span>
                    </div>
                  </div>

                  {/* VALORACIÓN RECIBIDA */}
                  {entrega.valoracionRegistrada ? (
                    <div className="valoracion-recibida">
                      <div className="valoracion-header">
                        <strong>⭐ Valoración recibida:</strong>
                        <span className="valoracion-numero">{entrega.valoracionRecibida.toFixed(1)}/5</span>
                      </div>
                      <div className="stars-container">
                        {renderStars(entrega.valoracionRecibida)}
                      </div>
                      {entrega.fechaValoracion && (
                        <div className="fecha-valoracion">
                          Valorado el {formatearFecha(entrega.fechaValoracion)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="sin-valoracion">
                      <span>⏳ Pendiente de valoración</span>
                    </div>
                  )}

                  {/* INFORMACIÓN ADICIONAL */}
                  <div className="info-adicional">
                    <span className="distancia">📏 Distancia: {entrega.distancia}</span>
                    <span className="tiempo">⏱️ Tiempo: {entrega.tiempoEntrega}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialEntregas;