import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LocatarioDashboard.css';

interface Producto {
  id: number;
  _id?: string;
  nombre: string;
  ingredientes: string[];
  descripcion: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
}

const LocatarioDashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    ingredientes: '',
    descripcion: '',
    imagenUrl: '',
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchComidas = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:3001/comidas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    };
    fetchComidas();
  }, []);


  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
    }
  };

  const subirImagen = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagen', file);

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/comidas/upload', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }
    const data = await response.json();
    return data.url;
  };

  // Enviar producto al backend
  const agregarProducto = async (producto: {
    nombre: string;
    precio: number;
    cantidad: number;
    ingredientes: string[];
    descripcion: string;
    imagenUrl?: string;
  }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No autenticado');
    }
    const response = await fetch('http://localhost:3001/comidas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al agregar producto');
    }
    return response.json();
  };

  const handleAgregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, precio, cantidad, ingredientes, descripcion } = formulario;
    if (!nombre || !precio || !cantidad || !ingredientes || !descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    const ingredientesArray = ingredientes.split(',').map(i => i.trim()).filter(i => i);

    let imagenUrl = '';
    if (imagenFile) {
      try {
        imagenUrl = await subirImagen(imagenFile);
      } catch (err: any) {
        alert('Error al subir la imagen: ' + err.message);
        return;
      }
    }

    try {
      await agregarProducto({
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad, 10),
        ingredientes: ingredientesArray,
        descripcion,
        imagenUrl: imagenUrl || undefined,
      });
      alert('Producto agregado correctamente');
      limpiarFormulario();
      setMostrarFormulario(false);
      setImagenFile(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: '',
      precio: '',
      cantidad: '',
      ingredientes: '',
      descripcion: '',
      imagenUrl: '',
    });
    setImagenFile(null);
  };

  return (
    <div className="locatario-dashboard">
      {/* Barra superior */}
      <nav className="navbar-locatario">
        <div className="logo-centered">Panel Locatario</div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          Salir
        </button>
      </nav>

      {/* Botones principales centrados */}
      <div className="main-actions">
        <button onClick={() => setMostrarFormulario(true)}>Agregar Producto</button>
        <button>Agregar Promoción</button>
        <button>Edición de productos</button>
        <button>Top Ventas</button>
        <button>Top Deliverys</button>
        <button onClick={() => navigate('/locatario/pedidos')}>Pedidos</button>
      </div>

      {/* Productos (puedes mejorar esto según tu lógica real) */}
      <div className="contenido">
        {productos.length === 0 ? (
          <div className="no-products">No hay productos registrados.</div>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => (
              <div className="producto-card" key={producto.id || producto._id}>
                <img
                  src={
                    producto.imagenUrl
                      ? producto.imagenUrl.startsWith('/uploads/')
                        ? `http://localhost:3001${producto.imagenUrl}`
                        : producto.imagenUrl
                      : 'https://via.placeholder.com/200x140?text=Sin+Imagen'
                  }
                  alt={producto.nombre}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                />
                <h3>{producto.nombre}</h3>
                <p><strong>Precio:</strong> ${producto.precio}</p>
                <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                <p><strong>Ingredientes:</strong> {producto.ingredientes?.join(', ')}</p>
                <p>{producto.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario para agregar producto */}
      {mostrarFormulario && (
        <div className="overlay" onClick={() => setMostrarFormulario(false)}>
          <form className="formulario-flotante" onClick={(e) => e.stopPropagation()} onSubmit={handleAgregarProducto}>
            <button className="cerrar" onClick={() => setMostrarFormulario(false)}>×</button>
            <h3>Agregar Producto</h3>
            <input type="text" name="nombre" placeholder="Nombre del producto" value={formulario.nombre} onChange={handleInputChange} />
            <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={handleInputChange} />
            <input type="number" name="cantidad" placeholder="Cantidad" value={formulario.cantidad} onChange={handleInputChange} />
            <input type="text" name="ingredientes" placeholder="Ingredientes (separados por coma)" value={formulario.ingredientes} onChange={handleInputChange} />
            <textarea name="descripcion" placeholder="Descripción" value={formulario.descripcion} onChange={handleTextareaChange} />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit">Agregar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LocatarioDashboard;