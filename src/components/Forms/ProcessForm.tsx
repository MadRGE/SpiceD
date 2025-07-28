import React, { useState } from 'react';
import { X, Save, FileText, User, Building, Calendar, DollarSign } from 'lucide-react';
import { ProcesoDisplay, Cliente, Organismo } from '../../types';
import { PlantillaProcedimiento } from '../../data/plantillas';

interface ProcessFormProps {
  proceso?: ProcesoDisplay | null;
  clientes: Cliente[];
  organismos: Organismo[];
  plantillas: PlantillaProcedimiento[];
  onSave: (proceso: any) => void;
  onCancel: () => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({
  proceso,
  clientes,
  organismos,
  plantillas,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    titulo: proceso?.titulo || '',
    descripcion: proceso?.descripcion || '',
    clienteId: proceso?.clienteId || '',
    organismoId: proceso?.organismoId || '',
    plantillaId: proceso?.plantillaId || '',
    fechaVencimiento: proceso?.fechaVencimiento ? 
      new Date(proceso.fechaVencimiento).toISOString().split('T')[0] : '',
    prioridad: proceso?.prioridad || 'media',
    costos: proceso?.costos || 0,
    notas: proceso?.notas || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const plantillaSeleccionada = plantillas.find(p => p.id === formData.plantillaId);
    
    const procesoData = {
      id: proceso?.id || Date.now().toString(),
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      estado: proceso?.estado || 'pendiente',
      fechaCreacion: proceso?.fechaCreacion || new Date().toISOString(),
      fechaInicio: proceso?.fechaInicio || new Date().toISOString(),
      fechaVencimiento: formData.fechaVencimiento ? new Date(formData.fechaVencimiento).toISOString() : undefined,
      clienteId: formData.clienteId,
      organismoId: formData.organismoId,
      plantillaId: formData.plantillaId,
      documentos: proceso?.documentos || (plantillaSeleccionada ? 
        plantillaSeleccionada.documentosRequeridos.map((doc, index) => ({
          id: `${Date.now()}-${index}`,
          nombre: doc,
          tipo: 'requerido' as const,
          estado: 'pendiente' as const,
          fechaCarga: new Date().toISOString(),
          validado: false,
          tipoDocumento: 'Documento requerido'
        })) : []
      ),
      progreso: proceso?.progreso || 0,
      prioridad: formData.prioridad,
      etiquetas: proceso?.etiquetas || [],
      responsable: proceso?.responsable || 'Usuario Actual',
      comentarios: proceso?.comentarios || [],
      costos: formData.costos,
      facturado: proceso?.facturado || false,
      notas: formData.notas
    };

    onSave(procesoData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {proceso ? 'Editar Proceso' : 'Nuevo Proceso'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Título del Proceso *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Cliente *
                </label>
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building size={16} className="inline mr-2" />
                  Organismo *
                </label>
                <select
                  value={formData.organismoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, organismoId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar organismo...</option>
                  {organismos.map(organismo => (
                    <option key={organismo.id} value={organismo.id}>
                      {organismo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla (Opcional)
                </label>
                <select
                  value={formData.plantillaId}
                  onChange={(e) => setFormData(prev => ({ ...prev, plantillaId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin plantilla...</option>
                  {plantillas.map(plantilla => (
                    <option key={plantilla.id} value={plantilla.id}>
                      {plantilla.nombre} - {plantilla.organismo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => setFormData(prev => ({ ...prev, fechaVencimiento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData(prev => ({ ...prev, prioridad: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Costos Estimados
                </label>
                <input
                  type="number"
                  value={formData.costos}
                  onChange={(e) => setFormData(prev => ({ ...prev, costos: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Save size={16} />
                <span>{proceso ? 'Actualizar' : 'Crear'} Proceso</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProcessForm;