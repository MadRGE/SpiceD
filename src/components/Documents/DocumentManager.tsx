import React, { useState } from 'react';
import { Upload, FileText, Check, X, Eye, Download, Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Documento } from '../../types';

interface DocumentManagerProps {
  documentos: Documento[];
  onDocumentUpdate: (documentos: Documento[]) => void;
  readOnly?: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documentos,
  onDocumentUpdate,
  readOnly = false
}) => {
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'required' | 'validated' | 'pending'>('all');

  const handleFileUpload = async (docId: string, file: File) => {
    setUploadingDoc(docId);
    
    // TODO: Integrar con Supabase Storage
    // Simulamos la carga del archivo
    setTimeout(() => {
      const updatedDocs = documentos.map(doc => 
        doc.id === docId 
          ? { 
              ...doc, 
              url: URL.createObjectURL(file),
              fechaCarga: new Date(),
              notas: `Archivo cargado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
            }
          : doc
      );
      onDocumentUpdate(updatedDocs);
      setUploadingDoc(null);
    }, 1500);
  };

  const toggleValidation = (docId: string) => {
    const updatedDocs = documentos.map(doc => 
      doc.id === docId 
        ? { ...doc, validado: !doc.validado }
        : doc
    );
    onDocumentUpdate(updatedDocs);
  };

  const updateNotes = (docId: string, notas: string) => {
    const updatedDocs = documentos.map(doc => 
      doc.id === docId ? { ...doc, notas } : doc
    );
    onDocumentUpdate(updatedDocs);
  };

  const addCustomDocument = () => {
    const newDoc: Documento = {
      id: Math.random().toString(36).substr(2, 9),
      nombre: 'Documento personalizado',
      requerido: false,
      validado: false
    };
    onDocumentUpdate([...documentos, newDoc]);
  };

  const removeDocument = (docId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      onDocumentUpdate(documentos.filter(doc => doc.id !== docId));
    }
  };

  const filteredDocuments = documentos.filter(doc => {
    switch (filter) {
      case 'required':
        return doc.requerido;
      case 'validated':
        return doc.validado;
      case 'pending':
        return !doc.validado;
      default:
        return true;
    }
  });

  const stats = {
    total: documentos.length,
    required: documentos.filter(d => d.requerido).length,
    validated: documentos.filter(d => d.validado).length,
    pending: documentos.filter(d => !d.validado).length,
    uploaded: documentos.filter(d => d.url).length
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileText className="mr-2" size={20} />
            Gestión de Documentos
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Administra todos los documentos requeridos para este proceso
          </p>
        </div>
        
        {!readOnly && (
          <button
            onClick={addCustomDocument}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Agregar Documento</span>
          </button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-700">Total</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{stats.required}</div>
          <div className="text-sm text-red-700">Requeridos</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
          <div className="text-sm text-green-700">Validados</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-orange-700">Pendientes</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.uploaded}</div>
          <div className="text-sm text-purple-700">Subidos</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({stats.total})
        </button>
        <button
          onClick={() => setFilter('required')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'required' 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Requeridos ({stats.required})
        </button>
        <button
          onClick={() => setFilter('validated')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'validated' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Validados ({stats.validated})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending' 
              ? 'bg-orange-100 text-orange-700 border border-orange-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendientes ({stats.pending})
        </button>
      </div>

      {/* Lista de documentos */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className={`border-2 rounded-lg p-6 transition-all ${
              doc.validado ? 'border-green-300 bg-green-50' : 
              doc.url ? 'border-yellow-300 bg-yellow-50' : 
              doc.requerido ? 'border-red-300 bg-red-50' :
              'border-gray-300 bg-white'
            }`}
          >
            {/* Header del documento */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  doc.validado ? 'bg-green-100' :
                  doc.url ? 'bg-yellow-100' :
                  doc.requerido ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <FileText size={20} className={
                    doc.validado ? 'text-green-600' :
                    doc.url ? 'text-yellow-600' :
                    doc.requerido ? 'text-red-600' : 'text-gray-600'
                  } />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{doc.nombre}</h4>
                    {doc.requerido && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                        Requerido
                      </span>
                    )}
                    {doc.validado && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Validado
                      </span>
                    )}
                  </div>
                  
                  {doc.fechaCarga && (
                    <p className="text-sm text-gray-600">
                      <Clock size={14} className="inline mr-1" />
                      Subido: {new Date(doc.fechaCarga).toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center space-x-2">
                {doc.url && (
                  <>
                    <button
                      onClick={() => window.open(doc.url, '_blank')}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Ver documento"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.url!;
                        link.download = doc.nombre;
                        link.click();
                      }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Descargar"
                    >
                      <Download size={16} />
                    </button>
                  </>
                )}
                
                {!readOnly && (
                  <>
                    <button
                      onClick={() => toggleValidation(doc.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        doc.validado 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title={doc.validado ? 'Marcar como no validado' : 'Marcar como validado'}
                    >
                      {doc.validado ? <Check size={16} /> : <X size={16} />}
                    </button>
                    
                    {!doc.requerido && (
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar documento"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Área de carga y notas */}
            {!readOnly && (
              <div className="space-y-4">
                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    id={`file-${doc.id}`}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(doc.id, file);
                    }}
                  />
                  <label
                    htmlFor={`file-${doc.id}`}
                    className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      uploadingDoc === doc.id 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-medium">
                      {uploadingDoc === doc.id ? 'Subiendo archivo...' : 
                       doc.url ? 'Reemplazar archivo' : 'Subir archivo'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, XLS, JPG, PNG (máx. 10MB)
                    </span>
                  </label>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del documento
                  </label>
                  <textarea
                    value={doc.notas || ''}
                    onChange={(e) => updateNotes(doc.id, e.target.value)}
                    placeholder="Agregar notas sobre el documento..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Notas en modo solo lectura */}
            {readOnly && doc.notas && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{doc.notas}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {filter === 'all' ? 'No hay documentos' : `No hay documentos ${
              filter === 'required' ? 'requeridos' :
              filter === 'validated' ? 'validados' : 'pendientes'
            }`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'Comienza agregando documentos para este proceso'
              : 'Cambia el filtro para ver otros documentos'
            }
          </p>
          {!readOnly && filter === 'all' && (
            <button
              onClick={addCustomDocument}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Primer Documento
            </button>
          )}
        </div>
      )}

      {/* Progreso general */}
      {documentos.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de Documentación</span>
            <span className="text-sm font-bold text-gray-800">
              {Math.round((stats.validated / stats.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${(stats.validated / stats.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {stats.validated} de {stats.total} documentos validados
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;