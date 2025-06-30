import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopVentas.css';

interface LocalVentas {
  nombreLocal: string;
  cantidadPedidos: number;
  totalVentas: number;
  totalPropinas: number;
  totalCompleto: number;
  promedioVentaPorPedido: number;
}

const TopVentas: React.FC = () => {
  const navigate = useNavigate();
  const [locales, setLocales] = useState<LocalVentas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('ventas'); // 'ventas', 'pedidos', 'promedio'

  useEffect(() => {
    cargarTopLocales();
  }, []);

  const cargarTopLocales = async () => {
    try {
      setLoading(true);
      
      // ✅ USAR MICROSERVICIO DE REPORTES
      const response = await fetch('http://localhost:3004/stats/top-locales?limite=20');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const localesData = await response.json();
      console.log('📊 Datos de locales recibidos:', localesData);
      
      // Procesar y enriquecer datos
      const localesConDatos: LocalVentas[] = localesData.map((local: any) => ({
        nombreLocal: local.nombreLocal,
        cantidadPedidos: local.cantidadPedidos,
        totalVentas: local.totalVentas,
        totalPropinas: local.totalPropinas,
        totalCompleto: local.totalVentas + local.totalPropinas,
        promedioVentaPorPedido: local.cantidadPedidos > 0 ? local.totalVentas / local.cantidadPedidos : 0
      }));

      setLocales(localesConDatos);
      
    } catch (err) {
      console.error('Error cargando top locales:', err);
      setError(`Error al cargar los datos de ventas: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };

  const obtenerLocalesOrdenados = () => {
    switch (filtro) {
      case 'pedidos':
        return [...locales].sort((a, b) => b.cantidadPedidos - a.cantidadPedidos);
      case 'promedio':
        return [...locales].sort((a, b) => b.promedioVentaPorPedido - a.promedioVentaPorPedido);
      default:
        return [...locales].sort((a, b) => b.totalCompleto - a.totalCompleto);
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
      <div className="top-ventas-root">
        <div className="loading">Cargando ranking de ventas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="top-ventas-root">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/admin')} className="btn-volver">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="top-ventas-root">
      {/* HEADER */}
      <div className="top-ventas-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="btn-volver"
        >
          ← Volver
        </button>
        <h1 className="page-title">🏆 Top Ventas por Local</h1>
        <div className="refresh-btn" onClick={cargarTopLocales}>
          🔄
        </div>
      </div>

      {/* DEBUG INFO */}
      <div style={{ background: '#f0f0f0', padding: '1rem', margin: '1rem', borderRadius: '8px' }}>
        <p><strong>🔍 Debug Info:</strong></p>
        <p>Total locales cargados: {locales.length}</p>
        <p>Filtro actual: {filtro}</p>
        {locales.length > 0 && (
          <p>Primer local: {locales[0].nombreLocal} - {formatearMoneda(locales[0].totalCompleto)}</p>
        )}
      </div>

      {/* FILTROS */}
      <div className="filtros-container">
        <h3>Ordenar por:</h3>
        <div className="filtros-buttons">
          <button 
            className={filtro === 'ventas' ? 'active' : ''}
            onClick={() => setFiltro('ventas')}
          >
            💰 Total Ventas
          </button>
          <button 
            className={filtro === 'pedidos' ? 'active' : ''}
            onClick={() => setFiltro('pedidos')}
          >
            📦 Cantidad Pedidos
          </button>
          <button 
            className={filtro === 'promedio' ? 'active' : ''}
            onClick={() => setFiltro('promedio')}
          >
            📊 Promedio por Pedido
          </button>
        </div>
      </div>

      {/* RANKING */}
      <div className="ranking-container">
        <div className="ranking-header">
          <h2>
            🏅 Ranking de Locales 
            <span className="total-locales">({locales.length} locales)</span>
          </h2>
        </div>

        {locales.length === 0 ? (
          <div className="no-datos">
            <div className="no-datos-icon">📈</div>
            <h3>No hay datos de ventas disponibles</h3>
            <p>Cuando se realicen pedidos aparecerán aquí</p>
          </div>
        ) : (
          <div className="locales-ranking">
            {obtenerLocalesOrdenados().map((local: LocalVentas, index: number) => {
              const posicion = index + 1;
              const colorPosicion = obtenerColorPosicion(posicion);
              
              return (
                <div key={`${local.nombreLocal}-${index}`} className={`local-card ${colorPosicion}`}>
                  <div className="local-posicion">
                    <span className="posicion-numero">
                      {obtenerIconoPosicion(posicion)}
                    </span>
                  </div>

                  <div className="local-info">
                    <h3 className="local-nombre">{local.nombreLocal}</h3>
                    <div className="local-stats">
                      <div className="stat-item principal">
                        <span className="label">Total Recaudado:</span>
                        <span className="value destacado">
                          {formatearMoneda(local.totalCompleto)}
                        </span>
                      </div>
                      
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="label">Ventas:</span>
                          <span className="value">{formatearMoneda(local.totalVentas)}</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Propinas:</span>
                          <span className="value">{formatearMoneda(local.totalPropinas)}</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Pedidos:</span>
                          <span className="value">{local.cantidadPedidos}</span>
                        </div>
                        <div className="stat-item">
                          <span className="label">Promedio:</span>
                          <span className="value">{formatearMoneda(local.promedioVentaPorPedido)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="local-badge">
                    <div className="badge-content">
                      {filtro === 'ventas' && formatearMoneda(local.totalCompleto)}
                      {filtro === 'pedidos' && `${local.cantidadPedidos} pedidos`}
                      {filtro === 'promedio' && formatearMoneda(local.promedioVentaPorPedido)}
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

export default TopVentas;