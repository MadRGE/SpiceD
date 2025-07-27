import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, MapPin, FileText, Building, Receipt, Eye, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cliente, ProcesoDisplay, Factura } from '../../types';

interface ClientsViewProps {
  clientes: Cliente[];
  procesos: ProcesoDisplay[];
  facturas: Factura[];
  onAddCliente: (cliente: Cliente) => void;
  onEditCliente: (cliente: Cliente) => void;
  onDeleteCliente: (clienteId: string) => void;
  onProcessClick?: (proceso: ProcesoDisplay) => void;
  setCurrentView: (view: string) => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({
  clientes,
  procesos,
  facturas,
  onAddCliente,
  onEditCliente,
  onDeleteCliente,
  onProcessClick,
  setCurrentView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'procesos' | 'facturas' | 'documentos'>('info');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.cuit && cliente.cuit.includes(searchTerm))
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cliente: Cliente = {
      id: editingCliente?.id || Date.now().toString(),
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      cuit: formData.get('cuit') as string || undefined,
      fechaRegistro: editingCliente?.fechaRegistro || new Date().toISOString(),
      activo: true
    };

    if (editingCliente) {
      onEditCliente(cliente);
    } else {
      onAddCliente(cliente);
      
      // Notificar creación de cliente
      onAddNotificacion({
        id: Date.now().toString(),
        tipo: 'nuevo_cliente',
        modulo: 'clientes',
        titulo: 'Nuevo cliente registrado',
        mensaje: `Se ha registrado el cliente ${cliente.nombre}`,
        fecha: new Date(),
        leida: false,
        prioridad: 'media',
        clienteId: cliente.id
      });
    }

    setShowForm(false);
    setEditingCliente(undefined);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const handleProcessClick = (proceso: ProcesoDisplay) => {
    setSelectedCliente(null);
    if (onProcessClick) {
      onProcessClick(proceso);
    }
  };

  const getClienteProcesos = (clienteId: string) => {
    return procesos.filter(p => p.clienteId === clienteId);
  };

  const getClienteFacturas = (clienteId: string) => {
    return facturas.filter(f => f.clienteId === clienteId);
  };

  const stats = {
    total: clientes.length,
    activos: clientes.filter(c => c.activo).length,
    totalFacturado: facturas.reduce((sum, f) => sum + f.total, 0),
    procesosTotales: procesos.length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
        <button
          onClick={() => {
            setEditingCliente(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <User className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-purple-600">${stats.totalFacturado.toLocaleString()}</p>
            </div>
            <DollarSign className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Procesos</p>
              <p className="text-2xl font-bold text-orange-600">{stats.procesosTotales}</p>
            </div>
            <FileText className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClientes.map((cliente) => {
          const clienteProcesos = getClienteProcesos(cliente.id);
          const clienteFacturas = getClienteFacturas(cliente.id);
          const totalFacturado = clienteFacturas.reduce((sum, f) => sum + f.total, 0);
          const facturasPendientes = clienteFacturas.filter(f => f.estado === 'enviada').length;

          return (
            <div 
              key={cliente.id} 
              className="bg-white rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleView(cliente)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{cliente.nombre}</h3>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Cliente Activo
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(cliente);
                    }}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(cliente);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar cliente"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Estás seguro de que quieres eliminar el cliente "${cliente.nombre}"?`)) {
                        onDeleteCliente(cliente.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Eliminar cliente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span>{cliente.email}</span>
                </div>
                {cliente.telefono && (
                  <div className="flex items-center space-x-2">
                    <Phone size={14} />
                    <span>{cliente.telefono}</span>
                  </div>
                )}
                {cliente.cuit && (
                  <div className="flex items-center space-x-2">
                    <Building size={14} />
                    <span>CUIT: {cliente.cuit}</span>
                  </div>
                )}
                {cliente.direccion && (
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} />
                    <span>{cliente.direccion}</span>
                  </div>
                )}
              </div>

              {/* Resumen de actividad */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Procesos:</span>
                  <span className="font-medium">{clienteProcesos.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Facturas:</span>
                  <span className="font-medium">{clienteFacturas.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pendientes:</span>
                  <span className="font-medium text-orange-600">{facturasPendientes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total facturado:</span>
                  <span className="font-medium text-green-600">${totalFacturado.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado vacío */}
      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <User size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer cliente'}
          </p>
        </div>
      )}

      {/* Modal de detalles del cliente */}
      {selectedCliente && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSelectedCliente(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Detalles del Cliente: {selectedCliente.nombre}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Tabs */}
                <div className="border-b">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'info'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Información
                    </button>
                    <button
                      onClick={() => setActiveTab('documentos')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'documentos'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Documentos Impositivos
                    </button>
                    <button
                      onClick={() => setActiveTab('procesos')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'procesos'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Procesos ({getClienteProcesos(selectedCliente.id).length})
                    </button>
                    <button
                      onClick={() => setActiveTab('facturas')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'facturas'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Facturas ({getClienteFacturas(selectedCliente.id).length})
                    </button>
                  </nav>
                </div>

                {/* Contenido de tabs */}
                {activeTab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Información de Contacto</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Email:</strong> {selectedCliente.email}</p>
                        {selectedCliente.telefono && <p><strong>Teléfono:</strong> {selectedCliente.telefono}</p>}
                        {selectedCliente.direccion && <p><strong>Dirección:</strong> {selectedCliente.direccion}</p>}
                        {selectedCliente.cuit && <p><strong>CUIT:</strong> {selectedCliente.cuit}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Resumen de Actividad</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Procesos totales:</span>
                          <span className="font-medium">{getClienteProcesos(selectedCliente.id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Facturas totales:</span>
                          <span className="font-medium">{getClienteFacturas(selectedCliente.id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Facturas pagadas:</span>
                          <span className="font-medium text-green-600">
                            {getClienteFacturas(selectedCliente.id).filter(f => f.estado === 'pagada').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Facturas pendientes:</span>
                          <span className="font-medium text-orange-600">
                            {getClienteFacturas(selectedCliente.id).filter(f => f.estado === 'enviada').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total facturado:</span>
                          <span className="font-medium text-blue-600">
                            ${getClienteFacturas(selectedCliente.id).reduce((sum, f) => sum + f.total, 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documentos' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Documentos Impositivos</h4>
                      <input
                        type="file"
                        id="upload-doc"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingDoc(file.name);
                            setTimeout(() => {
                              setUploadingDoc(null);
                              // Actualizar cliente con nuevo documento
                              const nuevoDoc = {
                                id: Date.now().toString(),
                                nombre: file.name,
                                tipo: 'documento_impositivo',
                                url: URL.createObjectURL(file),
                                fechaCarga: new Date().toISOString(),
                                estado: 'cargado' as const
                              };
                              
                              const clienteActualizado = {
                                ...selectedCliente,
                                documentosImpositivos: [
                                  ...(selectedCliente.documentosImpositivos || []),
                                  nuevoDoc
                                ]
                              };
                              
                              onEditCliente(clienteActualizado);
                              setSelectedCliente(clienteActualizado);
                            }, 2000);
                          }
                        }}
                      />
                      <label
                        htmlFor="upload-doc"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Subir Documento
                      </label>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Documentos del cliente */}
                      {(selectedCliente.documentosImpositivos || []).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <FileText size={16} className="text-gray-500" />
                            <span className="text-sm font-medium">{doc.nombre}</span>
                            {doc.url && (
                              <button
                                onClick={() => window.open(doc.url, '_blank')}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Ver
                              </button>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              doc.estado === 'cargado' || doc.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.estado === 'cargado' ? 'Cargado' : 
                               doc.estado === 'aprobado' ? 'Aprobado' : 'Pendiente'}
                            </span>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar ${doc.nombre}?`)) {
                                  const clienteActualizado = {
                                    ...selectedCliente,
                                    documentosImpositivos: selectedCliente.documentosImpositivos?.filter(d => d.id !== doc.id) || []
                                  };
                                  onEditCliente(clienteActualizado);
                                  setSelectedCliente(clienteActualizado);
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Eliminar documento"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Documentos requeridos que faltan */}
                      {[
                        'Certificado de CUIT',
                        'Constancia de Inscripción AFIP', 
                        'Certificado Fiscal',
                        'Poder de Representación'
                      ].filter(docRequerido => 
                        !(selectedCliente.documentosImpositivos || []).some(doc => 
                          doc.nombre.toLowerCase().includes(docRequerido.toLowerCase())
                        )
                      ).map((docFaltante, index) => (
                        <div key={`faltante-${index}`} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center space-x-3">
                            <FileText size={16} className="text-yellow-600" />
                            <span className="text-sm font-medium">{docFaltante}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Pendiente
                            </span>
                            <input
                              type="file"
                              id={`upload-${index}`}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const nuevoDoc = {
                                    id: Date.now().toString(),
                                    nombre: docFaltante,
                                    tipo: 'documento_impositivo',
                                    url: URL.createObjectURL(file),
                                    fechaCarga: new Date().toISOString(),
                                    estado: 'cargado' as const
                                  };
                                  
                                  const clienteActualizado = {
                                    ...selectedCliente,
                                    documentosImpositivos: [
                                      ...(selectedCliente.documentosImpositivos || []),
                                      nuevoDoc
                                    ]
                                  };
                                  
                                  onEditCliente(clienteActualizado);
                                  setSelectedCliente(clienteActualizado);
                                }
                              }}
                            />
                            <label
                              htmlFor={`upload-${index}`}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                            >
                              Subir
                            </label>
                          </div>
                        </div>
                      ))}
                      
                      {/* Botón para agregar documento personalizado */}
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <input
                          type="file"
                          id="upload-custom-doc"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const nuevoDoc = {
                                id: Date.now().toString(),
                                nombre: file.name,
                                tipo: 'documento_personalizado',
                                url: URL.createObjectURL(file),
                                fechaCarga: new Date().toISOString(),
                                estado: 'cargado' as const
                              };
                              
                              const clienteActualizado = {
                                ...selectedCliente,
                                documentosImpositivos: [
                                  ...(selectedCliente.documentosImpositivos || []),
                                  nuevoDoc
                                ]
                              };
                              
                              onEditCliente(clienteActualizado);
                              setSelectedCliente(clienteActualizado);
                            }
                          }}
                        />
                        <label
                          htmlFor="upload-custom-doc"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                        >
                          <Plus size={16} />
                          <span>Agregar Documento Personalizado</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'procesos' && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Procesos del Cliente</h4>
                    {getClienteProcesos(selectedCliente.id).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Título</th>
                              <th className="px-4 py-2 text-left">Organismo</th>
                              <th className="px-4 py-2 text-left">Estado</th>
                              <th className="px-4 py-2 text-left">Progreso</th>
                              <th className="px-4 py-2 text-left">Fecha</th>
                              <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {getClienteProcesos(selectedCliente.id).map((proceso) => (
                              <tr key={proceso.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium">{proceso.titulo}</td>
                                <td className="px-4 py-2">{proceso.organismo}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    proceso.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                    proceso.estado === 'en-progreso' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {proceso.estado}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{proceso.progreso}%</td>
                                <td className="px-4 py-2">{format(new Date(proceso.fechaCreacion), 'dd/MM/yyyy')}</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => {
                                      handleProcessClick(proceso);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                  >
                                    Ver Proceso →
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-blue-50 hover:bg-blue-100 cursor-pointer">
                              <td colSpan={6} className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedCliente(null);
                                    setCurrentView('processes');
                                    // TODO: Pre-seleccionar cliente en formulario
                                  }}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  + Crear Nuevo Proceso para este Cliente
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No hay procesos para este cliente</p>
                    )}
                  </div>
                )}

                {activeTab === 'presupuestos' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Presupuestos del Cliente</h4>
                      <button
                        onClick={() => {
                          setSelectedCliente(null);
                          setCurrentView('budgets');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Crear Presupuesto
                      </button>
                    </div>
                    {presupuestos.filter(p => p.clienteId === selectedCliente.id).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Número</th>
                              <th className="px-4 py-2 text-left">Tipo Operación</th>
                              <th className="px-4 py-2 text-left">Total</th>
                              <th className="px-4 py-2 text-left">Estado</th>
                              <th className="px-4 py-2 text-left">Fecha</th>
                              <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {presupuestos.filter(p => p.clienteId === selectedCliente.id).map((presupuesto) => (
                              <tr key={presupuesto.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{presupuesto.numero}</td>
                                <td className="px-4 py-2">{presupuesto.tipoOperacion}</td>
                                <td className="px-4 py-2">${presupuesto.total?.toLocaleString()}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    presupuesto.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                    presupuesto.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {presupuesto.estado}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{format(presupuesto.fechaCreacion, 'dd/MM/yyyy')}</td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => {
                                      setSelectedCliente(null);
                                      setCurrentView('budgets');
                                    }}
                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                  >
                                    Ver Presupuesto →
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No hay presupuestos para este cliente</p>
                    )}
                  </div>
                )}
                {activeTab === 'facturas' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Facturas del Cliente</h4>
                      <button
                        onClick={() => {
                          setSelectedCliente(null);
                          setCurrentView('financial');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Ir a Facturación
                      </button>
                    </div>
                    {getClienteFacturas(selectedCliente.id).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Número</th>
                              <th className="px-4 py-2 text-left">Fecha</th>
                              <th className="px-4 py-2 text-left">Total</th>
                              <th className="px-4 py-2 text-left">Estado</th>
                              <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {getClienteFacturas(selectedCliente.id).map((factura) => (
                              <tr key={factura.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{factura.numero}</td>
                                <td className="px-4 py-2">{format(new Date(factura.fecha), 'dd/MM/yyyy')}</td>
                                <td className="px-4 py-2">${factura.total.toLocaleString()}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    factura.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                                    factura.estado === 'enviada' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {factura.estado}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    onClick={() => {
                                      setSelectedCliente(null);
                                      setCurrentView('financial');
                                    }}
                                    className="text-blue-600 hover:text-blue-900 text-sm"
                                  >
                                    Ver Factura →
                                  </button>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-green-50 hover:bg-green-100 cursor-pointer">
                              <td colSpan={5} className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedCliente(null);
                                    setCurrentView('financial');
                                    // TODO: Pre-seleccionar cliente en formulario de factura
                                  }}
                                  className="text-green-600 hover:text-green-800 font-medium"
                                >
                                  + Crear Nueva Factura para este Cliente
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No hay facturas para este cliente</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-between">
                <button
                  onClick={() => setSelectedCliente(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedCliente(null);
                      // Crear nuevo proceso para este cliente
                      setCurrentView('processes');
                      // Aquí podrías pasar el clienteId para pre-seleccionar
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Crear Proceso
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCliente(null);
                      handleEdit(selectedCliente);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Editar Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Formulario Cliente Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingCliente?.nombre}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingCliente?.email}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      defaultValue={editingCliente?.telefono}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CUIT
                    </label>
                    <input
                      type="text"
                      name="cuit"
                      defaultValue={editingCliente?.cuit}
                      placeholder="XX-XXXXXXXX-X"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <textarea
                      name="direccion"
                      defaultValue={editingCliente?.direccion}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sección de documentos para nuevo cliente */}
                {!editingCliente && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">Documentos Impositivos (Opcional)</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Puedes agregar documentos ahora o después desde los detalles del cliente
                    </p>
                    
                    <div className="space-y-3">
                      {[
                        'Certificado de CUIT',
                        'Constancia de Inscripción AFIP',
                        'Certificado Fiscal',
                        'Poder de Representación'
                      ].map((docName, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-sm font-medium">{docName}</span>
                          <input
                            type="file"
                            id={`new-client-doc-${index}`}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Actualizar cliente con nuevo documento
                                const nuevoDoc = {
                                  id: Date.now().toString(),
                                  nombre: file.name,
                                  tipo: 'documento_impositivo',
                                  url: URL.createObjectURL(file),
                                  fechaCarga: new Date().toISOString(),
                                  estado: 'cargado' as const
                                };
                                
                                const clienteActualizado = {
                                  ...selectedCliente,
                                  documentosImpositivos: [
                                    ...(selectedCliente.documentosImpositivos || []),
                                    nuevoDoc
                                  ]
                                };
                                
                                onEditCliente(clienteActualizado);
                                setSelectedCliente(clienteActualizado);
                              }
                            }}
                          />
                          <label
                            htmlFor={`new-client-doc-${index}`}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                          >
                            Subir
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingCliente ? 'Actualizar' : 'Crear'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientsView;