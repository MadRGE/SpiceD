import React from 'react';
import { Calendar, User, Building, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { ProcesoDisplay } from '../../types';

interface ProcessCardProps {
  proceso: ProcesoDisplay;
  onView: (proceso: ProcesoDisplay) => void;
  onEdit: (proceso: ProcesoDisplay) => void;
  onDelete: (id: string) => void;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ proceso, onView, onEdit, onDelete }) => {
  const getEstadoFlag = (estado: string) => {
    const flags = {
      'pendiente': '🔴',
      'recopilacion-docs': '🟠',
      'enviado': '🔵',
      'revision': '🟣',
      'aprobado': '🟢',
      'rechazado': '🔴',
      'archivado': '⚫'
    };
    return flags[estado as keyof typeof flags] || '⚪';
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      'pendiente': 'text-red-600',
      'recopilacion-docs': 'text-orange-600',
      'enviado': 'text-blue-600',
      'revision': 'text-purple-600',
      'aprobado': 'text-emerald-600',
      'rechazado': 'text-red-700',
      'archivado': 'text-slate-600'
    };
    return colors[estado as keyof typeof colors] || 'text-gray-600';
  };

  const getPrioridadColor = (prioridad: string) => {
    const colors = {
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-green-100 text-green-800'
    };
    return colors[prioridad as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isVencido = proceso.fechaVencimiento && new Date(proceso.fechaVencimiento) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300">
      <div className="p-4">
        {/* Header con estado y prioridad */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getEstadoFlag(proceso.estado)}</span>
            <span className={`text-sm font-medium ${getEstadoColor(proceso.estado)}`}>
              {proceso.estado.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(proceso.prioridad)}`}>
            {proceso.prioridad.toUpperCase()}
          </span>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {proceso.titulo}
        </h3>

        {/* Cliente y Organismo */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User size={14} />
            <span className="truncate">{proceso.cliente}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building size={14} />
            <span className="truncate">{proceso.organismo}</span>
          </div>
        </div>

        {/* Fechas */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Inicio: {formatDate(proceso.fechaInicio)}</span>
          </div>
          {proceso.fechaVencimiento && (
            <div className={`flex items-center space-x-2 text-xs ${isVencido ? 'text-red-600' : 'text-gray-500'}`}>
              <Clock size={12} />
              <span>Vence: {formatDate(proceso.fechaVencimiento)}</span>
              {isVencido && <AlertTriangle size={12} />}
            </div>
          )}
        </div>

        {/* Progreso */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{proceso.progreso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${proceso.progreso}%` }}
            />
          </div>
        </div>

        {/* Documentos */}
        {proceso.documentos && proceso.documentos.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
            <FileText size={12} />
            <span>
              {proceso.documentos.filter(d => d.estado === 'aprobado').length} / {proceso.documentos.length} docs
            </span>
            {proceso.documentos.filter(d => d.estado === 'aprobado').length === proceso.documentos.length && (
              <CheckCircle size={12} className="text-green-600" />
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(proceso)}
            className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Ver
          </button>
          <button
            onClick={() => onEdit(proceso)}
            className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres eliminar este proceso?')) {
                onDelete(proceso.id);
              }
            }}
            className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessCard;