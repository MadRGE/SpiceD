import React, { useState } from 'react';
import { X, Edit, FileText, User, Building, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProcesoDisplay, Documento } from '../../types';
import DocumentManager from '../Documents/DocumentManager';

interface ProcessDetailsProps {
  proceso: ProcesoDisplay;
  onClose: () => void;
  onEdit: () => void;
  onUpdateDocuments: (documentos: Documento[]) => void;
}

const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  proceso,
  onClose,
  onEdit,
  onUpdateDocuments
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'documentos' | 'historial'>('general');

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-red-100 text-red-800';
      case 'recopilacion-docs': return 'bg-orange-100 text-orange-800';
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'revision': return 'bg-purple-100 text-purple-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      case 'archivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'recopilacion-docs': return 'Recopilación de Documentos';
      case 'enviado': return 'Enviado';
      case 'revision': return 'En Revisión';
      case 'aprobado': return 'Aprobado';
      case 'rechazado': return 'Rechazado';
      case 'archivado': return 'Archivado';
      default: return estado;
    }
  };

  const documentosValidados = proceso.documentos?.filter(doc => doc.validado).length || 0;
  const totalDocumentos = proceso.documentos?.length || 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{proceso.titulo}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(proceso.estado)}`}>
                    {getEstadoLabel(proceso.estado)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Progreso: {proceso.progreso}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Tabs */}
            <div className="border-b mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Información General
                </button>
                <button
                  onClick={() => setActiveTab('documentos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'documentos'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Documentos ({documentosValidados}/{totalDocumentos})
                </button>
                <button
                  onClick={() => setActiveTab('historial')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'historial'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Historial ({proceso.comentarios?.length || 0})
                </button>
              </nav>
            </div>

            {/* Contenido de tabs */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Información del Proceso</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-sm"><strong>Cliente:</strong> {proceso.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building size={16} className="text-gray-400" />
                        <span className="text-sm"><strong>Organismo:</strong> {proceso.organismo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm">
                          <strong>Fecha Inicio:</strong> {format(new Date(proceso.fechaInicio), 'dd/MM/yyyy', { locale: es })}
                        </span>
                      </div>
                      {proceso.fechaVencimiento && (
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-sm">
                            <strong>Vencimiento:</strong> {format(new Date(proceso.fechaVencimiento), 'dd/MM/yyyy', { locale: es })}
                          </span>
                        </div>
                      )}
                      {proceso.costos && (
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} className="text-gray-400" />
                          <span className="text-sm">
                            <strong>Costos:</strong> ${proceso.costos.toLocaleString('es-AR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Estado y Progreso</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progreso General</span>
                          <span className="text-sm font-bold">{proceso.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${proceso.progreso}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Documentos</span>
                          <span className="text-sm font-bold">{documentosValidados}/{totalDocumentos}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {documentosValidados > 0 && (
                            <div className="flex items-center text-sm text-green-600">
                              <CheckCircle size={14} className="mr-1" />
                              <span>{documentosValidados} validados</span>
                            </div>
                          )}
                          {(totalDocumentos - documentosValidados) > 0 && (
                            <div className="flex items-center text-sm text-orange-600">
                              <AlertTriangle size={14} className="mr-1" />
                              <span>{totalDocumentos - documentosValidados} pendientes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {proceso.descripcion && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{proceso.descripcion}</p>
                  </div>
                )}

                {proceso.notas && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Notas</h4>
                    <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">{proceso.notas}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documentos' && (
              <DocumentManager
                documentos={proceso.documentos || []}
                onDocumentUpdate={onUpdateDocuments}
              />
            )}

            {activeTab === 'historial' && (
              <div className="space-y-4">
                {proceso.comentarios && proceso.comentarios.length > 0 ? (
                  proceso.comentarios.map((comentario) => (
                    <div key={comentario.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">{comentario.autor}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comentario.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </span>
                      </div>
                      <p className="text-gray-700">{comentario.contenido}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        comentario.tipo === 'cambio_estado' ? 'bg-blue-100 text-blue-800' :
                        comentario.tipo === 'documento_agregado' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {comentario.tipo === 'cambio_estado' ? 'Cambio de Estado' :
                         comentario.tipo === 'documento_agregado' ? 'Documento Agregado' :
                         'Comentario'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No hay historial disponible</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessDetails;