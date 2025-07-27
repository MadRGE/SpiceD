/*
  # Insertar datos de ejemplo

  1. Datos de muestra
    - Usuarios con diferentes roles (clientes, despachantes, admin)
    - Plantillas de procedimientos
    - Procesos de ejemplo
    - Presupuestos y facturas
    - Documentos asociados

  2. Propósito
    - Demostrar funcionalidad del sistema
    - Datos realistas para testing
    - Ejemplos de diferentes estados y tipos
*/

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (id, auth_id, nombre, email, rol, telefono, empresa, activo) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', null, 'Alimentos Argentinos SA', 'contacto@alimentosarg.com.ar', 'cliente', '+54 11 4567-8900', 'Av. Corrientes 1234, CABA', true),
  ('550e8400-e29b-41d4-a716-446655440002', null, 'Importadora del Sur SRL', 'info@importadorasur.com', 'cliente', '+54 11 9876-5432', 'San Martín 567, Buenos Aires', true),
  ('550e8400-e29b-41d4-a716-446655440003', null, 'Tecnología Avanzada SA', 'ventas@tecavanzada.com.ar', 'cliente', '+54 11 5555-1234', 'Microcentro 890, CABA', true),
  ('550e8400-e29b-41d4-a716-446655440004', null, 'Exportadora Nacional', 'comercio@exportnacional.com', 'cliente', '+54 11 3333-7777', 'Puerto Madero 456, CABA', true),
  ('550e8400-e29b-41d4-a716-446655440005', null, 'Juan Carlos Pérez', 'jperez@despachante.com', 'despachante', '+54 11 2222-8888', 'Oficina Central', true),
  ('550e8400-e29b-41d4-a716-446655440006', null, 'María González', 'mgonzalez@admin.com', 'admin', '+54 11 1111-9999', 'Administración', true);

-- Insertar plantillas de procedimientos
INSERT INTO plantillas_procedimientos (id, nombre, codigo, organismo, documentos_requeridos, etapas, dias_estimados, descripcion) VALUES
  ('plt-001', 'Registro Nacional de Establecimiento (RNE)', 'RNE-001', 'ANMAT', 
   ARRAY['Formulario de solicitud', 'Plano del establecimiento', 'Certificado de habilitación municipal', 'Responsable técnico'], 
   ARRAY['Presentación', 'Revisión técnica', 'Inspección', 'Aprobación'], 30,
   'Registro completo para establecimientos que manipulan alimentos'),
  
  ('plt-002', 'Autorización Fitosanitaria de Importación (AFIDI)', 'AFIDI-001', 'SENASA',
   ARRAY['Solicitud AFIDI', 'Factura proforma', 'Análisis de riesgo de plagas', 'Certificado fitosanitario'],
   ARRAY['Solicitud', 'Análisis de riesgo', 'Aprobación'], 20,
   'Autorización para importación de productos vegetales'),
   
  ('plt-003', 'Homologación Equipos Telecomunicaciones', 'HET-001', 'ENACOM',
   ARRAY['Solicitud de homologación', 'Ensayos de compatibilidad', 'Manual técnico', 'Certificado de origen'],
   ARRAY['Presentación', 'Ensayos técnicos', 'Evaluación', 'Homologación'], 45,
   'Homologación de equipos de telecomunicaciones'),
   
  ('plt-004', 'Certificación de Conformidad', 'CC-001', 'Dirección Nacional de Reglamentos Técnicos',
   ARRAY['Solicitud de certificación', 'Ensayos de laboratorio', 'Manual de usuario', 'Declaración de conformidad'],
   ARRAY['Solicitud', 'Ensayos', 'Evaluación', 'Certificación'], 35,
   'Certificación de conformidad para productos técnicos');

-- Insertar procesos de ejemplo
INSERT INTO procesos (id, titulo, descripcion, estado, cliente_id, despachante_id, plantilla_id, tipo_procedimiento, organismo, fecha_inicio, fecha_vencimiento, progreso, notas) VALUES
  ('proc-001', 'RNE para Nueva Planta de Alimentos', 'Registro de establecimiento para nueva planta procesadora de alimentos', 'recopilacion-docs', 
   '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'plt-001', 'Registro', 'ANMAT',
   now() - interval '5 days', now() + interval '25 days', 35, 'Cliente muy colaborativo, documentos en proceso'),
   
  ('proc-002', 'Importación Maquinaria Agrícola', 'AFIDI para importación de tractores desde Brasil', 'enviado',
   '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'plt-002', 'Importación', 'SENASA',
   now() - interval '10 days', now() + interval '10 days', 75, 'Documentos enviados, esperando respuesta'),
   
  ('proc-003', 'Homologación Equipos WiFi', 'Homologación de routers WiFi importados de China', 'revision',
   '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'plt-003', 'Homologación', 'ENACOM',
   now() - interval '20 days', now() + interval '25 days', 80, 'En etapa final de revisión técnica'),
   
  ('proc-004', 'Exportación Carne Bovina', 'Certificaciones para exportación a Europa', 'aprobado',
   '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'plt-002', 'Exportación', 'SENASA',
   now() - interval '30 days', now() - interval '5 days', 100, 'Proceso completado exitosamente'),
   
  ('proc-005', 'Certificación Juguetes Importados', 'Certificación de conformidad para juguetes', 'pendiente',
   '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'plt-004', 'Certificación', 'Dirección Nacional de Reglamentos Técnicos',
   now(), now() + interval '35 days', 10, 'Proceso recién iniciado');

-- Insertar documentos de ejemplo
INSERT INTO documentos (id, proceso_id, nombre, tipo_archivo, estado, comentarios, subido_por, subido_en) VALUES
  ('doc-001', 'proc-001', 'Formulario RNE Completado', 'PDF', 'aprobado', 'Formulario correctamente diligenciado', '550e8400-e29b-41d4-a716-446655440001', now() - interval '4 days'),
  ('doc-002', 'proc-001', 'Planos Técnicos Planta', 'PDF', 'pendiente', 'Requiere firma del arquitecto', '550e8400-e29b-41d4-a716-446655440001', now() - interval '3 days'),
  ('doc-003', 'proc-002', 'Factura Comercial Tractores', 'PDF', 'aprobado', 'Factura en orden', '550e8400-e29b-41d4-a716-446655440002', now() - interval '8 days'),
  ('doc-004', 'proc-002', 'Certificado Fitosanitario Brasil', 'PDF', 'aprobado', 'Certificado válido', '550e8400-e29b-41d4-a716-446655440002', now() - interval '7 days'),
  ('doc-005', 'proc-003', 'Manual Técnico Router', 'PDF', 'aprobado', 'Manual completo en español', '550e8400-e29b-41d4-a716-446655440003', now() - interval '15 days'),
  ('doc-006', 'proc-003', 'Ensayos de Compatibilidad', 'PDF', 'aprobado', 'Ensayos realizados en laboratorio certificado', '550e8400-e29b-41d4-a716-446655440003', now() - interval '12 days'),
  ('doc-007', 'proc-004', 'Certificado Sanitario Carne', 'PDF', 'aprobado', 'Certificado SENASA aprobado', '550e8400-e29b-41d4-a716-446655440004', now() - interval '25 days'),
  ('doc-008', 'proc-005', 'Lista de Productos Juguetes', 'Excel', 'pendiente', 'Falta completar códigos de producto', '550e8400-e29b-41d4-a716-446655440001', now() - interval '1 day');

-- Insertar facturas de ejemplo
INSERT INTO facturas (id, numero_factura, cliente_id, proceso_id, monto, fecha_vencimiento, estado, descripcion) VALUES
  ('fact-001', 'FAC-2024-001', '550e8400-e29b-41d4-a716-446655440001', 'proc-001', 25000.00, now() + interval '30 days', 'pendiente', 'Gestión RNE - Registro Nacional de Establecimiento'),
  ('fact-002', 'FAC-2024-002', '550e8400-e29b-41d4-a716-446655440002', 'proc-002', 15000.00, now() + interval '15 days', 'pendiente', 'AFIDI - Autorización Fitosanitaria Importación'),
  ('fact-003', 'FAC-2024-003', '550e8400-e29b-41d4-a716-446655440003', 'proc-003', 35000.00, now() - interval '5 days', 'pagada', 'Homologación Equipos Telecomunicaciones'),
  ('fact-004', 'FAC-2024-004', '550e8400-e29b-41d4-a716-446655440004', 'proc-004', 18000.00, now() - interval '10 days', 'pagada', 'Certificaciones Exportación Carne Bovina');

-- Insertar notificaciones de ejemplo
INSERT INTO notificaciones (id, usuario_id, titulo, mensaje, tipo, proceso_id) VALUES
  ('notif-001', '550e8400-e29b-41d4-a716-446655440005', 'Documento Pendiente de Revisión', 'El documento "Planos Técnicos Planta" requiere revisión y aprobación', 'advertencia', 'proc-001'),
  ('notif-002', '550e8400-e29b-41d4-a716-446655440005', 'Proceso Próximo a Vencer', 'El proceso "Importación Maquinaria Agrícola" vence en 10 días', 'advertencia', 'proc-002'),
  ('notif-003', '550e8400-e29b-41d4-a716-446655440005', 'Proceso Completado', 'El proceso "Exportación Carne Bovina" ha sido completado exitosamente', 'exito', 'proc-004'),
  ('notif-004', '550e8400-e29b-41d4-a716-446655440005', 'Nuevo Proceso Asignado', 'Se ha asignado el proceso "Certificación Juguetes Importados"', 'info', 'proc-005');