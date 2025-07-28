import React, { useState } from 'react';
import { Menu, Bell, Home, Database } from 'lucide-react';

// Importar hooks de Supabase
import { useSupabaseClientes } from './hooks/useSupabaseClientes';
import { useSupabasePresupuestos } from './hooks/useSupabasePresupuestos';

// Importar hooks locales para datos que aún no están en Supabase
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

  // Hooks de Supabase
  const { 
    clientes, 
    loading: clientesLoading, 
    agregarCliente, 
    actualizarCliente, 
    eliminarCliente 
  } = useSupabaseClientes();

  const { 
    presupuestos, 
    loading: presupuestosLoading, 
    agregarPresupuesto, 
    actualizarPresupuesto, 
    eliminarPresupuesto,
    obtenerPresupuestosSinProceso
  } = useSupabasePresupuestos(clientes);

  // Hooks locales (temporales hasta migrar a Supabase)
  const { procesos, agregarProceso, actualizarProcesoCompleto, eliminarProceso, cambiarEstadoProceso } = useProcesos();
  const { facturas, agregarFactura, actualizarFactura, eliminarFactura } = useFacturas(clientes);
  const { organismos, agregarOrganismo, actualizarOrganismo, eliminarOrganismo } = useOrganismos();
  const { proveedores, facturasProveedores, agregarProveedor, actualizarProveedor, eliminarProveedor, agregarFacturaProveedor, actualizarFacturaProveedor, eliminarFacturaProveedor } = useProveedores();
  const { servicios, notificaciones, agregarServicio, actualizarServicio, eliminarServicio, aplicarAumento, marcarNotificacionLeida } = useServicios();
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

    // Actualizar presupuesto con IDs de procesos creados
    const procesoIds = plantillasSeleccionadas.map(() => Date.now().toString());
    actualizarPresupuesto({
      ...presupuesto,
      procesoIds
    });

    alert(`Se crearon ${plantillasSeleccionadas.length} proceso(s) desde el presupuesto`);
  };

  // Función para manejar clic en proceso
  const handleProcessClick = (proceso: ProcesoDisplay) => {
    setSelectedProcess(proceso);
    setCurrentView('process-details');
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

  // Mostrar loading si los datos principales están cargando
  if (clientesLoading || presupuestosLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header con indicador de carga */}
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
              {/* Indicador de carga pequeño */}
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">Cargando datos...</span>
              </div>
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

        {/* Main Content con mensaje de carga */}
        <main className={`transition-all duration-300 ${
          sidebarFixed ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
        }`}>
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Database className="text-blue-600" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Conectando con Supabase...
                </h2>
                <p className="text-gray-500 mb-4">
                  Cargando clientes y presupuestos desde la base de datos
                </p>
                <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
          <ProcessesView
            procesos={procesosDisplay}
            clientes={clientes}
            presupuestosSinProceso={obtenerPresupuestosSinProceso()}
            onAddProceso={agregarProceso}
            onEditProceso={actualizarProcesoCompleto}
            onDeleteProceso={eliminarProceso}
            onChangeState={cambiarEstadoProceso}
            onProcessClick={handleProcessClick}
            onCreateFromBudget={crearProcesoDesdePresupuesto}
          />
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

      case 'templates':
        return (
          <TemplatesView
            onCreateFromTemplate={(templateId) => {
              // Crear proceso desde plantilla
              const plantilla = plantillasProcedimientos.find(p => p.id === templateId);
              if (plantilla) {
                setCurrentView('processes');
                // TODO: Pre-llenar formulario con plantilla
              }
            }}
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
              // Marcar como leída en ambos arrays
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
              // TODO: Implementar subida de documentos
              console.log('Subir documento:', procesoId, documento);
            }}
            onAddNotificacion={agregarNotificacion}
          />
        );

      case 'ai-validation':
        return (
          <AIValidationView
            validaciones={validaciones}
            documentos={[]} // TODO: Obtener documentos de procesos
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
                Bienvenido al sistema integrado con <strong>Supabase</strong>. 
                Todos los datos de clientes y presupuestos se guardan en la base de datos.
              </p>

              {/* Estadísticas del dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Clientes</h3>
                  <p className="text-3xl font-bold text-blue-600">{clientes.length}</p>
                  <p className="text-sm text-blue-600">Registrados en BD</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Presupuestos</h3>
                  <p className="text-3xl font-bold text-green-600">{presupuestos.length}</p>
                  <p className="text-sm text-green-600">En Supabase</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Procesos</h3>
                  <p className="text-3xl font-bold text-purple-600">{procesos.length}</p>
                  <p className="text-sm text-purple-600">Activos</p>
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

              {/* Información de integración */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Base de Datos Integrada</h4>
                <p className="text-sm text-green-700">
                  La aplicación está conectada a Supabase. Los clientes y presupuestos se guardan automáticamente.
                  Los procesos, facturas y otros datos se migrarán próximamente.
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