import React from 'react';
import { 
  Edit, 
  Trash2, 
  Paperclip, 
  Calendar, 
  User, 
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProcesoDisplay, EstadoProceso } from '../../types';

interface ProcessCardProps {
  proceso: ProcesoDisplay;
  onView: (process: ProcesoDisplay) => void;
  onEdit: (process: ProcesoDisplay) => void;
  onDelete: (processId: string) => void;
  onChangeState: (processId: string, newState: EstadoProceso) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  proceso,
  onView,
  onEdit,
  onDelete,
  onChangeState
}) => {
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeState(proceso.id, e.target.value as EstadoProceso);
  };

  const documentosValidados = proceso.documentos?.filter(doc => doc.validado).length || 0;
  const totalDocumentos = proceso.documentos?.length || 0;

  const getDaysUntilDue = () => {
    if (!proceso.fechaVencimiento) return null;
    const today = new Date();
    const dueDate = new Date(proceso.fechaVencimiento);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  const getUrgencyColor = () => {
    if (!daysUntilDue) return 'border-gray-200';
    if (daysUntilDue < 0) return 'border-red-500 bg-red-50';
    if (daysUntilDue <= 3) return 'border-orange-500 bg-orange-50';
    if (daysUntilDue <= 7) return 'border-yellow-500 bg-yellow-50';
    return 'border-gray-200';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    console.log('🎯 Viendo proceso:', proceso.id);
    onView(proceso);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('✏️ Editando proceso:', proceso.id);
    onEdit(proceso);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que quieres eliminar el proceso "${proceso.tipo}"?`)) {
      onDelete(proceso.id);
    }
  };

  const estadoLabels = {
    pendiente: 'Pendiente',
    recopilacion: 'Recopilación',
    enviado: 'Enviado',
    revision: 'Revisión',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    archivado: 'Archivado'
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card-modern p-4 hover-lift cursor-pointer select-none ${getUrgencyColor()}`}
    >
      {/* Título del proceso */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm text-slate-800 line-clamp-2 mb-2">
          {proceso.titulo}
        </h4>
      </div>

      {/* Cliente y Organismo */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-slate-700">
        <User size={16} className="mr-2 text-blue-500" />
        <span className="font-medium">{proceso.cliente}</span>
      </div>
        <div className="flex items-center text-sm text-slate-600">
          <Building size={16} className="mr-2 text-slate-500" />
          <span>{proceso.organismo}</span>
        </div>
      </div>

      {/* Fecha de vencimiento si existe */}
      {proceso.fechaVencimiento && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-slate-600">
              <Clock size={14} className="mr-2" />
              <span>Vence: {format(new Date(proceso.fechaVencimiento), 'dd/MM/yy', { locale: es })}</span>
            </div>
            {daysUntilDue !== null && (
              <span className={`px-2 py-1 rounded-full font-medium text-xs text-white shadow-sm ${
                daysUntilDue < 0 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                daysUntilDue <= 3 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                daysUntilDue <= 7 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}>
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} días vencido` :
                 daysUntilDue === 0 ? 'Vence hoy' :
                 daysUntilDue === 1 ? 'Vence mañana' :
                 `${daysUntilDue} días`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Documentos - Solo si hay documentos */}
      {totalDocumentos > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center">
              <Paperclip size={14} className="mr-1" />
              <span>Documentos</span>
            </div>
            <span className="font-medium">
              {documentosValidados}/{totalDocumentos}
            </span>
          </div>
        </div>
      )}

      {/* Costo - Solo si existe */}
      {proceso.costos && proceso.costos > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-600">
            <DollarSign size={16} className="mr-1" />
              <span>Costo</span>
          </div>
            <span className="font-semibold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            ${proceso.costos.toLocaleString('es-AR')}
          </span>
        </div>
        </div>
      )}

      {/* Selector de Estado */}
      <div className="mb-3">
        <select
          value={proceso.estado}
          onChange={handleStateChange}
          onClick={(e) => e.stopPropagation()}
          className="input-modern w-full text-xs font-medium"
        >
          {Object.entries(estadoLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
        <button
          onClick={handleCardClick}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          title="Ver detalles"
        >
          <Eye size={12} />
          <span>Ver</span>
        </button>
        
        <div className="flex space-x-1">
          <button
            onClick={handleEditClick}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar proceso"
          >
            <Edit size={14} />
          </button>
          
        <button
          onClick={handleDeleteClick}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Eliminar proceso"
        >
            <Trash2 size={14} />
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessCard;