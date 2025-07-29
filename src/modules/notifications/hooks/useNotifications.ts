import { useState } from 'react';
import { Notificacion } from '../types';

export const useNotifications = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const agregarNotificacion = (notificacion: Notificacion) => {
    setNotificaciones(prev => [...prev, notificacion]);
  };

  const marcarLeida = (id: string) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const eliminarNotificacion = (id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  };

  const marcarTodasLeidas = () => {
    setNotificaciones(prev => 
      prev.map(n => ({ ...n, leida: true }))
    );
  };

  return {
    notificaciones,
    agregarNotificacion,
    marcarLeida,
    eliminarNotificacion,
    marcarTodasLeidas
  };
};