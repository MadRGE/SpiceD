/*
  # Esquema inicial para aplicación de gestión de importación/exportación

  1. Nuevas tablas
    - `clientes` - Información de clientes
    - `procesos` - Procesos de importación/exportación
    - `presupuestos` - Presupuestos para clientes
    - `facturas` - Facturas emitidas
    - `items_presupuesto` - Items de presupuestos
    - `items_factura` - Items de facturas
    - `documentos` - Documentos asociados a procesos

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para usuarios autenticados
*/

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL UNIQUE,
  telefono text,
  direccion text,
  cuit text,
  condicion_iva text DEFAULT 'responsable_inscripto',
  activo boolean DEFAULT true,
  fecha_registro timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de presupuestos
CREATE TABLE IF NOT EXISTS presupuestos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  tipo_operacion text NOT NULL,
  descripcion text,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  iva decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  estado text DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado', 'aprobado', 'rechazado', 'vencido')),
  fecha_creacion timestamptz DEFAULT now(),
  fecha_vencimiento timestamptz NOT NULL,
  plantillas_ids text[] DEFAULT '{}',
  proceso_ids text[] DEFAULT '{}',
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de procesos
CREATE TABLE IF NOT EXISTS procesos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'recopilacion', 'enviado', 'revision', 'aprobado', 'rechazado', 'archivado')),
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  organismo text NOT NULL,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_vencimiento timestamptz,
  progreso integer DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
  costos decimal(10,2),
  presupuesto_id uuid REFERENCES presupuestos(id) ON DELETE SET NULL,
  facturado boolean DEFAULT false,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de facturas
CREATE TABLE IF NOT EXISTS facturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE,
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  fecha timestamptz NOT NULL,
  fecha_vencimiento timestamptz NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  iva decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  estado text DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviada', 'pagada', 'vencida', 'cancelada')),
  proceso_id uuid REFERENCES procesos(id) ON DELETE SET NULL,
  presupuesto_id uuid REFERENCES presupuestos(id) ON DELETE SET NULL,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de items de presupuesto
CREATE TABLE IF NOT EXISTS items_presupuesto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presupuesto_id uuid REFERENCES presupuestos(id) ON DELETE CASCADE,
  descripcion text NOT NULL,
  cantidad integer NOT NULL DEFAULT 1,
  precio_unitario decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL,
  plantilla_id text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de items de factura
CREATE TABLE IF NOT EXISTS items_factura (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id uuid REFERENCES facturas(id) ON DELETE CASCADE,
  descripcion text NOT NULL,
  cantidad integer NOT NULL DEFAULT 1,
  precio_unitario decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de documentos
CREATE TABLE IF NOT EXISTS documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id uuid REFERENCES procesos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('requerido', 'opcional', 'generado')),
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'cargado', 'aprobado', 'rechazado')),
  url text,
  fecha_carga timestamptz,
  validado boolean DEFAULT false,
  tipo_documento text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE procesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_presupuesto ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_factura ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes
CREATE POLICY "Usuarios pueden leer todos los clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar clientes"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar clientes"
  ON clientes FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para presupuestos
CREATE POLICY "Usuarios pueden leer todos los presupuestos"
  ON presupuestos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar presupuestos"
  ON presupuestos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar presupuestos"
  ON presupuestos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar presupuestos"
  ON presupuestos FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para procesos
CREATE POLICY "Usuarios pueden leer todos los procesos"
  ON procesos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar procesos"
  ON procesos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar procesos"
  ON procesos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar procesos"
  ON procesos FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para facturas
CREATE POLICY "Usuarios pueden leer todas las facturas"
  ON facturas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar facturas"
  ON facturas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar facturas"
  ON facturas FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar facturas"
  ON facturas FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para items de presupuesto
CREATE POLICY "Usuarios pueden leer todos los items de presupuesto"
  ON items_presupuesto FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar items de presupuesto"
  ON items_presupuesto FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar items de presupuesto"
  ON items_presupuesto FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar items de presupuesto"
  ON items_presupuesto FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para items de factura
CREATE POLICY "Usuarios pueden leer todos los items de factura"
  ON items_factura FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar items de factura"
  ON items_factura FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar items de factura"
  ON items_factura FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar items de factura"
  ON items_factura FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para documentos
CREATE POLICY "Usuarios pueden leer todos los documentos"
  ON documentos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden insertar documentos"
  ON documentos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar documentos"
  ON documentos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden eliminar documentos"
  ON documentos FOR DELETE
  TO authenticated
  USING (true);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cuit ON clientes(cuit);
CREATE INDEX IF NOT EXISTS idx_presupuestos_cliente_id ON presupuestos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_estado ON presupuestos(estado);
CREATE INDEX IF NOT EXISTS idx_procesos_cliente_id ON procesos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_procesos_estado ON procesos(estado);
CREATE INDEX IF NOT EXISTS idx_procesos_presupuesto_id ON procesos(presupuesto_id);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente_id ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_proceso_id ON facturas(proceso_id);
CREATE INDEX IF NOT EXISTS idx_facturas_presupuesto_id ON facturas(presupuesto_id);
CREATE INDEX IF NOT EXISTS idx_items_presupuesto_presupuesto_id ON items_presupuesto(presupuesto_id);
CREATE INDEX IF NOT EXISTS idx_items_factura_factura_id ON items_factura(factura_id);
CREATE INDEX IF NOT EXISTS idx_documentos_proceso_id ON documentos(proceso_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_presupuestos_updated_at BEFORE UPDATE ON presupuestos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procesos_updated_at BEFORE UPDATE ON procesos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();