import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Presupuesto, Cliente, ItemFactura } from '../types';

export const useSupabasePresupuestos = (clientes: Cliente[]) => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar presupuestos desde Supabase
  const cargarPresupuestos = async () => {
    try {
      setLoading(true);
      const { data: presupuestosData, error: presupuestosError } = await supabase
        .from('presupuestos')
        .select(`
          *,
          items_presupuesto (*)
        `)
        .order('created_at', { ascending: false });

      if (presupuestosError) throw presupuestosError;

      const presupuestosFormateados: Presupuesto[] = (presupuestosData || []).map(presupuesto => {
        const cliente = clientes.find(c => c.id === presupuesto.cliente_id);
        
        const items: ItemFactura[] = (presupuesto.items_presupuesto || []).map((item: any) => ({
          id: item.id,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioUnitario: parseFloat(item.precio_unitario),
          total: parseFloat(item.total)
        }));

        return {
          id: presupuesto.id,
          numero: presupuesto.numero,
          clienteId: presupuesto.cliente_id,
          cliente: cliente || { id: presupuesto.cliente_id, nombre: 'Cliente no encontrado' } as Cliente,
          tipoOperacion: presupuesto.tipo_operacion,
          descripcion: presupuesto.descripcion || '',
          items,
          subtotal: parseFloat(presupuesto.subtotal),
          iva: parseFloat(presupuesto.iva),
          total: parseFloat(presupuesto.total),
          estado: presupuesto.estado as any,
          fechaCreacion: new Date(presupuesto.fecha_creacion),
          fechaVencimiento: new Date(presupuesto.fecha_vencimiento),
          notas: presupuesto.notas,
          procesoIds: presupuesto.proceso_ids || [],
          plantillasIds: presupuesto.plantillas_ids || []
        };
      });

      setPresupuestos(presupuestosFormateados);
    } catch (error: any) {
      console.error('Error cargando presupuestos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar presupuesto
  const agregarPresupuesto = async (presupuesto: Omit<Presupuesto, 'id'>) => {
    try {
      // Insertar presupuesto
      const { data: presupuestoData, error: presupuestoError } = await supabase
        .from('presupuestos')
        .insert([{
          numero: presupuesto.numero,
          cliente_id: presupuesto.clienteId,
          tipo_operacion: presupuesto.tipoOperacion,
          descripcion: presupuesto.descripcion,
          subtotal: presupuesto.subtotal,
          iva: presupuesto.iva,
          total: presupuesto.total,
          estado: presupuesto.estado,
          fecha_creacion: presupuesto.fechaCreacion.toISOString(),
          fecha_vencimiento: presupuesto.fechaVencimiento.toISOString(),
          plantillas_ids: presupuesto.plantillasIds || [],
          proceso_ids: presupuesto.procesoIds || [],
          notas: presupuesto.notas
        }])
        .select()
        .single();

      if (presupuestoError) throw presupuestoError;

      // Insertar items
      if (presupuesto.items.length > 0) {
        const itemsData = presupuesto.items.map(item => ({
          presupuesto_id: presupuestoData.id,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from('items_presupuesto')
          .insert(itemsData);

        if (itemsError) throw itemsError;
      }

      // Recargar presupuestos
      await cargarPresupuestos();
    } catch (error: any) {
      console.error('Error agregando presupuesto:', error);
      setError(error.message);
      throw error;
    }
  };

  // Actualizar presupuesto
  const actualizarPresupuesto = async (presupuesto: Presupuesto) => {
    try {
      const { error } = await supabase
        .from('presupuestos')
        .update({
          numero: presupuesto.numero,
          cliente_id: presupuesto.clienteId,
          tipo_operacion: presupuesto.tipoOperacion,
          descripcion: presupuesto.descripcion,
          subtotal: presupuesto.subtotal,
          iva: presupuesto.iva,
          total: presupuesto.total,
          estado: presupuesto.estado,
          fecha_vencimiento: presupuesto.fechaVencimiento.toISOString(),
          plantillas_ids: presupuesto.plantillasIds || [],
          proceso_ids: presupuesto.procesoIds || [],
          notas: presupuesto.notas
        })
        .eq('id', presupuesto.id);

      if (error) throw error;

      // Recargar presupuestos
      await cargarPresupuestos();
    } catch (error: any) {
      console.error('Error actualizando presupuesto:', error);
      setError(error.message);
      throw error;
    }
  };

  // Eliminar presupuesto
  const eliminarPresupuesto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('presupuestos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPresupuestos(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error eliminando presupuesto:', error);
      setError(error.message);
      throw error;
    }
  };

  // Buscar presupuesto por ID
  const buscarPresupuesto = (id: string): Presupuesto | undefined => {
    return presupuestos.find(p => p.id === id);
  };

  // Obtener presupuestos aprobados sin proceso asignado
  const obtenerPresupuestosSinProceso = (): Presupuesto[] => {
    return presupuestos.filter(p => 
      p.estado === 'aprobado' && 
      (!p.procesoIds || p.procesoIds.length === 0)
    );
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (clientes.length > 0) {
      cargarPresupuestos();
    }
  }, [clientes]);

  return {
    presupuestos,
    loading,
    error,
    agregarPresupuesto,
    actualizarPresupuesto,
    eliminarPresupuesto,
    buscarPresupuesto,
    obtenerPresupuestosSinProceso,
    recargar: cargarPresupuestos
  };
};