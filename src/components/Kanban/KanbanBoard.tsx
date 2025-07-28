import React from 'react';
import { EstadoProceso, ProcesoDisplay } from '../../types';
import ProcessCard from './ProcessCard';

interface KanbanBoardProps {
  procesos: ProcesoDisplay[];
  onView: (proceso: ProcesoDisplay) => void;
  onEdit: (proceso: ProcesoDisplay) => void;
  onDelete: (procesoId: string) => void;
  onChangeState: (procesoId: string, newState: EstadoProceso) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  procesos,
  onView,
  onEdit,
  onDelete,
  onChangeState
}) => {
  const estados = [
    { 
      key: 'pendiente', 
      label: 'Pendiente', 
      color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
      headerColor: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: '⏳'
    },
    { 
      key: 'recopilacion-docs', 
      label: 'Recopilación de Documentos', 
      color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
      headerColor: 'bg-gradient-to-r from-orange-500 to-orange-600',
      icon: '📄'
    },
    { 
      key: 'enviado', 
      label: 'Enviado al Organismo', 
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      headerColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: '📤'
    },
    { 
      key: 'revision', 
      label: 'En Revisión', 
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      headerColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: '🔍'
    },
    { 
      key: 'aprobado', 
      label: 'Aprobado', 
      color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
      headerColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      icon: '✅'
    },
    { 
      key: 'rechazado', 
      label: 'Rechazado', 
      color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
      headerColor: 'bg-gradient-to-r from-red-600 to-pink-600',
      icon: '❌'
    },
    { 
      key: 'archivado', 
      label: 'Archivado', 
      color: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
      headerColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
      icon: '📁'
    }
  ];

  const getProcesosPorEstado = (estado: string) => {
    return procesos.filter(p => p.estado === estado);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Tablero de Procesos
        </h3>
        <p className="text-slate-600">
          Gestiona el flujo de trabajo de todos tus procesos de importación/exportación
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 min-h-[600px]">
        {estados.map(estado => {
          const procesosEstado = getProcesosPorEstado(estado.key);
          
          return (
            <div key={estado.key} className={`rounded-2xl border-2 ${estado.color} backdrop-blur-sm shadow-lg`}>
              {/* Header de la columna */}
              <div className={`${estado.headerColor} text-white p-4 rounded-t-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{estado.icon}</span>
                    <h4 className="font-bold text-sm">{estado.label}</h4>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {procesosEstado.length}
                  </span>
                </div>
              </div>
              
              {/* Contenido de la columna */}
              <div className="p-4">
                <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin">
                  {procesosEstado.map(proceso => (
                    <ProcessCard
                      key={proceso.id}
                      proceso={proceso}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onChangeState={onChangeState}
                    />
                  ))}
                </div>
                
                {procesosEstado.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <div className="text-4xl mb-3">{estado.icon}</div>
                    <p className="text-sm font-medium">No hay procesos</p>
                    <p className="text-xs">Los procesos aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen del tablero */}
      <div className="mt-6 bg-slate-50 rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-800">{procesos.length}</div>
            <div className="text-sm text-slate-600">Total Procesos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {procesos.filter(p => !['aprobado', 'archivado', 'rechazado'].includes(p.estado)).length}
            </div>
            <div className="text-sm text-slate-600">En Progreso</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {procesos.filter(p => p.estado === 'aprobado').length}
            </div>
            <div className="text-sm text-slate-600">Completados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((procesos.filter(p => p.estado === 'aprobado').length / Math.max(procesos.length, 1)) * 100)}%
            </div>
            <div className="text-sm text-slate-600">Tasa de Éxito</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;