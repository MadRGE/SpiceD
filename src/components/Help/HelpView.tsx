import React, { useState } from 'react';
import { HelpCircle, Book, Video, MessageCircle, Search, ChevronDown, ChevronRight } from 'lucide-react';

const HelpView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('faq');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      id: 'facturacion-impuestos',
      categoria: 'Facturación',
      pregunta: '¿Cómo calcular los impuestos en facturación?',
      respuesta: `Para calcular los impuestos en el sistema:

1. **IVA (21% por defecto)**: Se aplica automáticamente sobre el subtotal
2. **Ganancias**: Se calcula según el porcentaje configurado (35% por defecto)
3. **Configuración**: Puedes cambiar estos porcentajes en Configuración > Facturación

**Ejemplo de cálculo:**
- Subtotal: $10,000
- IVA (21%): $2,100
- Total con IVA: $12,100
- Ganancias (35% sobre subtotal): $3,500

El sistema calcula automáticamente estos valores cuando creas una factura.`
    },
    {
      id: 'kanban-uso',
      categoria: 'Tablero Kanban',
      pregunta: '¿Cómo usar el tablero Kanban?',
      respuesta: `El tablero Kanban te permite gestionar el flujo de tus procesos:

**Estados disponibles:**
1. **Pendiente**: Procesos recién creados
2. **Recopilación de Docs**: Reuniendo documentación
3. **Enviado**: Enviado al organismo
4. **En Revisión**: Siendo revisado por el organismo
5. **Aprobado**: Proceso completado exitosamente
6. **Rechazado**: Proceso rechazado, requiere acción
7. **Archivado**: Procesos finalizados

**Cómo usar:**
- Arrastra las tarjetas entre columnas para cambiar estados
- Haz clic en una tarjeta para editarla
- Las tarjetas muestran información clave: cliente, fechas, progreso, documentos`
    },
    {
      id: 'documentos-validacion',
      categoria: 'Documentos',
      pregunta: '¿Cómo funciona la validación IA de documentos?',
      respuesta: `La validación IA utiliza OpenAI para analizar documentos:

**Proceso:**
1. Sube el documento (PDF, imagen)
2. La IA extrae texto y analiza contenido
3. Detecta campos importantes automáticamente
4. Proporciona sugerencias de mejora
5. Asigna un nivel de confianza (0-100%)

**Estados de validación:**
- **Pendiente**: Esperando validación
- **Procesando**: IA analizando el documento
- **Completada**: Validación exitosa
- **Error**: Problema en la validación

**Configuración:** Necesitas configurar tu API key de OpenAI en Configuración > API Keys`
    },
    {
      id: 'plantillas-uso',
      categoria: 'Plantillas',
      pregunta: '¿Cómo usar las plantillas de procedimientos?',
      respuesta: `Las plantillas aceleran la creación de procesos:

**76 plantillas disponibles** organizadas por organismo:
- ANMAT (12 procedimientos)
- SENASA (9 procedimientos)
- ENACOM (3 procedimientos)
- Y muchos más...

**Cómo usar:**
1. Ve a la sección "Plantillas"
2. Busca o filtra por organismo
3. Selecciona la plantilla deseada
4. Haz clic en "Crear Proceso con esta Plantilla"
5. Se creará automáticamente con documentos requeridos

**Beneficios:**
- Documentos requeridos pre-cargados
- Tiempos estimados incluidos
- Costos sugeridos
- Información del organismo`
    },
    {
      id: 'clientes-gestion',
      categoria: 'Clientes',
      pregunta: '¿Cómo gestionar clientes y sus documentos?',
      respuesta: `Gestión completa de clientes:

**Información básica:**
- Nombre, email, teléfono
- CUIT y condición IVA
- Dirección y datos de contacto

**Documentos impositivos:**
- Certificado de CUIT
- Constancia de Inscripción AFIP
- Certificados fiscales
- Otros documentos requeridos

**Funcionalidades:**
- Búsqueda y filtros
- Asociación con procesos
- Historial de facturación
- Estados de documentos`
    },
    {
      id: 'organismos-proveedores',
      categoria: 'Organismos y Proveedores',
      pregunta: '¿Cómo gestionar organismos y proveedores?',
      respuesta: `**Organismos:**
- Información de contacto completa
- Tiempos de respuesta promedio
- Costos estimados
- Tipos: Público/Privado

**Proveedores:**
- Categorías: Logística, Legal, Gobierno, Otro
- Gestión de facturas asociadas
- Información fiscal (CUIT)
- Seguimiento de pagos

**Facturas de proveedores:**
- Asociación con procesos específicos
- Cálculo automático de IVA
- Estados: Pendiente, Pagada, Vencida
- Reportes de gastos`
    },
    {
      id: 'precios-aumentos',
      categoria: 'Lista de Precios',
      pregunta: '¿Cómo gestionar precios y aplicar aumentos?',
      respuesta: `**Lista de precios:**
- Precios por servicio/procedimiento
- Organización por categorías
- Asociación con organismos
- Historial de cambios

**Aplicar aumentos:**
1. Ve a Lista de Precios > Aplicar Aumentos
2. Define el porcentaje de aumento
3. Selecciona categoría (opcional)
4. Revisa la vista previa
5. Aplica el aumento

**Notificaciones:**
- Alertas por precios faltantes
- Nuevos procedimientos sin precio
- Actualizaciones necesarias

**Integración:** Los precios se integran automáticamente con la facturación`
    },
    {
      id: 'reportes-analytics',
      categoria: 'Reportes',
      pregunta: '¿Qué reportes están disponibles?',
      respuesta: `**Métricas principales:**
- Total de procesos activos/completados
- Tasa de éxito por organismo
- Tiempo promedio de procesamiento
- Costos totales y promedios

**Gráficos disponibles:**
- Procesos por estado
- Distribución por organismo
- Tendencias temporales
- Análisis de rentabilidad

**Exportación:**
- Datos en formato CSV
- Reportes personalizables
- Filtros por fecha/cliente/organismo

**Análisis de impuestos:**
- IVA pendiente de pago
- Ganancias calculadas
- Resumen fiscal mensual`
    }
  ];

  const guiaRapida = [
    {
      titulo: 'Crear tu primer proceso',
      pasos: [
        'Haz clic en "Nuevo Proceso" en el tablero principal',
        'Selecciona una plantilla o crea desde cero',
        'Completa la información del cliente y proceso',
        'Agrega los documentos requeridos',
        'Guarda y comienza a gestionar el proceso'
      ]
    },
    {
      titulo: 'Configurar la aplicación',
      pasos: [
        'Ve a Configuración en el menú lateral',
        'Completa tu información empresarial',
        'Configura las API keys (OpenAI para IA)',
        'Ajusta las preferencias de notificaciones',
        'Configura los porcentajes de impuestos'
      ]
    },
    {
      titulo: 'Gestionar documentos',
      pasos: [
        'Abre un proceso desde el tablero Kanban',
        'Ve a la pestaña "Documentos"',
        'Sube los archivos requeridos',
        'Usa la validación IA para verificar contenido',
        'Marca como validados los documentos correctos'
      ]
    }
  ];

  const filteredFaq = faqData.filter(item =>
    item.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.respuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorias = [...new Set(faqData.map(item => item.categoria))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Centro de Ayuda</h2>
        <div className="text-sm text-gray-600">
          ¿Necesitas ayuda? Encuentra respuestas aquí
        </div>
      </div>

      {/* Navegación */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveSection('faq')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeSection === 'faq'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <HelpCircle size={16} />
              <span>Preguntas Frecuentes</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSection('guia')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeSection === 'guia'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Book size={16} />
              <span>Guía Rápida</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeSection === 'faq' && (
            <div className="space-y-6">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar en preguntas frecuentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSearchTerm('')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    searchTerm === '' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setSearchTerm(categoria)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      searchTerm === categoria 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {categoria}
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFaq.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
                          {item.categoria}
                        </span>
                        <h3 className="font-medium text-gray-800">{item.pregunta}</h3>
                      </div>
                      {expandedFaq === item.id ? (
                        <ChevronDown className="text-gray-400" size={20} />
                      ) : (
                        <ChevronRight className="text-gray-400" size={20} />
                      )}
                    </button>
                    
                    {expandedFaq === item.id && (
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <div className="pt-4 text-gray-700 whitespace-pre-line">
                          {item.respuesta}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaq.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'guia' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Guía Rápida de Uso
                </h3>
                <p className="text-gray-600">
                  Aprende a usar las funciones principales de la aplicación
                </p>
              </div>

              {guiaRapida.map((guia, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {guia.titulo}
                  </h4>
                  <ol className="space-y-2 ml-11">
                    {guia.pasos.map((paso, pasoIndex) => (
                      <li key={pasoIndex} className="flex items-start">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">
                          {pasoIndex + 1}
                        </span>
                        <span className="text-gray-700">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}

              {/* Recursos adicionales */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-4">Recursos Adicionales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Video className="text-blue-600" size={20} />
                    <div>
                      <h5 className="font-medium text-blue-800">Videos Tutoriales</h5>
                      <p className="text-sm text-blue-700">Próximamente disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="text-blue-600" size={20} />
                    <div>
                      <h5 className="font-medium text-blue-800">Soporte Técnico</h5>
                      <p className="text-sm text-blue-700">Contacta para ayuda personalizada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpView;