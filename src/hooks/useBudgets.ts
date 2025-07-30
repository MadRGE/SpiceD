import { useState, useEffect } from 'react';
import { Presupuesto } from '../types';

export const useBudgets = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Datos iniciales de ejemplo
    const presupuestosIniciales: Presupuesto[] = [
      {
        id: '1',
        numero: 'PRES-2024-001',
        clienteId: '1',
        cliente: {
          id: '1',
          nombre: 'Alimentos SA',
          email: 'contacto@alimentossa.com.ar',
          telefono: '+54 11 4567-8900',
          direccion: 'Av. Corrientes 1234, CABA',
          cuit: '30-12345678-9',
          fechaRegistro: '2024-01-10',
          activo: true
        },
        tipoOperacion: 'Registro ANMAT',
        descripcion: 'Registro Nacional de Establecimiento para nueva planta',
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
        estado: 'enviado',
        fechaCreacion: new Date('2024-01-10'),
        fechaVencimiento: new Date('2024-02-10'),
       notas: 'Incluye asesoría completa y gestión de documentos',
       procesoIds: []
      }
    ];
    
    setPresupuestos(presupuestosIniciales);
  }, []);

  const agregarPresupuesto = (presupuesto: Presupuesto) => {
    setPresupuestos(prev => [...prev, presupuesto]);
  };

  const actualizarPresupuesto = (presupuesto: Presupuesto) => {
    setPresupuestos(prev => 
      prev.map(p => p.id === presupuesto.id ? {
        ...presupuesto,
        fechaActualizacion: new Date()
      } : p)
    );
  };

  const eliminarPresupuesto = (id: string) => {
    setPresupuestos(prev => prev.filter(p => p.id !== id));
  };

  const buscarPresupuesto = (id: string): Presupuesto | undefined => {
    return presupuestos.find(p => p.id === id);
  };

  return {
    presupuestos,
    loading,
    agregarPresupuesto,
    actualizarPresupuesto,
    eliminarPresupuesto,
    buscarPresupuesto
  };
};