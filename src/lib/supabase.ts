import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          direccion: string | null
          cuit: string | null
          condicion_iva: string
          activo: boolean
          fecha_registro: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          telefono?: string | null
          direccion?: string | null
          cuit?: string | null
          condicion_iva?: string
          activo?: boolean
          fecha_registro?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          direccion?: string | null
          cuit?: string | null
          condicion_iva?: string
          activo?: boolean
          fecha_registro?: string
          created_at?: string
          updated_at?: string
        }
      }
      procesos: {
        Row: {
          id: string
          titulo: string
          descripcion: string
          estado: string
          cliente_id: string
          organismo: string
          fecha_creacion: string
          fecha_vencimiento: string | null
          progreso: number
          costos: number | null
          presupuesto_id: string | null
          facturado: boolean
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion: string
          estado?: string
          cliente_id: string
          organismo: string
          fecha_creacion?: string
          fecha_vencimiento?: string | null
          progreso?: number
          costos?: number | null
          presupuesto_id?: string | null
          facturado?: boolean
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string
          estado?: string
          cliente_id?: string
          organismo?: string
          fecha_creacion?: string
          fecha_vencimiento?: string | null
          progreso?: number
          costos?: number | null
          presupuesto_id?: string | null
          facturado?: boolean
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      presupuestos: {
        Row: {
          id: string
          numero: string
          cliente_id: string
          tipo_operacion: string
          descripcion: string
          subtotal: number
          iva: number
          total: number
          estado: string
          fecha_creacion: string
          fecha_vencimiento: string
          plantillas_ids: string[]
          proceso_ids: string[]
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero: string
          cliente_id: string
          tipo_operacion: string
          descripcion: string
          subtotal: number
          iva: number
          total: number
          estado?: string
          fecha_creacion?: string
          fecha_vencimiento: string
          plantillas_ids?: string[]
          proceso_ids?: string[]
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero?: string
          cliente_id?: string
          tipo_operacion?: string
          descripcion?: string
          subtotal?: number
          iva?: number
          total?: number
          estado?: string
          fecha_creacion?: string
          fecha_vencimiento?: string
          plantillas_ids?: string[]
          proceso_ids?: string[]
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      facturas: {
        Row: {
          id: string
          numero: string
          cliente_id: string
          fecha: string
          fecha_vencimiento: string
          subtotal: number
          iva: number
          total: number
          estado: string
          proceso_id: string | null
          presupuesto_id: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero: string
          cliente_id: string
          fecha: string
          fecha_vencimiento: string
          subtotal: number
          iva: number
          total: number
          estado?: string
          proceso_id?: string | null
          presupuesto_id?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero?: string
          cliente_id?: string
          fecha?: string
          fecha_vencimiento?: string
          subtotal?: number
          iva?: number
          total?: number
          estado?: string
          proceso_id?: string | null
          presupuesto_id?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      items_presupuesto: {
        Row: {
          id: string
          presupuesto_id: string
          descripcion: string
          cantidad: number
          precio_unitario: number
          total: number
          plantilla_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          presupuesto_id: string
          descripcion: string
          cantidad: number
          precio_unitario: number
          total: number
          plantilla_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          presupuesto_id?: string
          descripcion?: string
          cantidad?: number
          precio_unitario?: number
          total?: number
          plantilla_id?: string | null
          created_at?: string
        }
      }
      items_factura: {
        Row: {
          id: string
          factura_id: string
          descripcion: string
          cantidad: number
          precio_unitario: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          factura_id: string
          descripcion: string
          cantidad: number
          precio_unitario: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          factura_id?: string
          descripcion?: string
          cantidad?: number
          precio_unitario?: number
          total?: number
          created_at?: string
        }
      }
      documentos: {
        Row: {
          id: string
          proceso_id: string
          nombre: string
          tipo: string
          estado: string
          url: string | null
          fecha_carga: string | null
          validado: boolean
          tipo_documento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proceso_id: string
          nombre: string
          tipo: string
          estado?: string
          url?: string | null
          fecha_carga?: string | null
          validado?: boolean
          tipo_documento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proceso_id?: string
          nombre?: string
          tipo?: string
          estado?: string
          url?: string | null
          fecha_carga?: string | null
          validado?: boolean
          tipo_documento?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}