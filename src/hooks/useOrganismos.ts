import { useState, useEffect } from 'react';
import { Organismo } from '../types';

export const useOrganismos = () => {
  const [organismos, setOrganismos] = useState<Organismo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const organismosIniciales: Organismo[] = [
      {
        id: '1',
        nombre: 'ANMAT',
        tipo: 'publico',
        contacto: 'Mesa de Ayuda ANMAT',
        telefono: '0800-333-1234',
        email: 'consultas@anmat.gob.ar',
        direccion: 'Av. de Mayo 869, CABA',
        sitioWeb: 'https://www.argentina.gob.ar/anmat',
        tiempoRespuestaPromedio: 30,
        costoPromedio: 12000,
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01')
      },
      {
        id: '2',
        nombre: 'SENASA',
        tipo: 'publico',
        contacto: 'Atención al Público',
        telefono: '0800-999-2386',
        email: 'info@senasa.gob.ar',
        direccion: 'Av. Paseo Colón 367, CABA',
        sitioWeb: 'https://www.senasa.gob.ar',
        tiempoRespuestaPromedio: 20,
        costoPromedio: 8500,
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01')
      },
      {
        id: '3',
        nombre: 'ENACOM',
        tipo: 'publico',
        contacto: 'Mesa de Ayuda',
        telefono: '0800-555-3622',
        email: 'consultas@enacom.gob.ar',
        direccion: 'Perú 103, CABA',
        sitioWeb: 'https://www.enacom.gob.ar',
        tiempoRespuestaPromedio: 45,
        costoPromedio: 15000,
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01')
      }
    ];
    
    setOrganismos(organismosIniciales);
  }, []);

  const agregarOrganismo = (organismo: Organismo) => {
    setOrganismos(prev => [...prev, organismo]);
  };

  const actualizarOrganismo = (organismo: Organismo) => {
    setOrganismos(prev => 
      prev.map(o => o.id === organismo.id ? organismo : o)
    );
  };

  const eliminarOrganismo = (id: string) => {
    setOrganismos(prev => prev.filter(o => o.id !== id));
  };

  return {
    organismos,
    loading,
    agregarOrganismo,
    actualizarOrganismo,
    eliminarOrganismo
  };
};