export interface Presupuesto {
  id: string;
  numero: string;
  clienteId: string;
  cliente: any; // Referencia al cliente
  tipoOperacion: string;
  descripcion: string;
  items: ItemPresupuesto[];
  subtotal: number;
  iva: number;
  total?: number;
  estado: 'borrador' | 'enviado' | 'aprobado' | 'rechazado' | 'vencido';
  fechaCreacion: Date;
  fechaVencimiento: Date;
  notas?: string;
  procesoIds?: string[];
  plantillasIds?: string[];
}

export interface ItemPresupuesto {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}