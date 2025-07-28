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
      flag: '🔴',
      color: 'border-red-200 bg-red-50'
    },
    { 
      key: 'recopilacion-docs', 
      label: 'Recopilación', 
      flag: '🟠',
      color: 'border-orange-200 bg-orange-50'
    },
    { 
      key: 'enviado', 
      label: 'Enviado', 
      flag: '🔵',
      color: 'border-blue-200 bg-blue-50'
    },
    { 
      key: 'revision', 
      label: 'En Revisión', 
      flag: '🟣',
      color: 'border-purple-200 bg-purple-50'
    },
    { 
      key: 'aprobado', 
      label: 'Aprobado', 
      flag: '🟢',
      color: 'border-emerald-200 bg-emerald-50'
    },
    { 
      key: 'rechazado', 
      label: 'Rechazado', 
      flag: '🔴',
      color: 'border-red-300 bg-red-100'
    },
    { 
      key: 'archivado', 
      label: 'Archivado', 
      flag: '⚫',
      color: 'border-slate-200 bg-slate-50'
    }
  ];

  const getProcesosPorEstado = (estado: string) => {
    return procesos.filter(p => p.estado === estado);
  };

  return (
    <div className="space-y-6">
      {/* Tablero en Filas */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Tablero de Procesos
          </h3>
          <p className="text-slate-600">
            Gestiona el flujo de trabajo de todos tus procesos de importación/exportación
          </p>
        </div>

        <div className="space-y-4">
          {estados.map(estado => {
            const procesosEstado = getProcesosPorEstado(estado.key);
            
            return (
              <div key={estado.key} className={`rounded-xl border-2 ${estado.color} p-4`}>
                {/* Header de la fila */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{estado.flag}</span>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{estado.label}</h4>
                      <p className="text-sm text-slate-600">{procesosEstado.length} proceso(s)</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-bold text-slate-800">{procesosEstado.length}</span>
                  </div>
                </div>
                
                {/* Procesos en fila horizontal */}
                {procesosEstado.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {procesosEstado.map(proceso => (
                      <ProcessCard
                        key={proceso.id}
                        proceso={proceso}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onChangeState={onChangeState}
                        showStateSelector={false}
                        compact={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-4xl mb-3">{estado.flag}</div>
                    <p className="text-sm font-medium">No hay procesos en este estado</p>
                    <p className="text-xs">Los procesos aparecerán aquí cuando cambien de estado</p>
                  </div>
                )}
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
    </div>
  );
};

export default KanbanBoard;