import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Truck, Phone, Mail, MapPin, FileText, DollarSign, Eye, Download, Building } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Proveedor, FacturaProveedor } from '../../types';

interface ProveedoresViewProps {
  proveedores: Proveedor[];
  facturasProveedores: FacturaProveedor[];
  onAddProveedor: (proveedor: Proveedor) => void;
  onEditProveedor: (proveedor: Proveedor) => void;
  onDeleteProveedor: (proveedorId: string) => void;
  onAddFacturaProveedor: (factura: FacturaProveedor) => void;
  onEditFacturaProveedor: (factura: FacturaProveedor) => void;
  onDeleteFacturaProveedor: (facturaId: string) => void;
}

const ProveedoresView: React.FC<ProveedoresViewProps> = ({
  proveedores,
  facturasProveedores,
  onAddProveedor,
  onEditProveedor,
  onDeleteProveedor,
  onAddFacturaProveedor,
  onEditFacturaProveedor,
  onDeleteFacturaProveedor
}) => {
  const [activeTab, setActiveTab] = useState<'proveedores' | 'facturas'>('proveedores');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [showFacturaForm, setShowFacturaForm] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>();
  const [editingFactura, setEditingFactura] = useState<FacturaProveedor | undefined>();
  const [selectedCategoria, setSelectedCategoria] = useState<'all' | 'logistica' | 'legal' | 'gobierno' | 'otro'>('all');

  const categorias = [
    { value: 'logistica', label: 'Logística' },
    { value: 'legal', label: 'Legal' },
    { value: 'gobierno', label: 'Gobierno' },
    { value: 'otro', label: 'Otro' }
  ];

  const filteredProveedores = proveedores.filter(proveedor => {
    const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (proveedor.contacto && proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategoria = selectedCategoria === 'all' || proveedor.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria && proveedor.activo;
  });

  const filteredFacturas = facturasProveedores.filter(factura => {
    return factura.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
           factura.proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleProveedorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const proveedor: Proveedor = {
      id: editingProveedor?.id || Math.random().toString(36).substr(2, 9),
      nombre: formData.get('nombre') as string,
      categoria: formData.get('categoria') as 'logistica' | 'legal' | 'gobierno' | 'otro',
      cuit: formData.get('cuit') as string || undefined,
      contacto: formData.get('contacto') as string || undefined,
      telefono: formData.get('telefono') as string || undefined,
      email: formData.get('email') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      activo: true,
      fechaCreacion: editingProveedor?.fechaCreacion || new Date(),
      fechaActualizacion: new Date()
    };

    if (editingProveedor) {
      onEditProveedor(proveedor);
    } else {
      onAddProveedor(proveedor);
    }

    setShowProveedorForm(false);
    setEditingProveedor(undefined);
  };

  const handleFacturaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const proveedor = proveedores.find(p => p.id === formData.get('proveedorId'));
    if (!proveedor) return;

    const subtotal = Number(formData.get('subtotal'));
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const factura: FacturaProveedor = {
      id: editingFactura?.id || Math.random().toString(36).substr(2, 9),
      proveedorId: proveedor.id,
      proveedor,
      numero: formData.get('numero') as string,
      fecha: new Date(formData.get('fecha') as string),
      fechaVencimiento: new Date(formData.get('fechaVencimiento') as string),
      concepto: formData.get('concepto') as string,
      subtotal,
      iva,
      total,
      estado: formData.get('estado') as any,
      procesoId: formData.get('procesoId') as string || undefined,
      clienteId: formData.get('clienteId') as string || undefined,
      notas: formData.get('notas') as string || undefined,
      fechaCreacion: editingFactura?.fechaCreacion || new Date(),
      fechaActualizacion: new Date()
    };

    if (editingFactura) {
      onEditFacturaProveedor(factura);
    } else {
      onAddFacturaProveedor(factura);
    }

    setShowFacturaForm(false);
    setEditingFactura(undefined);
  };

  const proveedorStats = {
    total: proveedores.filter(p => p.activo).length,
    logistica: proveedores.filter(p => p.activo && p.categoria === 'logistica').length,
    legal: proveedores.filter(p => p.activo && p.categoria === 'legal').length,
    gobierno: proveedores.filter(p => p.activo && p.categoria === 'gobierno').length,
    totalFacturas: facturasProveedores.length,
    facturasPendientes: facturasProveedores.filter(f => f.estado === 'pendiente').length,
    montoTotal: facturasProveedores.reduce((sum, f) => sum + f.total, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingProveedor(undefined);
              setShowProveedorForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Proveedor</span>
          </button>
          <button
            onClick={() => {
              setEditingFactura(undefined);
              setShowFacturaForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText size={20} />
            <span>Nueva Factura</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{proveedorStats.total}</p>
            <p className="text-sm text-gray-600">Total Proveedores</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{proveedorStats.logistica}</p>
            <p className="text-sm text-gray-600">Logística</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{proveedorStats.legal}</p>
            <p className="text-sm text-gray-600">Legal</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{proveedorStats.gobierno}</p>
            <p className="text-sm text-gray-600">Gobierno</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{proveedorStats.totalFacturas}</p>
            <p className="text-sm text-gray-600">Total Facturas</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{proveedorStats.facturasPendientes}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">${proveedorStats.montoTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Monto Total</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
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
              <span>Proveedores ({proveedorStats.total})</span>
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
              <FileText size={16} />
              <span>Facturas ({proveedorStats.totalFacturas})</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'proveedores' ? 'Buscar proveedores...' : 'Buscar facturas...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {activeTab === 'proveedores' && (
              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* Contenido de tabs */}
          {activeTab === 'proveedores' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProveedores.map((proveedor) => (
                <div key={proveedor.id} className="bg-gray-50 rounded-lg p-6 border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        proveedor.categoria === 'logistica' ? 'bg-green-100' :
                        proveedor.categoria === 'legal' ? 'bg-purple-100' :
                        proveedor.categoria === 'gobierno' ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <Truck className={
                          proveedor.categoria === 'logistica' ? 'text-green-600' :
                          proveedor.categoria === 'legal' ? 'text-purple-600' :
                          proveedor.categoria === 'gobierno' ? 'text-orange-600' : 'text-gray-600'
                        } size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{proveedor.nombre}</h3>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          proveedor.categoria === 'logistica' ? 'text-green-800 bg-green-100' :
                          proveedor.categoria === 'legal' ? 'text-purple-800 bg-purple-100' :
                          proveedor.categoria === 'gobierno' ? 'text-orange-800 bg-orange-100' :
                          'text-gray-800 bg-gray-100'
                        }`}>
                          {categorias.find(c => c.value === proveedor.categoria)?.label}
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

                  <div className="space-y-2 text-sm text-gray-600">
                    {proveedor.contacto && (
                      <div className="flex items-center space-x-2">
                        <Building size={14} />
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
                    {proveedor.cuit && (
                      <div className="flex items-center space-x-2">
                        <FileText size={14} />
                        <span>CUIT: {proveedor.cuit}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Facturas: {facturasProveedores.filter(f => f.proveedorId === proveedor.id).length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concepto
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
                        {factura.proveedor.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {factura.concepto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(factura.fecha, 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${factura.total.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          factura.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          factura.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {factura.estado === 'pendiente' ? 'Pendiente' :
                           factura.estado === 'pagada' ? 'Pagada' : 'Vencida'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingFactura(factura);
                              setShowFacturaForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar factura"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
                                onDeleteFacturaProveedor(factura.id);
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
        </div>
      </div>

      {/* Formulario Proveedor Modal */}
      {showProveedorForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowProveedorForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h3>
              </div>
              
              <form onSubmit={handleProveedorSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingProveedor?.nombre}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="categoria"
                      defaultValue={editingProveedor?.categoria || 'otro'}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categorias.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CUIT
                    </label>
                    <input
                      type="text"
                      name="cuit"
                      defaultValue={editingProveedor?.cuit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contacto
                    </label>
                    <input
                      type="text"
                      name="contacto"
                      defaultValue={editingProveedor?.contacto}
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
                      defaultValue={editingProveedor?.telefono}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingProveedor?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <textarea
                      name="direccion"
                      defaultValue={editingProveedor?.direccion}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProveedorForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingProveedor ? 'Actualizar' : 'Crear'} Proveedor
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
                  {editingFactura ? 'Editar Factura' : 'Nueva Factura de Proveedor'}
                </h3>
              </div>
              
              <form onSubmit={handleFacturaSubmit} className="p-6 space-y-4">
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
                      Proveedor *
                    </label>
                    <select
                      name="proveedorId"
                      defaultValue={editingFactura?.proveedorId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar proveedor...</option>
                      {proveedores.map(proveedor => (
                        <option key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Concepto *
                    </label>
                    <input
                      type="text"
                      name="concepto"
                      defaultValue={editingFactura?.concepto}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtotal (sin IVA) *
                    </label>
                    <input
                      type="number"
                      name="subtotal"
                      defaultValue={editingFactura?.subtotal}
                      required
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="estado"
                      defaultValue={editingFactura?.estado || 'pendiente'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagada">Pagada</option>
                      <option value="vencida">Vencida</option>
                    </select>
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

      {/* Estado vacío */}
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

      {activeTab === 'facturas' && filteredFacturas.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No se encontraron facturas
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primera factura'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProveedoresView;