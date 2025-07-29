import { useState } from 'react';
import { Proceso, EstadoProceso } from '../types';

const procesosIniciales: Proceso[] = [
  {
    id: '1',
    titulo: 'Importación de Maquinaria Industrial',
    descripcion: 'Proceso de importación de equipos industriales desde Alemania',
    estado: EstadoProceso.ENVIADO,
    fechaCreacion: '2024-01-15',
    fechaInicio: '2024-01-15',
    fechaVencimiento: '2024-03-15',
    clienteId: '1',
    organismoId: '1',
    documentos: [
      { id: '1', nombre: 'Factura Comercial', tipo: 'requerido', estado: 'aprobado', fechaCarga: '2024-01-16', validado: true },
      { id: '2', nombre: 'Lista de Empaque', tipo: 'requerido', estado: 'pendiente', fechaCarga: '2024-01-17', validado: false }
    ],
    progreso: 65,
    prioridad: 'alta' as any,
    etiquetas: ['importación', 'maquinaria', 'alemania'],
    responsable: 'Juan Pérez',
    costos: 15000,
    plantillaId: 'anmat-rne',
    facturado: false,
    comentarios: [
      { id: '1', autor: 'Juan Pérez', contenido: 'Documentos iniciales cargados', fecha: '2024-01-16', tipo: 'comentario' }
    ]
  }
];

export const useProcesos = () => {
  const [procesos, setProcesos] = useState<Proceso[]>(procesosIniciales);

  const agregarProceso = (nuevoProceso: Omit<Proceso, 'id'>) => {
    const proceso: Proceso = {
      ...nuevoProceso,
      id: Date.now().toString(),
    };
    setProcesos(prev => [...prev, proceso]);
  };

  const actualizarProceso = (id: string, datosActualizados: Partial<Proceso>) => {
    setProcesos(prev =>
      prev.map(proceso =>
        proceso.id === id ? { 
          ...proceso, 
          ...datosActualizados,
          comentarios: [
            ...(proceso.comentarios || []),
            {
              id: Date.now().toString(),
              autor: 'Usuario Actual',
              contenido: `Proceso actualizado: ${Object.keys(datosActualizados).join(', ')}`,
              fecha: new Date().toISOString(),
              tipo: 'cambio_estado'
            }
          ]
        } : proceso
      )
    );
  };

  const eliminarProceso = (id: string) => {
    setProcesos(prev => prev.filter(proceso => proceso.id !== id));
  };

  const obtenerProcesoPorId = (id: string) => {
    return procesos.find(proceso => proceso.id === id);
  };

  const cambiarEstadoProceso = (id: string, nuevoEstado: EstadoProceso) => {
    actualizarProceso(id, { estado: nuevoEstado });
  };

  const actualizarProgreso = (id: string, progreso: number) => {
    actualizarProceso(id, { progreso });
  };

  return {
    procesos,
    agregarProceso,
    actualizarProceso,
    eliminarProceso,
    obtenerProcesoPorId,
    cambiarEstadoProceso,
    actualizarProgreso,
  };
};