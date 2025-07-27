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
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProcesoDisplay, EstadoProceso } from '../../types';

interface ProcessCardProps {
  proceso: ProcesoDisplay;
  onEdit: (process: ProcesoDisplay) => void;
  onDelete: (processId: string) => void;
  onChangeState: (processId: string, newState: EstadoProceso) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  proceso,
  onEdit,
  onDelete,
  onChangeState
}) => {

  const estados = Object.values(EstadoProceso);
  const currentIndex = estados.indexOf(proceso.estado);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < estados.length - 1;

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canMoveLeft) {
      onChangeState(proceso.id, estados[currentIndex - 1]);
    }
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canMoveRight) {
      onChangeState(proceso.id, estados[currentIndex + 1]);
    }
  };

  const documentosValidados = proceso.documentos.filter(doc => doc.validado).length;
  const documentosPendientes = proceso.documentos.filter(doc => !doc.validado).length;
  const totalDocumentos = proceso.documentos.length;

  const getDaysUntilDue = () => {
    if (!proceso.fechaVencimiento) return null;
    const today = new Date();
    const dueDate = new Date(proceso.fechaVencimiento);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilDue = getDaysUntilDue();

  const getUrgencyColor = () => {
    if (!daysUntilDue) return 'border-gray-200';
    if (daysUntilDue < 0) return 'border-red-500 bg-red-50';
    if (daysUntilDue <= 3) return 'border-orange-500 bg-orange-50';
    if (daysUntilDue <= 7) return 'border-yellow-500 bg-yellow-50';
    return 'border-gray-200';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    console.log('🎯 Abriendo proceso:', proceso.id);
    onEdit(proceso);
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

  console.log(`🎴 ProcessCard: Renderizando ${proceso.id}`);

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer select-none ${getUrgencyColor()}`}
    >
      {/* Selector de Estado */}
      <div className="mb-3">
        <select
          value={proceso.estado}
          onChange={(e) => onChangeState(proceso.id, e.target.value as EstadoProceso)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          onClick={(e) => e.stopPropagation()}
        >
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      {/* Información básica */}
      <div className="mb-3">
        <h3 className="font-semibold text-sm text-gray-800 mb-1">{proceso.titulo}</h3>
        <div className="flex items-center text-xs text-gray-600 space-x-3">
          <div className="flex items-center">
            <User size={12} className="mr-1" />
            <span>{proceso.cliente}</span>
          </div>
          <div className="flex items-center">
            <Building size={12} className="mr-1" />
            <span>{proceso.organismo}</span>
          </div>
        </div>
      </div>

      {/* Fechas y urgencia */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>Inicio: {format(new Date(proceso.fechaCreacion), 'dd/MM/yy', { locale: es })}</span>
          </div>
        </div>
        
        {proceso.fechaVencimiento && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-2" />
              <span>Vence: {format(new Date(proceso.fechaVencimiento), 'dd/MM/yy', { locale: es })}</span>
            </div>
            <span className={`px-2 py-1 rounded-full font-medium ${
              daysUntilDue && daysUntilDue < 0 ? 'bg-red-100 text-red-800' :
              daysUntilDue && daysUntilDue <= 3 ? 'bg-orange-100 text-orange-800' :
              daysUntilDue && daysUntilDue <= 7 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {daysUntilDue && daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} días vencido` :
               daysUntilDue === 0 ? 'Vence hoy' :
               daysUntilDue === 1 ? 'Vence mañana' :
               `${daysUntilDue} días`}
            </span>
          </div>
        )}
      </div>

      {/* Progreso */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600 font-medium">Progreso</span>
          <span className="text-xs font-bold text-gray-800">{proceso.progreso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor(proceso.progreso)}`}
            style={{ width: `${proceso.progreso}%` }}
          />
        </div>
      </div>

      {/* Documentos */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-xs text-gray-600">
            <Paperclip size={14} className="mr-1" />
            <span className="font-medium">Documentos</span>
          </div>
          <span className="text-xs font-bold">
            {documentosValidados}/{totalDocumentos}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {documentosValidados > 0 && (
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle size={12} className="mr-1" />
              <span>{documentosValidados} validados</span>
            </div>
          )}
          {documentosPendientes > 0 && (
            <div className="flex items-center text-xs text-orange-600">
              <AlertTriangle size={12} className="mr-1" />
              <span>{documentosPendientes} pendientes</span>
            </div>
          )}
        </div>
      </div>

      {/* Costo */}
      {proceso.costos && (
        <div className="flex items-center justify-between mb-3 p-2 bg-green-50 rounded">
          <div className="flex items-center text-sm text-green-700">
            <DollarSign size={16} className="mr-1" />
            <span className="font-medium">Costo</span>
          </div>
          <span className="text-sm font-bold text-green-800">
            ${proceso.costos.toLocaleString('es-AR')}
          </span>
        </div>
      )}

      {/* Notas */}
      {proceso.notas && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="flex items-center text-xs text-gray-600 mb-1">
            <FileText size={12} className="mr-1" />
            <span className="font-medium">Notas</span>
          </div>
          <p className="text-xs text-gray-700 italic line-clamp-2">
            {proceso.notas}
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        <button
          onClick={handleEditClick}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          title="Editar proceso"
        >
          <Edit size={12} />
          <span>Editar</span>
        </button>
        <button
          onClick={handleDeleteClick}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
          title="Eliminar proceso"
        >
          <Trash2 size={12} />
          <span>Eliminar</span>
        </button>
      </div>

      {/* Ayuda para cambio de estados */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <Clock size={16} />
          <span className="text-sm font-medium">Tip:</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Usa el selector desplegable en la parte superior de cada tarjeta para cambiar el estado del proceso. 
          Haz clic en una tarjeta para editarla o ver más detalles.
        </p>
      </div>
    </div>
  );
};

export default ProcessCard;