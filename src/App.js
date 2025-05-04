import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar'; // Si NavBar está en src
import Usuarios from './components/Usuarios'; // Importar desde components
import Locatarios from './components/Locatarios';
import Pagos from './components/Pagos';
import Pedidos from './components/Pedidos';
import Reportes from './components/Reportes';
import './App.css'; // Archivo de estilos globales

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/locatarios" element={<Locatarios />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </Router>
  );
}

export default App;