// Enums
export enum EstadoProceso {
  PENDIENTE = 'pendiente',
  RECOPILACION = 'recopilacion',
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

// Interfaces básicas
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  cuit: string;
  fechaRegistro: string;
  activo: boolean;
  documentosImpositivos?: {
    id: string;
    nombre: string;
    tipo: string;
    url?: string;
    fechaCarga: string;
    estado: 'pendiente' | 'cargado' | 'aprobado' | 'rechazado';
  }[];
}

export interface Organismo {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb?: string;
  contactoPrincipal: string;
  activo: boolean;
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
}

export interface Proceso {
  id: string;
  titulo: string;
  tipo?: string;
  descripcion: string;
  producto?: string;
  estado: EstadoProceso;
  fechaCreacion: string;
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
  necesitaMuestra?: boolean;
  observaciones?: {
    id: string;
    texto: string;
    fecha: Date;
    usuario: string;
  }[];
  proveedoresAsociados?: Proveedor[];
  facturaId?: string;
  presupuestoId?: string;
}

export interface ProcesoDisplay extends Proceso {
  cliente: string;
  organismo: string;
  fechaInicio: string;
}

export interface Factura {
  id: string;
  numero: string;
  clienteId: string;
  cliente: Cliente | string;
  tipo: 'cliente' | 'proveedor' | 'organismo';
  quienPaga?: 'nosotros' | 'cliente';
  proveedor?: string;
  organismo?: string;
  fecha: string | Date;
  fechaVencimiento: string | Date;
  items: ItemFactura[];
  subtotal: number;
  iva: number;
  total?: number;
  estado: 'borrador' | 'enviada' | 'pagada' | 'vencida';
  pagos?: PagoFactura[];
  notas?: string;
  fechaCreacion?: string | Date;
  fechaActualizacion?: string | Date;
  archivoAfip?: string;
  historial?: HistorialFactura[];
  procesoId?: string;
  presupuestoId?: string;
}

export interface PagoFactura {
  id: string;
  facturaId: string;
  monto: number;
  fecha: Date;
  tipo: 'parcial' | 'total';
  metodoPago: string;
  notas?: string;
}
export interface HistorialFactura {
  id: string;
  accion: 'creacion' | 'edicion' | 'eliminacion' | 'cambio_estado';
  fecha: Date;
  usuario: string;
  descripcion: string;
  datosAnteriores?: any;
  datosNuevos?: any;
}

export interface Proveedor {
  id: string;
  nombre: string;
  cuit: string;
  email: string;
  telefono: string;
  direccion: string;
  servicios: string[];
  activo: boolean;
  fechaRegistro: string;
}

export interface FacturaProveedor {
  id: string;
  proveedorId: string;
  proveedor: string;
  numero: string;
  fecha: string;
  fechaVencimiento: string;
  concepto: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida';
  archivo?: string;
}

export interface ServicioPrecio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
  fechaUltimaActualizacion: string;
  historialPrecios: {
    fecha: string;
    precio: number;
    motivo: string;
  }[];
}

export interface NotificacionPrecio {
  id: string;
  tipo: 'nuevo_proceso' | 'nuevo_cliente' | 'nuevo_presupuesto' | 'precio_faltante' | 'proceso_modificado' | 'observacion_agregada';
  modulo: 'procesos' | 'clientes' | 'presupuestos' | 'facturas' | 'documentos';
  titulo: string;
  precioAnterior?: number;
  precioNuevo: number;
  porcentajeCambio?: number;
  fecha: string;
  leida: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  procesoId?: string;
  clienteId?: string;
  presupuestoId?: string;
  mensaje: string;
}

export interface ValidacionIA {
  id: string;
  documentoId: string;
  nombreDocumento: string;
  estado: 'procesando' | 'completado' | 'error';
  resultado?: {
    valido: boolean;
    confianza: number;
    observaciones: string[];
    camposExtraidos: Record<string, any>;
  };
  fechaValidacion: string;
  tiempoProcessamiento?: number;
}

export interface Presupuesto {
  id: string;
  numero: string;
  clienteId: string;
  cliente: Cliente;
  tipoOperacion: string;
  descripcion: string;
  items: ItemFactura[];
  subtotal: number;
  iva: number;
  total?: number;
  estado: 'borrador' | 'enviado' | 'aprobado' | 'rechazado' | 'vencido';
  fechaCreacion: Date;
  fechaVencimiento: Date;
  notas?: string;
  procesoIds?: string[];
  facturaAsociada?: string;
  proveedorCostos?: {
    proveedorId: string;
    concepto: string;
    monto: number;
  }[];
}

export interface ItemFactura {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface FiltrosProcesos {
  busqueda: string;
  estado: EstadoProceso | 'todos';
  cliente: string;
  organismo: string;
  prioridad: PrioridadProceso | 'todas';
  fechaDesde?: string;
  fechaHasta?: string;
  responsable: string;
  etiquetas: string[];
}