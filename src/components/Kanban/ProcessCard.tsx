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
      className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer select-none ${getUrgencyColor()}`}
    >
      {/* Título del proceso */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-2">
          {proceso.titulo}
        </h4>
      </div>

      {/* Cliente y Organismo */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-700">
        <User size={16} className="mr-2 text-blue-600" />
        <span className="font-medium">{proceso.cliente}</span>
      </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building size={16} className="mr-2 text-gray-500" />
          <span>{proceso.organismo}</span>
        </div>
      </div>

      {/* Fecha de vencimiento si existe */}
      {proceso.fechaVencimiento && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-2" />
              <span>Vence: {format(new Date(proceso.fechaVencimiento), 'dd/MM/yy', { locale: es })}</span>
            </div>
            {daysUntilDue !== null && (
              <span className={`px-2 py-1 rounded-full font-medium text-xs ${
                daysUntilDue < 0 ? 'bg-red-100 text-red-800' :
                daysUntilDue <= 3 ? 'bg-orange-100 text-orange-800' :
                daysUntilDue <= 7 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
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
            <div className="flex items-center text-gray-600">
            <DollarSign size={16} className="mr-1" />
              <span>Costo</span>
          </div>
            <span className="font-semibold text-green-600">
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
          className="w-full px-3 py-2 text-xs font-medium rounded border border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          {Object.entries(estadoLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <button
          onClick={handleCardClick}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors"
          title="Ver detalles"
        >
          <Eye size={12} />
          <span>Ver</span>
        </button>
        
        <div className="flex space-x-1">
          <button
            onClick={handleEditClick}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Editar proceso"
          >
            <Edit size={14} />
          </button>
          
        <button
          onClick={handleDeleteClick}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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