import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Tipo para Cliente basado en la tabla usuarios
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  fechaRegistro: string;
  activo: boolean;
  documentosImpositivos?: any[];
}

export const useSupabaseClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('rol', 'cliente')
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      const formattedClientes: Cliente[] = (data || []).map(dbUsuario => ({
        id: dbUsuario.id,
        nombre: dbUsuario.nombre,
        email: dbUsuario.email,
        telefono: dbUsuario.telefono || '',
        direccion: dbUsuario.empresa || '', // Usando empresa como dirección temporal
        cuit: '', // No disponible en usuarios
        fechaRegistro: dbUsuario.created_at,
        activo: dbUsuario.activo,
        documentosImpositivos: []
      }));
      
      setClientes(formattedClientes);
    } catch (err: any) {
      console.error('Error cargando clientes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const agregarCliente = async (cliente: Omit<Cliente, 'id' | 'fechaRegistro' | 'activo' | 'documentosImpositivos'>) => {
    try {
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .insert({
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          empresa: cliente.direccion, // Usando empresa como dirección temporal
          rol: 'cliente',
          activo: true
        })
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      await cargarClientes();
      return data;
    } catch (err: any) {
      console.error('Error agregando cliente:', err);
      setError(err.message);
      throw err;
    }
  };

  const actualizarCliente = async (cliente: Cliente) => {
    try {
      setError(null);
      
      const { error: supabaseError } = await supabase
        .from('usuarios')
        .update({
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          empresa: cliente.direccion, // Usando empresa como dirección temporal
          activo: cliente.activo
        })
        .eq('id', cliente.id);

      if (supabaseError) throw supabaseError;
      await cargarClientes();
    } catch (err: any) {
      console.error('Error actualizando cliente:', err);
      setError(err.message);
      throw err;
    }
  };

  const eliminarCliente = async (id: string) => {
    try {
      setError(null);
      
      const { error: supabaseError } = await supabase
        .from('usuarios')
        .update({ activo: false })
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      setClientes(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Error eliminando cliente:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    recargarClientes: cargarClientes
  };
};