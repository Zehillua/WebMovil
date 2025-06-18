import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import './Perfil.css';

interface Usuario {
  nombre: string;
  apellido: string;
  tipoUsuario: string;
  telefono?: string;
  direccion?: string;
  nombreUsuario?: string;
  correo: string;
  saldo?: number;
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'contacto' | 'cartera' | 'usuario'>('perfil');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Usuario>({} as Usuario);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error("No hay token de autenticación.");
      return;
    }
    fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            console.error("Token de autenticación inválido o expirado.");
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, [token]);

  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<Usuario>) => {
      const response = await fetch('http://localhost:3000/usuarios/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Error al actualizar los datos';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setUsuario(data);
      setFormData(data);
      setEditing(false);
      alert('Datos actualizados correctamente.');
    },
    onError: (error: any) => {
      console.error("Error en la mutación:", error.message);
      alert('Fallo al actualizar: ' + error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    mutation.mutate(formData);
  };

  if (!usuario) {
    return <div className="perfil-loading">Cargando datos del perfil...</div>;
  }

  return (
    <div className="perfil-wrapper">
      <div className="top-perfil-banner">
        VeciMarket - Perfil de Usuario
      </div>

      <div className="perfil-main-content-area">
        <div className="perfil-sidebar">
          {/* Avatar fijo encima de las pestañas */}
          <div className="perfil-avatar">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="Avatar de usuario"
            />
          </div>
          <h2>Perfil</h2>
          <ul className="sidebar-options">
            <li className={`sidebar-card-button ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
              👤 Información Personal
            </li>
            <li className={`sidebar-card-button ${activeTab === 'contacto' ? 'active' : ''}`} onClick={() => setActiveTab('contacto')}>
              📞 Datos de Contacto
            </li>
            <li className={`sidebar-card-button ${activeTab === 'cartera' ? 'active' : ''}`} onClick={() => setActiveTab('cartera')}>
              💳 Cartera
            </li>
            <li className={`sidebar-card-button ${activeTab === 'usuario' ? 'active' : ''}`} onClick={() => setActiveTab('usuario')}>
              🔐 Datos de Usuario
            </li>
          </ul>
        </div>

        <div className="perfil-content">
          <div className="perfil-content-header">
            {!editing && (
              <button className="editar-button" onClick={() => setEditing(true)}>Editar</button>
            )}
          </div>

          {activeTab === 'perfil' && (
            <div className="perfil-content-section">
              <h3>Información Personal</h3>
              <div className="perfil-info-display">
                <p><b>Nombre Completo:</b> {usuario.nombre} {usuario.apellido}</p>
                <p><b>Tipo de Usuario:</b> {usuario.tipoUsuario}</p>
              </div>
            </div>
          )}

          {activeTab === 'contacto' && (
            <div className="perfil-content-section">
              <h3>Datos de Contacto</h3>
              {editing ? (
                <>
                  <label htmlFor="telefono">Teléfono:</label>
                  <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleInputChange} />

                  <label htmlFor="direccion">Dirección:</label>
                  <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleInputChange} />
                </>
              ) : (
                <div className="perfil-info-display">
                  <p><b>Teléfono:</b> {usuario.telefono || 'No registrado'}</p>
                  <p><b>Dirección:</b> {usuario.direccion || 'No registrada'}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cartera' && (
            <div className="perfil-content-section">
              <h3>Cartera</h3>
              {editing ? (
                <>
                  <label htmlFor="saldo">Saldo:</label>
                  <input type="number" id="saldo" name="saldo" value={formData.saldo ?? 0} onChange={handleInputChange} />
                </>
              ) : (
                <div className="perfil-info-display">
                  <p><b>Saldo Actual:</b> ${usuario.saldo?.toFixed(2) || '0.00'}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'usuario' && (
            <div className="perfil-content-section">
              <h3>Datos de Usuario</h3>
              {editing ? (
                <>
                  <label htmlFor="correo">Correo Electrónico:</label>
                  <input type="email" id="correo" name="correo" value={formData.correo || ''} disabled />
                  <p className="note-text" style={{ fontSize: '0.9em', color: 'gray' }}>* El correo no puede ser modificado directamente.</p>

                  <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
                  <input type="text" id="nombreUsuario" name="nombreUsuario" value={formData.nombreUsuario || ''} onChange={handleInputChange} />

                  <p><b>Contraseña:</b> ******** (No editable desde aquí por seguridad)</p>
                </>
              ) : (
                <div className="perfil-info-display">
                  <p><b>Correo Electrónico:</b> {usuario.correo}</p>
                  <p><b>Nombre de Usuario:</b> {usuario.nombreUsuario || '-'}</p>
                  <p><b>Contraseña:</b> ********</p>
                </div>
              )}
            </div>
          )}

          {editing && (
            <div className="perfil-actions">
              <button className="guardar-button" onClick={handleSave} disabled={mutation.status === 'pending'}>
                {mutation.status === 'pending' ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button className="cancelar-button" onClick={() => { setEditing(false); setFormData(usuario); }}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
