import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LocalView.css';

interface Comida {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  ingredientes: string[];
  imagenUrl?: string;
}

const LocalView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [nombreLocal, setNombreLocal] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedComida, setSelectedComida] = useState<Comida | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComidas = async () => {
      const token = localStorage.getItem('token');
      if (!token || !id) return;

      // Obtener nombre del local como ejemplo de ahora
      const localRes = await fetch(`http://localhost:3000/locatarios/${id}`);
      if (localRes.ok) {
        const localData = await localRes.json();
        setNombreLocal(localData.nombreLocal || 'Local');
      }
      // Aca se obtiene las comidas del locatario como ejemplo por ahora
      const response = await fetch(`http://localhost:3001/comidas/locatario/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComidas(data);
      }
    };
    fetchComidas();
  }, [id]);

  const handleAgregarClick = (comida: Comida) => {
    setSelectedComida(comida);
    setCantidad(1);
    setShowModal(true);
  };

  const handleAceptar = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedComida || !id) return;
    console.log('Iniciando handleAceptar');

    //Aca se puede obtener la id del comprador desde el back
    let idComprador = localStorage.getItem('idUsuario');
    try {
        const res = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
        const data = await res.json();
        console.log('Respuesta de /usuarios/me:', data);
        idComprador = data.userId;
        } else {
        alert('No se pudo obtener el usuario');
        return;
        }
    } catch {
        alert('Error de conexión');
        return;
    }

    // Construir el body según lo que espera tu backend
    const body = {
        idLocatario: id,
        nombreLocal,
        nombreComida: selectedComida.nombre,
        cantidad,
        precio: selectedComida.precio
    };
    console.log('idComprador:', idComprador);
    console.log('Body enviado al carrito:', body);
    try {
        const response = await fetch(`http://localhost:3002/carrito/${idComprador}/agregar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
        });
        if (response.ok) {
        alert('Producto agregado al carrito');
        setShowModal(false);
        } else {
        const error = await response.json();
        alert('Error al agregar al carrito: ' + (error.message || 'Error'));
        }
    } catch {
        alert('Error de conexión al agregar al carrito');
    }
    };

  return (
    <div className="local-view">
      {/* Barra superior moderna */}
      <nav className="local-navbar">
        <button className="volver-btn" onClick={() => navigate(-1)}>
          <span>←</span> Volver
        </button>
        <span className="local-nombre">{nombreLocal}</span>
      </nav>

      <div className="productos-grid">
        {comidas.length === 0 ? (
          <div style={{ color: '#888', marginTop: '2rem' }}>No hay productos disponibles.</div>
        ) : (
          comidas.map((comida) => (
            <div className="producto-card" key={comida._id}>
              <img
                src={
                  comida.imagenUrl
                    ? comida.imagenUrl.startsWith('/uploads/')
                      ? `http://localhost:3001${comida.imagenUrl}`
                      : comida.imagenUrl
                    : 'https://via.placeholder.com/200x140?text=Sin+Imagen'
                }
                alt={comida.nombre}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
              />
              <h3>{comida.nombre}</h3>
              <p><strong>Precio:</strong> ${comida.precio}</p>
              <p><strong>Stock:</strong> {comida.cantidad}</p>
              <p><strong>Ingredientes:</strong> {comida.ingredientes?.join(', ')}</p>
              <p>{comida.descripcion}</p>
              <button
                className="agregar-btn"
                onClick={() => handleAgregarClick(comida)}
              >
                + Agregar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal para elegir cantidad */}
      {showModal && selectedComida && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-cantidad" onClick={e => e.stopPropagation()}>
            <h3>¿Cuántos deseas agregar?</h3>
            <div className="modal-producto-nombre">{selectedComida.nombre}</div>
            <input
              type="number"
              min={1}
              max={selectedComida.cantidad}
              value={cantidad}
              onChange={e => setCantidad(Number(e.target.value))}
              className="input-cantidad"
            />
            <div className="modal-btns">
              <button
                className="aceptar-btn"
                onClick={() => { console.log('Click aceptar'); handleAceptar(); }}
              >
                Aceptar
              </button>
              <button
                className="cancelar-btn"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalView;