// LocalView.tsx (Adaptado al diseño pastel unificado)
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

      const localRes = await fetch(`http://localhost:3000/locatarios/${id}`);
      if (localRes.ok) {
        const localData = await localRes.json();
        setNombreLocal(localData.nombreLocal || 'Local');
      }

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

    let idComprador = localStorage.getItem('idUsuario');
    try {
      const res = await fetch('http://localhost:3000/usuarios/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        idComprador = data.userId;
      } else {
        alert('No se pudo obtener el usuario');
        return;
      }
    } catch {
      alert('Error de conexión');
      return;
    }

    const body = {
      idLocatario: id,
      nombreLocal,
      nombreComida: selectedComida.nombre,
      cantidad,
      precio: selectedComida.precio
    };

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
      <div className="top-banner">
        <div className="top-banner-text">
          <button className="volver-btn" onClick={() => navigate(-1)}>&larr; Volver</button>
          <span className="local-nombre">{nombreLocal}</span>
        </div>
      </div>

      <div className="productos-grid">
        {comidas.length === 0 ? (
          <div className="no-products-message">No hay productos disponibles.</div>
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
                className="producto-imagen"
              />
              <div className="producto-info">
                <h3 className="producto-nombre">{comida.nombre}</h3>
                <p className="producto-precio">Precio: ${comida.precio.toLocaleString('es-CL')}</p>
                <p className="producto-stock">Stock: {comida.cantidad}</p>
                <p className="producto-descripcion">{comida.descripcion}</p>
                <button className="add-to-cart-button" onClick={() => handleAgregarClick(comida)}>
                  + Agregar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedComida && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            <h2>{selectedComida.nombre}</h2>
            <p>¿Cuántos deseas agregar?</p>
            <input
              type="number"
              min={1}
              max={selectedComida.cantidad}
              value={cantidad}
              onChange={e => setCantidad(Number(e.target.value))}
              className="input-cantidad"
            />
            <div className="modal-btns">
              <button className="accept-button" onClick={handleAceptar}>Aceptar</button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalView;
