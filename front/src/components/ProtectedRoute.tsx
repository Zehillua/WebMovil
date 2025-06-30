import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'usuario' | 'locatario' | 'repartidor';
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requireAdmin = false 
}) => {
  const { user, loading, isAdmin, isAuthenticated, getDefaultRoute } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        🔒 Verificando permisos...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ SI REQUIERE ADMIN Y NO ES ADMIN
  if (requireAdmin && !isAdmin) {
    console.log('❌ Acceso denegado: Se requiere admin, redirigiendo a:', getDefaultRoute());
    return <Navigate to={getDefaultRoute()} replace />;
  }

  // ✅ SI REQUIERE ROL ESPECÍFICO Y NO LO TIENE - PERO LOS ADMINS SIEMPRE PUEDEN ACCEDER
  if (requiredRole && user.tipoUsuario !== requiredRole && !isAdmin) {
    console.log(`❌ Acceso denegado: Se requiere rol ${requiredRole}, usuario tiene ${user.tipoUsuario}, admin: ${isAdmin}`);
    return <Navigate to={getDefaultRoute()} replace />;
  }

  // ✅ DEBUGGING PARA EL CARRITO
  console.log('✅ ProtectedRoute - Acceso permitido:', {
    requiredRole,
    userTipoUsuario: user.tipoUsuario,
    isAdmin,
    requireAdmin
  });

  return <>{children}</>;
};

export default ProtectedRoute;