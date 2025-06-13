// Register.tsx (Unificado - Lógica de Proyecto 1 con Diseño de Proyecto 2 y Corrección isPending)
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importa los estilos unificados

const Register = () => {
  // Estados para los campos comunes del formulario
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [direccion, setDireccion] = useState(''); // Renombrado para consistencia
  const [telefono, setTelefono] = useState('');   // Renombrado para consistencia

  // Estados para los campos específicos según el tipo de usuario
  const [nombreUsuario, setNombreUsuario] = useState(''); // Para 'usuario' (comprador)
  const [numeroCasaDepto, setNumeroCasaDepto] = useState(''); // Para 'usuario' (comprador)
  const [nombreLocal, setNombreLocal] = useState(''); // Para 'locatario'
  const [numeroLocal, setNumeroLocal] = useState(''); // Para 'locatario'
  const [usuarioRepartidor, setUsuarioRepartidor] = useState(''); // Para 'repartidor'
  const [vehiculo, setVehiculo] = useState(''); // Para 'repartidor'
  const [patente, setPatente] = useState('');   // Para 'repartidor'

  const navigate = useNavigate();

  // Función para el registro que interactúa con el backend
  const registerUser = async (datos: any) => {
    try {
      const response = await fetch('http://localhost:3000/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!response.ok) {
        // Si la respuesta no es OK (ej. 400, 500), intentar parsear el error del backend
        const error = await response.json();
        throw new Error(error.message || 'Error en el registro');
      }
      return response.json(); // Devolver los datos de respuesta si todo fue bien
    } catch (err: any) {
      // Capturar y lanzar el error para que useMutation lo maneje
      throw new Error(err.message || 'Error de conexión con el servidor. Inténtalo más tarde.');
    }
  };

  // Configuración de la mutación con React Query
  const mutation = useMutation({
    mutationFn: registerUser, // La función que se ejecutará al llamar a mutation.mutate()
    onSuccess: () => {
      // Acciones a realizar si el registro es exitoso
      alert('Registro exitoso. ¡Bienvenido a VeciMarket!');
      navigate('/login'); // Redirigir al usuario a la página de login
    },
    onError: (error: any) => {
      // Acciones a realizar si hay un error en el registro
      alert('Error en el registro: ' + error.message);
    },
  });

  // Manejador del envío del formulario
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // 1. Validaciones de campos obligatorios comunes
    if (!tipoUsuario || !nombre || !apellido || !correo || !clave || !confirmarClave || !direccion || !telefono) {
      alert('Por favor, completa todos los campos obligatorios marcados.');
      return;
    }

    // 2. Validación de que las contraseñas coincidan
    if (clave !== confirmarClave) {
      alert('Las contraseñas no coinciden. Por favor, revísalas.');
      return;
    }

    // 3. Validaciones de campos específicos según el tipo de usuario
    if (tipoUsuario === 'usuario' && (!nombreUsuario || !numeroCasaDepto)) {
      alert('Como comprador, por favor, ingresa tu nombre de usuario y número de casa/depto.');
      return;
    }

    if (tipoUsuario === 'locatario' && (!nombreLocal || !numeroLocal)) {
      alert('Como locatario, por favor, ingresa el nombre y número de tu local.');
      return;
    }

    if (tipoUsuario === 'repartidor' && (!usuarioRepartidor || !vehiculo || !patente)) {
      alert('Como repartidor, por favor, ingresa tu nombre de usuario, tipo de vehículo y patente.');
      return;
    }

    // 4. Construcción del objeto de datos a enviar al backend
    const datos = {
      tipoUsuario,
      nombre,
      apellido,
      correo,
      clave: clave, // La clave ya se validó que coincida
      direccion,
      telefono,
      // Se añaden campos específicos condicionalmente
      ...(tipoUsuario === 'usuario' && {
        nombreUsuario,
        numeroCasaDepto,
      }),
      ...(tipoUsuario === 'locatario' && {
        nombreLocal,
        numeroLocal,
        comidasStock: [], // Asegúrate que tu backend espere estos campos si son obligatorios
        ventas: [],        // Asegúrate que tu backend espere estos campos si son obligatorios
      }),
      ...(tipoUsuario === 'repartidor' && {
        usuarioRepartidor,
        vehiculo,
        patente,
      }),
    };

    // 5. Llamar a la mutación para enviar los datos
    mutation.mutate(datos);
    console.log('Datos enviados para registro:', datos); // Para depuración
  };

  return (
    <div className="register-page"> {/* Contenedor principal para el fondo y centrado */}
      <div className="register-card"> {/* La "card" principal que contiene las dos secciones */}

        {/* Sección izquierda: Contenido principal y formulario */}
        <div className="register-left">
          {/* Opcional: Puedes descomentar y usar un logo aquí si tienes uno */}
          {/* <img src="/ruta/a/tu/logo.png" alt="VeciMarket Logo" className="register-logo" /> */}
          
          <h1 className="register-main-title">Únete a VeciMarket</h1>
          <p className="register-subtitle">Crea tu cuenta y empieza a disfrutar de tu comunidad</p>

          {/* Tarjeta interior para el formulario con el estilo pastel */}
          <div className="register-form-inner-card">
            <form className="register-form" onSubmit={handleRegister}>
              {/* Campos comunes */}
              <div className="form-group">
                <label htmlFor="nombre" className="register-label">Nombre</label>
                <input className="register-input" type="text" id="nombre" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="apellido" className="register-label">Apellido</label>
                <input className="register-input" type="text" id="apellido" placeholder="Tu apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="correo" className="register-label">Correo electrónico</label>
                <input className="register-input" type="email" id="correo" placeholder="tu_correo@ejemplo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="clave" className="register-label">Contraseña</label>
                <input className="register-input" type="password" id="clave" placeholder="••••••••" value={clave} onChange={(e) => setClave(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmarClave" className="register-label">Confirmar contraseña</label>
                <input className="register-input" type="password" id="confirmarClave" placeholder="••••••••" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="direccion" className="register-label">Dirección</label>
                <input className="register-input" type="text" id="direccion" placeholder="Ej: Calle Principal 123" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="telefono" className="register-label">Teléfono</label>
                <input className="register-input" type="tel" id="telefono" placeholder="Ej: +56912345678" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              </div>

              {/* Selector de Tipo de Usuario */}
              <div className="form-group">
                <label htmlFor="tipoUsuario" className="register-label">Tipo de usuario</label>
                <select className="register-input" id="tipoUsuario" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)} required>
                  <option value="">Selecciona tu tipo de usuario</option>
                  <option value="usuario">Comprador</option>
                  <option value="locatario">Locatario</option>
                  <option value="repartidor">Repartidor</option>
                </select>
              </div>

              {/* Campos específicos renderizados condicionalmente */}
              {tipoUsuario === 'usuario' && (
                <>
                  <div className="form-group">
                    <label htmlFor="nombreUsuario" className="register-label">Nombre de usuario (Comprador)</label>
                    <input className="register-input" type="text" id="nombreUsuario" placeholder="Tu nombre de usuario" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numeroCasaDepto" className="register-label">Número de casa o depto</label>
                    <input className="register-input" type="text" id="numeroCasaDepto" placeholder="Ej: 123 B" value={numeroCasaDepto} onChange={(e) => setNumeroCasaDepto(e.target.value)} required />
                  </div>
                </>
              )}

              {tipoUsuario === 'locatario' && (
                <>
                  <div className="form-group">
                    <label htmlFor="nombreLocal" className="register-label">Nombre del local</label>
                    <input className="register-input" type="text" id="nombreLocal" placeholder="Nombre de tu negocio" value={nombreLocal} onChange={(e) => setNombreLocal(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numeroLocal" className="register-label">Número del local</label>
                    <input className="register-input" type="text" id="numeroLocal" placeholder="Ej: Local 5" value={numeroLocal} onChange={(e) => setNumeroLocal(e.target.value)} required />
                  </div>
                </>
              )}

              {tipoUsuario === 'repartidor' && (
                <>
                  <div className="form-group">
                    <label htmlFor="usuarioRepartidor" className="register-label">Nombre de usuario (Repartidor)</label>
                    <input className="register-input" type="text" id="usuarioRepartidor" placeholder="Tu nombre de usuario de repartidor" value={usuarioRepartidor} onChange={(e) => setUsuarioRepartidor(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vehiculo" className="register-label">Tipo de vehículo</label>
                    <select className="register-input" id="vehiculo" value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} required>
                      <option value="">Selecciona tu vehículo</option>
                      <option value="auto">Auto</option>
                      <option value="moto">Moto</option>
                      <option value="bicicleta">Bicicleta</option>
                      <option value="pie">A pie</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="patente" className="register-label">Patente del vehículo</label>
                    <input className="register-input" type="text" id="patente" placeholder="Ej: ABCD-12" value={patente} onChange={(e) => setPatente(e.target.value)} required />
                  </div>
                </>
              )}

              {/* Botones de acción */}
              <button type="submit" className="register-action-button" disabled={mutation.isPending}>
                {mutation.isPending ? 'Registrando...' : 'Registrarse'}
              </button>
              <button
                type="button"
                className="register-back-button"
                onClick={() => navigate('/')}
                disabled={mutation.isPending}
              >
                ← Volver al inicio
              </button>
            </form>
          </div>
        </div>

        {/* Sección derecha: Imagen decorativa y texto superpuesto */}
        <div className="register-right">
          <img
            src="https://img.freepik.com/foto-gratis/arreglo-comida-tradicional-alto-angulo_23-2148708221.jpg?semt=ais_hybrid&w=740"
            alt="Ilustración de comunidad o alimentos"
            className="decorative-image"
          />
          <div className="overlay-text">
            <h3>Conecta con tu Comunidad</h3>
            <p>Forma parte de la red de VeciMarket</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;