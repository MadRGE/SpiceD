export interface PlantillaProcedimiento {
  id: string;
  nombre: string;
  organismo: string;
  documentosRequeridos: string[];
  tiempoEstimado: number;
  costo?: number;
  editable?: boolean;
  descripcion?: string;
}