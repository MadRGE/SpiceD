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
    agregarServicio, 
    actualizarServicio, 
    eliminarServicio, 
    aplicarAumento, 
    notificaciones, 
    agregarNotificacion, 
    marcarNotificacionLeida 
  } = useServicios();
  const { 
    validaciones, 
    validarDocumento, 
    reintentarValidacion, 
    notificacionesSistema, 
    setNotificacionesSistema 
  } = useValidacionIA();

  // Procesos con información completa para mostrar
  const procesosDisplay: ProcesoDisplay[] = procesos.map(proceso => {
    const cliente = clientes.find(c => c.id === proceso.clienteId);
    const organismo = organismos.find(o => o.id === proceso.organismoId);
    
    return {
      ...proceso,
      cliente: cliente?.nombre || 'Cliente no encontrado',
      organismo: organismo?.nombre || 'Organismo no encontrado'
    };
  });

  // Función para crear proceso desde presupuesto
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setCurrentView('budgets')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'budgets' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Presupuestos
            </button>
            <button
              onClick={() => setCurrentView('billing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'billing' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Facturación
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
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

      case 'templates':
        return (
          <TemplatesView
            onCreateFromTemplate={crearProcesoDesdeTemplate}
          />
        );

      case 'logistics':
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

      case 'financial':
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

      default:
        // Dashboard principal con todas las estadísticas
        return (
          <div className="space-y-6">
            {/* KPIs Financieros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Receipt className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  ${presupuestos.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Presupuestado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ${facturas.reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Facturado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ${facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Cobrado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ${facturas.filter(f => f.estado === 'enviada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Pendiente de Cobro</div>
              </div>
            </div>

            {/* Layout responsivo con estadísticas en lateral superior */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Contenido principal */}
              <div className="lg:col-span-3">
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
              </div>

              {/* Panel lateral con estadísticas */}
              <div className="lg:col-span-1 space-y-4">
                {/* Estadísticas generales */}
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Organismos:</span>
                      <span className="font-bold text-orange-600">{organismos.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Proveedores:</span>
                      <span className="font-bold text-pink-600">{proveedores.length}</span>
                    </div>
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
      <header className="bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-200"
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
          
          {/* Menú de navegación central */}
          <div className="hidden lg:flex items-center space-x-1 bg-white/50 rounded-xl p-1">
            <button
              onClick={() => setCurrentView('processes')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'processes' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Procesos
            </button>
            <button
              onClick={() => setCurrentView('clients')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'clients' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setCurrentView('budgets')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'budgets' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Presupuestos
            </button>
            <button
              onClick={() => setCurrentView('billing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'billing' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Facturación
            </button>
            <button
              onClick={() => setCurrentView('templates')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'templates' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => setCurrentView('logistics')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'logistics' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              Logística
            </button>
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

      case 'logistics':
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

      case 'financial':
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
            {/* Estado de Procesos con Banderitas - ARRIBA DE TODO */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Estado de Procesos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { estado: 'pendiente', label: 'Pendiente', flag: '🔴', color: 'text-red-600' },
                  { estado: 'recopilacion-docs', label: 'Recopilación', flag: '🟠', color: 'text-orange-600' },
                  { estado: 'enviado', label: 'Enviado', flag: '🔵', color: 'text-blue-600' },
                  { estado: 'revision', label: 'Revisión', flag: '🟣', color: 'text-purple-600' },
                  { estado: 'aprobado', label: 'Aprobado', flag: '🟢', color: 'text-emerald-600' },
                  { estado: 'rechazado', label: 'Rechazado', flag: '🔴', color: 'text-red-700' },
                  { estado: 'archivado', label: 'Archivado', flag: '⚫', color: 'text-slate-600' }
                ].map(({ estado, label, flag, color }) => {
                  const count = procesos.filter(p => p.estado === estado).length;
                  return (
                    <div key={estado} className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 hover:bg-white/70 transition-all">
                      <span className="text-lg">{flag}</span>
                      <div className="flex-1">
                        <div className="text-xs text-slate-600">{label}</div>
                        <div className={`font-bold ${color}`}>{count}</div>
                      </div>
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
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  ${presupuestos.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Presupuestado</div>
              </div>
              
              <div className="card-modern p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
              <div className="lg:col-span-3">
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
              </div>

              {/* Panel lateral con estadísticas y notificaciones */}
              <div className="lg:col-span-1 space-y-4">
                {/* KPIs Financieros compactos */}
                <div className="card-modern p-4">
                  <h3 className="font-semibold text-slate-800 mb-3 text-center">KPIs Financieros</h3>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">
                        ${presupuestos.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600">Total Presupuestado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        ${facturas.reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600">Total Facturado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        ${facturas.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600">Total Cobrado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        ${facturas.filter(f => f.estado === 'enviada').reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600">Pendiente de Cobro</div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas generales */}
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

                {/* Notificaciones */}
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