import { useState, useEffect } from 'react';
import { Factura, Cliente, HistorialFactura } from '../types';

// TODO: Integrar con Supabase para persistencia de datos
export const useFacturas = (clientes: Cliente[]) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [contadorFacturas, setContadorFacturas] = useState(1);
  const [loading, setLoading] = useState(false);

  // Función para generar número de factura automático
  const generarNumeroFactura = (): string => {
    const año = new Date().getFullYear();
    const numeroFormateado = contadorFacturas.toString().padStart(3, '0');
    return `FAC-${año}-${numeroFormateado}`;
  };

  // Función para agregar entrada al historial
  const agregarHistorial = (
    facturaId: string, 
    accion: 'creacion' | 'edicion' | 'eliminacion' | 'cambio_estado',
    descripcion: string,
    datosAnteriores?: any,
    datosNuevos?: any
  ): HistorialFactura => {
    return {
      id: Date.now().toString(),
      accion,
      fecha: new Date(),
      usuario: 'Usuario Actual', // TODO: Obtener del sistema de autenticación
      descripcion,
      datosAnteriores,
      datosNuevos
    };
  };

  // Simular algunos datos iniciales para demostración
  useEffect(() => {
    if (clientes.length === 0) return;

    const facturasIniciales: Factura[] = [
      {
        id: '1',
        numero: 'FAC-2024-001',
        tipo: 'cliente',
        clienteId: clientes[0].id,
        cliente: clientes[0],
        fecha: new Date('2024-01-15'),
        fechaVencimiento: new Date('2024-02-15'),
        items: [
          {
            id: '1',
            descripcion: 'Gestión RNE - ANMAT',
            cantidad: 1,
            precioUnitario: 15000,
            total: 15000
          }
        ],
        subtotal: 15000,
        iva: 3150,
        total: 18150,
        estado: 'enviada',
        notas: 'Proceso de registro nacional de establecimiento',
        fechaCreacion: new Date('2024-01-15'),
        fechaActualizacion: new Date('2024-01-15'),
        historial: [
          {
            id: '1',
            accion: 'creacion',
            fecha: new Date('2024-01-15'),
            usuario: 'Sistema',
            descripcion: 'Factura creada inicialmente'
          }
        ]
      },
      {
        id: '2',
        numero: 'FAC-2024-002',
        tipo: 'cliente',
        clienteId: clientes[1].id,
        cliente: clientes[1],
        fecha: new Date('2024-01-20'),
        fechaVencimiento: new Date('2024-02-20'),
        items: [
          {
            id: '2',
            descripcion: 'AFIDI - SENASA',
            cantidad: 1,
            precioUnitario: 8500,
            total: 8500
          }
        ],
        subtotal: 8500,
        iva: 1785,
        total: 10285,
        estado: 'pagada',
        fechaCreacion: new Date('2024-01-20'),
        fechaActualizacion: new Date('2024-01-25'),
        historial: [
          {
            id: '2',
            accion: 'creacion',
            fecha: new Date('2024-01-20'),
            usuario: 'Sistema',
            descripcion: 'Factura creada inicialmente'
          },
          {
            id: '3',
            accion: 'cambio_estado',
            fecha: new Date('2024-01-25'),
            usuario: 'Sistema',
            descripcion: 'Estado cambiado de enviada a pagada'
          }
        ]
      }
    ];
    
    setFacturas(facturasIniciales);
    setContadorFacturas(3); // Siguiente número disponible
  }, [clientes]);

  const agregarFactura = (facturaData: Omit<Factura, 'id' | 'numero' | 'historial'>) => {
    const numeroFactura = generarNumeroFactura();
    const nuevaFactura: Factura = {
      ...facturaData,
      id: Date.now().toString(),
      numero: numeroFactura,
      tipo: facturaData.tipo || 'cliente',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      historial: [
        agregarHistorial(
          '', // Se actualizará después
          'creacion',
          `Factura ${numeroFactura} creada`
        )
      ]
    };
    
    // Actualizar el ID en el historial
    nuevaFactura.historial[0].id = nuevaFactura.id;
    
    setFacturas(prev => [...prev, nuevaFactura]);
    setContadorFacturas(prev => prev + 1);
    
    return nuevaFactura;
  };

  const actualizarFactura = (facturaActualizada: Factura) => {
    const facturaAnterior = facturas.find(f => f.id === facturaActualizada.id);
    
    setFacturas(prev => 
      prev.map(f => {
        if (f.id === facturaActualizada.id) {
          const nuevaEntradaHistorial = agregarHistorial(
            f.id,
            'edicion',
            `Factura ${f.numero} editada`,
            facturaAnterior,
            facturaActualizada
          );
          
          return {
            ...facturaActualizada,
            fechaActualizacion: new Date(),
            historial: [...(f.historial || []), nuevaEntradaHistorial]
          };
        }
        return f;
      })
    );
  };

  const eliminarFactura = (id: string) => {
    const factura = facturas.find(f => f.id === id);
    if (factura) {
      // Agregar entrada de eliminación al historial antes de eliminar
      const entradaEliminacion = agregarHistorial(
        id,
        'eliminacion',
        `Factura ${factura.numero} eliminada`,
        factura
      );
      
      // En una implementación real, podrías guardar este historial en una tabla separada
      console.log('Factura eliminada:', entradaEliminacion);
    }
    
    setFacturas(prev => prev.filter(f => f.id !== id));
  };

  const cambiarEstadoFactura = (id: string, nuevoEstado: 'borrador' | 'enviada' | 'pagada' | 'vencida') => {
    setFacturas(prev => 
      prev.map(f => {
        if (f.id === id) {
          const nuevaEntradaHistorial = agregarHistorial(
            id,
            'cambio_estado',
            `Estado cambiado de ${f.estado} a ${nuevoEstado}`,
            { estado: f.estado },
            { estado: nuevoEstado }
          );
          
          return {
            ...f,
            estado: nuevoEstado,
            fechaActualizacion: new Date(),
            historial: [...(f.historial || []), nuevaEntradaHistorial]
          };
        }
        return f;
      })
    );
  };

  const buscarFactura = (id: string): Factura | undefined => {
    return facturas.find(f => f.id === id);
  };

  const obtenerFacturasPorCliente = (clienteId: string): Factura[] => {
    return facturas.filter(f => f.clienteId === clienteId);
  };

  const obtenerHistorialFactura = (facturaId: string): HistorialFactura[] => {
    const factura = facturas.find(f => f.id === facturaId);
    return factura?.historial || [];
  };

  return {
    facturas,
    loading,
    contadorFacturas,
    agregarFactura,
    actualizarFactura,
    eliminarFactura,
    cambiarEstadoFactura,
    buscarFactura,
    obtenerFacturasPorCliente,
    obtenerHistorialFactura,
    generarNumeroFactura
  };
};