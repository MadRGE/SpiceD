import React, { useState } from 'react';
import { Search, FileText, Eye, Download, CheckCircle, XCircle, Clock, Filter, User, Building, Brain, Zap, Upload, Plus, BookTemplate } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProcesoDisplay, ValidacionIA, Documento } from '../../types';
import { plantillasProcedimientos, organismos } from '../../data/plantillas';

interface DocumentsTemplatesViewProps {
  procesos: ProcesoDisplay[];
  validaciones: ValidacionIA[];
  documentos: Documento[];
  onValidateDocument: (documentoId: string) => void;
  onRetryValidation: (validacionId: string) => void;
  onCreateFromTemplate: (templateId: string) => void;
}

const DocumentsTemplatesView: React.FC<DocumentsTemplatesViewProps> = ({
  procesos,
  validaciones,
  documentos,
  onValidateDocument,
  onRetryValidation,
  onCreateFromTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'documentos' | 'plantillas'>('documentos');
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDocumento, setSelectedDocumento] = useState<any | null>(null);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  // Obtener todos los documentos de todos los procesos
  const todosDocumentos = procesos.flatMap(proceso => 
    proceso.documentos.map(doc => ({
      ...doc,
      proceso: {
        id: proceso.id,
        cliente: proceso.cliente,
        titulo: proceso.titulo,
        organismo: proceso.organismo
      }
    }))
  );

  const documentosFiltrados = todosDocumentos.filter(doc => {
    const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.proceso.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFiltro === 'all' || doc.estado === estadoFiltro;
    return matchesSearch && matchesEstado;
  });

  const filteredTemplates = plantillasProcedimientos.filter(template =>
    template.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.organismo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTemplateData = selectedTemplate 
    ? plantillasProcedimientos.find(t => t.id === selectedTemplate)
    : null;

  const stats = {
    documentos: todosDocumentos.length,
    pendientes: todosDocumentos.filter(d => d.estado === 'pendiente').length,
    aprobados: todosDocumentos.filter(d => d.estado === 'aprobado').length,
    plantillas: plantillasProcedimientos.length,
    validaciones: validaciones.length,
    validacionesCompletadas: validaciones.filter(v => v.estado === 'completado').length
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'rechazado':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Clock className="text-yellow-600" size={16} />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Documentos y Plantillas</h2>
        <div className="text-sm text-gray-600">
          {activeTab === 'documentos' && `${documentosFiltrados.length} documentos`}
          {activeTab === 'plantillas' && `${filteredTemplates.length} plantillas`}
          {activeTab === 'ia-validacion' && `${validaciones.length} validaciones`}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.documentos}</p>
            <p className="text-sm text-gray-600">Documentos</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.aprobados}</p>
            <p className="text-sm text-gray-600">Aprobados</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.plantillas}</p>
            <p className="text-sm text-gray-600">Plantillas</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.validaciones}</p>
            <p className="text-sm text-gray-600">Validaciones IA</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.validacionesCompletadas}</p>
            <p className="text-sm text-gray-600">Completadas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'documentos'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Documentos ({stats.documentos})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('plantillas')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'plantillas'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookTemplate size={16} />
              <span>Plantillas ({stats.plantillas})</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Buscar ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {activeTab === 'documentos' && (
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
              </select>
            )}
          </div>

          {/* Contenido de tabs */}
          {activeTab === 'documentos' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proceso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Carga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documentosFiltrados.map((documento) => (
                    <tr 
                      key={`${documento.proceso.id}-${documento.id}`} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedDocumento(documento);
                        setShowDocumentDetails(true);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="text-blue-600 mr-3" size={20} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{documento.nombre}</div>
                            <div className="text-sm text-gray-500">{documento.tipoDocumento}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {documento.proceso.cliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {documento.proceso.titulo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(documento.estado)}`}>
                          {getEstadoIcon(documento.estado)}
                          <span className="ml-1">{documento.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {documento.fechaCarga ? format(new Date(documento.fechaCarga), 'dd/MM/yyyy', { locale: es }) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {documento.url && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDocumento(documento);
                                  setShowDocumentDetails(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Ver documento"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const link = document.createElement('a');
                                  link.href = documento.url!;
                                  link.download = documento.nombre;
                                  link.click();
                                }}
                                className="text-green-600 hover:text-green-900"
                                title="Descargar"
                              >
                                <Download size={16} />
                              </button>
                            </>
                          )}
                          
                          {documento.estado === 'pendiente' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onValidateDocument(documento.id);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Validar con IA"
                            >
                              <Zap size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'plantillas' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Plantillas Disponibles</h3>
                  <button
                    onClick={() => {
                      setEditingTemplate(null);
                      setShowTemplateForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Nueva Plantilla
                  </button>
                </div>

                {organismos.map(organismo => {
                  const templates = filteredTemplates.filter(t => t.organismo === organismo);
                  if (templates.length === 0) return null;
                  
                  return (
                    <div key={organismo} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Building className="mr-2" size={20} />
                        {organismo}
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {templates.length}
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {templates.map(template => (
                          <div
                            key={template.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedTemplate === template.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <h4 className="font-medium text-gray-800 text-sm mb-2">
                              {template.nombre}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>{template.documentosRequeridos.length} docs</span>
                              <span>{template.tiempoEstimado} días</span>
                              {template.costo && (
                                <span className="text-green-600 font-medium">
                                  ${template.costo.toLocaleString()}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTemplate(template);
                                  setShowTemplateForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

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
                        <span>Crear Proceso</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <BookTemplate size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Selecciona una plantilla para ver sus detalles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* Estados vacíos */}
          {activeTab === 'documentos' && documentosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-gray-500">
                Los documentos aparecerán aquí cuando se carguen en los procesos
              </p>
            </div>
          )}

          {activeTab === 'plantillas' && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <BookTemplate size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron plantillas
              </h3>
              <p className="text-gray-500">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Modal de Plantilla */}
      {showTemplateForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowTemplateForm(false)} />
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
                setShowTemplateForm(false);
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

                  <div>
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

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTemplateForm(false)}
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

      {/* Modal de detalles del documento */}
      {showDocumentDetails && selectedDocumento && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowDocumentDetails(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Detalles del Documento: {selectedDocumento.nombre}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Información del Documento</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nombre:</strong> {selectedDocumento.nombre}</p>
                      <p><strong>Tipo:</strong> {selectedDocumento.tipoDocumento}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getEstadoColor(selectedDocumento.estado)}`}>
                          {selectedDocumento.estado === 'pendiente' ? 'Pendiente' :
                           selectedDocumento.estado === 'cargado' ? 'Cargado' :
                           selectedDocumento.estado === 'aprobado' ? 'Aprobado' :
                           selectedDocumento.estado === 'rechazado' ? 'Rechazado' :
                           selectedDocumento.estado}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Información del Proceso</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Cliente:</strong> {selectedDocumento.proceso.cliente}</p>
                      <p><strong>Proceso:</strong> {selectedDocumento.proceso.titulo}</p>
                      <p><strong>Organismo:</strong> {selectedDocumento.proceso.organismo}</p>
                    </div>
                  </div>
                </div>

                {selectedDocumento.url && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Archivo</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="text-blue-600" size={20} />
                          <span className="text-sm font-medium">Archivo disponible</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(selectedDocumento.url, '_blank')}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            Abrir
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedDocumento.url;
                              link.download = selectedDocumento.nombre;
                              link.click();
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Descargar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-between">
                <button
                  onClick={() => setShowDocumentDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                {selectedDocumento.estado === 'pendiente' && (
                  <button
                    onClick={() => {
                      setShowDocumentDetails(false);
                      onValidateDocument(selectedDocumento.id);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Validar con IA
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentsTemplatesView;