import React, { useState } from 'react';
import { Brain, Upload, CheckCircle, XCircle, Clock, Eye, FileText, Zap, AlertTriangle } from 'lucide-react';
import { ValidacionIA, Documento } from '../../types';

interface AIValidationViewProps {
  validaciones: ValidacionIA[];
  documentos: Documento[];
  onValidateDocument: (documentoId: string) => void;
  onRetryValidation: (validacionId: string) => void;
}

const AIValidationView: React.FC<AIValidationViewProps> = ({
  validaciones,
  documentos,
  onValidateDocument,
  onRetryValidation
}) => {
  const [selectedValidacion, setSelectedValidacion] = useState<ValidacionIA | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const validacionesPendientes = validaciones.filter(v => v.estado === 'pendiente').length;
  const validacionesCompletadas = validaciones.filter(v => v.estado === 'completada').length;
  const validacionesError = validaciones.filter(v => v.estado === 'error').length;

  const confianzaPromedio = validaciones.length > 0 
    ? validaciones
        .filter(v => v.estado === 'completada')
        .reduce((sum, v) => sum + v.confianza, 0) / validaciones.filter(v => v.estado === 'completada').length
    : 0;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'text-green-600 bg-green-100';
      case 'procesando': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completada': return <CheckCircle size={16} />;
      case 'procesando': return <Clock size={16} className="animate-spin" />;
      case 'error': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getConfianzaColor = (confianza: number) => {
    if (confianza >= 80) return 'text-green-600';
    if (confianza >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const documentosSinValidar = documentos.filter(doc => 
    doc.url && !validaciones.some(v => v.documentoId === doc.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Brain className="mr-3 text-purple-600" size={32} />
          Validación IA de Documentos
        </h2>
        <div className="text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
          <span className="font-medium">Powered by OpenAI GPT-4 Vision</span>
        </div>
      </div>

      {/* Métricas de IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{validacionesPendientes}</p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{validacionesCompletadas}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Errores</p>
              <p className="text-2xl font-bold text-red-600">{validacionesError}</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confianza Promedio</p>
              <p className={`text-2xl font-bold ${getConfianzaColor(confianzaPromedio)}`}>
                {Math.round(confianzaPromedio)}%
              </p>
            </div>
            <Brain className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Documentos sin validar */}
      {documentosSinValidar.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Upload className="mr-2" size={20} />
            Documentos Listos para Validación IA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentosSinValidar.map(documento => (
              <div key={documento.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-gray-600" />
                    <span className="text-sm font-medium">{documento.nombre}</span>
                  </div>
                </div>
                <button
                  onClick={() => onValidateDocument(documento.id)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Zap size={16} />
                  <span>Validar con IA</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Validaciones */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Historial de Validaciones</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confianza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validaciones.map((validacion) => {
                const documento = documentos.find(d => d.id === validacion.documentoId);
                return (
                  <tr key={validacion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-gray-600" />
                        {documento?.nombre || 'Documento no encontrado'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(validacion.estado)}`}>
                        {getEstadoIcon(validacion.estado)}
                        <span className="ml-1 capitalize">{validacion.estado}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {validacion.estado === 'completada' ? (
                        <span className={`font-medium ${getConfianzaColor(validacion.confianza)}`}>
                          {validacion.confianza}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {validacion.fechaProcesamiento.toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            console.log('Abriendo detalles de validación:', validacion);
                            setSelectedValidacion(validacion);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        {validacion.estado === 'error' && (
                          <button
                            onClick={() => {
                              console.log('Reintentando validación:', validacion.id);
                              onRetryValidation(validacion.id);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Reintentar validación"
                          >
                            <Zap size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showDetails && selectedValidacion && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowDetails(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold flex items-center">
                  <Brain className="mr-2 text-purple-600" />
                  Resultados de Validación IA
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Estado de Validación</h4>
                    <span className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-full ${getEstadoColor(selectedValidacion.estado)}`}>
                      {getEstadoIcon(selectedValidacion.estado)}
                      <span className="ml-2 capitalize">{selectedValidacion.estado}</span>
                    </span>
                  </div>
                  
                  {selectedValidacion.estado === 'completada' && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Nivel de Confianza</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              selectedValidacion.confianza >= 80 ? 'bg-green-500' :
                              selectedValidacion.confianza >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedValidacion.confianza}%` }}
                          />
                        </div>
                        <span className={`font-bold ${getConfianzaColor(selectedValidacion.confianza)}`}>
                          {selectedValidacion.confianza}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedValidacion.resultados.textoExtraido && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Texto Extraído</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedValidacion.resultados.textoExtraido}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedValidacion.resultados.camposDetectados && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Campos Detectados</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <pre className="text-sm text-blue-800">
                        {JSON.stringify(selectedValidacion.resultados.camposDetectados, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedValidacion.resultados.erroresEncontrados && selectedValidacion.resultados.erroresEncontrados.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="mr-2 text-red-500" size={16} />
                      Errores Encontrados
                    </h4>
                    <ul className="bg-red-50 p-4 rounded-lg space-y-2">
                      {selectedValidacion.resultados.erroresEncontrados.map((error, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedValidacion.resultados.sugerencias && selectedValidacion.resultados.sugerencias.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Sugerencias de Mejora</h4>
                    <ul className="bg-green-50 p-4 rounded-lg space-y-2">
                      {selectedValidacion.resultados.sugerencias.map((sugerencia, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {sugerencia}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {validaciones.length === 0 && (
        <div className="text-center py-12">
          <Brain size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No hay validaciones de IA
          </h3>
          <p className="text-gray-500">
            Sube documentos y utiliza la IA para validarlos automáticamente
          </p>
        </div>
      )}
    </div>
  );
};

export default AIValidationView;