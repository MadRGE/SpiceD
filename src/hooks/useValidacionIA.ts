import { useState, useCallback } from 'react';

// Tipos para validación IA
export interface ValidacionIA {
  id: string;
  documentoId: string;
  estado: 'pendiente' | 'validando' | 'aprobado' | 'rechazado' | 'error';
  confianza: number;
  observaciones: string[];
  fechaValidacion: Date;
  tiempoValidacion?: number;
}

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
  presupuestoId?: string;
}

export const useValidacionIA = () => {
  const [validaciones, setValidaciones] = useState<ValidacionIA[]>([]);
  const [loading, setLoading] = useState(false);
  const [notificacionesSistema, setNotificacionesSistema] = useState<Notificacion[]>([]);

  // Simular validación de documento con IA
  const validarDocumento = useCallback(async (documentoId: string, archivo: File) => {
    setLoading(true);
    
    try {
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resultado de validación
      const confianza = Math.random() * 100;
      const esValido = confianza > 70;
      
      const nuevaValidacion: ValidacionIA = {
        id: Date.now().toString(),
        documentoId,
        estado: esValido ? 'aprobado' : 'rechazado',
        confianza,
        observaciones: esValido 
          ? ['Documento válido', 'Formato correcto', 'Información completa']
          : ['Documento incompleto', 'Formato no válido', 'Información faltante'],
        fechaValidacion: new Date(),
        tiempoValidacion: 2000
      };

      setValidaciones(prev => [...prev, nuevaValidacion]);
      
      // Agregar notificación
      const notificacion: Notificacion = {
        id: Date.now().toString(),
        tipo: esValido ? 'exito' : 'error',
        modulo: 'validacion-ia',
        titulo: 'Validación IA completada',
        mensaje: `Documento ${esValido ? 'aprobado' : 'rechazado'} con ${confianza.toFixed(1)}% de confianza`,
        fecha: new Date(),
        leida: false,
        prioridad: esValido ? 'baja' : 'alta'
      };

      setNotificacionesSistema(prev => [...prev, notificacion]);
      
      return nuevaValidacion;
    } catch (error) {
      const errorValidacion: ValidacionIA = {
        id: Date.now().toString(),
        documentoId,
        estado: 'error',
        confianza: 0,
        observaciones: ['Error en la validación', 'Intente nuevamente'],
        fechaValidacion: new Date()
      };

      setValidaciones(prev => [...prev, errorValidacion]);
      return errorValidacion;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reintentar validación
  const reintentarValidacion = useCallback(async (validacionId: string) => {
    const validacion = validaciones.find(v => v.id === validacionId);
    if (!validacion) return;

    // Actualizar estado a pendiente
    setValidaciones(prev => 
      prev.map(v => 
        v.id === validacionId 
          ? { ...v, estado: 'validando' as const }
          : v
      )
    );

    // Simular nueva validación
    setTimeout(() => {
      const confianza = Math.random() * 100;
      const esValido = confianza > 70;

      setValidaciones(prev => 
        prev.map(v => 
          v.id === validacionId 
            ? {
                ...v,
                estado: esValido ? 'aprobado' : 'rechazado',
                confianza,
                observaciones: esValido 
                  ? ['Documento válido', 'Formato correcto', 'Información completa']
                  : ['Documento incompleto', 'Formato no válido', 'Información faltante'],
                fechaValidacion: new Date()
              }
            : v
        )
      );
    }, 1500);
  }, [validaciones]);

  // Obtener validación por documento
  const obtenerValidacionPorDocumento = useCallback((documentoId: string) => {
    return validaciones.find(v => v.documentoId === documentoId);
  }, [validaciones]);

  return {
    validaciones,
    loading,
    notificacionesSistema,
    setNotificacionesSistema,
    validarDocumento,
    reintentarValidacion,
    obtenerValidacionPorDocumento
  };
};