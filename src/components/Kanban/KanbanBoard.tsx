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
    { key: 'pendiente', label: 'Pendiente', color: 'bg-red-100 border-red-300' },
    { key: 'recopilacion-docs', label: 'Recopilación', color: 'bg-orange-100 border-orange-300' },
    { key: 'enviado', label: 'Enviado', color: 'bg-blue-100 border-blue-300' },
    { key: 'revision', label: 'En Revisión', color: 'bg-purple-100 border-purple-300' },
    { key: 'aprobado', label: 'Aprobado', color: 'bg-green-100 border-green-300' },
    { key: 'rechazado', label: 'Rechazado', color: 'bg-red-100 border-red-300' },
    { key: 'archivado', label: 'Archivado', color: 'bg-gray-100 border-gray-300' }
  ];

  const getProcesosPorEstado = (estado: string) => {
    return procesos.filter(p => p.estado === estado);
  };

  return (
    <div className="card-modern p-6">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 min-h-96">
        {estados.map(estado => {
          const procesosEstado = getProcesosPorEstado(estado.key);
          
          return (
            <div key={estado.key} className={`rounded-2xl border-2 ${estado.color} p-4 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">{estado.label}</h3>
                <span className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium shadow-sm">
                  {procesosEstado.length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No hay procesos</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;