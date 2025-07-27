import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building, Phone, Mail, Globe, Clock, DollarSign, Users, Truck, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Organismo, Proveedor, FacturaProveedor } from '../../types';

interface EntitiesViewProps {
  organismos: Organismo[];
  proveedores: Proveedor[];
  facturasProveedores: FacturaProveedor[];
  onAddOrganismo: (organismo: Organismo) => void;
  onEditOrganismo: (organismo: Organismo) => void;
  onDeleteOrganismo: (organismoId: string) => void;
  onAddProveedor: (proveedor: Proveedor) => void;
  onEditProveedor: (proveedor: Proveedor) => void;
  onDeleteProveedor: (proveedorId: string) => void;
  onAddFacturaProveedor: (factura: FacturaProveedor) => void;
  onEditFacturaProveedor: (factura: FacturaProveedor) => void;
  onDeleteFacturaProveedor: (facturaId: string) => void;
}

const EntitiesView: React.FC<EntitiesViewProps> = ({
  organismos,
  proveedores,
  facturasProveedores,
  onAddOrganismo,
  onEditOrganismo,
  onDeleteOrganismo,
  onAddProveedor,
  onEditProveedor,
  onDeleteProveedor,
  onAddFacturaProveedor,
  onEditFacturaProveedor,
  onDeleteFacturaProveedor
}) => {
  const [activeTab, setActiveTab] = useState<'organismos' | 'proveedores'>('organismos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrganismoForm, setShowOrganismoForm] = useState(false);
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [editingOrganismo, setEditingOrganismo] = useState<Organismo | undefined>();
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>();

  const filteredOrganismos = organismos.filter(organismo =>
    organismo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && organismo.activo
  );

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && proveedor.activo
  );

  const stats = {
    organismos: organismos.filter(o => o.activo).length,
    proveedores: proveedores.filter(p => p.activo).length,
    facturasProveedores: facturasProveedores.length,
    montoTotal: facturasProveedores.reduce((sum, f) => sum + f.total, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Organismos y Proveedores</h2>
        <div className="flex space-x-2">
          {activeTab === 'organismos' ? (
            <button
              onClick={() => {
                setEditingOrganismo(undefined);
                setShowOrganismoForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Organismo</span>
            </button>
          ) : (
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Organismos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.organismos}</p>
            </div>
            <Building className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Proveedores</p>
              <p className="text-2xl font-bold text-purple-600">{stats.proveedores}</p>
            </div>
            <Truck className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Facturas Proveedores</p>
              <p className="text-2xl font-bold text-green-600">{stats.facturasProveedores}</p>
            </div>
            <FileText className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monto Total</p>
              <p className="text-2xl font-bold text-orange-600">${stats.montoTotal.toLocaleString()}</p>
            </div>
            <DollarSign className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('organismos')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'organismos'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building size={16} />
              <span>Organismos ({stats.organismos})</span>
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
              <span>Proveedores ({stats.proveedores})</span>
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

          {activeTab === 'organismos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganismos.map((organismo) => (
                <div 
                  key={organismo.id} 
                  className="bg-white rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setEditingOrganismo(organismo);
                    setShowOrganismoForm(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        organismo.tipo === 'publico' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <Building className={
                          organismo.tipo === 'publico' ? 'text-green-600' : 'text-purple-600'
                        } size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{organismo.nombre}</h3>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          organismo.tipo === 'publico' 
                            ? 'text-green-800 bg-green-100' 
                            : 'text-purple-800 bg-purple-100'
                        }`}>
                          {organismo.tipo === 'publico' ? 'Público' : 'Privado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingOrganismo(organismo);
                          setShowOrganismoForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar organismo"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`¿Estás seguro de que quieres eliminar "${organismo.nombre}"?`)) {
                            onDeleteOrganismo(organismo.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar organismo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {organismo.contactoPrincipal && (
                      <div className="flex items-center space-x-2">
                        <Users size={14} />
                        <span>{organismo.contactoPrincipal}</span>
                      </div>
                    )}
                    {organismo.telefono && (
                      <div className="flex items-center space-x-2">
                        <Phone size={14} />
                        <span>{organismo.telefono}</span>
                      </div>
                    )}
                    {organismo.email && (
                      <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span>{organismo.email}</span>
                      </div>
                    )}
                    {organismo.sitioWeb && (
                      <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <a href={organismo.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Sitio Web
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProveedores.map((proveedor) => (
                <div 
                  key={proveedor.id} 
                  className="bg-white rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setEditingProveedor(proveedor);
                    setShowProveedorForm(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Truck className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{proveedor.nombre}</h3>
                        <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {proveedor.servicios?.join(', ') || 'Servicios generales'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProveedor(proveedor);
                          setShowProveedorForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar proveedor"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
          )}

          {/* Estados vacíos */}
          {activeTab === 'organismos' && filteredOrganismos.length === 0 && (
            <div className="text-center py-12">
              <Building size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron organismos
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer organismo'}
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

      {/* Formulario Organismo Modal */}
      {showOrganismoForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowOrganismoForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingOrganismo ? 'Editar Organismo' : 'Nuevo Organismo'}
                </h3>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const organismo: Organismo = {
                  id: editingOrganismo?.id || Date.now().toString(),
                  nombre: formData.get('nombre') as string,
                  tipo: formData.get('tipo') as string,
                  direccion: formData.get('direccion') as string,
                  telefono: formData.get('telefono') as string,
                  email: formData.get('email') as string,
                  sitioWeb: formData.get('sitioWeb') as string,
                  contactoPrincipal: formData.get('contactoPrincipal') as string,
                  activo: true
                };

                if (editingOrganismo) {
                  onEditOrganismo(organismo);
                } else {
                  onAddOrganismo(organismo);
                }

                setShowOrganismoForm(false);
                setEditingOrganismo(undefined);
              }} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingOrganismo?.nombre}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      name="tipo"
                      defaultValue={editingOrganismo?.tipo || 'publico'}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="publico">Público</option>
                      <option value="privado">Privado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contacto Principal
                    </label>
                    <input
                      type="text"
                      name="contactoPrincipal"
                      defaultValue={editingOrganismo?.contactoPrincipal}
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
                      defaultValue={editingOrganismo?.telefono}
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
                      defaultValue={editingOrganismo?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      name="sitioWeb"
                      defaultValue={editingOrganismo?.sitioWeb}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <textarea
                      name="direccion"
                      defaultValue={editingOrganismo?.direccion}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrganismoForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {editingOrganismo ? 'Actualizar' : 'Crear'} Organismo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

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
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const proveedor: Proveedor = {
                  id: editingProveedor?.id || Date.now().toString(),
                  nombre: formData.get('nombre') as string,
                  cuit: formData.get('cuit') as string,
                  email: formData.get('email') as string,
                  telefono: formData.get('telefono') as string,
                  direccion: formData.get('direccion') as string,
                  servicios: (formData.get('servicios') as string).split(',').map(s => s.trim()),
                  activo: true,
                  fechaRegistro: editingProveedor?.fechaRegistro || new Date().toISOString()
                };

                if (editingProveedor) {
                  onEditProveedor(proveedor);
                } else {
                  onAddProveedor(proveedor);
                }

                setShowProveedorForm(false);
                setEditingProveedor(undefined);
              }} className="p-6 space-y-4">
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
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingProveedor?.email}
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Servicios (separados por comas)
                    </label>
                    <input
                      type="text"
                      name="servicios"
                      defaultValue={editingProveedor?.servicios?.join(', ')}
                      placeholder="Logística, Transporte, Almacenamiento"
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
    </div>
  );
};

export default EntitiesView;