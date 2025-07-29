export interface ItemFactura {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface Factura {
  id: string;
  numero: string;
  clienteId: string;
  cliente: any; // Referencia al cliente
  fecha: Date;
  fechaVencimiento: Date;
  items: ItemFactura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'borrador' | 'enviada' | 'pagada' | 'vencida';
  notas?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  procesoId?: string;
  historial?: HistorialFactura[];
}

export interface HistorialFactura {
  id: string;
  accion: 'creacion' | 'edicion' | 'eliminacion' | 'cambio_estado';
  fecha: Date;
  usuario: string;
  descripcion: string;
  datosAnteriores?: any;
  datosNuevos?: any;
}

export interface PagoFactura {
  id: string;
  facturaId: string;
  monto: number;
  fecha: Date;
  tipo: 'parcial' | 'total';
  metodoPago: string;
  notas?: string;
}