import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import LocatarioDashboard from '../pages/dashboards/LocatarioDashboard';
import CompradorDashboard from '../pages/dashboards/CompradorDashboard';
import RepartidorDashboard from '../pages/dashboards/RepartidorDashboard';
import LocalView from '../pages/dashboards/LocalView';
import CarritoView from '../pages/dashboards/CarritoView';
import Perfil from '../pages/Perfil';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />                 
      <Route path="/login" element={<Login />} />              
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/locatario" element={<LocatarioDashboard />} />
      <Route path="/comprador" element={<CompradorDashboard />} />
      <Route path="/repartidor" element={<RepartidorDashboard />} />
      <Route path="/local/:id" element={<LocalView />} />
      <Route path="/carrito" element={<CarritoView />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}

