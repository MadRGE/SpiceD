import React, { useState, useEffect } from 'react';
import { Menu, Bell, Home, AlertTriangle, CheckCircle, User, FileText, Receipt, Search, Filter, Database } from 'lucide-react';

// Importar hooks locales
import { useClientes } from './hooks/useClientes';
import { useBudgets } from './hooks/useBudgets';
import { useProcesos } from './hooks/useProcesos';
import { useFacturas } from './hooks/useFacturas';
import { useOrganismos } from './hooks/useOrganismos';
import { useProveedores } from './hooks/useProveedores';
import { useServicios } from './hooks/useServicios';
import { useValidacionIA } from './hooks/useValidacionIA';

// Importar componentes de vistas
import ClientsView from './components/Clients/ClientsView';
import BudgetsView from './components/Budgets/BudgetsView';
import BillingView from './components/Billing/BillingView';
import ReportsView from './components/Reports/ReportsView';
import TemplatesView from './components/Templates/TemplatesView';
import NotificationsView from './components/Notifications/NotificationsView';
import CalendarView from './components/Calendar/CalendarView';
import DocumentsView from './components/Documents/DocumentsView';
import AIValidationView from './components/AI/AIValidationView';
import SettingsView from './components/Settings/SettingsView';
import HelpView from './components/Help/HelpView';
import Sidebar from './components/Layout/Sidebar';
import AccountingView from './components/Accounting/AccountingView';
import EntitiesView from './components/Entities/EntitiesView';
import PricingView from './components/Pricing/PricingView';
import DocumentsTemplatesView from './components/DocumentsTemplates/DocumentsTemplatesView';
import KanbanBoard from './components/Kanban/KanbanBoard';
import ProcessForm from './components/Forms/ProcessForm';
import ProcessDetails from './components/Processes/ProcessDetails';
import SearchFilters from './components/Search/SearchFilters';

// Tipos
import { ProcesoDisplay, EstadoProceso, NotificacionPrecio, FiltrosProcesos } from './types';
import { plantillasProcedimientos } from './data/plantillas';

const App: React.FC = () => {
  // Estados de navegación y UI
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFixed, setSidebarFixed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcesoDisplay | null>(null);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<ProcesoDisplay | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectionError, setShowConnectionError] = useState(false);
  
  // Estados de filtros
  const [filtros, setFiltros] = useState<FiltrosProcesos>({
    busqueda: '',
    estado: 'todos' as any,
    cliente: '',
    organismo: '',
    prioridad: 'todas' as any,
    fechaDesde: undefined,
    fechaHasta: undefined,
    responsable: '',
    etiquetas: []
  });

  // Hooks para todas las funcionalidades
  const { clientes, agregarCliente, actualizarCliente, eliminarCliente } = useClientes();
  const { presupuestos, agregarPresupuesto, actualizarPresupuesto, eliminarPresupuesto, buscarPresupuesto } = useBudgets();
  const { 
    procesos, 
    agregarProceso, 
    actualizarProceso,
    actualizarProcesoCompleto, 
    eliminarProceso, 
    obtenerProcesoPorId,
    obtenerProcesosPorCliente,
    obtenerProcesosPorEstado,
    cambiarEstadoProceso,
    actualizarProgreso
  } = useProcesos();
  const { 
    facturas, 
    agregarFactura, 
    actualizarFactura, 
    eliminarFactura, 
    cambiarEstadoFactura,
    buscarFactura,
    obtenerFacturasPorCliente,
    obtenerHistorialFactura,
    generarNumeroFactura
  } = useFacturas(clientes);
  const { organismos, agregarOrganismo, actualizarOrganismo, eliminarOrganismo } = useOrganismos();
  const { 
    proveedores, 
    facturasProveedores, 
    agregarProveedor, 
    actualizarProveedor, 
    eliminarProveedor, 
    agregarFacturaProveedor, 
    actualizarFacturaProveedor, 
    eliminarFacturaProveedor 
  } = useProveedores();
  const { 
    servicios, 
    notificaciones, 
    agregarServicio, 
    actualizarServicio, 
    eliminarServicio, 
    aplicarAumento, 
    marcarNotificacionLeida,
    agregarNotificacion: agregarNotificacionServicio
  } = useServicios();
  const { 
    validaciones, 
    loading: validacionLoading,
    validarDocumento, 
    reintentarValidacion,
    obtenerValidacionPorDocumento
  } = useValidacionIA();

  // Estados para notificaciones del sistema
  const [notificacionesSistema, setNotificacionesSistema] = useState<NotificacionPrecio[]>([]);

  // Convertir procesos a ProcesoDisplay con toda la información
  const procesosDisplay: ProcesoDisplay[] = procesos.map(proceso => {
    const cliente = clientes.find(c => c.id === proceso.clienteId);
    const organismo = organismos.find(o => o.id === proceso.organismoId);
    
    return {
      ...proceso,
      cliente: cliente?.nombre || 'Cliente no encontrado',
      organismo: organismo?.nombre || 'Organismo no encontrado',
      fechaInicio: proceso.fechaCreacion
    };
  });

  // Función para agregar notificaciones del sistema
  const agregarNotificacion = (notificacion: NotificacionPrecio) => {
    setNotificacionesSistema(prev => [...prev, notificacion]);
  };

  // Función ÚNICA para crear proceso desde presupuesto
  const crearProcesoDesdePresupuesto = (presupuesto: any) => {
    const plantillasSeleccionadas = plantillasProcedimientos.filter(p => 
      presupuesto.plantillasIds?.includes(p.id)
    );

    if (plantillasSeleccionadas.length === 0) {
      alert('No se encontraron plantillas asociadas al presupuesto');
      return;
    }

    // Crear un proceso por cada plantilla seleccionada
    plantillasSeleccionadas.forEach((plantilla, index) => {
      const nuevoProceso = {
        titulo: `${plantilla.nombre} - ${presupuesto.cliente.nombre}`,
        descripcion: `Proceso creado desde presupuesto ${presupuesto.numero}`,
        estado: 'pendiente' as EstadoProceso,
        fechaCreacion: new Date().toISOString(),
        fechaInicio: new Date().toISOString(),
        fechaVencimiento: new Date(Date.now() + (plantilla.tiempoEstimado * 24 * 60 * 60 * 1000)).toISOString(),
        clienteId: presupuesto.clienteId,
        organismoId: '1', // TODO: Mapear organismo correctamente
        documentos: plantilla.documentosRequeridos.map((doc, docIndex) => ({
          id: `${Date.now()}-${index}-${docIndex}`,
          nombre: doc,
          tipo: 'requerido' as const,
          estado: 'pendiente' as const,
          fechaCarga: new Date().toISOString(),
          validado: false,
          tipoDocumento: 'Documento requerido'
        })),
        progreso: 0,
        prioridad: 'media' as any,
        etiquetas: [presupuesto.tipoOperacion.toLowerCase()],
        responsable: 'Usuario Actual',
        comentarios: [],
        costos: presupuesto.total,
        plantillaId: plantilla.id,
        facturado: false,
        presupuestoId: presupuesto.id
      };

      agregarProceso(nuevoProceso);
    });

    // Crear factura automáticamente
    const nuevaFactura = {
      numero: generarNumeroFactura(),
      clienteId: presupuesto.clienteId,
      cliente: presupuesto.cliente,
      fecha: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      items: presupuesto.items,
      subtotal: presupuesto.subtotal,
      iva: presupuesto.iva,
      total: presupuesto.total,
      estado: 'enviada' as const,
      notas: `Factura generada desde presupuesto ${presupuesto.numero}`,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      presupuestoId: presupuesto.id,
      tipo: 'cliente' as const
    };

    agregarFactura(nuevaFactura);

    // Notificar creación de procesos y factura
    agregarNotificacion({
      id: Date.now().toString(),
      tipo: 'nuevo_proceso',
      modulo: 'procesos',
      titulo: 'Procesos y factura creados',
      mensaje: `Se crearon ${plantillasSeleccionadas.length} proceso(s) y 1 factura desde el presupuesto ${presupuesto.numero}`,
      fecha: new Date(),
      leida: false,
      prioridad: 'media',
      presupuestoId: presupuesto.id
    });

    alert(`✅ Se crearon ${plantillasSeleccionadas.length} proceso(s) y 1 factura desde el presupuesto`);
  };

  // Función para crear proceso desde plantilla
  const crearProcesoDesdeTemplate = (templateId: string) => {
    const plantilla = plantillasProcedimientos.find(p => p.id === templateId);
    if (!plantilla) return;

    const nuevoProceso = {
      titulo: plantilla.nombre,
      descripcion: `Proceso creado desde plantilla: ${plantilla.nombre}`,
      estado: 'pendiente' as EstadoProceso,
      fechaCreacion: new Date().toISOString(),
      fechaInicio: new Date().toISOString(),
      fechaVencimiento: new Date(Date.now() + (plantilla.tiempoEstimado * 24 * 60 * 60 * 1000)).toISOString(),
      clienteId: '', // Se debe seleccionar en el formulario
      organismoId: '1', // TODO: Mapear organismo correctamente
      documentos: plantilla.documentosRequeridos.map((doc, docIndex) => ({
        id: `${Date.now()}-${docIndex}`,
        nombre: doc,
        tipo: 'requerido' as const,
        estado: 'pendiente' as const,
        fechaCarga: new Date().toISOString(),
        validado: false,
        tipoDocumento: 'Documento requerido'
      })),
      progreso: 0,
      prioridad: 'media' as any,
      etiquetas: [plantilla.organismo.toLowerCase()],
      responsable: 'Usuario Actual',
      comentarios: [],
      costos: plantilla.costo || 0,
      plantillaId: plantilla.id,
      facturado: false
    };

    agregarProceso(nuevoProceso);
    setCurrentView('processes');
    
    // Notificar creación de proceso
    agregarNotificacion({
      id: Date.now().toString(),
      tipo: 'nuevo_proceso',
      modulo: 'procesos',
      titulo: 'Proceso creado desde plantilla',
      mensaje: `Se creó el proceso "${plantilla.nombre}" desde plantilla`,
      fecha: new Date(),
      leida: false,
      prioridad: 'media'
    });

    alert(`Proceso "${plantilla.nombre}" creado desde plantilla`);
  };

  // Funciones de manejo de procesos
  const handleProcessClick = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
  };

  const handleEditProcess = (proceso: ProcesoDisplay) => {
    setEditingProcess(proceso);
    setShowProcessForm(true);
  };

  const handleViewProcess = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
  };

  // Funciones de navegación
  const handleMenuSelect = (menu: string) => {
    setCurrentView(menu);
    setSelectedProcess(null);
    setSidebarOpen(false);
  };

  const handleNotificationsClick = () => {
    setCurrentView('notifications');
  };

  const handleHomeClick = () => {
    setCurrentView('dashboard');
    setSelectedProcess(null);
  };

  // Función para subir documento a un proceso
  const handleUploadDocument = (procesoId: string, documento: any) => {
    const proceso = procesos.find(p => p.id === procesoId);
    if (!proceso) return;

    const documentosActualizados = [...(proceso.documentos || []), documento];
    
    actualizarProceso(procesoId, {
      documentos: documentosActualizados
    });

    // Notificar subida de documento
    agregarNotificacion({
      id: Date.now().toString(),
      tipo: 'documento_subido',
      modulo: 'documentos',
      titulo: 'Documento subido',
      mensaje: `Se subió el documento "${documento.nombre}" al proceso`,
      fecha: new Date(),
      leida: false,
      prioridad: 'baja',
      procesoId
    });
  };

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = notificacionesSistema.filter(n => !n.leida).length + 
                                 notificaciones.filter(n => !n.leida).length;

  // Filtrar procesos según filtros aplicados
  const procesosFiltrados = procesosDisplay.filter(proceso => {
    const matchesBusqueda = !filtros.busqueda || 
      proceso.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      proceso.cliente.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      proceso.organismo.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const matchesEstado = filtros.estado === 'todos' || proceso.estado === filtros.estado;
    const matchesCliente = !filtros.cliente || proceso.cliente.toLowerCase().includes(filtros.cliente.toLowerCase());
    const matchesOrganismo = !filtros.organismo || proceso.organismo === filtros.organismo;
    const matchesPrioridad = filtros.prioridad === 'todas' || proceso.prioridad === filtros.prioridad;
    
    // Filtros de fecha
    let matchesFecha = true;
    if (filtros.fechaDesde) {
      matchesFecha = matchesFecha && new Date(proceso.fechaCreacion) >= filtros.fechaDesde;
    }
    if (filtros.fechaHasta) {
      matchesFecha = matchesFecha && new Date(proceso.fechaCreacion) <= filtros.fechaHasta;
    }
    
    return matchesBusqueda && matchesEstado && matchesCliente && matchesOrganismo && matchesPrioridad && matchesFecha;
  });

  // Renderizar vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'clients':
        return (
          <ClientsView
            clientes={clientes}
            procesos={procesosDisplay}
            facturas={facturas}
            onAddCliente={agregarCliente}
            onEditCliente={actualizarCliente}
            onDeleteCliente={eliminarCliente}
            onProcessClick={handleProcessClick}
            setCurrentView={setCurrentView}
          />
        );

      case 'budgets':
        return (
          <BudgetsView
            presupuestos={presupuestos}
            clientes={clientes}
            servicios={servicios}
            onAddPresupuesto={agregarPresupuesto}
            onEditPresupuesto={actualizarPresupuesto}
            onDeletePresupuesto={eliminarPresupuesto}
            onCreateProcess={crearProcesoDesdePresupuesto}
          />
        );

      case 'processes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Procesos</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {procesosFiltrados.length} de {procesosDisplay.length} procesos
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Filter size={20} />
                  <span>Filtros</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProcess(null);
                    setShowProcessForm(true);
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FileText size={20} />
                  <span>Nuevo Proceso</span>
                </button>
              </div>
            </div>

            {/* Tablero Kanban */}
            <KanbanBoard
              procesos={procesosFiltrados}
              onView={handleViewProcess}
              onEdit={handleEditProcess}
              onDelete={eliminarProceso}
              onChangeState={cambiarEstadoProceso}
            />

            {/* Filtros */}
            <SearchFilters
              open={showFilters}
              onClose={() => setShowFilters(false)}
              filtros={filtros}
              onFiltrosChange={setFiltros}
              onClearFilters={() => setFiltros({
                busqueda: '',
                estado: 'todos' as any,
                cliente: '',
                organismo: '',
                prioridad: 'todas' as any,
                fechaDesde: undefined,
                fechaHasta: undefined,
                responsable: '',
                etiquetas: []
              })}
            />

            {/* Modal de formulario de proceso */}
            {showProcessForm && (
              <ProcessForm
                proceso={editingProcess}
                clientes={clientes}
                organismos={organismos}
                plantillas={plantillasProcedimientos}
                onSave={(proceso) => {
                  if (editingProcess) {
                    actualizarProcesoCompleto(proceso);
                  } else {
                    agregarProceso(proceso);
                  }
                  setShowProcessForm(false);
                  setEditingProcess(null);
                }}
                onCancel={() => {
                  setShowProcessForm(false);
                  setEditingProcess(null);
                }}
              />
            )}

            {/* Modal de detalles del proceso */}
            {selectedProcess && (
              <ProcessDetails
                proceso={selectedProcess}
                onClose={() => setSelectedProcess(null)}
                onEdit={() => {
                  setEditingProcess(selectedProcess);
                  setSelectedProcess(null);
                  setShowProcessForm(true);
                }}
                onUpdateDocuments={(documentos) => {
                  const procesoActualizado = {
                    ...selectedProcess,
                    documentos
                  };
                  actualizarProcesoCompleto(procesoActualizado);
                  setSelectedProcess(procesoActualizado);
                }}
              />
            )}
          </div>
        );

      case 'billing':
        return (
          <BillingView
            facturas={facturas}
            clientes={clientes}
            onAddFactura={agregarFactura}
            onEditFactura={actualizarFactura}
            onDeleteFactura={eliminarFactura}
          />
        );

      case 'accounting':
        return (
          <AccountingView
            clientes={clientes}
            facturas={facturas}
            proveedores={proveedores}
            facturasProveedores={facturasProveedores}
            onAddCliente={agregarCliente}
            onEditCliente={actualizarCliente}
            onDeleteCliente={eliminarCliente}
            onAddFactura={agregarFactura}
            onEditFactura={actualizarFactura}
            onDeleteFactura={eliminarFactura}
            onAddProveedor={agregarProveedor}
            onEditProveedor={actualizarProveedor}
            onDeleteProveedor={eliminarProveedor}
            onAddFacturaProveedor={agregarFacturaProveedor}
            onEditFacturaProveedor={actualizarFacturaProveedor}
            onDeleteFacturaProveedor={eliminarFacturaProveedor}
          />
        );

      case 'entities':
        return (
          <EntitiesView
            organismos={organismos}
            proveedores={proveedores}
            facturasProveedores={facturasProveedores}
            onAddOrganismo={agregarOrganismo}
            onEditOrganismo={actualizarOrganismo}
            onDeleteOrganismo={eliminarOrganismo}
            onAddProveedor={agregarProveedor}
            onEditProveedor={actualizarProveedor}
            onDeleteProveedor={eliminarProveedor}
            onAddFacturaProveedor={agregarFacturaProveedor}
            onEditFacturaProveedor={actualizarFacturaProveedor}
            onDeleteFacturaProveedor={eliminarFacturaProveedor}
          />
        );

      case 'pricing':
        return (
          <PricingView
            servicios={servicios}
            notificaciones={notificaciones}
            onAddServicio={agregarServicio}
            onEditServicio={actualizarServicio}
            onDeleteServicio={eliminarServicio}
            onAplicarAumento={aplicarAumento}
            onMarcarNotificacionLeida={marcarNotificacionLeida}
          />
        );

      case 'templates':
        return (
          <TemplatesView
            onCreateFromTemplate={crearProcesoDesdeTemplate}
          />
        );

      case 'logistics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión Logística</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Módulo de logística en desarrollo</p>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Estado Contable</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">Ingresos</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">Gastos</h3>
                <p className="text-2xl font-bold text-red-600">
                  ${facturasProveedores.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">Balance</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${(facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0) - 
                     facturasProveedores.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <ReportsView
            procesos={procesos}
            onProcessClick={handleProcessClick}
          />
        );

      case 'notifications':
        return (
          <NotificationsView
            notificaciones={[...notificacionesSistema, ...notificaciones]}
            onMarcarLeida={(id) => {
              setNotificacionesSistema(prev => 
                prev.map(n => n.id === id ? { ...n, leida: true } : n)
              );
              marcarNotificacionLeida(id);
            }}
            onEliminarNotificacion={(id) => {
              setNotificacionesSistema(prev => prev.filter(n => n.id !== id));
            }}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            procesos={procesosDisplay}
            onProcessClick={handleProcessClick}
          />
        );

      case 'documents':
        return (
          <DocumentsView
            procesos={procesosDisplay}
            onValidateDocument={validarDocumento}
            onUploadDocument={handleUploadDocument}
            onAddNotificacion={agregarNotificacion}
          />
        );

      case 'document-management':
        return (
          <DocumentsTemplatesView
            procesos={procesosDisplay}
            validaciones={validaciones}
            documentos={procesosDisplay.flatMap(p => p.documentos || [])}
            onValidateDocument={validarDocumento}
            onRetryValidation={reintentarValidacion}
            onCreateFromTemplate={crearProcesoDesdeTemplate}
          />
        );

      case 'ai-validation':
        return (
          <AIValidationView
            validaciones={validaciones}
            documentos={procesosDisplay.flatMap(p => p.documentos || [])}
            onValidateDocument={validarDocumento}
            onRetryValidation={reintentarValidacion}
          />
        );

      case 'settings':
        return <SettingsView />;

      case 'help':
        return <HelpView />;

      default:
        // Dashboard principal
        return (
          <div className="space-y-6">
            {/* Título principal */}
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                🚀 Sistema de Gestión de Importación/Exportación
              </h1>
              <p className="text-slate-600 text-lg">
                Sistema completo para gestión de procesos aduaneros
              </p>
            </div>

            {/* Estados de procesos - Lista con banderitas */}
            <div className="card-modern p-4">
              <h3 className="text-lg font-semibold mb-3 text-slate-800">Estado de Procesos</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { estado: 'pendiente', label: 'Pendiente', flag: '🔴' },
                  { estado: 'recopilacion-docs', label: 'Recopilación', flag: '🟠' },
                  { estado: 'enviado', label: 'Enviado', flag: '🔵' },
                  { estado: 'revision', label: 'Revisión', flag: '🟣' },
                  { estado: 'aprobado', label: 'Aprobado', flag: '🟢' },
                  { estado: 'rechazado', label: 'Rechazado', flag: '🔴' },
                  { estado: 'archivado', label: 'Archivado', flag: '⚫' }
                ].map(({ estado, label, flag }) => {
                  const count = procesos.filter(p => p.estado === estado).length;
                  return (
                    <div key={estado} className="flex items-center space-x-2 bg-white/70 rounded-lg px-3 py-2 border">
                      <span className="text-lg">{flag}</span>
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KPIs Financieros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Receipt className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  ${presupuestos.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Presupuestado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${facturas.reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Facturado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Cobrado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  ${facturas.filter(f => f.estado === 'enviada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Pendiente de Cobro</div>
              </div>
            </div>

            {/* Menú de Acciones Principales */}
            <div className="card-modern p-6">
              <h3 className="text-xl font-semibold text-center mb-6 text-slate-800">
                Acciones Principales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <button
                  onClick={() => setCurrentView('budgets')}
                  className="card-gradient p-6 hover-lift group text-center"
                  title="Crear y gestionar presupuestos para clientes"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Receipt className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Crear Presupuesto</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('clients')}
                  className="card-gradient p-6 hover-lift group text-center"
                  title="Administrar información de clientes y documentos"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <User className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Gestionar Clientes</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('processes')}
                  className="card-gradient p-6 hover-lift group text-center"
                  title="Ver y gestionar todos los procesos en tablero Kanban"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Ver Procesos</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('templates')}
                  className="card-gradient p-6 hover-lift group text-center"
                  title="Usar plantillas predefinidas para crear procesos"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Usar Plantillas</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('logistics')}
                  className="card-gradient p-6 hover-lift group text-center"
                  title="Gestión logística y seguimiento de envíos"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Logística</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('accounting')}
                  className="card-gradient p-6 hover-lift group text-center"
                  title="Estado contable, facturación y finanzas"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Receipt className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Estado Contable</span>
                </button>
              </div>
            </div>

            {/* Panel lateral con estadísticas */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                {/* Espacio para contenido adicional si es necesario */}
              </div>

              <div className="lg:col-span-1 space-y-4">
                <div className="card-modern p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-center">Estadísticas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Clientes:</span>
                      <span className="font-bold text-blue-600">{clientes.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Presupuestos:</span>
                      <span className="font-bold text-emerald-600">{presupuestos.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Procesos:</span>
                      <span className="font-bold text-purple-600">{procesos.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Facturas:</span>
                      <span className="font-bold text-indigo-600">{facturas.length}</span>
                    </div>
                  </div>
                </div>

                <div className="card-modern p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-center">Notificaciones</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">No leídas:</span>
                      <span className="font-bold text-red-600">{notificacionesNoLeidas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total:</span>
                      <span className="font-bold text-blue-600">{[...notificacionesSistema, ...notificaciones].length}</span>
                    </div>
                    {notificacionesNoLeidas > 0 && (
                      <button
                        onClick={() => setCurrentView('notifications')}
                        className="w-full text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        Ver Notificaciones
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="header-modern sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={16} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Sistema de Gestión - Importación/Exportación
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading && (
              <div className="flex items-center space-x-2 glass text-blue-800 px-3 py-1 rounded-full text-sm shadow-lg">
                <Database className="animate-spin" size={14} />
                <span>Conectando BD...</span>
              </div>
            )}
            
            <button
              onClick={handleNotificationsClick}
              className="relative p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
              title="Notificaciones"
            >
              <Bell size={20} />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {notificacionesNoLeidas > 9 ? '9+' : notificacionesNoLeidas}
                </span>
              )}
            </button>
            
            {currentView !== 'dashboard' && (
              <button
                onClick={handleHomeClick}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
                title="Volver a Pantalla Principal"
              >
                <Home size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMenuSelect={handleMenuSelect}
        isFixed={sidebarFixed}
        onToggleFixed={() => setSidebarFixed(!sidebarFixed)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarFixed ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
      }`}>
        <div className="p-6">
          {showConnectionError && (
            <div className="card-modern bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-red-600" size={20} />
                <div>
                  <h4 className="font-semibold text-red-800">Error de conexión</h4>
                  <p className="text-sm text-red-700">No se pudo conectar con la base de datos. Trabajando en modo local.</p>
                </div>
              </div>
            </div>
          )}
          
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default App;