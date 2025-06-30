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
import HistorialPedidos from '../pages/dashboards/usuarios/HistorialPedidos'; // ✅ NUEVO
import HistorialEntregas from '../pages/dashboards/repartidor/HistorialEntregas'; // ✅ NUEVO


export default function AppRouter() {
  return (
    <Routes>
      {/* ========== RUTAS PÚBLICAS ========== */}
      <Route path="/" element={<Home />} />                 
      <Route path="/login" element={<Login />} />              
      <Route path="/register" element={<Register />} />
      
      {/* ========== RUTAS DE ADMIN ========== */}
      <Route path="/admin" element={<AdminDashboard />} />
      
      {/* ========== RUTAS DE LOCATARIO ========== */}
      <Route path="/locatario" element={<LocatarioDashboard />} />
      <Route path="/locatario/pedidos" element={<PedidosDashboards/>} />
      
      {/* ========== RUTAS DE USUARIO/COMPRADOR ========== */}
      <Route path="/comprador" element={<CompradorDashboard />} />
      <Route path="/local/:id" element={<LocalView />} />
      <Route path="/carrito" element={<CarritoView />} />
      <Route path="/cartera" element={<CarteraUsuarioDashboard />} />
      <Route path="/pedidos" element={<PedidosDashboard />} />
      <Route path="/historial" element={<HistorialPedidos />} /> {/* ✅ NUEVA RUTA */}
      
      {/* ========== RUTAS DE REPARTIDOR ========== */}
      <Route path="/repartidor" element={<RepartidorDashboard />} />
      <Route path="/repartidor/pedidos" element={<PedidosRepartidor />} />
      <Route path="/repartidor/pendientes" element={<PedidosPendientes />} /> {/* ✅ DUPLICADO ELIMINADO */}
      <Route path="/repartidor/en-camino" element={<PedidosEnCamino />} />
      <Route path="/repartidor/historial" element={<HistorialEntregas />} />
    </Routes>
  );
}