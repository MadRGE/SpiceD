import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building, Phone, Mail, Globe, Clock, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Organismo } from '../../types';

interface OrganismosViewProps {
  organismos: Organismo[];
  onAddOrganismo: (organismo: Organismo) => void;
  onEditOrganismo: (organismo: Organismo) => void;
  onDeleteOrganismo: (organismoId: string) => void;
}

const OrganismosView: React.FC<OrganismosViewProps> = ({
  organismos,
  onAddOrganismo,
  onEditOrganismo,
  onDeleteOrganismo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOrganismo, setEditingOrganismo] = useState<Organismo | undefined>();
  const [selectedTipo, setSelectedTipo] = useState<'all' | 'publico' | 'privado'>('all');

  const filteredOrganismos = organismos.filter(organismo => {
    const matchesSearch = organismo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (organismo.contacto && organismo.contacto.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = selectedTipo === 'all' || organismo.tipo === selectedTipo;
    return matchesSearch && matchesTipo && organismo.activo;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const organismo: Organismo = {
      id: editingOrganismo?.id || Math.random().toString(36).substr(2, 9),
      nombre: formData.get('nombre') as string,
      tipo: formData.get('tipo') as 'publico' | 'privado',
      contacto: formData.get('contacto') as string || undefined,
      telefono: formData.get('telefono') as string || undefined,
      email: formData.get('email') as string || undefined,
      direccion: formData.get('direccion') as string || undefined,
      sitioWeb: formData.get('sitioWeb') as string || undefined,
      tiempoRespuestaPromedio: Number(formData.get('tiempoRespuestaPromedio')) || undefined,
      costoPromedio: Number(formData.get('costoPromedio')) || undefined,
      activo: true,
      fechaCreacion: editingOrganismo?.fechaCreacion || new Date(),
      fechaActualizacion: new Date()
    };

    if (editingOrganismo) {
      onEditOrganismo(organismo);
    } else {
      onAddOrganismo(organismo);
    }

    setShowForm(false);
    setEditingOrganismo(undefined);
  };

  const handleEdit = (organismo: Organismo) => {
    setEditingOrganismo(organismo);
    setShowForm(true);
  };

  const organismoStats = {
    total: organismos.filter(o => o.activo).length,
    publicos: organismos.filter(o => o.activo && o.tipo === 'publico').length,
    privados: organismos.filter(o => o.activo && o.tipo === 'privado').length,
    tiempoPromedio: organismos.filter(o => o.tiempoRespuestaPromedio).reduce((sum, o) => sum + (o.tiempoRespuestaPromedio || 0), 0) / organismos.filter(o => o.tiempoRespuestaPromedio).length || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Organismos</h2>
        <button
          onClick={() => {
            setEditingOrganismo(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Organismo</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Organismos</p>
              <p className="text-2xl font-bold text-blue-600">{organismoStats.total}</p>
            </div>
            <Building className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Públicos</p>
              <p className="text-2xl font-bold text-green-600">{organismoStats.publicos}</p>
            </div>
            <Users className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Privados</p>
              <p className="text-2xl font-bold text-purple-600">{organismoStats.privados}</p>
            </div>
            <Building className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-orange-600">{Math.round(organismoStats.tiempoPromedio)}</p>
              <p className="text-xs text-gray-500">días</p>
            </div>
            <Clock className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar organismos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="publico">Públicos</option>
            <option value="privado">Privados</option>
          </select>
        </div>
      </div>

      {/* Lista de Organismos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganismos.map((organismo) => (
          <div key={organismo.id} className="bg-white rounded-lg shadow-md p-6">
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
                  onClick={() => handleEdit(organismo)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Editar organismo"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => {
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
              {organismo.contacto && (
                <div className="flex items-center space-x-2">
                  <Users size={14} />
                  <span>{organismo.contacto}</span>
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

            {(organismo.tiempoRespuestaPromedio || organismo.costoPromedio) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {organismo.tiempoRespuestaPromedio && (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-orange-600">
                        <Clock size={14} />
                        <span className="font-medium">{organismo.tiempoRespuestaPromedio} días</span>
                      </div>
                      <span className="text-gray-500">Tiempo promedio</span>
                    </div>
                  )}
                  {organismo.costoPromedio && (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-green-600">
                        <DollarSign size={14} />
                        <span className="font-medium">${organismo.costoPromedio.toLocaleString()}</span>
                      </div>
                      <span className="text-gray-500">Costo promedio</span>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                  {editingOrganismo ? 'Editar Organismo' : 'Nuevo Organismo'}
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
                      Contacto
                    </label>
                    <input
                      type="text"
                      name="contacto"
                      defaultValue={editingOrganismo?.contacto}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo Respuesta Promedio (días)
                    </label>
                    <input
                      type="number"
                      name="tiempoRespuestaPromedio"
                      defaultValue={editingOrganismo?.tiempoRespuestaPromedio}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo Promedio (ARS)
                    </label>
                    <input
                      type="number"
                      name="costoPromedio"
                      defaultValue={editingOrganismo?.costoPromedio}
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
                    onClick={() => setShowForm(false)}
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

      {filteredOrganismos.length === 0 && (
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
    </div>
  );
};

export default OrganismosView;