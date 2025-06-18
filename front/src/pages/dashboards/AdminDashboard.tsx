import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

interface Producto {
  _id: string;
  nombre: string;
  categoria: string;
  estado: 'Revisado' | 'Sospechoso' | 'Pendiente';
  locatarioNombre: string;
  imagenUrl: string;
  descripcion: string;
}

const AdminDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [locatariosActivos, setLocatariosActivos] = useState<number>(0);
  const [compradoresActivos, setCompradoresActivos] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroLocatario, setFiltroLocatario] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch('http://localhost:3001/admin/productos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(data);

      const resLocatarios = await fetch('http://localhost:3000/admin/locatarios-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resLocatarios.ok) throw new Error("Error al cargar locatarios");
      const locData = await resLocatarios.json();
      setLocatariosActivos(locData.total);

      const resCompradores = await fetch('http://localhost:3000/admin/compradores-count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resCompradores.ok) throw new Error("Error al cargar compradores");
      const compData = await resCompradores.json();
      setCompradoresActivos(compData.total);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cambiarEstadoProducto = async (id: string, nuevoEstado: Producto['estado']) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch(`http://localhost:3001/admin/productos/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error("Error al actualizar estado");
      cargarDatos();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const categoriasDisponibles = Array.from(new Set(productos.map(p => p.categoria)));

  const productosFiltrados = productos.filter(p =>
    p.locatarioNombre.toLowerCase().includes(filtroLocatario.toLowerCase()) &&
    (filtroCategoria === '' || p.categoria === filtroCategoria) &&
    (filtroEstado === '' || p.estado === filtroEstado)
  );

  const productosPorLocatario = productosFiltrados.reduce((acc: Record<string, Producto[]>, p) => {
    if (!acc[p.locatarioNombre]) acc[p.locatarioNombre] = [];
    acc[p.locatarioNombre].push(p);
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="admin-logo">VeciMarket Admin</div>
      </nav>

      <div className="admin-contenido">
        <h1>Resumen del Sistema</h1>

        <div className="admin-resumen-cards">
          <div className="admin-card-resumen">
            <span className="icon-large">📦</span>
            <h2>{productos.length}</h2>
            <p>Total Productos</p>
          </div>
          <div className="admin-card-resumen">
            <span className="icon-large">🏪</span>
            <h2>{locatariosActivos}</h2>
            <p>Locatarios Activos</p>
          </div>
          <div className="admin-card-resumen">
            <span className="icon-large">🛒</span>
            <h2>{compradoresActivos}</h2>
            <p>Compradores Activos</p>
          </div>
        </div>

        <h2>Revisión de Productos</h2>

        <div className="admin-filtros">
          <input type="text" placeholder="Buscar locatario..." value={filtroLocatario} onChange={e => setFiltroLocatario(e.target.value)} />
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Revisado">Revisado</option>
            <option value="Sospechoso">Sospechoso</option>
          </select>
        </div>

        {Object.entries(productosPorLocatario).length > 0 ? (
          Object.entries(productosPorLocatario).map(([locatario, productos]) => (
            <div key={locatario} className="admin-bloque-locatario">
              <h3>{locatario}</h3>
              <div className="admin-grid-productos-revision">
                {productos.map(p => (
                  <div key={p._id} className="admin-card-revision">
                    <img src={p.imagenUrl || 'https://via.placeholder.com/100'} alt={p.nombre} className="admin-card-img" />
                    <div className="admin-card-info">
                      <h4>{p.nombre}</h4>
                      <p className="admin-card-meta">Categoría: {p.categoria}</p>
                      <span className={`admin-estado admin-estado-${p.estado.toLowerCase()}`}>{p.estado}</span>
                    </div>
                    <div className="admin-card-actions">
                      <button className="btn-revisado" onClick={() => cambiarEstadoProducto(p._id, 'Revisado')}>✔ Revisado</button>
                      <button className="btn-sospechoso" onClick={() => cambiarEstadoProducto(p._id, 'Sospechoso')}>⚠ Sospechoso</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="admin-no-data-message">No hay productos disponibles.</p>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
