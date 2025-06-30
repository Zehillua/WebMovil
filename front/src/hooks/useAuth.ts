import { useState, useEffect } from 'react';

interface User {
  _id: string;
  userId?: string;
  nombre: string;
  apellido: string;
  correo: string;
  tipoUsuario: 'usuario' | 'locatario' | 'repartidor';
  isAdmin: boolean;
  nombreUsuario?: string;
  nombreLocal?: string;
  usuarioRepartidor?: string;
  vehiculo?: string;
  patente?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        console.log('🔍 Verificando autenticación con admin-check...');
        
        const response = await fetch('http://localhost:3000/usuarios/me/admin-check', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('✅ Datos del usuario obtenidos (admin-check):', userData);
          console.log('🔑 isAdmin:', userData.isAdmin);
          
          if (isMounted) {
            setUser(userData);
            setError(null);
          }
        } else {
          console.error('❌ Error obteniendo datos admin-check:', response.status);
          
          const fallbackResponse = await fetch('http://localhost:3000/usuarios/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('✅ Datos obtenidos con fallback:', fallbackData);
            
            const userWithAdmin = {
              ...fallbackData,
              isAdmin: false
            };
            
            if (isMounted) {
              setUser(userWithAdmin);
              setError(null);
            }
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tipoUsuario');
            if (isMounted) setError('Sesión expirada');
          }
        }
      } catch (error) {
        console.error('❌ Error verificando autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('tipoUsuario');
        if (isMounted) setError('Error de conexión');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ CORREGIR LA LÓGICA DE ROLES - LOS ADMINS PUEDEN ACCEDER A TODO
  const isAdmin = user?.isAdmin === true;
  const isLocatario = user?.tipoUsuario === 'locatario'; // ✅ NO EXCLUIR ADMIN
  const isRepartidor = user?.tipoUsuario === 'repartidor'; // ✅ NO EXCLUIR ADMIN
  const isUsuario = user?.tipoUsuario === 'usuario'; // ✅ NO EXCLUIR ADMIN
  const isAuthenticated = !!user;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    setUser(null);
    setError(null);
  };

  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    // ✅ PRIORIDAD PARA ADMIN
    if (user.isAdmin === true) {
      console.log('🔑 getDefaultRoute: Usuario es admin -> /admin');
      return '/admin';
    }
    
    // ✅ Si no es admin, usar tipoUsuario
    console.log('👤 getDefaultRoute: No es admin, tipo:', user.tipoUsuario);
    switch (user.tipoUsuario) {
      case 'locatario':
        return '/locatario';
      case 'repartidor':
        return '/repartidor';
      case 'usuario':
      default:
        return '/comprador';
    }
  };

  return {
    user,
    loading,
    error,
    isAdmin,
    isLocatario,
    isRepartidor,
    isUsuario,
    isAuthenticated,
    logout,
    getDefaultRoute
  };
};