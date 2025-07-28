import React, { useState } from 'react';
import { Search, FileText, Clock, Building, Plus, Eye } from 'lucide-react';
import { plantillasProcedimientos, organismos } from '../../data/plantillas';

interface TemplatesViewProps {
  onCreateFromTemplate: (templateId: string) => void;
}

const TemplatesView: React.FC<TemplatesViewProps> = ({ onCreateFromTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganismo, setSelectedOrganismo] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const filteredTemplates = plantillasProcedimientos.filter(template => {
    const matchesSearch = template.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.organismo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganismo = !selectedOrganismo || template.organismo === selectedOrganismo;
    
    return matchesSearch && matchesOrganismo;
  });

  const templatesByOrganismo = organismos.map(organismo => ({
    organismo,
    templates: filteredTemplates.filter(t => t.organismo === organismo),
    count: plantillasProcedimientos.filter(t => t.organismo === organismo).length
  })).filter(group => group.templates.length > 0);

  const selectedTemplateData = selectedTemplate 
    ? plantillasProcedimientos.find(t => t.id === selectedTemplate)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Plantillas de Procedimientos</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} de {plantillasProcedimientos.length} plantillas
          </div>
          <button
            onClick={() => {
              setEditingTemplate(null);
              setShowCreateForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Nueva Plantilla</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedOrganismo}
            onChange={(e) => setSelectedOrganismo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los organismos</option>
            {organismos.map(organismo => (
              <option key={organismo} value={organismo}>
                {organismo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de plantillas */}
        <div className="lg:col-span-2 space-y-6">
          {templatesByOrganismo.map(({ organismo, templates, count }) => (
            <div key={organismo} className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Building className="mr-2" size={20} />
                    {organismo}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {templates.length} plantillas
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">
                          {template.nombre}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FileText size={14} className="mr-1" />
                            <span>{template.documentosRequeridos.length} docs</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{template.tiempoEstimado} días</span>
                          </div>
                          {template.costo && (
                            <div className="flex items-center">
                              <span className="text-green-600 font-medium">
                                ${template.costo.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTemplate(template);
                            setShowCreateForm(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Editar plantilla"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplate(template.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateFromTemplate(template.id);
                          }}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} />
                          <span>Usar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Panel de detalles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md sticky top-6">
            {selectedTemplateData ? (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Detalles de la Plantilla
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Nombre</h4>
                    <p className="text-sm text-gray-600">{selectedTemplateData.nombre}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Organismo</h4>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {selectedTemplateData.organismo}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Tiempo Estimado</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{selectedTemplateData.tiempoEstimado} días hábiles</span>
                    </div>
                  </div>
                  
                  {selectedTemplateData.costo && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Costo Estimado</h4>
                      <div className="text-lg font-semibold text-green-600">
                        ${selectedTemplateData.costo.toLocaleString('es-AR')}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Documentos Requeridos ({selectedTemplateData.documentosRequeridos.length})
                    </h4>
                    <ul className="space-y-2">
                      {selectedTemplateData.documentosRequeridos.map((doc, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <FileText size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button
                  onClick={() => onCreateFromTemplate(selectedTemplateData.id)}
                  className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  <span>Crear Proceso con esta Plantilla</span>
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Selecciona una plantilla para ver sus detalles</p>
      {/* Modal de creación/edición de plantilla */}
      {showCreateForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCreateForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}
                </h3>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const documentos = (formData.get('documentos') as string).split('\n').filter(d => d.trim());
                
                const nuevaPlantilla = {
                  id: editingTemplate?.id || Date.now().toString(),
                  nombre: formData.get('nombre') as string,
                  organismo: formData.get('organismo') as string,
                  documentosRequeridos: documentos,
                  tiempoEstimado: Number(formData.get('tiempoEstimado')),
                  costo: Number(formData.get('costo')) || undefined
                };
                
                console.log('Plantilla guardada:', nuevaPlantilla);
                alert(`Plantilla "${nuevaPlantilla.nombre}" ${editingTemplate ? 'actualizada' : 'creada'} correctamente`);
                setShowCreateForm(false);
                setEditingTemplate(null);
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Plantilla *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingTemplate?.nombre}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
              </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organismo *
                    </label>
                    <select
                      name="organismo"
                      defaultValue={editingTemplate?.organismo}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {organismos.map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                  </div>
            )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo Estimado (días) *
                    </label>
                    <input
                      type="number"
                      name="tiempoEstimado"
                      defaultValue={editingTemplate?.tiempoEstimado}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
          </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo Estimado
                    </label>
                    <input
                      type="number"
                      name="costo"
                      defaultValue={editingTemplate?.costo}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
        </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documentos Requeridos (uno por línea) *
                    </label>
                    <textarea
                      name="documentos"
                      defaultValue={editingTemplate?.documentosRequeridos?.join('\n')}
                      required
                      rows={6}
                      placeholder="Documento 1&#10;Documento 2&#10;Documento 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
      </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingTemplate ? 'Actualizar' : 'Crear'} Plantilla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatesView;