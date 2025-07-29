export enum EstadoProceso {
  PENDIENTE = 'pendiente',
  RECOPILACION = 'recopilacion-docs',
  ENVIADO = 'enviado',
  REVISION = 'revision',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  ARCHIVADO = 'archivado'
}

export enum PrioridadProceso {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente'
}

export interface Comentario {
  id: string;
  autor: string;
  contenido: string;
  fecha: string;
  tipo: 'comentario' | 'cambio_estado' | 'documento_agregado';
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: 'requerido' | 'opcional' | 'generado';
  estado: 'pendiente' | 'cargado' | 'aprobado' | 'rechazado';
  url?: string;
  fechaCarga: string;
  validado?: boolean;
  tipoDocumento?: string;
  notas?: string;
}

export interface Proceso {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoProceso;
  fechaCreacion: string;
  fechaInicio: string;
  fechaVencimiento?: string;
  clienteId: string;
  organismoId: string;
  documentos: Documento[];
  progreso: number;
  prioridad: PrioridadProceso;
  etiquetas: string[];
  responsable: string;
  comentarios: Comentario[];
  costos?: number;
  notas?: string;
  plantillaId?: string;
  facturado?: boolean;
}

export interface ProcesoDisplay extends Proceso {
  cliente: string;
  organismo: string;
}

export interface FiltrosProcesos {
  busqueda: string;
  estado: EstadoProceso | 'todos';
  cliente: string;
  organismo: string;
  prioridad: PrioridadProceso | 'todas';
  fechaDesde?: Date;
  fechaHasta?: Date;
  responsable: string;
  etiquetas: string[];
}