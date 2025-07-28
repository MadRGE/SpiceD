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
    if (!daysUntilDue) return 'border-gray-200 bg-white';
    if (daysUntilDue < 0) return 'border-red-400 bg-red-50';
    if (daysUntilDue <= 3) return 'border-orange-400 bg-orange-50';
    if (daysUntilDue <= 7) return 'border-yellow-400 bg-yellow-50';
    return 'border-gray-200 bg-white';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('select')) {
      return;
    }
    onView(proceso);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(proceso);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que quieres eliminar el proceso "${proceso.titulo}"?`)) {
      onDelete(proceso.id);
    }
  };

  const estadoLabels = {
    pendiente: 'Pendiente',
    'recopilacion-docs': 'Recopilación',
    enviado: 'Enviado',
    revision: 'Revisión',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    archivado: 'Archivado'
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${getUrgencyColor()} border-2 rounded-xl p-5 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 min-h-[280px] flex flex-col`}
    >
      {/* Header con título */}
      <div className="mb-4">
        <h4 className="font-bold text-lg text-slate-800 leading-tight mb-2 line-clamp-2">
          {proceso.titulo}
        </h4>
        {proceso.descripcion && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {proceso.descripcion}
          </p>
        )}
      </div>

      {/* Cliente y Organismo */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center bg-blue-50 rounded-lg p-2">
          <User size={18} className="mr-3 text-blue-600" />
          <div>
            <span className="text-xs text-blue-600 font-medium">Cliente</span>
            <p className="font-semibold text-slate-800">{proceso.cliente}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-purple-50 rounded-lg p-2">
          <Building size={18} className="mr-3 text-purple-600" />
          <div>
            <span className="text-xs text-purple-600 font-medium">Organismo</span>
            <p className="font-semibold text-slate-800">{proceso.organismo}</p>
          </div>
        </div>
      </div>

      {/* Fechas importantes */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-slate-600">
            <Calendar size={16} className="mr-2" />
            <span>Inicio: {format(new Date(proceso.fechaInicio), 'dd/MM/yy', { locale: es })}</span>
          </div>
        </div>
        
        {proceso.fechaVencimiento && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-slate-600 text-sm">
              <Clock size={16} className="mr-2" />
              <span>Vence: {format(new Date(proceso.fechaVencimiento), 'dd/MM/yy', { locale: es })}</span>
            </div>
            {daysUntilDue !== null && (
              <span className={`px-3 py-1 rounded-full font-bold text-xs text-white shadow-md ${
                daysUntilDue < 0 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                daysUntilDue <= 3 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                daysUntilDue <= 7 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}>
                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d vencido` :
                 daysUntilDue === 0 ? 'Vence hoy' :
                 daysUntilDue === 1 ? 'Vence mañana' :
                 `${daysUntilDue} días`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progreso visual */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">Progreso</span>
          <span className="text-sm font-bold text-slate-800">{proceso.progreso}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              proceso.progreso >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
              proceso.progreso >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${proceso.progreso}%` }}
          />
        </div>
      </div>

      {/* Documentos */}
      {totalDocumentos > 0 && (
        <div className="mb-4 bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm font-semibold text-slate-700">
              <Paperclip size={16} className="mr-2" />
              <span>Documentos</span>
            </div>
            <span className="text-sm font-bold text-slate-800">
              {documentosValidados}/{totalDocumentos}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {documentosValidados > 0 && (
              <div className="flex items-center text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                <CheckCircle size={12} className="mr-1" />
                <span>{documentosValidados} validados</span>
              </div>
            )}
            {(totalDocumentos - documentosValidados) > 0 && (
              <div className="flex items-center text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                <AlertTriangle size={12} className="mr-1" />
                <span>{totalDocumentos - documentosValidados} pendientes</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Costo */}
      {proceso.costos && proceso.costos > 0 && (
        <div className="mb-4 bg-emerald-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-semibold text-emerald-700">
              <DollarSign size={16} className="mr-2" />
              <span>Costo Estimado</span>
            </div>
            <span className="text-lg font-bold text-emerald-800">
              ${proceso.costos.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      )}

      {/* Notas */}
      {proceso.notas && (
        <div className="mb-4 bg-blue-50 rounded-lg p-3">
          <div className="flex items-center text-sm font-semibold text-blue-700 mb-2">
            <FileText size={16} className="mr-2" />
            <span>Notas</span>
          </div>
          <p className="text-sm text-blue-800 line-clamp-2">
            {proceso.notas}
          </p>
        </div>
      )}

      {/* Spacer para empujar botones al final */}
      <div className="flex-1"></div>

      {/* Selector de Estado */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-2">Estado del Proceso</label>
        <select
          value={proceso.estado}
          onChange={handleStateChange}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          {Object.entries(estadoLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center pt-3 border-t-2 border-slate-100">
        <button
          onClick={handleCardClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          title="Ver detalles completos"
        >
          <Eye size={16} />
          <span className="font-semibold">Ver Detalles</span>
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={handleEditClick}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
            title="Editar proceso"
          >
            <Edit size={18} />
          </button>
          
          <button
            onClick={handleDeleteClick}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
            title="Eliminar proceso"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessCard;