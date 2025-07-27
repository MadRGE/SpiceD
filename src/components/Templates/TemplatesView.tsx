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
        <div className="text-sm text-gray-600">
          {filteredTemplates.length} de {plantillasProcedimientos.length} plantillas
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
              </div>
            )}
          </div>
        </div>
      </div>

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