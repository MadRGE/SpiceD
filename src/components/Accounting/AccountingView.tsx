import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, MapPin, FileText, Building, Receipt, Truck, DollarSign, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cliente, Factura, Proveedor, FacturaProveedor } from '../../types';

interface AccountingViewProps {
  clientes: Cliente[];
  facturas: Factura[];
  proveedores: Proveedor[];
  facturasProveedores: FacturaProveedor[];
  onAddCliente: (cliente: Cliente) => void;
  onEditCliente: (cliente: Cliente) => void;
  onDeleteCliente: (clienteId: string) => void;
  onAddFactura: (factura: Factura) => void;
  onEditFactura: (factura: Factura) => void;
  onDeleteFactura: (facturaId: string) => void;
  onAddProveedor: (proveedor: Proveedor) => void;
  onEditProveedor: (proveedor: Proveedor) => void;
  onDeleteProveedor: (proveedorId: string) => void;
  onAddFacturaProveedor: (factura: FacturaProveedor) => void;
  onEditFacturaProveedor: (factura: FacturaProveedor) => void;
  onDeleteFacturaProveedor: (facturaId: string) => void;
}

const AccountingView: React.FC<AccountingViewProps> = ({
  clientes,
  facturas,
  proveedores,
  facturasProveedores,
  onAddCliente,
  onEditCliente,
  onDeleteCliente,
  onAddFactura,
  onEditFactura,
  onDeleteFactura,
  onAddProveedor,
  onEditProveedor,
  onDeleteProveedor,
  onAddFacturaProveedor,
  onEditFacturaProveedor,
  onDeleteFacturaProveedor
}) => {
  const [activeTab, setActiveTab] = useState<'clientes' | 'facturas' | 'proveedores'>('clientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [showFacturaForm, setShowFacturaForm] = useState(false);
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | undefined>();
  const [editingFactura, setEditingFactura] = useState<Factura | undefined>();
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.cuit && cliente.cuit.includes(searchTerm))
  );

  const filteredFacturas = facturas.filter(factura =>
    factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (proveedor.contacto && proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cliente: Cliente = {
      id: editingClient?.id || Math.random().toString(36).substr(2, 9),
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      cuit: formData.get('cuit') as string || undefined,
      condicionIva: formData.get('condicionIva') as any,
      fechaCreacion: editingClient?.fechaCreacion || new Date(),
      fechaActualizacion: new Date(),
      activo: true,
      documentosImpositivos: [],
      descuentosEspeciales: []
    };

    if (editingClient) {
      onEditCliente(cliente);
    } else {
      onAddCliente(cliente);
    }

    setShowClientForm(false);
    setEditingClient(undefined);
  };

  const handleEditClient = (cliente: Cliente) => {
    setEditingClient(cliente);
    setShowClientForm(true);
  };

  const condicionIvaLabels = {
    responsable_inscripto: 'Responsable Inscripto',
    monotributo: 'Monotributo',
    exento: 'Exento',
    consumidor_final: 'Consumidor Final'
  };

  const estadoLabels = {
    borrador: 'Borrador',
    enviada: 'Enviada',
    pagada: 'Pagada',
    vencida: 'Vencida',
    cancelada: 'Cancelada'
  };

  const estadoColors = {
    borrador: 'bg-gray-100 text-gray-800',
    enviada: 'bg-blue-100 text-blue-800',
    pagada: 'bg-green-100 text-green-800',
    vencida: 'bg-red-100 text-red-800',
    cancelada: 'bg-red-100 text-red-800'
  };

  const getClienteFacturas = (clienteId: string) => {
    return facturas.filter(f => f.clienteId === clienteId);
  };

  const getClienteProcesos = (clienteNombre: string) => {
    // Aquí deberías tener acceso a los procesos para filtrar por cliente
    // Por ahora retornamos un array vacío
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Administración Contable</h2>
        <div className="flex space-x-2">
          {activeTab === 'clientes' && (
            <button
              onClick={() => {
                setEditingClient(undefined);
                setShowClientForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Cliente</span>
            </button>
          )}
          {activeTab === 'facturas' && (
            <button
              onClick={() => {
                setEditingFactura(undefined);
                setShowFacturaForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nueva Factura</span>
            </button>
          )}
          {activeTab === 'proveedores' && (
            <button
              onClick={() => {
                setEditingProveedor(undefined);
                setShowProveedorForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Proveedor</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'clientes'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>Clientes ({clientes.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('facturas')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'facturas'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Receipt size={16} />
              <span>Facturación ({facturas.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('proveedores')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'proveedores'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Truck size={16} />
              <span>Proveedores ({proveedores.length})</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Buscar ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {activeTab === 'clientes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClientes.map((cliente) => {
                const clienteFacturas = getClienteFacturas(cliente.id);
                const clienteProcesos = getClienteProcesos(cliente.nombre);
                const totalFacturado = clienteFacturas.reduce((sum, f) => sum + f.total, 0);
                const facturasPendientes = clienteFacturas.filter(f => f.estado === 'enviada').length;

                return (
                  <div key={cliente.id} className="bg-white rounded-lg shadow-md p-6 border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{cliente.nombre}</h3>
                          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {condicionIvaLabels[cliente.condicionIva]}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCliente(cliente)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClient(cliente)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar cliente"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
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
                    </div>

                    {/* Resumen financiero */}
                    <div className="border-t pt-4 space-y-2">
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
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Procesos:</span>
                        <span className="font-medium">{clienteProcesos.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'facturas' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFacturas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {factura.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {factura.cliente.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(factura.fecha, 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${factura.total.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[factura.estado]}`}>
                          {estadoLabels[factura.estado]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // Ver factura
                              console.log('Ver factura:', factura);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver factura"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingFactura(factura);
                              setShowFacturaForm(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Editar factura"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
                                onDeleteFactura(factura.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar factura"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'proveedores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProveedores.map((proveedor) => {
                const proveedorFacturas = facturasProveedores.filter(f => f.proveedorId === proveedor.id);
                const totalGastado = proveedorFacturas.reduce((sum, f) => sum + f.total, 0);
                const facturasPendientes = proveedorFacturas.filter(f => f.estado === 'pendiente').length;

                return (
                  <div key={proveedor.id} className="bg-white rounded-lg shadow-md p-6 border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Truck className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{proveedor.nombre}</h3>
                          <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {proveedor.categoria}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProveedor(proveedor);
                            setShowProveedorForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar proveedor"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de que quieres eliminar "${proveedor.nombre}"?`)) {
                              onDeleteProveedor(proveedor.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar proveedor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {proveedor.contacto && (
                        <div className="flex items-center space-x-2">
                          <User size={14} />
                          <span>{proveedor.contacto}</span>
                        </div>
                      )}
                      {proveedor.telefono && (
                        <div className="flex items-center space-x-2">
                          <Phone size={14} />
                          <span>{proveedor.telefono}</span>
                        </div>
                      )}
                      {proveedor.email && (
                        <div className="flex items-center space-x-2">
                          <Mail size={14} />
                          <span>{proveedor.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Resumen financiero */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Facturas:</span>
                        <span className="font-medium">{proveedorFacturas.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pendientes:</span>
                        <span className="font-medium text-red-600">{facturasPendientes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total gastado:</span>
                        <span className="font-medium text-red-600">${totalGastado.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Estados vacíos */}
          {activeTab === 'clientes' && filteredClientes.length === 0 && (
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

          {activeTab === 'facturas' && filteredFacturas.length === 0 && (
            <div className="text-center py-12">
              <Receipt size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron facturas
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando tu primera factura'}
              </p>
            </div>
          )}

          {activeTab === 'proveedores' && filteredProveedores.length === 0 && (
            <div className="text-center py-12">
              <Truck size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron proveedores
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer proveedor'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del cliente */}
      {selectedCliente && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSelectedCliente(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Detalles del Cliente: {selectedCliente.nombre}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Información básica */}
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
                    <h4 className="font-medium text-gray-700 mb-2">Estado de Pagos</h4>
                    <div className="space-y-2 text-sm">
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

                {/* Facturas del cliente */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Facturas del Cliente</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Número</th>
                          <th className="px-4 py-2 text-left">Fecha</th>
                          <th className="px-4 py-2 text-left">Total</th>
                          <th className="px-4 py-2 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getClienteFacturas(selectedCliente.id).map((factura) => (
                          <tr key={factura.id}>
                            <td className="px-4 py-2">{factura.numero}</td>
                            <td className="px-4 py-2">{format(factura.fecha, 'dd/MM/yyyy')}</td>
                            <td className="px-4 py-2">${factura.total.toLocaleString()}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${estadoColors[factura.estado]}`}>
                                {estadoLabels[factura.estado]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t">
                <button
                  onClick={() => setSelectedCliente(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Formulario Cliente Modal */}
      {showClientForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowClientForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
              </div>
              
              <form onSubmit={handleClientSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingClient?.nombre}
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
                      defaultValue={editingClient?.email}
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
                      defaultValue={editingClient?.telefono}
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
                      defaultValue={editingClient?.cuit}
                      placeholder="XX-XXXXXXXX-X"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condición IVA *
                    </label>
                    <select
                      name="condicionIva"
                      defaultValue={editingClient?.condicionIva || 'responsable_inscripto'}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="responsable_inscripto">Responsable Inscripto</option>
                      <option value="monotributo">Monotributo</option>
                      <option value="exento">Exento</option>
                      <option value="consumidor_final">Consumidor Final</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <textarea
                      name="direccion"
                      defaultValue={editingClient?.direccion}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowClientForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingClient ? 'Actualizar' : 'Crear'} Cliente
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

export default AccountingView;