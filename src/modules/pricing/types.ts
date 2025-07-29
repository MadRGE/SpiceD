export interface ServicioPrecio {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  organismo?: string;
  categoria: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  plantillaId?: string;
}

export interface NotificacionPrecio {
  id: string;
  tipo: 'nuevo_proceso' | 'nuevo_cliente' | 'nuevo_presupuesto' | 'precio_faltante' | 'proceso_modificado';
  modulo: 'procesos' | 'clientes' | 'presupuestos' | 'facturas' | 'documentos';
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  procesoId?: string;
  clienteId?: string;
  presupuestoId?: string;
  procedimiento?: string;
  organismo?: string;
}