import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar, User, FileText, Download, Receipt, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Factura, Cliente, ItemFactura } from '../../types';

interface BillingViewProps {
  facturas: Factura[];
  clientes: Cliente[];
  onAddFactura: (factura: Factura) => void;
  onEditFactura: (factura: Factura) => void;
  onDeleteFactura: (facturaId: string) => void;
}

const BillingView: React.FC<BillingViewProps> = ({
  facturas,
  clientes,
  onAddFactura,
  onEditFactura,
  onDeleteFactura
}) => {
  const [activeTab, setActiveTab] = useState<'facturas' | 'proveedores'>('facturas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | undefined>();
  const [selectedEstado, setSelectedEstado] = useState('');

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factura.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !selectedEstado || factura.estado === selectedEstado;
    return matchesSearch && matchesEstado;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cliente = clientes.find(c => c.id === formData.get('clienteId'));
    if (!cliente) return;

    // Obtener items del formulario
    const items: ItemFactura[] = [];
    const itemsData = formData.getAll('items');
    // Aquí procesarías los items del formulario dinámico
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const iva = subtotal * 0.21; // 21% IVA
    const total = subtotal + iva;

    const factura: Factura = {
      id: editingFactura?.id || Math.random().toString(36).substr(2, 9),
      numero: formData.get('numero') as string,
      clienteId: cliente.id,
      cliente,
      fecha: new Date(formData.get('fecha') as string),
      fechaVencimiento: new Date(formData.get('fechaVencimiento') as string),
      items,
      subtotal,
      iva,
      total,
      estado: formData.get('estado') as any,
      notas: formData.get('notas') as string || undefined,
      fechaCreacion: editingFactura?.fechaCreacion || new Date(),
      fechaActualizacion: new Date()
    };

    if (editingFactura) {
      onEditFactura(factura);
    } else {
      onAddFactura(factura);
    }

    setShowForm(false);
    setEditingFactura(undefined);
  };

  const handleEdit = (factura: Factura) => {
    setEditingFactura(factura);
    setShowForm(true);
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

  const totalFacturado = filteredFacturas.reduce((sum, f) => sum + f.total, 0);
  const facturasPagadas = filteredFacturas.filter(f => f.estado === 'pagada').length;
  const facturasVencidas = filteredFacturas.filter(f => f.estado === 'vencida').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión Contable</h2>
        <button
          onClick={() => {
            setEditingFactura(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Factura</span>
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalFacturado.toLocaleString('es-AR')}
              </p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facturas</p>
              <p className="text-2xl font-bold text-blue-600">{filteredFacturas.length}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagadas</p>
              <p className="text-2xl font-bold text-green-600">{facturasPagadas}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-red-600">{facturasVencidas}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
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
              <span>Facturación a Clientes</span>
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
              <span>Gestión de Proveedores</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'facturas' ? (
            <>
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por número o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {Object.entries(estadoLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Facturas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  Vencimiento
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
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      {factura.cliente.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(factura.fecha, 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(factura.fechaVencimiento, 'dd/MM/yyyy', { locale: es })}
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
                          console.log('Ver factura:', factura);
                          // Abrir modal de detalles de factura
                          setSelectedFactura(factura);
                          setShowFacturaDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver factura"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(factura)}
                        className="text-green-600 hover:text-green-900"
                        title="Editar factura"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          console.log('Descargar PDF:', factura);
                          // Aquí implementarías la descarga del PDF
                          alert(`Descargando PDF de factura ${factura.numero}`);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Descargar PDF"
                      >
                        <Download size={16} />
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
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingFactura ? 'Editar Factura' : 'Nueva Factura'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Factura *
                    </label>
                    <input
                      type="text"
                      name="numero"
                      defaultValue={editingFactura?.numero}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <select
                      name="clienteId"
                      defaultValue={editingFactura?.clienteId}
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
                      defaultValue={editingFactura ? format(editingFactura.fecha, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
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
                      defaultValue={editingFactura ? format(editingFactura.fechaVencimiento, 'yyyy-MM-dd') : ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                      {Object.entries(estadoLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
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

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
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

      {filteredFacturas.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No se encontraron facturas
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando tu primera factura'}
          </p>
        </div>
      )}
            </>
          ) : (
            <div className="text-center py-12">
              <Truck size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Gestión de Proveedores
              </h3>
              <p className="text-gray-500">
                Esta funcionalidad estará disponible próximamente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingView;