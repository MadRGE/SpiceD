import React, { useState } from 'react';
import { Search, FileText, Eye, Download, CheckCircle, XCircle, Clock, Filter, User, Building, Brain, Zap, Upload, Plus, BookTemplate } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProcesoDisplay, ValidacionIA, Documento } from '../../types';

interface DocumentsViewProps {
  procesos: ProcesoDisplay[];
  onValidateDocument: (documentoId: string) => void;
  onUploadDocument: (procesoId: string, documento: Documento) => void;
  onAddNotificacion: (notificacion: any) => void;
}

const DocumentsView: React.FC<DocumentsViewProps> = ({
  procesos,
  onValidateDocument,
  onUploadDocument,
  onAddNotificacion
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'all' | 'pendiente' | 'aprobado' | 'rechazado'>('all');
  const [clienteFiltro, setClienteFiltro] = useState('');
  const [organismoFiltro, setOrganismoFiltro] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState('');

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
                         doc.proceso.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.proceso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFiltro === 'all' || doc.estado === estadoFiltro;
    const matchesCliente = !clienteFiltro || doc.proceso.cliente.toLowerCase().includes(clienteFiltro.toLowerCase());
    const matchesOrganismo = !organismoFiltro || doc.proceso.organismo === organismoFiltro;
    
    return matchesSearch && matchesEstado && matchesCliente && matchesOrganismo;
  });

  const clientes = [...new Set(procesos.map(p => p.cliente))];
  const organismos = [...new Set(procesos.map(p => p.organismo))];

  const stats = {
    total: todosDocumentos.length,
    pendientes: todosDocumentos.filter(d => d.estado === 'pendiente').length,
    aprobados: todosDocumentos.filter(d => d.estado === 'aprobado').length,
    rechazados: todosDocumentos.filter(d => d.estado === 'rechazado').length,
    conArchivo: todosDocumentos.filter(d => d.url).length
  };

  const handleUploadSubmit = () => {
    if (!selectedProceso || uploadFiles.length === 0) return;

    uploadFiles.forEach((file, index) => {
      const nuevoDocumento: Documento = {
        id: `${Date.now()}-${index}`,
        nombre: file.name,
        tipo: 'opcional',
        estado: 'cargado',
        url: URL.createObjectURL(file),
        fechaCarga: new Date().toISOString(),
        tipoDocumento: 'Documento subido',
        validado: false,
        mensaje: uploadMessage
      };

      onUploadDocument(selectedProceso, nuevoDocumento);
    });

    // Notificar subida de documentos
    onAddNotificacion({
      id: Date.now().toString(),
      tipo: 'documento_subido',
      modulo: 'documentos',
      titulo: 'Documentos subidos',
      mensaje: `Se subieron ${uploadFiles.length} documento(s) al proceso`,
      fecha: new Date(),
      leida: false,
      prioridad: 'media',
      procesoId: selectedProceso
    });

    setShowUploadModal(false);
    setUploadFiles([]);
    setUploadMessage('');
    setSelectedProceso('');
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

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Documentos</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            {documentosFiltrados.length} de {todosDocumentos.length} documentos
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Subir Documentos</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprobados}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rechazados</p>
              <p className="text-2xl font-bold text-red-600">{stats.rechazados}</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Archivo</p>
              <p className="text-2xl font-bold text-purple-600">{stats.conArchivo}</p>
            </div>
            <FileText className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
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

          <select
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los clientes</option>
            {clientes.map(cliente => (
              <option key={cliente} value={cliente}>{cliente}</option>
            ))}
          </select>

          <select
            value={organismoFiltro}
            onChange={(e) => setOrganismoFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los organismos</option>
            {organismos.map(organismo => (
              <option key={organismo} value={organismo}>{organismo}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Organismo
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
                <tr key={`${documento.proceso.id}-${documento.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="text-blue-600" size={20} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {documento.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {documento.tipoDocumento}
                        </div>
                        {documento.mensaje && (
                          <div className="text-xs text-blue-600 italic">
                            {documento.mensaje}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User size={16} className="mr-2 text-gray-400" />
                      {documento.proceso.cliente}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={documento.proceso.titulo}>
                      {documento.proceso.titulo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building size={16} className="mr-2 text-gray-400" />
                      {documento.proceso.organismo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(documento.estado)}`}>
                      {getEstadoIcon(documento.estado)}
                      <span className="ml-1">{getEstadoLabel(documento.estado)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {documento.fechaCarga ? (
                      format(new Date(documento.fechaCarga), 'dd/MM/yyyy', { locale: es })
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {documento.url && (
                        <>
                          <button
                            onClick={() => window.open(documento.url, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver documento"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
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
                          onClick={() => onValidateDocument(documento.id)}
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
      </div>

      {/* Modal de Subida de Documentos */}
      {showUploadModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowUploadModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Subir Documentos</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proceso de Destino *
                  </label>
                  <select
                    value={selectedProceso}
                    onChange={(e) => setSelectedProceso(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar proceso...</option>
                    {procesos.map(proceso => (
                      <option key={proceso.id} value={proceso.id}>
                        {proceso.cliente} - {proceso.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivos (múltiples permitidos)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setUploadFiles(files);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos permitidos: PDF, DOC, XLS, JPG, PNG (máx. 10MB cada uno)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje/Propósito (opcional)
                  </label>
                  <textarea
                    value={uploadMessage}
                    onChange={(e) => setUploadMessage(e.target.value)}
                    placeholder="Describe para qué se suben estos documentos o si rectifican algo..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {uploadFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Archivos seleccionados ({uploadFiles.length})
                    </h4>
                    <div className="space-y-2">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={!selectedProceso || uploadFiles.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
                >
                  Subir Documentos
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Estado vacío */}
      {documentosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No se encontraron documentos
          </h3>
          <p className="text-gray-500">
            {searchTerm || estadoFiltro !== 'all' || clienteFiltro || organismoFiltro
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Los documentos aparecerán aquí cuando se carguen en los procesos'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsView;