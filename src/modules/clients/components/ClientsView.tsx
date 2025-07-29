import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Mail, Phone, MapPin, FileText, Building, Receipt, Eye, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cliente } from '../types';

interface ClientsViewProps {
  clientes: Cliente[];
  onAddCliente: (cliente: Cliente) => void;
  onEditCliente: (cliente: Cliente) => void;
  onDeleteCliente: (clienteId: string) => void;
  onProcessClick?: (clienteId: string) => void;
  setCurrentView: (view: string) => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({
  clientes,
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
      condicionIva: formData.get('condicionIva') as any,
      fechaRegistro: editingCliente?.fechaRegistro || new Date().toISOString(),
      activo: true
    };

    if (editingCliente) {
      onEditCliente(cliente);
    } else {
      onAddCliente(cliente);
    }

    setShowForm(false);
    setEditingCliente(undefined);
  };

  const stats = {
    total: clientes.length,
    activos: clientes.filter(c => c.activo).length,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm text-gray-600">Nuevos este mes</p>
              <p className="text-2xl font-bold text-purple-600">
                {clientes.filter(c => {
                  const fechaRegistro = new Date(c.fechaRegistro);
                  const ahora = new Date();
                  return fechaRegistro.getMonth() === ahora.getMonth() && 
                         fechaRegistro.getFullYear() === ahora.getFullYear();
                }).length}
              </p>
            </div>
            <FileText className="text-purple-600" size={32} />
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
        {filteredClientes.map((cliente) => (
          <div 
            key={cliente.id} 
            className="bg-white rounded-lg shadow-md p-6 border cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCliente(cliente)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{cliente.nombre}</h3>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {cliente.condicionIva.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCliente(cliente);
                  }}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCliente(cliente);
                    setShowForm(true);
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
          </div>
        ))}
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                      Condición IVA *
                    </label>
                    <select
                      name="condicionIva"
                      defaultValue={editingCliente?.condicionIva || 'responsable_inscripto'}
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
                      defaultValue={editingCliente?.direccion}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
                    {editingCliente ? 'Actualizar' : 'Crear'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

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
    </div>
  );
};

export default ClientsView;