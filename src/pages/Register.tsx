import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [direccion, setCalle] = useState('');
  const [telefono, settelefono] = useState('');

  // Campos específicos
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuarioRepartidor, setUsuarioRepartidor] = useState('');
  const [numeroCasaDepto, setNumeroCasaDepto] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [patente, setPatente] = useState('');

  const navigate = useNavigate();


  const registerUser = async (datos: any) => {
  try {
    const response = await fetch('http://localhost:3000/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }
    return response.json();
  } catch (err: any) {
    // Puedes personalizar el mensaje de error aquí si quieres
    throw new Error(err.message || 'Error de conexión');
  }
};


  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert('Registro exitoso');
      navigate('/');
    },
    onError: (error: any) => {
      alert('Error en el registro: ' + error.message);
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoUsuario || !nombre || !apellido || !correo || !clave || !confirmarClave || !direccion || !telefono) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    if (clave !== confirmarClave) {
      alert('Las claves no coinciden');
      return;
    }

    if (tipoUsuario === 'usuario' && (!nombreUsuario || !numeroCasaDepto)) {
      alert('Faltan datos específicos del usuario');
      return;
    }

    if (tipoUsuario === 'locatario' && (!nombreLocal || !numeroLocal)) {
      alert('Faltan datos específicos del locatario');
      return;
    }

    if (tipoUsuario === 'repartidor' && (!usuarioRepartidor || !vehiculo || !patente)) {
      alert('Faltan datos específicos del repartidor');
      return;
    }

    const datos = {
      tipoUsuario,
      nombre,
      apellido,
      correo,
      clave: clave,
      direccion,
      telefono,
      ...(tipoUsuario === 'usuario' && {
        nombreUsuario,
        numeroCasaDepto,
      }),
      ...(tipoUsuario === 'locatario' && {
        nombreLocal,
        numeroLocal,
        comidasStock: [],
        ventas: [],
      }),
      ...(tipoUsuario === 'repartidor' && {
        usuarioRepartidor,
        vehiculo,
        patente,
      }),
    };
    mutation.mutate(datos);
    console.log('Datos listos para enviar:', datos);
    alert(`Registro simulado para tipo ${tipoUsuario}`);
  };

  return (
    <div className="register-container">
      <div className="register-inner">
        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-icon">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/add-user-group-man-man.png" alt="Register" />
          </div>

          <h2>Crea tu cuenta</h2>

          {/* Campos comunes */}
          <input className="register-input" type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input className="register-input" type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          <input className="register-input" type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <input className="register-input" type="password" placeholder="clave" value={clave} onChange={(e) => setClave(e.target.value)} />
          <input className="register-input" type="password" placeholder="Confirmar clave" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} />
          <input className="register-input" type="text" placeholder="Dirección" value={direccion} onChange={(e) => setCalle(e.target.value)} />
          <input className="register-input" type="text" placeholder="Teléfono" value={telefono} onChange={(e) => settelefono(e.target.value)} />

          {/* Tipo de usuario */}
          <select className="register-input" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
            <option value="">Selecciona tu tipo de usuario</option>
            <option value="usuario">Comprador</option>
            <option value="locatario">Locatario</option>
            <option value="repartidor">Repartidor</option>
          </select>

          {/* Campos específicos */}
          {tipoUsuario === 'usuario' && (
            <>
              <input className="register-input" type="text" placeholder="Nombre de usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
              <input className="register-input" type="text" placeholder="Número de casa o depto" value={numeroCasaDepto} onChange={(e) => setNumeroCasaDepto(e.target.value)} />
            </>
          )}

          {tipoUsuario === 'locatario' && (
            <>
              <input className="register-input" type="text" placeholder="Nombre del local" value={nombreLocal} onChange={(e) => setNombreLocal(e.target.value)} />
              <input className="register-input" type="text" placeholder="Número del local" value={numeroLocal} onChange={(e) => setNumeroLocal(e.target.value)} />
            </>
          )}

          {tipoUsuario === 'repartidor' && (
            <>
              <input className="register-input" type="text" placeholder="Nombre de usuario" value={usuarioRepartidor} onChange={(e) => setUsuarioRepartidor(e.target.value)} />
              <select className="register-input" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}>
                <option value="">Selecciona tu vehículo</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
              <input className="register-input" type="text" placeholder="Patente del vehículo" value={patente} onChange={(e) => setPatente(e.target.value)} />
            </>
          )}
          <button type="submit" className="register-button">
            Registrarse
          </button>
          {/* Botón Volver */}
          <button
            type="button"
            className="register-button volver-button"
            onClick={() => navigate('/')}
          >
            ← Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
