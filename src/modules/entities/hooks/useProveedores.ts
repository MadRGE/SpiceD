import { useState, useEffect } from 'react';
import { Proveedor, FacturaProveedor } from '../types';

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [facturasProveedores, setFacturasProveedores] = useState<FacturaProveedor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const proveedoresIniciales: Proveedor[] = [
      {
        id: '1',
        nombre: 'Estudio Jurídico Asociados',
        categoria: 'legal',
        cuit: '30-12345678-9',
        contacto: 'Dr. Juan Pérez',
        telefono: '+54 11 4567-8900',
        email: 'contacto@estudiojuridico.com',
        direccion: 'Av. Corrientes 1234, CABA',
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01')
      },
      {
        id: '2',
        nombre: 'Laboratorio de Análisis SA',
        categoria: 'logistica',
        cuit: '30-98765432-1',
        contacto: 'Dra. María González',
        telefono: '+54 11 9876-5432',
        email: 'info@laboratorio.com',
        direccion: 'San Martín 567, Buenos Aires',
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01')
      }
    ];
    
    setProveedores(proveedoresIniciales);
  }, []);

  const agregarProveedor = (proveedor: Proveedor) => {
    setProveedores(prev => [...prev, proveedor]);
  };

  const actualizarProveedor = (proveedor: Proveedor) => {
    setProveedores(prev => 
      prev.map(p => p.id === proveedor.id ? proveedor : p)
    );
  };

  const eliminarProveedor = (id: string) => {
    setProveedores(prev => prev.filter(p => p.id !== id));
  };

  const agregarFacturaProveedor = (factura: FacturaProveedor) => {
    setFacturasProveedores(prev => [...prev, factura]);
  };

  const actualizarFacturaProveedor = (factura: FacturaProveedor) => {
    setFacturasProveedores(prev => 
      prev.map(f => f.id === factura.id ? factura : f)
    );
  };

  const eliminarFacturaProveedor = (id: string) => {
    setFacturasProveedores(prev => prev.filter(f => f.id !== id));
  };

  return {
    proveedores,
    facturasProveedores,
    loading,
    agregarProveedor,
    actualizarProveedor,
    eliminarProveedor,
    agregarFacturaProveedor,
    actualizarFacturaProveedor,
    eliminarFacturaProveedor
  };
};