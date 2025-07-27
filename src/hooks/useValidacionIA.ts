import { useState, useEffect } from 'react';
import { ValidacionIA, Documento } from '../types';

// TODO: Integrar con OpenAI API para validación real
export const useValidacionIA = () => {
  const [validaciones, setValidaciones] = useState<ValidacionIA[]>([]);
  const [loading, setLoading] = useState(false);

  // Simular algunos datos iniciales para demostración
  useEffect(() => {
    const validacionesIniciales: ValidacionIA[] = [
      {
        id: '1',
        documentoId: 'doc1',
        estado: 'completada',
        confianza: 95,
        resultados: {
          textoExtraido: 'CERTIFICADO DE ORIGEN\nProducto: Maquinaria Industrial\nPaís de Origen: Alemania\nFecha: 15/01/2024',
          camposDetectados: {
            tipoDocumento: 'Certificado de Origen',
            producto: 'Maquinaria Industrial',
            paisOrigen: 'Alemania',
            fecha: '15/01/2024'
          },
          sugerencias: [
            'El documento está completo y cumple con los requisitos',
            'Verificar que la fecha no esté vencida'
          ]
        },
        fechaProcesamiento: new Date('2024-01-16')
      },
      {
        id: '2',
        documentoId: 'doc2',
        estado: 'error',
        confianza: 0,
        resultados: {
          erroresEncontrados: [
            'No se pudo extraer texto del documento',
            'La calidad de la imagen es muy baja',
            'Formato de archivo no compatible'
          ],
          sugerencias: [
            'Volver a escanear el documento con mejor calidad',
            'Asegurarse de que el documento esté completo',
            'Usar formato PDF o imagen de alta resolución'
          ]
        },
        fechaProcesamiento: new Date('2024-01-17')
      }
    ];
    
    setValidaciones(validacionesIniciales);
  }, []);

  const validarDocumento = async (documentoId: string): Promise<void> => {
    setLoading(true);
    
    // Crear nueva validación en estado pendiente
    const nuevaValidacion: ValidacionIA = {
      id: Math.random().toString(36).substr(2, 9),
      documentoId,
      estado: 'pendiente',
      confianza: 0,
      resultados: {},
      fechaProcesamiento: new Date()
    };
    
    setValidaciones(prev => [...prev, nuevaValidacion]);

    // Simular procesamiento con IA
    setTimeout(() => {
      // Cambiar a procesando
      setValidaciones(prev => 
        prev.map(v => 
          v.id === nuevaValidacion.id 
            ? { ...v, estado: 'procesando' }
            : v
        )
      );

      // Simular resultado después de 3 segundos
      setTimeout(() => {
        const resultadoSimulado: ValidacionIA = {
          ...nuevaValidacion,
          estado: 'completada',
          confianza: Math.floor(Math.random() * 40) + 60, // 60-100%
          resultados: {
            textoExtraido: 'Texto extraído del documento...',
            camposDetectados: {
              tipoDocumento: 'Documento detectado',
              fecha: new Date().toLocaleDateString('es-AR')
            },
            sugerencias: [
              'El documento parece estar en orden',
              'Verificar información adicional si es necesario'
            ]
          },
          fechaProcesamiento: new Date()
        };

        setValidaciones(prev => 
          prev.map(v => 
            v.id === nuevaValidacion.id ? resultadoSimulado : v
          )
        );
        setLoading(false);
      }, 3000);
    }, 1000);
  };

  const reintentarValidacion = async (validacionId: string): Promise<void> => {
    setValidaciones(prev => 
      prev.map(v => 
        v.id === validacionId 
          ? { ...v, estado: 'pendiente', fechaProcesamiento: new Date() }
          : v
      )
    );

    // Simular nuevo procesamiento
    setTimeout(() => {
      validarDocumento(
        validaciones.find(v => v.id === validacionId)?.documentoId || ''
      );
    }, 500);
  };

  const obtenerValidacionPorDocumento = (documentoId: string): ValidacionIA | undefined => {
    return validaciones.find(v => v.documentoId === documentoId);
  };

  return {
    validaciones,
    loading,
    validarDocumento,
    reintentarValidacion,
    obtenerValidacionPorDocumento
  };
};