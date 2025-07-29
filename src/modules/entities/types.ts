export interface Organismo {
  id: string;
  nombre: string;
  tipo: 'publico' | 'privado';
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  sitioWeb?: string;
  tiempoRespuestaPromedio?: number;
  costoPromedio?: number;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Proveedor {
  id: string;
  nombre: string;
  categoria: 'logistica' | 'legal' | 'gobierno' | 'otro';
  cuit?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface FacturaProveedor {
  id: string;
  proveedorId: string;
  proveedor: Proveedor;
  numero: string;
  fecha: Date;
  fechaVencimiento: Date;
  concepto: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida';
  procesoId?: string;
  clienteId?: string;
  notas?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}