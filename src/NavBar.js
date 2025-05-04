import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f4f4f4' }}>
      <Link to="/usuarios" style={{ margin: '0 10px' }}>Usuarios</Link>
      <Link to="/locatarios" style={{ margin: '0 10px' }}>Locatarios</Link>
      <Link to="/pagos" style={{ margin: '0 10px' }}>Pagos</Link>
      <Link to="/pedidos" style={{ margin: '0 10px' }}>Pedidos</Link>
      <Link to="/reportes" style={{ margin: '0 10px' }}>Reportes</Link>
    </nav>
  );
}

export default NavBar;