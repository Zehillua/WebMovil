// ✅ FUNCIONES HELPER PARA NORMALIZAR DIRECCIONES
export const normalizarDireccion = (direccion: any): string => {
  if (!direccion) return '';
  
  if (Array.isArray(direccion)) {
    return direccion
      .filter((item: any) => item && typeof item === 'string' && item.trim() !== '')
      .join(', ');
  }
  
  if (typeof direccion === 'string') {
    return direccion.trim();
  }
  
  return String(direccion);
};

// ✅ FUNCIÓN PARA FORMATEAR DIRECCIÓN CON FALLBACK
export const formatearDireccion = (direccion: any, fallback: string = 'Dirección no disponible'): string => {
  const direccionNormalizada = normalizarDireccion(direccion);
  return direccionNormalizada || fallback;
};
