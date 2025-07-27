import React from 'react';
import { X } from 'lucide-react';
import { FiltrosProcesos, EstadoProceso } from '../../types';
import { organismos } from '../../data/plantillas';

interface SearchFiltersProps {
  open: boolean;
  onClose: () => void;
  filtros: FiltrosProcesos;
  onFiltrosChange: (filtros: FiltrosProcesos) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  open,
  onClose,
  filtros,
  onFiltrosChange,
  onClearFilters
}) => {
  const estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'recopilacion', label: 'Recopilación de Documentos' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'revision', label: 'En Revisión' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' },
    { value: 'archivado', label: 'Archivado' }
  ];

  const handleFiltroChange = (campo: keyof FiltrosProcesos, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  const filtrosActivos = Object.values(filtros).filter(v => v !== undefined && v !== '').length;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Filtros de Búsqueda</h2>
              {filtrosActivos > 0 && (
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {filtrosActivos} activos
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por cliente
              </label>
              <input
                type="text"
                value={filtros.cliente || ''}
                onChange={(e) => handleFiltroChange('cliente', e.target.value)}
                placeholder="Nombre del cliente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por tipo de proceso
              </label>
              <input
                type="text"
                value={filtros.tipo || ''}
                onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                placeholder="Tipo de procedimiento..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organismo
              </label>
              <select
                value={filtros.organismo || ''}
                onChange={(e) => handleFiltroChange('organismo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los organismos</option>
                {organismos.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado || ''}
                onChange={(e) => handleFiltroChange('estado', e.target.value as EstadoProceso)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <hr className="my-6" />

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Rango de Fechas
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Fecha desde
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaDesde ? filtros.fechaDesde.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFiltroChange('fechaDesde', e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Fecha hasta
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaHasta ? filtros.fechaHasta.toISOString().split('T')[0] : ''}
                    onChange={(e) => handleFiltroChange('fechaHasta', e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                onClick={onClearFilters}
                disabled={filtrosActivos === 0}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilters;