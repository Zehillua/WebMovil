export class CreateUsuarioDto {
  tipoUsuario: 'usuario' | 'locatario' | 'repartidor';
  nombre?: string;
  apellido?: string;
  nombreUsuario?: string; // ahora requerido también para repartidor
  correo: string;
  contraseña: string;
  pais?: string;
  ciudad?: string;
  numeroTelefono?: string;
  numeroCasaDepto?: string;
  // Locatario
  nombreLocal?: string;
  numeroLocal?: string;
  comidasStock?: { nombre: string; precio: number; cantidad: number }[];
  ventas?: { comida: string; precio: number }[];
  // Repartidor
  vehiculo?: string;
  patente?: string;
}

// DTO para comida individual (opcional, si lo necesitas en el futuro)
export class ComidaDto {
  nombre: string;
  precio: number;
  cantidad: number;
}
