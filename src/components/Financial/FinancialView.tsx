import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Receipt, TrendingUp, Package, Bell, Eye, Download, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ServicioPrecio, NotificacionPrecio, Factura, Cliente } from '../../types';

interface FinancialViewProps {
  servicios: ServicioPrecio[];
  notificaciones: NotificacionPrecio[];
  facturas: Factura[];
  clientes: Cliente[];
  onAddFactura: (factura: Factura) => void;
  onEditFactura: (factura: Factura) => void;
  onDeleteFactura: (facturaId: string) => void;
  onAddServicio: (servicio: ServicioPrecio) => void;
  onEditServicio: (servicio: ServicioPrecio) => void;
  onDeleteServicio: (servicioId: string) => void;
  onAplicarAumento: (porcentaje: number, categoria?: string) => void;
  onMarcarNotificacionLeida: (notificacionId: string) => void;
}

const FinancialView: React.FC<FinancialViewProps> = ({
  servicios,
  notificaciones,
  facturas,
  clientes,
  onAddFactura,
  onEditFactura,
  onDeleteFactura,
  onAddServicio,
  onEditServicio,
  onDeleteServicio,
  onAplicarAumento,
  onMarcarNotificacionLeida
}) => {
  const [activeTab, setActiveTab] = useState<'precios' | 'aumentos' | 'notificaciones' | 'facturas' | 'avisos-contables'>('precios');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrecioForm, setShowPrecioForm] = useState(false);
  const [showFacturaForm, setShowFacturaForm] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioPrecio | undefined>();
  const [editingFactura, setEditingFactura] = useState<Factura | undefined>();
  const [tipoFactura, setTipoFactura] = useState<'cliente' | 'proveedor' | 'organismo'>('cliente');
  const [quienPaga, setQuienPaga] = useState<'nosotros' | 'cliente'>('cliente');
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [showFacturaDetails, setShowFacturaDetails] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [procesosCliente, setProcesosCliente] = useState<any[]>([]);
  const [itemsFactura, setItemsFactura] = useState<any[]>([{ descripcion: '', cantidad: 1, precioUnitario: 0 }]);
  const [uploadingFactura, setUploadingFactura] = useState(false);
  const [archivoAfipSubido, setArchivoAfipSubido] = useState<string | null>(null);

  const stats = {
    servicios: servicios.filter(s => s.activo).length,
    facturas: facturas.length,
    totalFacturado: facturas.reduce((sum, f) => sum + f.total, 0),
    facturasPendientes: facturas.filter(f => f.estado === 'enviada').length,
    notificacionesPendientes: notificaciones.filter(n => !n.leida).length
  };

  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && servicio.activo
  );

  const filteredFacturas = facturas.filter(factura =>
    factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    factura.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const estadoLabels = {
    borrador: 'Borrador',
    enviada: 'Enviada',
    pagada: 'Pagada',
    vencida: 'Vencida'
  };

  const estadoColors = {
    borrador: 'bg-gray-100 text-gray-800',
    enviada: 'bg-blue-100 text-blue-800',
    pagada: 'bg-green-100 text-green-800',
    vencida: 'bg-red-100 text-red-800'
  };

  // Obtener procesos del cliente seleccionado que no han sido facturados
  const getProcesosNoFacturados = (clienteId: string) => {
    if (!clienteId) return [];
    
    // Simular procesos del cliente (en una implementación real vendría de props)
    const todosLosProcesos = [
      { id: '1', titulo: 'Registro RNE - ANMAT', clienteId: clienteId, costo: 15000, facturado: false },
      { id: '2', titulo: 'AFIDI - SENASA', clienteId: clienteId, costo: 8500, facturado: false },
      { id: '3', titulo: 'Certificación ENACOM', clienteId: clienteId, costo: 12000, facturado: true }
    ];
    
    return todosLosProcesos.filter(p => p.clienteId === clienteId && !p.facturado);
  };

  const handleClienteChange = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    const procesos = getProcesosNoFacturados(clienteId);
    setProcesosCliente(procesos);
    
    // Auto-llenar items con procesos no facturados
    if (procesos.length > 0) {
      const items = procesos.map(proceso => ({
        descripcion: proceso.titulo,
        cantidad: 1,
        precioUnitario: proceso.costo
      }));
      setItemsFactura(items);
    } else {
      setItemsFactura([{ descripcion: '', cantidad: 1, precioUnitario: 0 }]);
    }
  };

  const agregarItem = () => {
    setItemsFactura([...itemsFactura, { descripcion: '', cantidad: 1, precioUnitario: 0 }]);
  };

  const eliminarItem = (index: number) => {
    if (itemsFactura.length > 1) {
      setItemsFactura(itemsFactura.filter((_, i) => i !== index));
    }
  };

  const actualizarItem = (index: number, campo: string, valor: any) => {
    const nuevosItems = [...itemsFactura];
    nuevosItems[index] = { ...nuevosItems[index], [campo]: valor };
    setItemsFactura(nuevosItems);
  };

  const calcularSubtotal = () => {
    return itemsFactura.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  };

  const handleFacturaUpload = (file: File) => {
    setUploadingFactura(true);
    
    // Simular subida de archivo
    setTimeout(() => {
      setUploadingFactura(false);
      setArchivoAfipSubido(file.name);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Precios y Facturación</h2>
        <div className="flex space-x-2">
          {activeTab === 'precios' ? (
            <button
              onClick={() => {
                setEditingServicio(undefined);
                setShowPrecioForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Precio</span>
            </button>
          ) : (
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
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Servicios</p>
              <p className="text-2xl font-bold text-blue-600">{stats.servicios}</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Facturas</p>
              <p className="text-2xl font-bold text-green-600">{stats.facturas}</p>
            </div>
            <Receipt className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-purple-600">
                ${stats.totalFacturado.toLocaleString()}
              </p>
            </div>
            <DollarSign className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.facturasPendientes}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notificaciones</p>
              <p className="text-2xl font-bold text-red-600">{stats.notificacionesPendientes}</p>
            </div>
            <Bell className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('precios')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'precios'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <DollarSign size={16} />
              <span>Lista de Precios ({stats.servicios})</span>
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
              <span>Facturación ({stats.facturas})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('avisos-contables')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'avisos-contables'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} />
              <span>Avisos Contables</span>
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
                placeholder={`Buscar ${activeTab === 'precios' ? 'servicios' : 'facturas'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {activeTab === 'precios' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actualización
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServicios.map((servicio) => (
                    <tr 
                      key={servicio.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setEditingServicio(servicio);
                        setShowPrecioForm(true);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{servicio.nombre}</div>
                          {servicio.descripcion && (
                            <div className="text-sm text-gray-500">{servicio.descripcion}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {servicio.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${servicio.precio.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {servicio.fechaUltimaActualizacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingServicio(servicio);
                              setShowPrecioForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar precio"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`¿Estás seguro de que quieres eliminar "${servicio.nombre}"?`)) {
                                onDeleteServicio(servicio.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar precio"
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
          ) : activeTab === 'facturas' ? (
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
                    <tr 
                      key={factura.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedFactura(factura);
                        setShowFacturaDetails(true);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {factura.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof factura.cliente === 'string' ? factura.cliente : factura.cliente?.nombre || 'Cliente no especificado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(factura.fecha), 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${factura.total?.toLocaleString('es-AR') ?? '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[factura.estado]}`}>
                          {estadoLabels[factura.estado]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFactura(factura);
                              setShowFacturaDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver factura"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFactura(factura);
                              setShowFacturaForm(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Editar factura"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Descargar PDF:', factura);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Descargar PDF"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
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
          ) : null}

          {activeTab === 'avisos-contables' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado Contable</h3>
              
              {/* Facturas por Pagar */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-3">Facturas Pendientes de Pago</h4>
                <div className="space-y-2">
                  {facturas.filter(f => f.estado === 'enviada' && f.tipo === 'proveedor').map(factura => (
                    <div key={factura.id} className="flex justify-between items-center text-sm">
                      <span>{factura.numero} - {factura.proveedor}</span>
                      <span className="font-medium text-red-600">${factura.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facturas por Cobrar */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3">Facturas Pendientes de Cobro</h4>
                <div className="space-y-2">
                  {facturas.filter(f => f.estado === 'enviada' && f.tipo === 'cliente').map(factura => (
                    <div key={factura.id} className="flex justify-between items-center text-sm">
                      <span>{factura.numero} - {factura.cliente.nombre}</span>
                      <span className="font-medium text-green-600">${factura.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Estados vacíos */}
          {activeTab === 'precios' && filteredServicios.length === 0 && (
            <div className="text-center py-12">
              <DollarSign size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron precios
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer precio'}
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
        </div>
      </div>

      {/* Formulario Precio Modal */}
      {showPrecioForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowPrecioForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingServicio ? 'Editar Precio' : 'Nuevo Precio'}
                </h3>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const servicio: ServicioPrecio = {
                  id: editingServicio?.id || Date.now().toString(),
                  nombre: formData.get('nombre') as string,
                  descripcion: formData.get('descripcion') as string,
                  precio: Number(formData.get('precio')),
                  categoria: formData.get('categoria') as string,
                  activo: true,
                  fechaUltimaActualizacion: new Date().toISOString().split('T')[0],
                  historialPrecios: editingServicio?.historialPrecios || []
                };

                if (editingServicio) {
                  onEditServicio(servicio);
                } else {
                  onAddServicio(servicio);
                }

                setShowPrecioForm(false);
                setEditingServicio(undefined);
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Servicio *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingServicio?.nombre}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      defaultValue={editingServicio?.descripcion}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio (ARS) *
                    </label>
                    <input
                      type="number"
                      name="precio"
                      defaultValue={editingServicio?.precio}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <input
                      type="text"
                      name="categoria"
                      defaultValue={editingServicio?.categoria}
                      required
                      placeholder="Ej: Registros, Autorizaciones, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPrecioForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingServicio ? 'Actualizar' : 'Crear'} Precio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Formulario Factura Modal */}
      {showFacturaForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFacturaForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingFactura ? 'Editar Factura' : 'Nueva Factura'}
                </h3>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const cliente = clientes.find(c => c.id === formData.get('clienteId'));
                if (!cliente) return;

                const subtotal = calcularSubtotal();
                const iva = subtotal * 0.21;
                const total = subtotal + iva;

                const facturaData = {
                  clienteId: cliente.id,
                  cliente: cliente.nombre,
                  fecha: formData.get('fecha') as string,
                  fechaVencimiento: formData.get('fechaVencimiento') as string,
                  items: itemsFactura.map((item, index) => ({
                    id: (index + 1).toString(),
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    subtotal: item.cantidad * item.precioUnitario
                  })),
                  subtotal,
                  iva,
                  total,
                  estado: formData.get('estado') as any,
                  notas: formData.get('notas') as string,
                  archivoAfip: archivoAfipSubido || undefined
                };

                if (editingFactura) {
                  const facturaCompleta = {
                    ...editingFactura,
                    ...facturaData
                  };
                  onEditFactura(facturaCompleta);
                } else {
                  onAddFactura(facturaData as any);
                }

                setShowFacturaForm(false);
                setEditingFactura(undefined);
                setSelectedClienteId('');
                setProcesosCliente([]);
                setItemsFactura([{ descripcion: '', cantidad: 1, precioUnitario: 0 }]);
                setArchivoAfipSubido(null);
                
                // Mostrar mensaje de confirmación
                alert(`Factura ${editingFactura ? 'actualizada' : 'creada'} correctamente`);
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Factura *
                    </label>
                    <select
                      value={tipoFactura}
                      onChange={(e) => setTipoFactura(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cliente">Para Cliente</option>
                      <option value="proveedor">De Proveedor</option>
                      <option value="organismo">De Organismo</option>
                    </select>
                  </div>

                  {(tipoFactura === 'proveedor' || tipoFactura === 'organismo') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quién Paga *
                      </label>
                      <select
                        value={quienPaga}
                        onChange={(e) => setQuienPaga(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="nosotros">Nosotros</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editingFactura && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Factura
                      </label>
                      <input
                        type="text"
                        value={editingFactura.numero}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <select
                      name="clienteId"
                      defaultValue={editingFactura?.clienteId}
                      onChange={(e) => handleClienteChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar cliente...</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      defaultValue={editingFactura?.fecha ? format(new Date(editingFactura.fecha), 'yyyy-MM-dd') : new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Vencimiento *
                    </label>
                    <input
                      type="date"
                      name="fechaVencimiento"
                      defaultValue={editingFactura?.fechaVencimiento ? format(new Date(editingFactura.fechaVencimiento), 'yyyy-MM-dd') : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Items a Facturar
                      </label>
                      <button
                        type="button"
                        onClick={agregarItem}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        + Agregar Item
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {itemsFactura.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded">
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Descripción del servicio"
                              value={item.descripcion}
                              onChange={(e) => actualizarItem(index, 'descripcion', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div className="col-span-1">
                            <input
                              type="number"
                              placeholder="Cant."
                              value={item.cantidad}
                              onChange={(e) => actualizarItem(index, 'cantidad', Number(e.target.value))}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              min="1"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Precio unitario"
                              value={item.precioUnitario}
                              onChange={(e) => actualizarItem(index, 'precioUnitario', Number(e.target.value))}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm font-medium">
                              ${(item.cantidad * item.precioUnitario).toLocaleString()}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <div className="flex space-x-1">
                              <select
                                value={tipoFactura}
                                onChange={(e) => setTipoFactura(e.target.value as 'cliente' | 'proveedor')}
                                className="px-2 py-1 text-xs border border-gray-300 rounded"
                              >
                                <option value="cliente">Cliente</option>
                                <option value="proveedor">Proveedor</option>
                              </select>
                              {itemsFactura.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => eliminarItem(index)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title="Eliminar item"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {procesosCliente.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <h5 className="text-sm font-medium text-blue-800 mb-2">
                          Procesos disponibles para facturar:
                        </h5>
                        <div className="space-y-1">
                          {procesosCliente.map(proceso => (
                            <div key={proceso.id} className="flex justify-between text-sm text-blue-700">
                              <span>• {proceso.titulo}</span>
                              <span className="font-medium">${proceso.costo.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 p-3 bg-gray-100 rounded">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">${calcularSubtotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA (21%):</span>
                        <span className="font-medium">${(calcularSubtotal() * 0.21).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold border-t pt-1 mt-1">
                        <span>Total:</span>
                        <span>${(calcularSubtotal() * 1.21).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="estado"
                      defaultValue={editingFactura?.estado || 'borrador'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="borrador">Borrador</option>
                      <option value="enviada">Enviada</option>
                      <option value="pagada">Pagada</option>
                      <option value="vencida">Vencida</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subir Factura AFIP (Opcional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        id="factura-afip"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFacturaUpload(file);
                        }}
                      />
                      <label
                        htmlFor="factura-afip"
                        className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          uploadingFactura ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        <div className="text-center">
                          {uploadingFactura ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="text-sm">Subiendo factura AFIP...</span>
                            </div>
                          ) : archivoAfipSubido ? (
                            <div className="flex items-center space-x-2 text-green-600">
                              <span className="text-sm font-medium">✓ {archivoAfipSubido}</span>
                            </div>
                          ) : (
                            <>
                              <span className="text-sm font-medium">Subir factura generada en AFIP</span>
                              <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (máx. 10MB)</span>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas
                    </label>
                    <textarea
                      name="notas"
                      defaultValue={editingFactura?.notas}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFacturaForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={calcularSubtotal() === 0}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingFactura ? 'Actualizar' : 'Crear'} Factura
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Modal de detalles de factura */}
      {showFacturaDetails && selectedFactura && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFacturaDetails(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Detalles de Factura: {selectedFactura.numero}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Información de la Factura</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Número:</strong> {selectedFactura.numero}</p>
                      <p><strong>Cliente:</strong> {typeof selectedFactura.cliente === 'string' ? selectedFactura.cliente : selectedFactura.cliente.nombre}</p>
                      <p><strong>Fecha:</strong> {format(new Date(selectedFactura.fecha), 'dd/MM/yyyy')}</p>
                      <p><strong>Vencimiento:</strong> {format(new Date(selectedFactura.fechaVencimiento), 'dd/MM/yyyy')}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${estadoColors[selectedFactura.estado]}`}>
                          {estadoLabels[selectedFactura.estado]}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Totales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedFactura.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA:</span>
                        <span>${selectedFactura.iva.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${selectedFactura.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items de la factura */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Items Facturados</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Descripción</th>
                          <th className="px-4 py-2 text-left">Cantidad</th>
                          <th className="px-4 py-2 text-left">Precio Unit.</th>
                          <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedFactura.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{item.descripcion}</td>
                            <td className="px-4 py-2">{item.cantidad}</td>
                            <td className="px-4 py-2">${item.precioUnitario.toLocaleString()}</td>
                            <td className="px-4 py-2">${item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedFactura.notas && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Notas</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedFactura.notas}</p>
                  </div>
                )}

                {selectedFactura.archivoAfip && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Archivo AFIP</h4>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">✓ {selectedFactura.archivoAfip}</span>
                        <button
                          onClick={() => {
                            console.log('Descargar archivo AFIP:', selectedFactura.archivoAfip);
                            alert(`Descargando ${selectedFactura.archivoAfip}`);
                          }}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Historial */}
                {selectedFactura.historial && selectedFactura.historial.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Historial de Cambios</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {selectedFactura.historial.map((entrada) => (
                        <div key={entrada.id} className={`p-3 rounded-lg text-sm ${
                          entrada.accion === 'creacion' ? 'bg-green-50 border-l-4 border-green-500' :
                          entrada.accion === 'edicion' ? 'bg-blue-50 border-l-4 border-blue-500' :
                          entrada.accion === 'eliminacion' ? 'bg-red-50 border-l-4 border-red-500' :
                          'bg-yellow-50 border-l-4 border-yellow-500'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{entrada.descripcion}</p>
                              <p className="text-xs text-gray-600">por {entrada.usuario}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(entrada.fecha, 'dd/MM/yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-between">
                <button
                  onClick={() => setShowFacturaDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowFacturaDetails(false);
                      setEditingFactura(selectedFactura);
                      setShowFacturaForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Editar Factura
                  </button>
                  <button
                    onClick={() => {
                      console.log('Descargar PDF:', selectedFactura);
                      alert(`Descargando PDF de factura ${selectedFactura.numero}`);
                    }}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialView;