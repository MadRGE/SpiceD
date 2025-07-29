export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  condicionIva: 'responsable_inscripto' | 'monotributo' | 'exento' | 'consumidor_final';
  fechaRegistro: string;
  activo: boolean;
  documentosImpositivos?: DocumentoImpositivo[];
}

export interface DocumentoImpositivo {
  id: string;
  nombre: string;
  tipo: string;
  url?: string;
  fechaCarga: string;
  estado: 'pendiente' | 'cargado' | 'aprobado' | 'rechazado';
}