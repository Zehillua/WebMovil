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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      // Guardar token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('tipoUsuario', data.tipoUsuario);
      
      try {
        // ✅ USAR EL NUEVO ENDPOINT ESPECÍFICO PARA ADMIN
        console.log('📞 Haciendo petición a /usuarios/me/admin-check...');
        const adminResponse = await fetch('http://localhost:3000/usuarios/me/admin-check', {
          headers: { Authorization: `Bearer ${data.access_token}` }
        });
        
        console.log('📊 Respuesta del servidor admin-check:', adminResponse.status);
        
        if (adminResponse.ok) {
          const userData = await adminResponse.json();
          console.log('👤 Datos COMPLETOS del usuario (admin-check):', userData);
          console.log('🔑 Valor de isAdmin:', userData.isAdmin);
          console.log('🔑 Tipo de isAdmin:', typeof userData.isAdmin);
          console.log('🔑 String de isAdmin:', String(userData.isAdmin));
          
          // ✅ DEBUGGING MÁS DETALLADO
          console.log('🔍 Comparación userData.isAdmin === true:', userData.isAdmin === true);
          console.log('🔍 Comparación userData.isAdmin == true:', userData.isAdmin == true);
          console.log('🔍 Comparación String(userData.isAdmin) === "true":', String(userData.isAdmin) === "true");
          console.log('🔍 Comparación Boolean(userData.isAdmin):', Boolean(userData.isAdmin));
          
          // ✅ VERIFICAR ADMIN CON MÚLTIPLES CONDICIONES
          const esAdmin = userData.isAdmin === true || 
                        userData.isAdmin === 'true' || 
                        String(userData.isAdmin) === 'true' ||
                        Boolean(userData.isAdmin) === true;
          
          console.log('🔑 Resultado final esAdmin:', esAdmin);
          
          if (esAdmin) {
            console.log('✅ CONFIRMADO: Usuario es ADMIN - Redirigiendo a /admin');
            console.log('🚀 Ejecutando navigate("/admin")...');
            navigate('/admin', { replace: true });
            console.log('✅ Navigate ejecutado');
            return; // ✅ ASEGURARSE DE SALIR AQUÍ
          }
          
          // ✅ ESTE CÓDIGO SOLO SE EJECUTA SI NO ES ADMIN
          console.log('❌ Usuario NO es admin');
          console.log('👤 Verificando tipoUsuario:', userData.tipoUsuario);
          
          switch (userData.tipoUsuario) {
            case 'usuario':
              console.log('➡️ Redirigiendo a /comprador');
              navigate('/comprador', { replace: true });
              break;
            case 'locatario':
              console.log('➡️ Redirigiendo a /locatario');
              navigate('/locatario', { replace: true });
              break;
            case 'repartidor':
              console.log('➡️ Redirigiendo a /repartidor');
              navigate('/repartidor', { replace: true });
              break;
            default:
              console.log('➡️ Tipo no reconocido, redirigiendo a /comprador');
              navigate('/comprador', { replace: true });
          }
        } else {
          console.error('❌ Error en admin-check, usando datos del login');
          const errorText = await adminResponse.text();
          console.error('❌ Texto del error:', errorText);
          
          // Fallback usando los datos del login
          const rutasPorTipo: Record<string, string> = {
            usuario: '/comprador',
            locatario: '/locatario',
            repartidor: '/repartidor',
          };
          const ruta = rutasPorTipo[data.tipoUsuario] || '/comprador';
          navigate(ruta, { replace: true });
        }
      } catch (error) {
        console.error('❌ Error en petición admin-check:', error);
        
        // Fallback usando los datos del login
        const rutasPorTipo: Record<string, string> = {
          usuario: '/comprador',
          locatario: '/locatario',
          repartidor: '/repartidor',
        };
        const ruta = rutasPorTipo[data.tipoUsuario] || '/comprador';
        navigate(ruta, { replace: true });
      }
    },
    onError: (error: any) => {
      console.error('❌ Error en login:', error);
      setError('Error en el login: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate({ correo, clave });
  };

  return (
    <div className="login-container">
      <div className="login-inner">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-icon">
            <img src="https://img.icons8.com/ios-filled/100/ffffff/user.png" alt="User" />
          </div>

          {error && (
            <div className="error-message" style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
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