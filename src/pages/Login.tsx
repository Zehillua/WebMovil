import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
    mutation.mutate({ correo, clave });
  };

  return (
    <div className="login-container">
      <div className="login-inner">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-icon">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/user.png" alt="User" />
          </div>

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
          {/* Botón Volver */}
          <button
            type="button"
            className="login-button volver-button"
            onClick={() => navigate('/')}
          >
            ← Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;