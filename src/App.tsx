import React, { useState, useEffect } from 'react';
import { Menu, Bell, Home, AlertTriangle, CheckCircle, User, FileText, Receipt, Search, Filter, Database } from 'lucide-react';

// Importar hooks locales (dejamos Supabase en stand-by como solicitaste)
import { useClientes } from './hooks/useClientes';
import { useBudgets } from './hooks/useBudgets';
import { useProcesos } from './hooks/useProcesos';
import { useFacturas } from './hooks/useFacturas';
import { useOrganismos } from './hooks/useOrganismos';
import { useProveedores } from './hooks/useProveedores';
import { useServicios } from './hooks/useServicios';
import { useValidacionIA } from './hooks/useValidacionIA';

// Importar TODOS los componentes de vistas que habíamos creado
import ClientsView from './components/Clients/ClientsView';
import BudgetsView from './components/Budgets/BudgetsView';
import ProcessesView from './components/Processes/ProcessesView';
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
import ProcessCard from './components/Kanban/ProcessCard';
import KanbanBoard from './components/Kanban/KanbanBoard';
import ProcessForm from './components/Forms/ProcessForm';
import ProcessDetails from './components/Processes/ProcessDetails';
import DocumentManager from './components/Documents/DocumentManager';
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

  // Hooks para TODAS las funcionalidades
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

  // Función para crear proceso desde presupuesto
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

    // Notificar creación de procesos
    agregarNotificacion({
      id: Date.now().toString(),
      tipo: 'nuevo_proceso',
      modulo: 'procesos',
      titulo: 'Procesos creados desde presupuesto',
      mensaje: `Se crearon ${plantillasSeleccionadas.length} proceso(s) desde el presupuesto ${presupuesto.numero}`,
      fecha: new Date(),
      leida: false,
      prioridad: 'media',
      presupuestoId: presupuesto.id
    });

    alert(`Se crearon ${plantillasSeleccionadas.length} proceso(s) desde el presupuesto`);
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

  // Función para manejar clic en proceso (ver detalles)
  const handleProcessClick = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
  };

  // Función para editar proceso
  const handleEditProcess = (proceso: ProcesoDisplay) => {
    setEditingProcess(proceso);
    setShowProcessForm(true);
  };

  // Función para ver proceso (alias de handleProcessClick)
  const handleViewProcess = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
  };

  // Función para manejar navegación del sidebar
  const handleMenuSelect = (menu: string) => {
    setCurrentView(menu);
    setSelectedProcess(null);
    setSidebarOpen(false); // Cerrar sidebar en móvil
  };

  // Función para manejar notificaciones
  const handleNotificationsClick = () => {
    setCurrentView('notifications');
  };

  // Función para volver al dashboard
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
        // Dashboard principal con todas las estadísticas
        return (
          <div className="space-y-6">
            <div className="card-modern p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <FileText className="text-white" size={32} />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                🚀 Sistema de Gestión de Importación/Exportación
              </h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Sistema completo para gestión de procesos aduaneros, clientes, presupuestos, facturación y documentos.
              </p>
              </div>

              {/* Estadísticas principales del dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-gradient p-6 hover-lift group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">Clientes</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{clientes.length}</p>
                      <p className="text-sm text-slate-600">Registrados</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <User className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="card-gradient p-6 hover-lift group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Presupuestos</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">{presupuestos.length}</p>
                      <p className="text-sm text-slate-600">Activos</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Receipt className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="card-gradient p-6 hover-lift group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">Procesos</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{procesos.length}</p>
                      <p className="text-sm text-slate-600">En gestión</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="card-gradient p-6 hover-lift group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 group-hover:text-orange-700 transition-colors">Plantillas</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">{plantillasProcedimientos.length}</p>
                      <p className="text-sm text-slate-600">Disponibles</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">Facturas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-indigo-700">Total:</span>
                      <span className="font-medium text-indigo-800">{facturas.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-indigo-700">Pagadas:</span>
                      <span className="font-medium text-green-600">
                        {facturas.filter(f => f.estado === 'pagada').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-indigo-700">Pendientes:</span>
                      <span className="font-medium text-orange-600">
                        {facturas.filter(f => f.estado === 'enviada').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">Organismos</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-teal-700">Total:</span>
                      <span className="font-medium text-teal-800">{organismos.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-teal-700">Públicos:</span>
                      <span className="font-medium text-teal-600">
                        {organismos.filter(o => o.tipo === 'publico').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-teal-700">Privados:</span>
                      <span className="font-medium text-teal-600">
                        {organismos.filter(o => o.tipo === 'privado').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
                  <h3 className="text-lg font-semibold text-pink-800 mb-2">Proveedores</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-pink-700">Total:</span>
                      <span className="font-medium text-pink-800">{proveedores.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-pink-700">Facturas:</span>
                      <span className="font-medium text-pink-600">{facturasProveedores.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-pink-700">Servicios:</span>
                      <span className="font-medium text-pink-600">{servicios.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button
                  onClick={() => setCurrentView('budgets')}
                  className="card-gradient p-6 hover-lift group text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Receipt className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Crear Presupuesto</span>
                </button>
                <button
                  onClick={() => setCurrentView('clients')}
                  className="card-gradient p-6 hover-lift group text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <User className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Gestionar Clientes</span>
                </button>
                <button
                  onClick={() => setCurrentView('processes')}
                  className="card-gradient p-6 hover-lift group text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Ver Procesos</span>
                </button>
                <button
                  onClick={() => setCurrentView('templates')}
                  className="card-gradient p-6 hover-lift group text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="text-white" size={24} />
                  </div>
                  <span className="block font-semibold text-slate-700">Usar Plantillas</span>
                </button>
              </div>

              {/* Resumen de procesos por estado */}
              <div className="card-gradient p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Estado de Procesos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { estado: 'pendiente', label: 'Pendiente', gradient: 'from-red-400 to-red-600' },
                    { estado: 'recopilacion-docs', label: 'Recopilación', gradient: 'from-orange-400 to-orange-600' },
                    { estado: 'enviado', label: 'Enviado', gradient: 'from-blue-400 to-blue-600' },
                    { estado: 'revision', label: 'Revisión', gradient: 'from-purple-400 to-purple-600' },
                    { estado: 'aprobado', label: 'Aprobado', gradient: 'from-emerald-400 to-emerald-600' },
                    { estado: 'rechazado', label: 'Rechazado', gradient: 'from-red-500 to-pink-600' },
                    { estado: 'archivado', label: 'Archivado', gradient: 'from-slate-400 to-slate-600' }
                  ].map(({ estado, label, gradient }) => {
                    const count = procesos.filter(p => p.estado === estado).length;
                    return (
                      <div key={estado} className="text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg text-white font-bold text-lg`}>
                          {count}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Información del sistema */}
              <div className="mt-8 card-gradient p-6">
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center justify-center">
                  <CheckCircle className="mr-2" size={16} />
                  Sistema Completo Funcionando
                </h4>
                <p className="text-sm text-slate-600 text-center">
                  Todas las funcionalidades están operativas: gestión de clientes, presupuestos, procesos Kanban, 
                  facturación, documentos, plantillas, reportes, validación IA, notificaciones y más.
                </p>
              </div>

              {/* Notificaciones recientes */}
              {(notificacionesSistema.length > 0 || notificaciones.length > 0) && (
                <div className="mt-6 card-gradient p-6">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center justify-center">
                    <Bell className="mr-2" size={16} />
                    Notificaciones Recientes
                  </h4>
                  <div className="space-y-2">
                    {[...notificacionesSistema, ...notificaciones]
                      .filter(n => !n.leida)
                      .slice(0, 3)
                      .map(notif => (
                        <div key={notif.id} className="text-sm text-slate-600 text-center">
                          • {notif.titulo}
                        </div>
                      ))}
                    {notificacionesNoLeidas > 3 && (
                      <div className="text-sm text-slate-500 text-center">
                        ...y {notificacionesNoLeidas - 3} más
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            {/* Indicador de carga pequeño */}
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
          {/* Alerta de error de conexión */}
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