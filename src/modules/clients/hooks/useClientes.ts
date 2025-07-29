import { useState, useEffect } from 'react';
import { Cliente } from '../types';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientesIniciales: Cliente[] = [
      {
        id: '1',
        nombre: 'Alimentos SA',
        email: 'contacto@alimentossa.com.ar',
        telefono: '+54 11 4567-8900',
        direccion: 'Av. Corrientes 1234, CABA',
        cuit: '30-12345678-9',
        condicionIva: 'responsable_inscripto',
        fechaRegistro: '2024-01-10',
        activo: true
      },
      {
        id: '2',
        nombre: 'Importadora del Sur',
        email: 'info@importadorasur.com',
        telefono: '+54 11 9876-5432',
        direccion: 'San Martín 567, Buenos Aires',
        cuit: '30-98765432-1',
        condicionIva: 'responsable_inscripto',
        fechaRegistro: '2024-01-15',
        activo: true
      },
      {
        id: '3',
        nombre: 'Tecnología Avanzada SRL',
        email: 'ventas@tecavanzada.com.ar',
        telefono: '+54 11 5555-1234',
        direccion: 'Microcentro 890, CABA',
        cuit: '30-55555555-5',
        condicionIva: 'monotributo',
        fechaRegistro: '2024-01-20',
        activo: true
      }
    ];
    
    setClientes(clientesIniciales);
  }, []);

  const agregarCliente = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  const actualizarCliente = (cliente: Cliente) => {
    setClientes(prev => 
      prev.map(c => c.id === cliente.id ? cliente : c)
    );
  };

  const eliminarCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const buscarCliente = (id: string): Cliente | undefined => {
    return clientes.find(c => c.id === id);
  };

  return {
    clientes,
    loading,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    buscarCliente
  };
};