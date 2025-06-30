import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/dashboards/admin/AdminDashboard';
import LocatarioDashboard from '../pages/dashboards/locatarios/LocatarioDashboard';
import CompradorDashboard from '../pages/dashboards/usuarios/CompradorDashboard';
import PedidosDashboards from '../pages/dashboards/locatarios/PedidosDashboards';
import RepartidorDashboard from '../pages/dashboards/repartidor/RepartidorDashboard';
import LocalView from '../pages/dashboards/usuarios/LocalView';
import PedidosDashboard from '../pages/dashboards/usuarios/PedidosDashboard';
import PedidosRepartidor from '../pages/dashboards/repartidor/PedidosRepartidor';
import PedidosPendientes from '../pages/dashboards/repartidor/PedidosPendientes';
import CarritoView from '../pages/dashboards/usuarios/CarritoView';
import PedidosEnCamino from '../pages/dashboards/repartidor/PedidosEnCamino';
import CarteraUsuarioDashboard from '../pages/dashboards/usuarios/CarteraUsuarioDashboard';
import HistorialPedidos from '../pages/dashboards/usuarios/HistorialPedidos';
import HistorialEntregas from '../pages/dashboards/repartidor/HistorialEntregas';
import TopVentas from '../pages/dashboards/admin/TopVentas';
import TopRepartidores from '../pages/dashboards/admin/TopRepartidores';
// ✅ AGREGAR IMPORT DE EDICIÓN DE PRODUCTOS
import EdicionProductos from '../pages/dashboards/locatarios/EdicionProductos';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      {/* ========== RUTAS PÚBLICAS ========== */}
      <Route path="/" element={<Home />} />                 
      <Route path="/login" element={<Login />} />              
      <Route path="/register" element={<Register />} />
      
      {/* ========== RUTAS DE ADMIN (Solo para isAdmin = true) ========== */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/top-ventas" element={
        <ProtectedRoute requireAdmin={true}>
          <TopVentas />
        </ProtectedRoute>
      } />
      <Route path="/admin/top-repartidores" element={
        <ProtectedRoute requireAdmin={true}>
          <TopRepartidores />
        </ProtectedRoute>
      } />
      
      {/* ========== RUTAS DE LOCATARIO ========== */}
      <Route path="/locatario" element={
        <ProtectedRoute requiredRole="locatario">
          <LocatarioDashboard />
        </ProtectedRoute>
      } />
      <Route path="/locatario/pedidos" element={
        <ProtectedRoute requiredRole="locatario">
          <PedidosDashboards />
        </ProtectedRoute>
      } />
      {/* ✅ NUEVA RUTA PARA EDICIÓN DE PRODUCTOS */}
      <Route path="/locatario/edicion-productos" element={
        <ProtectedRoute requiredRole="locatario">
          <EdicionProductos />
        </ProtectedRoute>
      } />
      
      {/* ========== RUTAS DE USUARIO/COMPRADOR ========== */}
      <Route path="/comprador" element={
        <ProtectedRoute requiredRole="usuario">
          <CompradorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/comprador/carrito" element={
        <ProtectedRoute requiredRole="usuario">
          <CarritoView />
        </ProtectedRoute>
      } />
      <Route path="/comprador/pedidos" element={
        <ProtectedRoute requiredRole="usuario">
          <PedidosDashboard />
        </ProtectedRoute>
      } />
      <Route path="/comprador/cartera" element={
        <ProtectedRoute requiredRole="usuario">
          <CarteraUsuarioDashboard />
        </ProtectedRoute>
      } />
      <Route path="/comprador/historial" element={
        <ProtectedRoute requiredRole="usuario">
          <HistorialPedidos />
        </ProtectedRoute>
      } />

      <Route path="/local/:id" element={
        <ProtectedRoute requiredRole="usuario">
          <LocalView />
        </ProtectedRoute>
      } />
            
      {/* ========== RUTAS DE REPARTIDOR ========== */}
      <Route path="/repartidor" element={
        <ProtectedRoute requiredRole="repartidor">
          <RepartidorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/repartidor/pedidos" element={
        <ProtectedRoute requiredRole="repartidor">
          <PedidosRepartidor />
        </ProtectedRoute>
      } />
      <Route path="/repartidor/pendientes" element={
        <ProtectedRoute requiredRole="repartidor">
          <PedidosPendientes />
        </ProtectedRoute>
      } />
      <Route path="/repartidor/en-camino" element={
        <ProtectedRoute requiredRole="repartidor">
          <PedidosEnCamino />
        </ProtectedRoute>
      } />
      <Route path="/repartidor/historial" element={
        <ProtectedRoute requiredRole="repartidor">
          <HistorialEntregas />
        </ProtectedRoute>
      } />

      {/* ========== RUTA 404 ========== */}
      <Route path="*" element={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h1>404 - Página no encontrada</h1>
          <button onClick={() => window.location.href = '/'}>
            Volver al inicio
          </button>
        </div>
      } />
    </Routes>
  );
}