import { PlantillaProcedimiento } from '../types';

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
    tiempoEstimado: 30,
    costo: 15000
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
    tiempoEstimado: 45,
    costo: 18000
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
    tiempoEstimado: 20,
    costo: 8500
  },
  {
    id: 'senasa-cert',
    nombre: 'Certificación sanitaria/fitosanitaria',
    organismo: 'SENASA',
    documentosRequeridos: [
      'Solicitud de certificación',
      'Análisis de laboratorio',
      'Certificado de origen',
      'Inspección sanitaria'
    ],
    tiempoEstimado: 15,
    costo: 12000
  },
  // ENACOM (3 procedimientos)
  {
    id: 'enacom-hom',
    nombre: 'Registro/homologación equipos telecomunicaciones',
    organismo: 'ENACOM',
    documentosRequeridos: [
      'Solicitud de homologación',
      'Ensayos de compatibilidad',
      'Manual técnico',
      'Certificado de origen'
    ],
    tiempoEstimado: 45,
    costo: 25000
  }
];