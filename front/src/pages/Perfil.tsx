import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import './Perfil.css';

interface Usuario {
  _id: string;
  userId: string;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [saldoAgregar, setSaldoAgregar] = useState<number>(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:3000/usuarios/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Usuario cargado:", data);
        setUsuario(data);
        setFormData(data);
      })
      .catch(console.error);
  }, [token]);

  // Modificación aquí para manejar el posible null de 'usuario'
  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<Usuario>) => {
      // **Verificación añadida para asegurar que usuario no es null**
      if (!usuario) {
        throw new Error("No se ha cargado la información del usuario para actualizar.");
      }

      const response = await fetch(`http://localhost:3000/usuario/${usuario._id}`, { // Aquí ya no necesitas '!' porque lo verificaste
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    // Añadir `enabled` para que la mutación solo se active cuando `usuario` no es null
    // y para que `usuario` en `mutationFn` sea siempre de tipo `Usuario`.
    // Sin embargo, `mutationFn` se define una vez, por lo que la verificación dentro es mejor.
    // La clave es que `usuario` sea accesible y no nulo cuando `mutate` es llamado.
    // Tanstack Query no tiene una opción `enabled` para `mutation`, solo para `query`.
    // La verificación interna en `mutationFn` es el enfoque correcto.
    onSuccess: (data) => {
      setUsuario(data);
      setFormData(data);
      setEditing(false);
      alert('Datos actualizados correctamente.');
    },
    onError: (error: any) => {
      console.error("Error:", error.message);
      alert('Fallo al actualizar: ' + error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Es importante que `usuario` exista antes de llamar a `mutate`.
    // El hook `useMutation` no tiene una opción `enabled` como `useQuery`.
    // La verificación dentro de `mutationFn` ya lo maneja.
    mutation.mutate(formData);
  };

  const handleAgregarSaldo = async () => {
    if (!usuario) {
      alert("Error: No se ha cargado el perfil del usuario para agregar saldo.");
      return;
    }
    const nuevoSaldo = (usuario.saldo || 0) + saldoAgregar;

    mutation.mutate({ saldo: nuevoSaldo });
    setSaldoAgregar(0);
    setModalVisible(false);
  };

  if (!usuario) return <div className="perfil-loading">Cargando perfil...</div>;

  return (
    <div className="perfil-wrapper">
      <div className="top-perfil-banner">VeciMarket - Perfil de Usuario</div>

      <div className="perfil-main-content-area">
        <div className="perfil-sidebar">
          <div className="perfil-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="avatar" />
          </div>
          <h2>Perfil</h2>
          <ul className="sidebar-options">
            <li className={`sidebar-card-button ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>👤 Información Personal</li>
            <li className={`sidebar-card-button ${activeTab === 'contacto' ? 'active' : ''}`} onClick={() => setActiveTab('contacto')}>📞 Datos de Contacto</li>
            <li className={`sidebar-card-button ${activeTab === 'cartera' ? 'active' : ''}`} onClick={() => setActiveTab('cartera')}>💳 Cartera</li>
            <li className={`sidebar-card-button ${activeTab === 'usuario' ? 'active' : ''}`} onClick={() => setActiveTab('usuario')}>🔐 Datos de Usuario</li>
          </ul>
        </div>

        <div className="perfil-content">
          <div className="perfil-content-header">
            {!editing && <button className="editar-button" onClick={() => setEditing(true)}>Editar</button>}
          </div>

          {activeTab === 'perfil' && (
            <div className="perfil-content-section">
              <h3>Información Personal</h3>
              {editing ? (
                <>
                  <label>Nombre:</label>
                  <input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} />

                  <label>Apellido:</label>
                  <input name="apellido" value={formData.apellido || ''} onChange={handleInputChange} />

                  <label>Tipo de Usuario:</label>
                  <input name="tipoUsuario" value={formData.tipoUsuario || ''} disabled />
                </>
              ) : (
                <div className="perfil-info-display">
                  <p><b>Nombre:</b> {usuario.nombre} {usuario.apellido}</p>
                  <p><b>Tipo de Usuario:</b> {usuario.tipoUsuario}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacto' && (
            <div className="perfil-content-section">
              <h3>Datos de Contacto</h3>
              {editing ? (
                <>
                  <label>Teléfono:</label>
                  <input name="telefono" value={formData.telefono || ''} onChange={handleInputChange} />

                  <label>Dirección:</label>
                  <input name="direccion" value={formData.direccion || ''} onChange={handleInputChange} />
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
              <p><b>Saldo Actual:</b> ${usuario.saldo?.toFixed(2) || '0.00'}</p>
              <button className="agregar-saldo-btn" onClick={() => setModalVisible(true)}>Agregar Saldo</button>
            </div>
          )}

          {activeTab === 'usuario' && (
            <div className="perfil-content-section">
              <h3>Datos de Usuario</h3>
              {editing ? (
                <>
                  <label>Correo:</label>
                  <input value={formData.correo || ''} disabled />

                  <label>Nombre de Usuario:</label>
                  <input name="nombreUsuario" value={formData.nombreUsuario || ''} onChange={handleInputChange} />

                  <p><b>Contraseña:</b> ******** (no editable)</p>
                </>
              ) : (
                <div className="perfil-info-display">
                  <p><b>Correo:</b> {usuario.correo}</p>
                  <p><b>Nombre de Usuario:</b> {usuario.nombreUsuario || '-'}</p>
                  <p><b>Contraseña:</b> ********</p>
                </div>
              )}
            </div>
          )}

          {editing && (
            <div className="perfil-actions">
              <button className="guardar-button" onClick={handleSave}>
                {mutation.status === 'pending' ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button className="cancelar-button" onClick={() => { setEditing(false); setFormData(usuario); }}>Cancelar</button>
            </div>
          )}
        </div>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Saldo</h3>
            <input
              type="number"
              min={0}
              value={saldoAgregar}
              onChange={(e) => setSaldoAgregar(Number(e.target.value))}
              placeholder="Monto a agregar"
            />
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleAgregarSaldo}>Agregar</button>
              <button className="cancel-button" onClick={() => setModalVisible(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}