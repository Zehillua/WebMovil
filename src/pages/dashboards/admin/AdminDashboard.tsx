import React, { useState } from 'react';
import './AdminDashboard.css';

interface Producto {
  id: number;
  nombre: string;
  locatario: string;
  categoria: string;
  estado: 'Revisado' | 'Sospechoso' | 'Pendiente';
}

const AdminDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Empanada de pino', locatario: 'La Picá de Juan', categoria: 'Empanadas', estado: 'Pendiente' },
    { id: 2, nombre: 'Pizza Margarita', locatario: 'Don Gusto', categoria: 'Pizza', estado: 'Pendiente' },
    { id: 3, nombre: 'Completo italiano', locatario: 'Kiosco Anita', categoria: 'Hotdog', estado: 'Revisado' },
    { id: 4, nombre: 'Pizza Napolitana', locatario: 'Don Gusto', categoria: 'Pizza', estado: 'Sospechoso' },
  ]);

  const [locatariosActivos] = useState(3);
  const [compradoresActivos] = useState(12);
  const totalProductos = productos.length;

  const [filtroLocatario, setFiltroLocatario] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const cambiarEstado = (id: number, nuevoEstado: Producto['estado']) => {
    const actualizados = productos.map((p) =>
      p.id === id ? { ...p, estado: nuevoEstado } : p
    );
    setProductos(actualizados);
  };

  // Obtener categorías únicas para el filtro
  const categoriasDisponibles = Array.from(new Set(productos.map(p => p.categoria)));

  // Filtrar productos antes de agruparlos
  const productosFiltrados = productos.filter(p =>
    p.locatario.toLowerCase().includes(filtroLocatario.toLowerCase()) &&
    (filtroCategoria === '' || p.categoria === filtroCategoria) &&
    (filtroEstado === '' || p.estado === filtroEstado)
  );

  // Agrupar por locatario
  const productosPorLocatario = productosFiltrados.reduce((acc: Record<string, Producto[]>, producto) => {
    if (!acc[producto.locatario]) acc[producto.locatario] = [];
    acc[producto.locatario].push(producto);
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <h1>Panel Administrador</h1>

      <div className="resumen-cards">
        <div className="card-resumen">
          <h2>{totalProductos}</h2>
          <p>Total de Productos</p>
        </div>
        <div className="card-resumen">
          <h2>{locatariosActivos}</h2>
          <p>Locatarios Activos</p>
        </div>
        <div className="card-resumen">
          <h2>{compradoresActivos}</h2>
          <p>Compradores Activos</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="filtros-admin">
        <input
          type="text"
          placeholder="Buscar locatario..."
          value={filtroLocatario}
          onChange={(e) => setFiltroLocatario(e.target.value)}
        />
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categoriasDisponibles.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Revisado">Revisado</option>
          <option value="Sospechoso">Sospechoso</option>
        </select>
      </div>

      <h2>Revisión de Productos por Locatario</h2>
      {Object.entries(productosPorLocatario).map(([locatario, productos]) => (
        <div key={locatario} className="bloque-locatario">
          <h3>{locatario}</h3>
          <table className="tabla-revision">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>
                    <span className={`estado ${p.estado.toLowerCase()}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => cambiarEstado(p.id, 'Revisado')}>✔ Revisado</button>
                    <button onClick={() => cambiarEstado(p.id, 'Sospechoso')}>⚠ Sospechoso</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {productosFiltrados.length === 0 && (
        <p style={{ marginTop: '2rem' }}>No se encontraron productos que coincidan con los filtros.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
