export interface PlantillaProcedimiento {
  id: string;
  nombre: string;
  organismo: string;
  documentosRequeridos: string[];
  tiempoEstimado: number; // días
  costo?: number;
  editable?: boolean;
}

export const organismos = [
  'ANMAT',
  'ANMaC',
  'Dirección Nacional de Reglamentos Técnicos',
  'ENACOM',
  'ENARGAS',
  'RENPRE',
  'Secretaría de Ambiente (Fauna/Flora CITES)',
  'SENASA',
  'Otros'
];

export const plantillasProcedimientos: PlantillaProcedimiento[] = [
  // ANMAT (12 procedimientos)
  {
    id: 'anmat-rne',
    nombre: 'Registro Nacional de Establecimiento (RNE)',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Formulario de solicitud',
      'Plano del establecimiento',
      'Certificado de habilitación municipal',
      'Responsable técnico'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'anmat-rnpa',
    nombre: 'Registro Nacional de Producto Alimenticio (RNPA)',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Formulario de solicitud',
      'Análisis bromatológico',
      'Etiqueta del producto',
      'Certificado de libre venta'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'anmat-autorizacion-importacion',
    nombre: 'Autorización/Aviso de Importación',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Solicitud de autorización',
      'Factura comercial',
      'Certificado de origen',
      'Análisis del producto'
    ],
    tiempoEstimado: 15
  },
  {
    id: 'anmat-libre-venta',
    nombre: 'Certificado de Libre Venta',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Solicitud del certificado',
      'RNPA vigente',
      'Comprobante de pago'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'anmat-habilitacion-establecimientos',
    nombre: 'Habilitación de establecimientos',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Formulario de habilitación',
      'Planos técnicos',
      'Manual de BPM',
      'Certificado municipal'
    ],
    tiempoEstimado: 60
  },
  {
    id: 'anmat-transito-interjurisdiccional',
    nombre: 'Autorización tránsito interjurisdiccional',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Solicitud de tránsito',
      'Documentación del producto',
      'Ruta de transporte'
    ],
    tiempoEstimado: 7
  },
  {
    id: 'anmat-modificaciones-registro',
    nombre: 'Modificaciones al registro',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Solicitud de modificación',
      'Documentación actualizada',
      'Justificación del cambio'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'anmat-monitoreo-pmi',
    nombre: 'Monitoreo ex post (PMI)',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Declaración jurada',
      'Documentación técnica',
      'Certificados de calidad'
    ],
    tiempoEstimado: 15
  },
  {
    id: 'anmat-no-intervencion',
    nombre: 'No intervención para usuarios directos',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Solicitud de no intervención',
      'Justificación técnica',
      'Documentación del producto'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'anmat-cosmeticos',
    nombre: 'Registro de productos cosméticos',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Formulario de registro',
      'Fórmula cualitativa',
      'Etiqueta del producto',
      'Certificado de libre venta'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'anmat-domisanitarios',
    nombre: 'Registro de domisanitarios',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Solicitud de registro',
      'Estudios de eficacia',
      'Ficha de seguridad',
      'Etiqueta y prospecto'
    ],
    tiempoEstimado: 90
  },
  {
    id: 'anmat-suplementos-envases',
    nombre: 'Registro de suplementos/envases',
    organismo: 'ANMAT',
    documentosRequeridos: [
      'Formulario de registro',
      'Certificado de aptitud',
      'Análisis de migración',
      'Especificaciones técnicas'
    ],
    tiempoEstimado: 45
  },

  // ANMaC (5 procedimientos)
  {
    id: 'anmac-autorizacion-importacion',
    nombre: 'Autorización previa importación temporal/definitiva',
    organismo: 'ANMaC',
    documentosRequeridos: [
      'Solicitud de autorización',
      'Certificado de usuario legítimo',
      'Factura comercial',
      'Certificado de origen'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'anmac-registro-armas',
    nombre: 'Registro armas/credencial tenencia',
    organismo: 'ANMaC',
    documentosRequeridos: [
      'Formulario de registro',
      'Certificado médico',
      'Certificado de antecedentes',
      'Comprobante de domicilio'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'anmac-habilitacion-importadores',
    nombre: 'Habilitación importadores',
    organismo: 'ANMaC',
    documentosRequeridos: [
      'Solicitud de habilitación',
      'Estatuto social',
      'Certificado de antecedentes',
      'Garantía bancaria'
    ],
    tiempoEstimado: 60
  },
  {
    id: 'anmac-tramite-expres',
    nombre: 'Trámite exprés digital',
    organismo: 'ANMaC',
    documentosRequeridos: [
      'Formulario digital',
      'Documentación digitalizada',
      'Comprobante de pago'
    ],
    tiempoEstimado: 5
  },
  {
    id: 'anmac-renovacion-credenciales',
    nombre: 'Renovación credenciales',
    organismo: 'ANMaC',
    documentosRequeridos: [
      'Solicitud de renovación',
      'Certificado médico actualizado',
      'Comprobante de pago'
    ],
    tiempoEstimado: 15
  },

  // Dirección Nacional de Reglamentos Técnicos (19 procedimientos)
  {
    id: 'dnrt-certificacion-conformidad',
    nombre: 'Certificación de Conformidad ex post',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de certificación',
      'Ensayos de laboratorio',
      'Manual de usuario',
      'Declaración de conformidad'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'dnrt-marcado-conformidad',
    nombre: 'Marcado conformidad sello/QR',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de marcado',
      'Certificado de conformidad',
      'Diseño del marcado'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'dnrt-certificados-extranjeros',
    nombre: 'Aceptación certificados extranjeros',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado extranjero',
      'Traducción oficial',
      'Solicitud de aceptación'
    ],
    tiempoEstimado: 15
  },
  {
    id: 'dnrt-dispensacion-intervenciones',
    nombre: 'Dispensación intervenciones previas',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de dispensación',
      'Justificación técnica',
      'Documentación del producto'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'dnrt-excepciones-regimenes',
    nombre: 'Excepciones regímenes certificación',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de excepción',
      'Fundamentos técnicos',
      'Documentación alternativa'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'dnrt-certificacion-epp',
    nombre: 'Certificación EPP',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de certificación',
      'Ensayos de laboratorio',
      'Manual de instrucciones',
      'Marcado CE'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'dnrt-eficiencia-energetica',
    nombre: 'Eficiencia energética',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de etiquetado',
      'Ensayos de eficiencia',
      'Ficha técnica',
      'Manual de usuario'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'dnrt-metrologia-simela',
    nombre: 'Metrología legal (SIMELA)',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de aprobación',
      'Certificado de calibración',
      'Manual técnico',
      'Planos constructivos'
    ],
    tiempoEstimado: 60
  },
  {
    id: 'dnrt-homologacion-ascensores',
    nombre: 'Homologación ascensores',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Solicitud de homologación',
      'Planos técnicos',
      'Certificados de componentes',
      'Manual de mantenimiento'
    ],
    tiempoEstimado: 90
  },
  {
    id: 'dnrt-bicicletas-infantiles',
    nombre: 'Bicicletas de Uso Infantil',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de seguridad',
      'Manual de usuario',
      'Etiquetado de seguridad'
    ],
    tiempoEstimado: 25
  },
  {
    id: 'dnrt-encendedores',
    nombre: 'Encendedores',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de seguridad',
      'Instrucciones de uso',
      'Marcado de seguridad'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'dnrt-pilas-baterias',
    nombre: 'Pilas y Baterías',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de seguridad',
      'Etiquetado ambiental',
      'Plan de gestión de residuos'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'dnrt-productos-electricos-construccion',
    nombre: 'Productos Eléctricos para la Construcción',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos eléctricos',
      'Manual de instalación',
      'Marcado de seguridad'
    ],
    tiempoEstimado: 35
  },
  {
    id: 'dnrt-seguridad-electrica',
    nombre: 'Seguridad Eléctrica',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de seguridad eléctrica',
      'Manual de usuario',
      'Marcado de conformidad'
    ],
    tiempoEstimado: 40
  },
  {
    id: 'dnrt-aceros-construccion',
    nombre: 'Aceros para la Construcción',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de calidad',
      'Ensayos mecánicos',
      'Certificado de origen',
      'Análisis químico'
    ],
    tiempoEstimado: 25
  },
  {
    id: 'dnrt-cementos',
    nombre: 'Cementos',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de resistencia',
      'Análisis químico',
      'Certificado de calidad'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'dnrt-maderas-compensado',
    nombre: 'Maderas y Compensado',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de calidad',
      'Certificado fitosanitario',
      'Tratamiento NIMF-15'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'dnrt-monturas-gafas',
    nombre: 'Monturas de Gafas y Anteojos de Sol',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos ópticos',
      'Certificado UV',
      'Manual de usuario'
    ],
    tiempoEstimado: 25
  },
  {
    id: 'dnrt-juguetes',
    nombre: 'Juguetes',
    organismo: 'Dirección Nacional de Reglamentos Técnicos',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos de seguridad',
      'Análisis de materiales',
      'Etiquetado de edad'
    ],
    tiempoEstimado: 35
  },

  // ENACOM (3 procedimientos)
  {
    id: 'enacom-registro-homologacion',
    nombre: 'Registro/homologación equipos telecomunicaciones',
    organismo: 'ENACOM',
    documentosRequeridos: [
      'Solicitud de homologación',
      'Ensayos de compatibilidad',
      'Manual técnico',
      'Certificado de origen'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'enacom-certificacion-conformidad',
    nombre: 'Certificación conformidad',
    organismo: 'ENACOM',
    documentosRequeridos: [
      'Certificado de conformidad',
      'Ensayos técnicos',
      'Declaración de conformidad',
      'Manual de usuario'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'enacom-excepciones-regimenes',
    nombre: 'Excepciones regímenes',
    organismo: 'ENACOM',
    documentosRequeridos: [
      'Solicitud de excepción',
      'Justificación técnica',
      'Documentación alternativa'
    ],
    tiempoEstimado: 20
  },

  // ENARGAS (2 procedimientos)
  {
    id: 'enargas-homologacion-equipos',
    nombre: 'Homologación de equipos y componentes para gas',
    organismo: 'ENARGAS',
    documentosRequeridos: [
      'Solicitud de homologación',
      'Ensayos de seguridad',
      'Manual técnico',
      'Certificado de calidad'
    ],
    tiempoEstimado: 60
  },
  {
    id: 'enargas-certificacion-seguridad',
    nombre: 'Certificación de seguridad',
    organismo: 'ENARGAS',
    documentosRequeridos: [
      'Certificado de seguridad',
      'Ensayos de presión',
      'Manual de instalación',
      'Planos técnicos'
    ],
    tiempoEstimado: 45
  },

  // RENPRE (8 procedimientos)
  {
    id: 'renpre-inscripcion-reinscripcion',
    nombre: 'Inscripción y Reinscripción',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Formulario de inscripción',
      'Estatuto social',
      'Certificado de antecedentes',
      'Comprobante de domicilio'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'renpre-certificados-importacion-exportacion',
    nombre: 'Certificados de Importación y Exportación',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Solicitud de certificado',
      'Factura comercial',
      'Lista de empaque',
      'Certificado de origen'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'renpre-presentacion-despachos',
    nombre: 'Presentación de despachos DGA',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Despacho de importación/exportación',
      'Documentación aduanera',
      'Comprobantes de pago'
    ],
    tiempoEstimado: 5
  },
  {
    id: 'renpre-modificaciones-registro',
    nombre: 'Modificaciones al registro',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Solicitud de modificación',
      'Documentación actualizada',
      'Justificación del cambio'
    ],
    tiempoEstimado: 15
  },
  {
    id: 'renpre-renovacion-anual',
    nombre: 'Renovación anual de certificado',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Solicitud de renovación',
      'Balance del ejercicio',
      'Comprobante de pago'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'renpre-consultas-certificados',
    nombre: 'Consultas de certificados',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Solicitud de consulta',
      'Número de certificado',
      'Identificación del solicitante'
    ],
    tiempoEstimado: 2
  },
  {
    id: 'renpre-autorizaciones-comercio-exterior',
    nombre: 'Autorizaciones para comercio exterior',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Solicitud de autorización',
      'Plan de negocios',
      'Garantías bancarias'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'renpre-autorizacion-previa-ifa',
    nombre: 'Autorización Previa Importación IFA',
    organismo: 'RENPRE',
    documentosRequeridos: [
      'Solicitud IFA',
      'Factura proforma',
      'Justificación de importación'
    ],
    tiempoEstimado: 15
  },

  // Secretaría de Ambiente (6 procedimientos)
  {
    id: 'ambiente-cites-import-export',
    nombre: 'Certificado CITES import/export/reexport',
    organismo: 'Secretaría de Ambiente (Fauna/Flora CITES)',
    documentosRequeridos: [
      'Solicitud CITES',
      'Certificado de origen',
      'Permiso del país de origen',
      'Factura comercial'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'ambiente-permiso-fauna-flora',
    nombre: 'Permiso de Importación de Fauna/Flora',
    organismo: 'Secretaría de Ambiente (Fauna/Flora CITES)',
    documentosRequeridos: [
      'Solicitud de permiso',
      'Certificado sanitario',
      'Plan de manejo',
      'Destino final'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'ambiente-certificado-flora-silvestre',
    nombre: 'Certificado de Flora Silvestre',
    organismo: 'Secretaría de Ambiente (Fauna/Flora CITES)',
    documentosRequeridos: [
      'Solicitud de certificado',
      'Identificación botánica',
      'Origen de la flora',
      'Uso previsto'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'ambiente-autorizacion-no-comercial',
    nombre: 'Autorización ambiental no comercial',
    organismo: 'Secretaría de Ambiente (Fauna/Flora CITES)',
    documentosRequeridos: [
      'Solicitud de autorización',
      'Justificación científica',
      'Plan de investigación'
    ],
    tiempoEstimado: 25
  },
  {
    id: 'ambiente-anulacion-cites',
    nombre: 'Anulación de Certificados CITES',
    organismo: 'Secretaría de Ambiente (Fauna/Flora CITES)',
    documentosRequeridos: [
      'Solicitud de anulación',
      'Certificado original',
      'Justificación de anulación'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'ambiente-no-intervencion-especies',
    nombre: 'No intervención para especies no listadas',
    organismo: 'Secretaría de Ambiente (Fauna/Flora CITES)',
    documentosRequeridos: [
      'Solicitud de no intervención',
      'Identificación de especies',
      'Certificado de no inclusión'
    ],
    tiempoEstimado: 15
  },

  // SENASA (9 procedimientos)
  {
    id: 'senasa-afidi',
    nombre: 'Autorización Fitosanitaria de Importación (AFIDI)',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud AFIDI',
      'Factura proforma',
      'Análisis de riesgo de plagas',
      'Certificado fitosanitario'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'senasa-certificacion-sanitaria',
    nombre: 'Certificación sanitaria/fitosanitaria',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud de certificación',
      'Análisis de laboratorio',
      'Certificado de origen',
      'Inspección sanitaria'
    ],
    tiempoEstimado: 15
  },
  {
    id: 'senasa-inscripcion-autogestion',
    nombre: 'Inscripción simplificada por autogestión',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Formulario de autogestión',
      'Declaración jurada',
      'Comprobante de pago'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'senasa-equivalencia-veterinarios',
    nombre: 'Autorización por equivalencia para productos veterinarios',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud de equivalencia',
      'Certificado de registro extranjero',
      'Estudios de bioequivalencia',
      'Dossier técnico'
    ],
    tiempoEstimado: 60
  },
  {
    id: 'senasa-cuarentena-post-entrada',
    nombre: 'Cuarentena Post Entrada (CPE)',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud CPE',
      'Plan de cuarentena',
      'Instalaciones aprobadas',
      'Protocolo sanitario'
    ],
    tiempoEstimado: 90
  },
  {
    id: 'senasa-registro-establecimientos',
    nombre: 'Registro de establecimientos importadores',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud de registro',
      'Plano del establecimiento',
      'Manual de procedimientos',
      'Responsable técnico'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'senasa-aptitud-uso-industrial',
    nombre: 'Certificado de aptitud para uso industrial',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud de aptitud',
      'Proceso industrial',
      'Análisis del producto',
      'Destino final'
    ],
    tiempoEstimado: 25
  },
  {
    id: 'senasa-autorizacion-fitosanitarios',
    nombre: 'Certificado de Autorización de Importación de Fitosanitarios y Fertilizantes',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud de autorización',
      'Registro del producto',
      'Ficha de seguridad',
      'Etiqueta del producto'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'senasa-declaracion-fin-fabricacion',
    nombre: 'Declaración Fin de Fabricación/Importación',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Declaración jurada',
      'Inventario final',
      'Comprobantes de destrucción'
    ],
    tiempoEstimado: 15
  },

  // Otros (12 procedimientos)
  {
    id: 'inv-certificados-vinos',
    nombre: 'INV Certificados calidad/origen vinos/alcoholes',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de certificado',
      'Análisis enológico',
      'Certificado de origen',
      'Registro de bodega'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'ctit-desbloqueos',
    nombre: 'CTIT Solicitud de Desbloqueos',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de desbloqueo',
      'Justificación técnica',
      'Documentación del vehículo'
    ],
    tiempoEstimado: 15
  },
  {
    id: 'ctit-tipificaciones-admision-temporaria',
    nombre: 'CTIT Solicitudes de Tipificaciones por Admisión Temporaria 360 días/10 años',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de tipificación',
      'Plan de uso temporal',
      'Garantías bancarias',
      'Cronograma de actividades'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'chas-certificacion-autopartes',
    nombre: 'CHAS Certificación Local de Autopartes',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de certificación',
      'Especificaciones técnicas',
      'Ensayos de calidad',
      'Certificado de origen'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'civac-vehiculos-clasicos',
    nombre: 'CIVAC Gestión de certificados de importación para vehículos clásicos',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud CIVAC',
      'Certificado de antigüedad',
      'Documentación del vehículo',
      'Valuación técnica'
    ],
    tiempoEstimado: 60
  },
  {
    id: 'lcm-lca-vehiculos',
    nombre: 'LCM/LCA Gestión de certificaciones para vehículos/componentes',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud LCM/LCA',
      'Certificado de conformidad',
      'Ensayos de homologación',
      'Manual técnico'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'draw-back-tipificacion',
    nombre: 'Draw-Back Solicitud de Tipificación',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de tipificación',
      'Plan de exportación',
      'Insumos importados',
      'Proceso productivo'
    ],
    tiempoEstimado: 30
  },
  {
    id: 'exportacion-temporal-perfeccionamiento',
    nombre: 'Exportación Temporal para perfeccionamiento/repairs',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de exportación temporal',
      'Contrato de reparación',
      'Cronograma de trabajos',
      'Garantías'
    ],
    tiempoEstimado: 20
  },
  {
    id: 'igm-mapas-cartograficos',
    nombre: 'IGM Intervención para mapas/cartográficos',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de intervención',
      'Material cartográfico',
      'Uso previsto',
      'Autorización de uso'
    ],
    tiempoEstimado: 25
  },
  {
    id: 'nimf-15-maderas',
    nombre: 'NIMF-15 Certificación maderas embalaje',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de certificación',
      'Tratamiento fitosanitario',
      'Certificado de origen',
      'Marcado NIMF-15'
    ],
    tiempoEstimado: 10
  },
  {
    id: 'vehiculos-electricos-aranceles',
    nombre: 'Vehículos Automotores Eléctricos Gestión de baja de Aranceles',
    organismo: 'Otros',
    documentosRequeridos: [
      'Solicitud de beneficio',
      'Certificado de vehículo eléctrico',
      'Especificaciones técnicas',
      'Plan de inversión'
    ],
    tiempoEstimado: 45
  },
  {
    id: 'declaracion-bienes-usados',
    nombre: 'Declaración Jurada para importación de bienes usados (ex-CIBU)',
    organismo: 'Otros',
    documentosRequeridos: [
      'Declaración jurada',
      'Certificado de uso',
      'Valuación técnica',
      'Fotografías del bien'
    ],
    tiempoEstimado: 15
  }
];