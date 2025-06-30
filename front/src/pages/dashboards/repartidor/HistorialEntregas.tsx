import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// No se usan useQuery ni useMutation directamente en este componente,
// pero se mantiene la estructura para referencia futura si se integran GraphQL aquí.
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_HISTORIAL_ENTREGAS_REPARTIDOR, GET_ESTADISTICAS_REPARTIDOR } from '../../../apollo/queries';
import './HistorialEntregas.css';

// Interfaz para los datos de cada entrega individual
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

// Interfaz para los datos de estadísticas generales
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

  // Efecto para obtener el ID del repartidor al cargar el componente
  useEffect(() => {
    const obtenerIdRepartidor = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/', { replace: true }); // Redirigir si no hay token
          return;
        }

        // Obtener datos del usuario actual desde el backend
        const response = await fetch('http://localhost:3000/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Error obteniendo datos del usuario');
        }

        const userData = await response.json();
        const id = userData.userId || userData._id; // Usar userId o _id
        
        console.log('🔍 ID del repartidor obtenido:', id);
        setRepartidorId(id); // Establecer el ID del repartidor
      } catch (error) {
        console.error('Error obteniendo ID del repartidor:', error);
        setError('Error de autenticación. Por favor, inicie sesión nuevamente.');
        setLoading(false);
      }
    };

    obtenerIdRepartidor();
  }, [navigate]); // Dependencia: `navigate` para evitar advertencias

  // Efecto para cargar los datos una vez que el ID del repartidor esté disponible
  useEffect(() => {
    if (repartidorId) {
      cargarDatos(); // Cargar datos si repartidorId existe
    }
  }, [repartidorId]); // Dependencia: `repartidorId`

  // Función principal para cargar el historial y las estadísticas
  const cargarDatos = async () => {
    if (!repartidorId) return; // Salir si el ID no está disponible

    try {
      setLoading(true);
      setError(null); // Limpiar errores previos
      console.log(`📦 Cargando datos para repartidor: ${repartidorId}`);
      
      // Cargar entregas y estadísticas en paralelo usando fetch (como en el original)
      const [entregasResponse, estadisticasResponse] = await Promise.all([
        fetch(`http://localhost:3003/repartidores/entregas/${repartidorId}`),
        fetch(`http://localhost:3003/repartidores/estadisticas/${repartidorId}`)
      ]);

      console.log(`📊 Status entregas: ${entregasResponse.status}`);
      console.log(`📊 Status estadísticas: ${estadisticasResponse.status}`);

      if (!entregasResponse.ok) {
        const errorText = await entregasResponse.text();
        console.error('Error en entregas:', errorText);
        throw new Error(`Error cargando entregas: ${entregasResponse.statusText}`);
      }

      if (!estadisticasResponse.ok) {
        const errorText = await estadisticasResponse.text();
        console.error('Error en estadísticas:', errorText);
        throw new Error(`Error cargando estadísticas: ${estadisticasResponse.statusText}`);
      }

      const entregasData = await entregasResponse.json();
      const estadisticasData = await estadisticasResponse.json();

      console.log('📦 Entregas recibidas:', entregasData);
      console.log('📊 Estadísticas recibidas:', estadisticasData);

      // Obtener valoración promedio via GraphQL (como en el original)
      const valoracionPromedio = await obtenerValoracionPromedio();

      setEntregas(entregasData);
      setEstadisticas({
        ...estadisticasData,
        valoracionPromedio // Combinar con la valoración promedio de GraphQL
      });

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(`Error al cargar el historial de entregas: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la valoración promedio del repartidor via GraphQL
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
      // Devolver el promedio o 0 si no hay datos o es nulo
      return data.data?.promedioValoracionRepartidor || 0;
    } catch (error) {
      console.error('Error obteniendo valoración promedio:', error);
      return 0; // Devolver 0 en caso de error
    }
  };

  // Función auxiliar para renderizar estrellas de valoración
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; // Verificar si hay media estrella

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star-filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star-half-filled">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating); // Calcular estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">★</span>);
    }

    return stars;
  };

  // Función auxiliar para formatear fechas
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función auxiliar para formatear valores de moneda
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="historial-entregas-root">
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <p>Cargando historial de entregas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historial-entregas-root">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Error al cargar el historial.</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/repartidor')} className="btn-volver-dashboard">
            Volver al Dashboard
          </button>
        </div>
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
                          Valorada el {formatearFecha(entrega.fechaValoracion)}
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
