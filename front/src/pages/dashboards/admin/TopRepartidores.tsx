import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopRepartidores.css';

// ✅ CORREGIR INTERFACE - AGREGAR CAMPO FALTANTE
interface RepartidorStats {
  repartidorId: string;
  nombreRepartidor: string;
  cantidadEntregas: number;
  totalPropinas: number;
  totalGanancias: number; // ✅ AGREGAR ESTE CAMPO
  valoracionPromedio: number;
  vehiculo?: string;
  patente?: string;
  promedioPropinasPorEntrega: number;
}

const TopRepartidores: React.FC = () => {
  const navigate = useNavigate();
  const [repartidores, setRepartidores] = useState<RepartidorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('entregas');

  useEffect(() => {
    cargarTopRepartidores();
  }, []);

  const cargarTopRepartidores = async () => {
    try {
      setLoading(true);
      
      const query = `
        query TopRepartidoresStats {
          topRepartidoresStats {
            repartidorId
            nombreRepartidor
            cantidadEntregas
            totalPropinas
            totalGanancias
            valoracionPromedio
            vehiculo
            patente
            promedioPropinasPorEntrega
          }
        }
      `;

      const response = await fetch('http://localhost:3003/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Error al cargar datos de repartidores');
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      console.log('📊 Datos recibidos:', data.data.topRepartidoresStats);
      setRepartidores(data.data.topRepartidoresStats || []);
      
    } catch (err) {
      console.error('Error cargando top repartidores:', err);
      setError(`Error al cargar los datos de repartidores: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESTO DEL CÓDIGO PERMANECE IGUAL
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };

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

  const obtenerRepartidoresOrdenados = () => {
    switch (filtro) {
      case 'valoracion':
        return [...repartidores].sort((a, b) => b.valoracionPromedio - a.valoracionPromedio);
      case 'propinas':
        return [...repartidores].sort((a, b) => b.totalPropinas - a.totalPropinas);
      default:
        return [...repartidores].sort((a, b) => b.cantidadEntregas - a.cantidadEntregas);
    }
  };

  const obtenerColorPosicion = (posicion: number) => {
    if (posicion === 1) return 'oro';
    if (posicion === 2) return 'plata';
    if (posicion === 3) return 'bronce';
    return 'normal';
  };

  const obtenerIconoPosicion = (posicion: number) => {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return `#${posicion}`;
  };

  if (loading) {
    return (
      <div className="top-repartidores-root">
        <div className="loading">Cargando ranking de repartidores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-repartidores-root">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/admin')} className="btn-volver">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="top-repartidores-root">
      {/* HEADER */}
      <div className="top-repartidores-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="btn-volver"
        >
          ← Volver
        </button>
        <h1 className="page-title">⭐ Top Repartidores</h1>
        <div className="refresh-btn" onClick={cargarTopRepartidores}>
          🔄
        </div>
      </div>

      {/* DEBUG INFO - Remover en producción */}
      <div style={{ background: '#f0f0f0', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
        <p><strong>🔍 Debug Info:</strong></p>
        <p>Total repartidores cargados: {repartidores.length}</p>
        <p>Filtro actual: {filtro}</p>
        {repartidores.length > 0 && (
          <p>Primer repartidor: {repartidores[0].nombreRepartidor} - {repartidores[0].cantidadEntregas} entregas</p>
        )}
      </div>

      {/* FILTROS */}
      <div className="filtros-container">
        <h3>Ordenar por:</h3>
        <div className="filtros-buttons">
          <button 
            className={filtro === 'entregas' ? 'active' : ''}
            onClick={() => setFiltro('entregas')}
          >
            📦 Entregas Realizadas
          </button>
          <button 
            className={filtro === 'valoracion' ? 'active' : ''}
            onClick={() => setFiltro('valoracion')}
          >
            ⭐ Valoración
          </button>
          <button 
            className={filtro === 'propinas' ? 'active' : ''}
            onClick={() => setFiltro('propinas')}
          >
            💰 Propinas Recibidas
          </button>
        </div>
      </div>

      {/* RANKING */}
      <div className="ranking-container">
        <div className="ranking-header">
          <h2>
            🏅 Ranking de Repartidores 
            <span className="total-repartidores">({repartidores.length} repartidores)</span>
          </h2>
        </div>

        {repartidores.length === 0 ? (
          <div className="no-datos">
            <div className="no-datos-icon">🚗</div>
            <h3>No hay datos de repartidores disponibles</h3>
            <p>Cuando se realicen entregas aparecerán aquí</p>
          </div>
        ) : (
          <div className="repartidores-ranking">
            {obtenerRepartidoresOrdenados().map((repartidor: RepartidorStats, index: number) => {
              const posicion = index + 1;
              const colorPosicion = obtenerColorPosicion(posicion);
              
              return (
                <div key={repartidor.repartidorId} className={`repartidor-card ${colorPosicion}`}>
                  <div className="repartidor-posicion">
                    <span className="posicion-numero">
                      {obtenerIconoPosicion(posicion)}
                    </span>
                  </div>

                  <div className="repartidor-info">
                    <h3 className="repartidor-nombre">{repartidor.nombreRepartidor}</h3>
                    
                    {/* VEHÍCULO */}
                    {repartidor.vehiculo && repartidor.vehiculo !== 'No especificado' && (
                      <div className="vehiculo-info">
                        <span className="vehiculo">🚗 {repartidor.vehiculo}</span>
                        {repartidor.patente && repartidor.patente !== 'No especificada' && (
                          <span className="patente">• {repartidor.patente}</span>
                        )}
                      </div>
                    )}

                    <div className="repartidor-stats">
                      <div className="stat-item principal">
                        <span className="label">Entregas Realizadas:</span>
                        <span className="value destacado">
                          {repartidor.cantidadEntregas}
                        </span>
                      </div>
                      
                      <div className="valoracion-container">
                        <span className="label">Valoración:</span>
                        <div className="valoracion-display">
                          <div className="stars-container">
                            {renderStars(repartidor.valoracionPromedio)}
                          </div>
                          <span className="valoracion-numero">
                            {repartidor.valoracionPromedio.toFixed(1)}/5
                          </span>
                        </div>
                      </div>
                      
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="label">Total Propinas:</span>
                          <span className="value">{formatearMoneda(repartidor.totalPropinas)}</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Total Ganancias:</span>
                          <span className="value">{formatearMoneda(repartidor.totalGanancias)}</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Promedio Propina:</span>
                          <span className="value">{formatearMoneda(repartidor.promedioPropinasPorEntrega)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="repartidor-badge">
                    <div className="badge-content">
                      {filtro === 'entregas' && `${repartidor.cantidadEntregas} entregas`}
                      {filtro === 'valoracion' && (
                        <div className="badge-valoracion">
                          <div className="stars-small">
                            {renderStars(repartidor.valoracionPromedio)}
                          </div>
                          <span>{repartidor.valoracionPromedio.toFixed(1)}</span>
                        </div>
                      )}
                      {filtro === 'propinas' && formatearMoneda(repartidor.totalPropinas)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRepartidores;