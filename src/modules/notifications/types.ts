export interface Notificacion {
  id: string;
  tipo: 'info' | 'exito' | 'advertencia' | 'error' | 'nuevo_proceso' | 'documento_subido';
  modulo: string;
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  procesoId?: string;
  clienteId?: string;
  presupuestoId?: string;
}