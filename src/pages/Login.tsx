// Login.tsx (Unificado - Lógica de Proyecto 1 con Diseño de Proyecto 2)
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query'; // Importa useMutation del Proyecto 1
import { useNavigate } from 'react-router-dom';
import './Login.css';

// Función para el login - Tomada directamente del Proyecto 1
const loginUser = async (datos: { correo: string; clave: string }) => {
  const response = await fetch('http://localhost:3000/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el login');
  }
  return response.json();
};

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  // Lógica de mutación con react-query - Tomada directamente del Proyecto 1
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('tipoUsuario', data.tipoUsuario);
        // Mapeo de tipoUsuario a ruta
      const rutasPorTipo: Record<string, string> = {
        usuario: '/comprador',
        locatario: '/locatario',
        repartidor: '/repartidor',
        admin: '/admin',
      };

      const ruta = rutasPorTipo[data.tipoUsuario];
      if (ruta) {
        navigate(ruta);
      } else {
        alert('Tipo de usuario desconocido');
      }
      },
    onError: (error: any) => {
        alert('Error en el login: ' + error.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || !clave) {
      alert('Por favor completa todos los campos.');
      return;
    }
    mutation.mutate({ correo, clave }); // Llama a la mutación para hacer el login
  };

  return (
    <div className="login-page"> {/* Contenedor principal del diseño de Proyecto 2 */}
      <div className="login-card">
        {/* Sección izquierda: formulario - Diseño de Proyecto 2 */}
        <div className="login-left">
          {/* Si tienes un logo, puedes ponerlo aquí. Si no, quita esta línea o pon un texto. */}
          {/* <img src="/logo-vecimarket.png" alt="VeciMarket Logo" className="login-logo" /> */}
          <h1 className="login-main-title">¡Bienvenido!</h1>
          <p className="login-subtitle">Accede a tu cuenta de VeciMarket</p>

          {/* Card interior para estilo - Diseño de Proyecto 2 */}
          <div className="login-form-inner-card">
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="correo" className="login-label">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="login-input"
                  placeholder="tu_correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="clave" className="login-label">Contraseña</label>
                <input
                  type="password"
                  id="clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" className="checkbox-input" /> Recordarme
                </label>
                <a href="#" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="login-action-button">Iniciar sesión</button>
              <button
                type="button"
                className="login-back-button"
                onClick={() => navigate('/')}
              >
                ← Volver al inicio
              </button>
            </form>
          </div>
        </div>

        {/* Sección derecha: imagen decorativa - Diseño de Proyecto 2 */}
        <div className="login-right">
          <img
            src="https://img.freepik.com/vector-gratis/edificio-tiendas-vectores-dibujos-animados-calle-ciudad-vista-rascacielos-urbanos-ilustracion-isometrica-apartamentos-cerca-tranvia-ciudad-nadie-dia-soleado-arquitectura-juegos-retro-papel-tapiz-grafico-2d_107791-22114.jpg"
            alt="Ilustración vecinal"
            className="decorative-image"
          />
          <div className="overlay-text">
            <h3>Tu Mercado Vecinal Digital</h3>
            <p>Conecta con tu comunidad, apoya lo local.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;