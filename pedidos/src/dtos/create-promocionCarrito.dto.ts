export class CreatePromocionCarritoDto {
  idPromocion: string;
  idLocatario: string;
  nombreLocal: string;
  nombrePromocion: string;
  cantidad: number;
  precio: number;
  imagenUrl?: string;
  tipo?: string;
  comidas?: {
    comidaId: string;
    nombre: string;
    cantidad: number;
    precioOriginal: number;
  }[];
}