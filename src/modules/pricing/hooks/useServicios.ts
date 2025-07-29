import { useState, useEffect } from 'react';
import { ServicioPrecio, NotificacionPrecio } from '../types';

export const useServicios = () => {
  const [servicios, setServicios] = useState<ServicioPrecio[]>([]);
  const [notificaciones, setNotificaciones] = useState<NotificacionPrecio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const serviciosIniciales: ServicioPrecio[] = [
      {
        id: '1',
        nombre: 'Registro Nacional de Establecimiento (RNE)',
        descripcion: 'Trámite completo para registro en ANMAT',
        precio: 15000,
        organismo: 'ANMAT',
        categoria: 'Registros',
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01'),
        plantillaId: 'anmat-rne'
      },
      {
        id: '2',
        nombre: 'Autorización Fitosanitaria de Importación (AFIDI)',
        descripcion: 'Autorización SENASA para importación',
        precio: 8500,
        organismo: 'SENASA',
        categoria: 'Autorizaciones',
        activo: true,
        fechaCreacion: new Date('2024-01-01'),
        fechaActualizacion: new Date('2024-01-01'),
        plantillaId: 'senasa-afidi'
      }
    ];
    
    setServicios(serviciosIniciales);
  }, []);

  const agregarServicio = (servicio: ServicioPrecio) => {
    setServicios(prev => [...prev, servicio]);
  };

  const actualizarServicio = (servicio: ServicioPrecio) => {
    setServicios(prev => 
      prev.map(s => s.id === servicio.id ? servicio : s)
    );
  };

  const eliminarServicio = (id: string) => {
    setServicios(prev => prev.filter(s => s.id !== id));
  };

  const aplicarAumento = (porcentaje: number, categoria?: string) => {
    setServicios(prev => 
      prev.map(servicio => {
        if (!categoria || servicio.categoria === categoria) {
          return {
            ...servicio,
            precio: Math.round(servicio.precio * (1 + porcentaje / 100)),
            fechaActualizacion: new Date()
          };
        }
        return servicio;
      })
    );
  };

  const marcarNotificacionLeida = (id: string) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const agregarNotificacion = (notificacion: NotificacionPrecio) => {
    setNotificaciones(prev => [...prev, notificacion]);
  };

  return {
    servicios,
    notificaciones,
    loading,
    agregarServicio,
    actualizarServicio,
    eliminarServicio,
    aplicarAumento,
    marcarNotificacionLeida,
    agregarNotificacion
  };
};