# 📋 ESTRUCTURA COMPLETA DEL PROYECTO
## Sistema de Gestión para Asesor de Importación/Exportación

---

## 🏗️ **ARQUITECTURA GENERAL**

```
src/
├── 📁 components/           # Componentes React reutilizables
├── 📁 hooks/               # Hooks personalizados globales
├── 📁 lib/                 # Configuraciones y utilidades
├── 📁 modules/             # Módulos de funcionalidad
├── 📁 types/               # Tipos TypeScript globales
├── 📁 data/                # Datos de ejemplo y plantillas
├── App.tsx                 # Componente principal
├── main.tsx               # Punto de entrada
└── index.css              # Estilos globales
```

---

## 🎯 **MÓDULOS PRINCIPALES**

### 📊 **1. MÓDULO CLIENTES** (`/modules/clients/`)
```
clients/
├── types.ts               # Interfaces Cliente, DocumentoImpositivo
├── hooks/
│   └── useClientes.ts     # Lógica CRUD de clientes
├── components/
│   └── ClientsView.tsx    # Vista principal de clientes
└── index.ts               # Exportaciones del módulo
```

**Funcionalidades:**
- ✅ **CRUD completo** de clientes
- ✅ **Gestión de documentos impositivos** (CUIT, AFIP, etc.)
- ✅ **Condiciones IVA** (Responsable Inscripto, Monotributo, etc.)
- ✅ **Vista detallada** con tabs (Info, Documentos, Procesos, Facturas)
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Estadísticas** por cliente

### 🔄 **2. MÓDULO PROCESOS** (`/modules/processes/`)
```
processes/
├── types.ts               # Proceso, EstadoProceso, Documento, Comentario
├── hooks/
│   └── useProcesos.ts     # Lógica de gestión de procesos
├── components/
│   ├── ProcessForm.tsx    # Formulario de creación/edición
│   ├── ProcessDetails.tsx # Vista detallada del proceso
│   └── ProcessCard.tsx    # Tarjeta de proceso para Kanban
└── index.ts
```

**Funcionalidades:**
- ✅ **Tablero Kanban** con 7 estados (Pendiente → Aprobado)
- ✅ **Gestión de documentos** por proceso
- ✅ **Progreso automático** basado en documentos validados
- ✅ **Comentarios e historial** de cambios
- ✅ **Fechas de vencimiento** y alertas
- ✅ **Asociación con plantillas** de procedimientos
- ✅ **Costos y facturación** integrada

### 💰 **3. MÓDULO PRESUPUESTOS** (`/modules/budgets/`)
```
budgets/
├── types.ts               # Presupuesto, ItemPresupuesto
├── hooks/
│   └── useBudgets.ts      # Lógica de presupuestos
└── index.ts
```

**Funcionalidades:**
- ✅ **Creación desde plantillas** (76 procedimientos disponibles)
- ✅ **Flujo de estados** (Borrador → Enviado → Aprobado)
- ✅ **Cálculo automático** de IVA (21%)
- ✅ **Conversión a procesos** automática
- ✅ **Items detallados** con precios por plantilla
- ✅ **Búsqueda por organismo** y tipo de operación

### 🧾 **4. MÓDULO FACTURACIÓN** (`/modules/billing/`)
```
billing/
├── types.ts               # Factura, ItemFactura, HistorialFactura
├── hooks/
│   └── useFacturas.ts     # Lógica de facturación
└── index.ts
```

**Funcionalidades:**
- ✅ **Facturación a clientes** y proveedores
- ✅ **Estados** (Borrador, Enviada, Pagada, Vencida)
- ✅ **Numeración automática** (FAC-2024-001)
- ✅ **Historial completo** de cambios
- ✅ **Cálculos automáticos** (Subtotal + IVA)
- ✅ **Asociación con procesos** y presupuestos

### 📋 **5. MÓDULO PLANTILLAS** (`/modules/templates/`)
```
templates/
├── types.ts               # PlantillaProcedimiento
├── data/
│   └── plantillas.ts      # 76 plantillas predefinidas
└── index.ts
```

**Funcionalidades:**
- ✅ **76 plantillas** organizadas por organismo:
  - 🏥 **ANMAT** (12 procedimientos)
  - 🌾 **SENASA** (9 procedimientos)  
  - 📡 **ENACOM** (3 procedimientos)
  - ⚡ **ENARGAS** (2 procedimientos)
  - 📊 **RENPRE** (8 procedimientos)
  - 🌿 **Ambiente** (6 procedimientos)
  - 🔧 **Reglamentos Técnicos** (19 procedimientos)
  - 🔫 **ANMaC** (5 procedimientos)
  - 📄 **Otros** (12 procedimientos)

### 🏢 **6. MÓDULO ENTIDADES** (`/modules/entities/`)
```
entities/
├── types.ts               # Organismo, Proveedor, FacturaProveedor
├── hooks/
│   ├── useOrganismos.ts   # Gestión de organismos
│   └── useProveedores.ts  # Gestión de proveedores
└── index.ts
```

**Funcionalidades:**
- ✅ **Organismos públicos/privados** con información completa
- ✅ **Proveedores por categoría** (Logística, Legal, Gobierno)
- ✅ **Facturas de proveedores** con seguimiento
- ✅ **Tiempos de respuesta** promedio por organismo
- ✅ **Costos estimados** por procedimiento

### 💲 **7. MÓDULO PRECIOS** (`/modules/pricing/`)
```
pricing/
├── types.ts               # ServicioPrecio, NotificacionPrecio
├── hooks/
│   └── useServicios.ts    # Gestión de precios
└── index.ts
```

**Funcionalidades:**
- ✅ **Lista de precios** por servicio/organismo
- ✅ **Aumentos masivos** por categoría o general
- ✅ **Notificaciones** de precios faltantes
- ✅ **Historial de cambios** de precios
- ✅ **Integración automática** con presupuestos

### 🔔 **8. MÓDULO NOTIFICACIONES** (`/modules/notifications/`)
```
notifications/
├── types.ts               # Notificacion
├── hooks/
│   └── useNotifications.ts # Sistema de notificaciones
└── index.ts
```

**Funcionalidades:**
- ✅ **Centro de notificaciones** centralizado
- ✅ **Tipos**: Info, Éxito, Advertencia, Error
- ✅ **Filtros** por módulo y estado
- ✅ **Prioridades** (Baja, Media, Alta)
- ✅ **Marcado masivo** como leídas

---

## 🎨 **COMPONENTES PRINCIPALES**

### 📱 **Layout y Navegación**
```
components/Layout/
└── Sidebar.tsx            # Sidebar con navegación principal
```

### 📊 **Tablero Kanban**
```
components/Kanban/
├── KanbanBoard.tsx        # Tablero principal con 7 columnas
├── KanbanColumn.tsx       # Columna individual del tablero
└── ProcessCard.tsx        # Tarjeta de proceso individual
```

### 📝 **Formularios**
```
components/Forms/
└── ProcessForm.tsx        # Formulario de creación/edición de procesos
```

### 🔍 **Búsqueda y Filtros**
```
components/Search/
└── SearchFilters.tsx      # Panel de filtros avanzados
```

### 📄 **Gestión de Documentos**
```
components/Documents/
├── DocumentsView.tsx      # Vista principal de documentos
├── DocumentManager.tsx    # Gestor de documentos por proceso
└── DocumentsTemplatesView.tsx # Vista combinada docs + plantillas
```

### 🤖 **Validación IA**
```
components/AI/
└── AIValidationView.tsx   # Validación automática con OpenAI
```

### 📈 **Reportes y Análisis**
```
components/Reports/
└── ReportsView.tsx        # Dashboard de métricas y reportes
```

### 📅 **Calendario**
```
components/Calendar/
└── CalendarView.tsx       # Calendario de vencimientos
```

### ⚙️ **Configuración**
```
components/Settings/
└── SettingsView.tsx       # Panel de configuración del sistema
```

### ❓ **Centro de Ayuda**
```
components/Help/
└── HelpView.tsx           # FAQ y guías de uso
```

---

## 🗄️ **BASE DE DATOS (SUPABASE)**

### **Tablas Principales:**
```sql
-- Usuarios del sistema
usuarios (id, auth_id, nombre, email, rol, telefono, empresa, activo)

-- Clientes (referencia a usuarios con rol='cliente')
clients (id, cuit, razon_social, domicilio_legal, telefono, correo_electronico)

-- Plantillas de procedimientos
plantillas_procedimientos (id, nombre, codigo, organismo, documentos_requeridos, dias_estimados)

-- Procesos de importación/exportación
procesos (id, titulo, descripcion, estado, cliente_id, despachante_id, plantilla_id, progreso)

-- Documentos asociados a procesos
documentos (id, proceso_id, nombre, tipo_archivo, estado, url_archivo)

-- Presupuestos
presupuestos (id, numero, cliente_id, tipo_operacion, subtotal, iva, total, estado)

-- Items de presupuestos
items_presupuesto (id, presupuesto_id, descripcion, cantidad, precio_unitario, total)

-- Facturas
facturas (id, numero_factura, cliente_id, monto, estado, fecha_vencimiento)

-- Notificaciones
notificaciones (id, usuario_id, titulo, mensaje, tipo, leida, proceso_id)

-- Configuración del sistema
settings (id, key, value, description)

-- Analytics y métricas
analytics (id, user_id, action_type, section, details)
```

---

## 🎯 **FUNCIONALIDADES PRINCIPALES**

### **1. 📊 DASHBOARD PRINCIPAL**
- **KPIs Financieros**: Total presupuestado, facturado, cobrado, pendiente
- **Estado de Procesos**: Contadores por estado con banderitas 🔴🟠🔵🟣🟢
- **Estadísticas Generales**: Clientes, presupuestos, procesos, facturas
- **Navegación Rápida**: Botones directos a cada módulo

### **2. 🔄 GESTIÓN DE PROCESOS**
- **Tablero Kanban**: 7 estados de flujo de trabajo
- **Estados**: Pendiente → Recopilación → Enviado → Revisión → Aprobado → Rechazado → Archivado
- **Documentos**: Gestión completa con validación IA
- **Progreso**: Cálculo automático basado en documentos
- **Vencimientos**: Alertas y calendario integrado

### **3. 👥 GESTIÓN DE CLIENTES**
- **CRUD Completo**: Crear, editar, eliminar, buscar
- **Documentos Impositivos**: Subida y gestión de archivos
- **Vista Detallada**: Tabs con información, procesos, facturas
- **Estadísticas**: Resumen financiero por cliente

### **4. 💰 PRESUPUESTOS**
- **Creación desde Plantillas**: Selección múltiple de procedimientos
- **Cálculo Automático**: Subtotal + IVA (21%)
- **Flujo de Aprobación**: Borrador → Enviado → Aprobado
- **Conversión a Procesos**: Automática al aprobar

### **5. 🧾 FACTURACIÓN**
- **Facturación a Clientes**: Con numeración automática
- **Gestión de Proveedores**: Facturas de gastos
- **Estados**: Borrador, Enviada, Pagada, Vencida
- **Historial**: Tracking completo de cambios

### **6. 📋 PLANTILLAS**
- **76 Procedimientos**: Organizados por organismo
- **Documentos Requeridos**: Lista predefinida por plantilla
- **Tiempos Estimados**: Días hábiles por procedimiento
- **Costos**: Precios sugeridos por gestión

### **7. 🏢 ORGANISMOS Y PROVEEDORES**
- **Organismos**: ANMAT, SENASA, ENACOM, etc.
- **Proveedores**: Logística, Legal, Gobierno
- **Información Completa**: Contactos, tiempos, costos
- **Facturas Asociadas**: Seguimiento de gastos

### **8. 💲 LISTA DE PRECIOS**
- **Precios por Servicio**: Organizados por categoría
- **Aumentos Masivos**: Por porcentaje y categoría
- **Notificaciones**: Alertas de precios faltantes
- **Integración**: Automática con presupuestos

### **9. 📄 GESTIÓN DOCUMENTAL**
- **Subida de Archivos**: PDF, DOC, XLS, imágenes
- **Estados**: Pendiente, Cargado, Aprobado, Rechazado
- **Validación IA**: Automática con OpenAI
- **Organización**: Por proceso, cliente, organismo

### **10. 🤖 VALIDACIÓN IA**
- **OpenAI Integration**: GPT-4 Vision para documentos
- **Extracción de Texto**: Automática de PDFs e imágenes
- **Nivel de Confianza**: 0-100% por validación
- **Sugerencias**: Mejoras automáticas detectadas

### **11. 📈 REPORTES Y ANÁLISIS**
- **Métricas Principales**: Procesos, costos, tiempos
- **Gráficos**: Por estado, organismo, cliente
- **Exportación**: CSV con datos completos
- **Tendencias**: Análisis temporal de procesos

### **12. 📅 CALENDARIO**
- **Vista Mensual**: Fechas de inicio y vencimiento
- **Alertas Visuales**: Procesos vencidos y próximos
- **Navegación**: Por mes con eventos clickeables
- **Estados**: Código de colores por urgencia

### **13. 🔔 CENTRO DE NOTIFICACIONES**
- **Tipos**: Nuevo proceso, cliente, documento subido
- **Filtros**: Por módulo, estado, prioridad
- **Marcado**: Individual o masivo como leídas
- **Historial**: Completo de todas las notificaciones

### **14. ⚙️ CONFIGURACIÓN**
- **Empresa**: Datos fiscales y de contacto
- **Facturación**: Porcentajes IVA y Ganancias
- **Base de Datos**: Sincronización con Supabase
- **API Keys**: OpenAI para validación IA
- **Notificaciones**: Preferencias de alertas

### **15. ❓ CENTRO DE AYUDA**
- **FAQ**: Preguntas frecuentes por módulo
- **Guías Rápidas**: Tutoriales paso a paso
- **Búsqueda**: En toda la documentación
- **Categorías**: Por funcionalidad

---

## 🎨 **DISEÑO Y UX**

### **Tema Visual:**
- 🎨 **Gradientes modernos**: Slate, Blue, Indigo
- 💎 **Glass morphism**: Efectos de cristal y blur
- 🌟 **Animaciones**: Hover states y transiciones
- 📱 **Responsive**: Mobile-first design

### **Componentes UI:**
- 🔘 **Botones**: Primary, Secondary, Success, Danger
- 📋 **Cards**: Modern, Gradient, Glass effects
- 🏷️ **Badges**: Success, Warning, Danger, Info
- 📝 **Inputs**: Modern con focus states
- 📊 **Progress bars**: Animadas con colores dinámicos

### **Iconografía:**
- 🎯 **Lucide React**: Iconos consistentes
- 🏳️ **Banderitas de estado**: 🔴🟠🔵🟣🟢⚫
- 📊 **Indicadores visuales**: Progreso, estados, alertas

---

## 🔧 **TECNOLOGÍAS UTILIZADAS**

### **Frontend:**
- ⚛️ **React 18** con TypeScript
- 🎨 **Tailwind CSS** para estilos
- 🎯 **Lucide React** para iconos
- 📅 **date-fns** para manejo de fechas
- 🎭 **React Beautiful DnD** para Kanban

### **Backend:**
- 🗄️ **Supabase** como BaaS
- 🔐 **Row Level Security** (RLS)
- 📊 **PostgreSQL** como base de datos
- 🔑 **Autenticación** integrada

### **Herramientas:**
- ⚡ **Vite** como bundler
- 📝 **ESLint** para linting
- 🎯 **TypeScript** para tipado
- 🎨 **PostCSS** para procesamiento CSS

---

## 📊 **MÉTRICAS Y KPIs**

### **Dashboard Principal:**
- 💰 **Total Presupuestado**: Suma de todos los presupuestos
- 🧾 **Total Facturado**: Suma de todas las facturas
- ✅ **Total Cobrado**: Facturas en estado "pagada"
- ⏳ **Pendiente de Cobro**: Facturas "enviadas"

### **Procesos:**
- 📊 **Por Estado**: Contadores con banderitas
- 🏢 **Por Organismo**: Distribución de procesos
- ⏱️ **Tiempo Promedio**: Días de procesamiento
- 📈 **Tasa de Éxito**: % de procesos aprobados

### **Clientes:**
- 👥 **Total Clientes**: Activos vs inactivos
- 💰 **Facturación por Cliente**: Histórico completo
- 📋 **Procesos por Cliente**: Cantidad y estados
- 📄 **Documentos**: Estado de documentación

---

## 🚀 **FLUJOS DE TRABAJO**

### **1. Flujo Completo de Proceso:**
```
Plantilla → Presupuesto → Aprobación → Proceso → Documentos → Validación → Factura → Cobro
```

### **2. Flujo de Presupuesto:**
```
Borrador → Enviado → Aprobado → Proceso Creado
```

### **3. Flujo de Documentos:**
```
Subida → Validación IA → Aprobación → Proceso Actualizado
```

### **4. Flujo de Facturación:**
```
Borrador → Enviada → Pagada/Vencida
```

---

## 🔐 **SEGURIDAD Y PERMISOS**

### **Roles de Usuario:**
- 👑 **Admin**: Acceso completo al sistema
- 👨‍💼 **Despachante**: Gestión de procesos y clientes
- 👤 **Cliente**: Vista limitada a sus procesos

### **Row Level Security (RLS):**
- ✅ **Usuarios**: Solo pueden ver/editar su perfil
- ✅ **Procesos**: Clientes ven solo los suyos
- ✅ **Documentos**: Acceso por proceso asociado
- ✅ **Facturas**: Por cliente correspondiente

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints:**
- 📱 **Mobile**: < 768px
- 📟 **Tablet**: 768px - 1024px  
- 💻 **Desktop**: > 1024px

### **Adaptaciones:**
- 📊 **Grids**: Responsive con Tailwind
- 📋 **Tablas**: Scroll horizontal en móvil
- 🎛️ **Sidebar**: Overlay en móvil, fijo en desktop
- 📝 **Formularios**: Stack vertical en móvil

---

## 🎯 **PRÓXIMAS FUNCIONALIDADES**

### **En Desarrollo:**
- 📧 **Email Integration**: Envío automático de presupuestos
- 📊 **Dashboard Avanzado**: Más métricas y gráficos
- 🔄 **Sincronización**: Real-time con WebSockets
- 📱 **PWA**: Aplicación web progresiva
- 🌐 **Multi-idioma**: Español/Inglés

### **Futuras:**
- 📋 **Workflow Builder**: Creador visual de procesos
- 🤖 **IA Avanzada**: Predicción de tiempos y costos
- 📊 **Business Intelligence**: Análisis predictivo
- 🔗 **Integraciones**: AFIP, bancos, organismos
- 📱 **App Móvil**: React Native

---

## 🎉 **RESUMEN EJECUTIVO**

Este sistema de gestión para asesores de importación/exportación incluye:

- ✅ **8 módulos principales** completamente funcionales
- ✅ **76 plantillas** de procedimientos predefinidas
- ✅ **Tablero Kanban** para gestión visual
- ✅ **Validación IA** con OpenAI
- ✅ **Base de datos** completa con Supabase
- ✅ **Diseño moderno** y responsive
- ✅ **Flujos completos** de trabajo
- ✅ **Sistema de notificaciones** integrado
- ✅ **Reportes y análisis** detallados
- ✅ **Centro de ayuda** completo

**🎯 Resultado:** Una aplicación completa, escalable y lista para producción que automatiza y optimiza todos los procesos de un despachante de aduana.