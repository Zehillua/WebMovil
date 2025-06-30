import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './AdminDashboard.css';

interface EstadisticasGenerales {
  totalPedidos: number;
  totalVentas: number;
  totalPropinas: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin, loading } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // ✅ SOLO VERIFICAR DESPUÉS DE QUE TERMINE DE CARGAR
  useEffect(() => {
    if (!loading) {
      console.log('AdminDashboard - Datos cargados:', { user, isAdmin, loading });
      
      if (!isAdmin) {
        console.log('❌ Usuario no es admin después de cargar, redirigiendo...');
        navigate('/comprador', { replace: true });
      } else {
        console.log('✅ Usuario confirmado como admin');
      }
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    // Solo cargar estadísticas si es admin
    if (isAdmin && !loading) {
      cargarEstadisticasGenerales();
    }
  }, [isAdmin, loading]);

  const cargarEstadisticasGenerales = async () => {
    try {
      const response = await fetch('http://localhost:3004/stats/generales');
      if (response.ok) {
        const data = await response.json();
        setEstadisticas({
          totalPedidos: data.resumenGeneral.totalPedidos,
          totalVentas: data.resumenGeneral.totalVentas,
          totalPropinas: data.resumenGeneral.totalPropinas,
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(valor);
  };

  // ✅ MOSTRAR LOADING MIENTRAS SE VERIFICA LA AUTENTICACIÓN
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        🔒 Verificando permisos de administrador...
      </div>
    );
  }

  // ✅ SI NO ES ADMIN, NO MOSTRAR NADA (EL useEffect SE ENCARGA DE REDIRIGIR)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <nav className="navbar-admin">
        <div className="logo-centered">
          🏛️ Panel Administrador
          {user && (
            <small style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>
              Bienvenido, {user.nombre} {user.apellido}
            </small>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      {/* ✅ ESTADÍSTICAS SIMPLIFICADAS - SOLO 3 CARDS */}
      {loadingStats ? (
        <div className="loading-admin">Cargando estadísticas...</div>
      ) : (
        <div className="resumen-cards">
          <div className="card-resumen pedidos">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <h2>{estadisticas?.totalPedidos || 0}</h2>
              <p>Total Pedidos</p>
            </div>
          </div>
          
          <div className="card-resumen ventas">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h2>{estadisticas ? formatearMoneda(estadisticas.totalVentas) : '$0'}</h2>
              <p>Total Ventas</p>
            </div>
          </div>
          
          <div className="card-resumen propinas">
            <div className="card-icon">🎁</div>
            <div className="card-content">
              <h2>{estadisticas ? formatearMoneda(estadisticas.totalPropinas) : '$0'}</h2>
              <p>Total Propinas</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MENÚ PRINCIPAL - SOLO 2 BOTONES */}
      <div className="admin-main-menu">
        <h2>📊 Rankings</h2>
        <div className="menu-buttons-two">
          <button 
            className="menu-btn ventas"
            onClick={() => navigate('/admin/top-ventas')}
          >
            <div className="btn-icon">🏆</div>
            <div className="btn-content">
              <h3>Top Ventas</h3>
            </div>
          </button>

          <button 
            className="menu-btn repartidores"
            onClick={() => navigate('/admin/top-repartidores')}
          >
            <div className="btn-icon">⭐</div>
            <div className="btn-content">
              <h3>Top Repartidores</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;