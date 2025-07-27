import { useState } from 'react';
import { Proceso, EstadoProceso } from '../types';

// Datos de ejemplo para procesos
const procesosIniciales: Proceso[] = [
  {
    id: '1',
    titulo: 'Importación de Maquinaria Industrial',
    descripcion: 'Proceso de importación de equipos industriales desde Alemania',
    producto: 'Maquinaria Industrial',
    estado: 'en-progreso',
    fechaCreacion: '2024-01-15',
    fechaInicio: '2024-01-15',
    fechaVencimiento: '2024-03-15',
    clienteId: '1',
    organismoId: '1',
    documentos: [
      { id: '1', nombre: 'Factura Comercial', tipo: 'factura', estado: 'validado', fechaCarga: '2024-01-16' },
      { id: '2', nombre: 'Lista de Empaque', tipo: 'lista-empaque', estado: 'pendiente', fechaCarga: '2024-01-17' }
    ],
    progreso: 65,
    prioridad: 'alta',
    etiquetas: ['importación', 'maquinaria', 'alemania'],
    responsable: 'Juan Pérez',
    costos: 15000,
    plantillaId: 'anmat-rne',
    facturado: false,
    comentarios: [
      { id: '1', autor: 'Juan Pérez', texto: 'Documentos iniciales cargados', fecha: '2024-01-16' }
    ]
  },
  {
    id: '2',
    titulo: 'Exportación de Productos Agrícolas',
    descripcion: 'Exportación de soja y trigo a Brasil',
    producto: 'Productos Agrícolas',
    estado: 'pendiente',
    fechaCreacion: '2024-01-20',
    fechaInicio: '2024-01-20',
    fechaVencimiento: '2024-02-28',
    clienteId: '2',
    organismoId: '2',
    documentos: [
      { id: '3', nombre: 'Certificado Fitosanitario', tipo: 'certificado', estado: 'pendiente', fechaCarga: '2024-01-21' }
    ],
    progreso: 25,
    prioridad: 'media',
    etiquetas: ['exportación', 'agrícola', 'brasil'],
    responsable: 'María García',
    costos: 8500,
    plantillaId: 'senasa-afidi',
    facturado: false,
    comentarios: []
  },
  {
    id: '3',
    titulo: 'Importación de Componentes Electrónicos',
    descripcion: 'Importación de semiconductores desde China',
    producto: 'Componentes Electrónicos',
    estado: 'completado',
    fechaCreacion: '2024-01-10',
    fechaInicio: '2024-01-10',
    fechaVencimiento: '2024-02-10',
    clienteId: '3',
    organismoId: '1',
    documentos: [
      { id: '4', nombre: 'Factura Comercial', tipo: 'factura', estado: 'validado', fechaCarga: '2024-01-11' },
      { id: '6', nombre: 'Certificado de Origen', tipo: 'certificado', estado: 'validado', fechaCarga: '2024-01-12' },
      { id: '7', nombre: 'Póliza de Seguro', tipo: 'logistica', estado: 'aprobado', fechaCarga: '2024-01-13' }
    ],
    progreso: 100,
    prioridad: 'alta',
    etiquetas: ['importación', 'electrónicos', 'china'],
    responsable: 'Carlos López',
    costos: 12000,
    facturado: true,
    comentarios: [
      { id: '2', autor: 'Carlos López', texto: 'Proceso completado exitosamente', fecha: '2024-02-10' }
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

  const actualizarProcesoCompleto = (procesoActualizado: any) => {
    setProcesos(prev =>
      prev.map(proceso =>
        proceso.id === procesoActualizado.id ? {
          ...procesoActualizado,
          comentarios: [
            ...(procesoActualizado.comentarios || proceso.comentarios || []),
            {
              id: Date.now().toString(),
              autor: 'Usuario Actual',
              contenido: `Proceso modificado completamente`,
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

  const obtenerProcesosPorCliente = (clienteId: string) => {
    return procesos.filter(proceso => proceso.clienteId === clienteId);
  };

  const obtenerProcesosPorEstado = (estado: EstadoProceso) => {
    return procesos.filter(proceso => proceso.estado === estado);
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
    actualizarProcesoCompleto,
    eliminarProceso,
    obtenerProcesoPorId,
    obtenerProcesosPorCliente,
    obtenerProcesosPorEstado,
    cambiarEstadoProceso,
    actualizarProgreso,
  };
};