# Datos de Ejemplo para Supabase

Este directorio contiene archivos CSV con datos de ejemplo para poblar la base de datos de Supabase.

## 📁 Archivos incluidos:

### 👥 **usuarios.csv** (6 registros)
- 4 Clientes empresariales
- 1 Despachante de aduana
- 1 Administrador del sistema

### 📋 **plantillas_procedimientos.csv** (76 registros)
Todas las plantillas de procedimientos organizadas por organismo:
- **ANMAT**: 12 procedimientos
- **ANMaC**: 5 procedimientos  
- **Dirección Nacional de Reglamentos Técnicos**: 19 procedimientos
- **ENACOM**: 3 procedimientos
- **ENARGAS**: 2 procedimientos
- **RENPRE**: 8 procedimientos
- **Secretaría de Ambiente**: 6 procedimientos
- **SENASA**: 9 procedimientos
- **Otros**: 12 procedimientos

### 🏢 **entidades.csv** (9 registros)
Tabla polimórfica que incluye:
- **Organismos**: 5 entidades gubernamentales
- **Proveedores**: 4 empresas de servicios

### ⚙️ **procesos.csv** (5 registros)
Procesos de ejemplo en diferentes estados:
- RNE Nueva Planta (35% progreso)
- Importación Tractores (75% progreso)
- Homologación WiFi (80% progreso)
- Exportación Carne (100% completado)
- Certificación Juguetes (10% iniciado)

### 📄 **documentos.csv** (8 registros)
Documentos asociados a los procesos con estados variados

### 💰 **presupuestos.csv** (4 registros)
Presupuestos con diferentes estados y montos

### 📊 **items_presupuesto.csv** (4 registros)
Items detallados de cada presupuesto

### 🧾 **facturas.csv** (4 registros)
Facturas asociadas a procesos con estados pendiente/pagada

### 🔔 **notificaciones.csv** (4 registros)
Notificaciones del sistema para el despachante

## 🚀 Cómo usar:

1. **Crear las tablas** primero usando las migraciones SQL
2. **Importar los CSV** en este orden:
   - usuarios.csv
   - plantillas_procedimientos.csv
   - entidades.csv
   - procesos.csv
   - documentos.csv
   - presupuestos.csv
   - items_presupuesto.csv
   - facturas.csv
   - notificaciones.csv

## 🎯 Resultado:
Una base de datos completamente poblada con datos realistas que demuestra todas las funcionalidades del sistema.