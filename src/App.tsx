import React, { useState, useEffect } from 'react';
import { Menu, Bell, Home, AlertTriangle, CheckCircle, User, FileText, Receipt, Search, Filter } from 'lucide-react';

// Importar hooks locales (dejamos Supabase en stand-by)
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
import { ProcesoDisplay, EstadoProceso, NotificacionPrecio } from './types';
import { plantillasProcedimientos } from './data/plantillas';

const App: React.FC = () => {
  // Estados de navegación
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarFixed, setSidebarFixed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcesoDisplay | null>(null);
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<ProcesoDisplay | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: 'todos' as any,
    cliente: '',
    organismo: '',
    prioridad: 'todas' as any,
    fechaDesde: undefined as Date | undefined,
    fechaHasta: undefined as Date | undefined,
    responsable: '',
    etiquetas: [] as string[]
  });

  // Hooks locales (usando datos locales por ahora)
  const { clientes, agregarCliente, actualizarCliente, eliminarCliente } = useClientes();
  const { presupuestos, agregarPresupuesto, actualizarPresupuesto, eliminarPresupuesto } = useBudgets();
  const { procesos, agregarProceso, actualizarProcesoCompleto, eliminarProceso, cambiarEstadoProceso } = useProcesos();
  const { facturas, agregarFactura, actualizarFactura, eliminarFactura } = useFacturas(clientes);
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
  const { validaciones, validarDocumento, reintentarValidacion } = useValidacionIA();

  // Estados para notificaciones
  const [notificacionesSistema, setNotificacionesSistema] = useState<NotificacionPrecio[]>([]);

  // Convertir procesos a ProcesoDisplay
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

  // Función para agregar notificaciones
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

    // Crear un proceso por cada plantilla
    plantillasSeleccionadas.forEach((plantilla, index) => {
      const nuevoProceso = {
        titulo: `${plantilla.nombre} - ${presupuesto.cliente.nombre}`,
        descripcion: `Proceso creado desde presupuesto ${presupuesto.numero}`,
        estado: 'pendiente' as EstadoProceso,
        fechaCreacion: new Date().toISOString(),
        fechaInicio: new Date().toISOString(),
        fechaVencimiento: new Date(Date.now() + (plantilla.tiempoEstimado * 24 * 60 * 60 * 1000)).toISOString(),
        clienteId: presupuesto.clienteId,
        organismoId: '1',
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
      clienteId: '',
      organismoId: '1',
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
    alert(`Proceso "${plantilla.nombre}" creado desde plantilla`);
  };

  // Función para manejar clic en proceso
  const handleProcessClick = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
  };

  // Función para editar proceso
  const handleEditProcess = (proceso: ProcesoDisplay) => {
    setEditingProcess(proceso);
    setShowProcessForm(true);
  };

  // Función para ver proceso
  const handleViewProcess = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
  };

  // Función para manejar navegación del sidebar
  const handleMenuSelect = (menu: string) => {
    setCurrentView(menu);
    setSelectedProcess(null);
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

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = notificacionesSistema.filter(n => !n.leida).length + 
                                 notificaciones.filter(n => !n.leida).length;

  // Filtrar procesos según filtros aplicados
  const procesosFiltrados = procesosDisplay.filter(proceso => {
    const matchesBusqueda = !filtros.busqueda || 
      proceso.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      proceso.cliente.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const matchesEstado = filtros.estado === 'todos' || proceso.estado === filtros.estado;
    const matchesCliente = !filtros.cliente || proceso.cliente.toLowerCase().includes(filtros.cliente.toLowerCase());
    const matchesOrganismo = !filtros.organismo || proceso.organismo === filtros.organismo;
    
    return matchesBusqueda && matchesEstado && matchesCliente && matchesOrganismo;
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
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Filter size={20} />
                  <span>Filtros</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProcess(null);
                    setShowProcessForm(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            onUploadDocument={(procesoId, documento) => {
              console.log('Subir documento:', procesoId, documento);
            }}
            onAddNotificacion={agregarNotificacion}
          />
        );

      case 'document-management':
        return (
          <DocumentsTemplatesView
            procesos={procesosDisplay}
            validaciones={validaciones}
            documentos={[]}
            onValidateDocument={validarDocumento}
            onRetryValidation={reintentarValidacion}
            onCreateFromTemplate={crearProcesoDesdeTemplate}
          />
        );

      case 'ai-validation':
        return (
          <AIValidationView
            validaciones={validaciones}
            documentos={[]}
            onValidateDocument={validarDocumento}
            onRetryValidation={reintentarValidacion}
          />
        );

      case 'settings':
        return <SettingsView />;

      case 'help':
        return <HelpView />;

      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🚀 Sistema de Gestión de Importación/Exportación
              </h1>
              <p className="text-gray-600 mb-6">
                Sistema completo para gestión de procesos aduaneros, clientes, presupuestos y documentos.
              </p>

              {/* Estadísticas del dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Clientes</h3>
                  <p className="text-3xl font-bold text-blue-600">{clientes.length}</p>
                  <p className="text-sm text-blue-600">Registrados</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Presupuestos</h3>
                  <p className="text-3xl font-bold text-green-600">{presupuestos.length}</p>
                  <p className="text-sm text-green-600">Activos</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Procesos</h3>
                  <p className="text-3xl font-bold text-purple-600">{procesos.length}</p>
                  <p className="text-sm text-purple-600">En gestión</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800">Plantillas</h3>
                  <p className="text-3xl font-bold text-orange-600">{plantillasProcedimientos.length}</p>
                  <p className="text-sm text-orange-600">Disponibles</p>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentView('budgets')}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Receipt className="mx-auto mb-2" size={24} />
                  <span className="block font-medium">Crear Presupuesto</span>
                </button>
                <button
                  onClick={() => setCurrentView('clients')}
                  className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <User className="mx-auto mb-2" size={24} />
                  <span className="block font-medium">Gestionar Clientes</span>
                </button>
                <button
                  onClick={() => setCurrentView('processes')}
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FileText className="mx-auto mb-2" size={24} />
                  <span className="block font-medium">Ver Procesos</span>
                </button>
              </div>

              {/* Información del sistema */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="mr-2" size={16} />
                  Sistema Completo Funcionando
                </h4>
                <p className="text-sm text-blue-700">
                  Todas las funcionalidades están operativas: gestión de clientes, presupuestos, procesos Kanban, 
                  facturación, documentos, plantillas, reportes y más.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Sistema de Gestión - Importación/Exportación
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNotificationsClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {notificacionesNoLeidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificacionesNoLeidas > 9 ? '9+' : notificacionesNoLeidas}
                </span>
              )}
            </button>
            
            {currentView !== 'dashboard' && (
              <button
                onClick={handleHomeClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default App;