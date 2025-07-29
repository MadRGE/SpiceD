import { useState, useEffect } from 'react';
import { Factura, HistorialFactura } from '../types';

export const useFacturas = (clientes: any[]) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [contadorFacturas, setContadorFacturas] = useState(1);
  const [loading, setLoading] = useState(false);

  const generarNumeroFactura = (): string => {
    const año = new Date().getFullYear();
    const numeroFormateado = contadorFacturas.toString().padStart(3, '0');
    return `FAC-${año}-${numeroFormateado}`;
  };

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
      usuario: 'Usuario Actual',
      descripcion,
      datosAnteriores,
      datosNuevos
    };
  };

  useEffect(() => {
    if (clientes.length === 0) return;

    const facturasIniciales: Factura[] = [
      {
        id: '1',
        numero: 'FAC-2024-001',
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
      }
    ];
    
    setFacturas(facturasIniciales);
    setContadorFacturas(2);
  }, [clientes]);

  const agregarFactura = (facturaData: Omit<Factura, 'id' | 'numero' | 'historial'>) => {
    const numeroFactura = generarNumeroFactura();
    const nuevaFactura: Factura = {
      ...facturaData,
      id: Date.now().toString(),
      numero: numeroFactura,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      historial: [
        agregarHistorial(
          '',
          'creacion',
          `Factura ${numeroFactura} creada`
        )
      ]
    };
    
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

  return {
    facturas,
    loading,
    contadorFacturas,
    agregarFactura,
    actualizarFactura,
    eliminarFactura,
    cambiarEstadoFactura,
    generarNumeroFactura
  };
};