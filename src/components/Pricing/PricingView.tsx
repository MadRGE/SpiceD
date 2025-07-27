import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, Bell, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { ServicioPrecio, NotificacionPrecio } from '../../types';
import { organismos } from '../../data/plantillas';

interface PricingViewProps {
  servicios: ServicioPrecio[];
  notificaciones: NotificacionPrecio[];
  onAddServicio: (servicio: ServicioPrecio) => void;
  onEditServicio: (servicio: ServicioPrecio) => void;
  onDeleteServicio: (servicioId: string) => void;
  onAplicarAumento: (porcentaje: number, categoria?: string) => void;
  onMarcarNotificacionLeida: (notificacionId: string) => void;
}

const PricingView: React.FC<PricingViewProps> = ({
  servicios,
  notificaciones,
  onAddServicio,
  onEditServicio,
  onDeleteServicio,
  onAplicarAumento,
  onMarcarNotificacionLeida
}) => {
  const [activeTab, setActiveTab] = useState<'precios' | 'aumentos' | 'notificaciones'>('precios');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioPrecio | undefined>();
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedOrganismo, setSelectedOrganismo] = useState('');
  const [aumentoPorcentaje, setAumentoPorcentaje] = useState(0);
  const [aumentoCategoria, setAumentoCategoria] = useState('');
  const [serviciosPlantilla, setServiciosPlantilla] = useState<string[]>([]);

  // Obtener servicios de plantillas que no tienen precio
  useEffect(() => {
    const serviciosSinPrecio = plantillasProcedimientos.filter(plantilla => 
      !servicios.some(servicio => 
        servicio.nombre.toLowerCase().includes(plantilla.nombre.toLowerCase()) ||
        servicio.plantillaId === plantilla.id
      )
    ).map(p => p.nombre);
    
    setServiciosPlantilla(serviciosSinPrecio);
  }, [servicios]);
  const categorias = [...new Set(servicios.map(s => s.categoria))];
  const filteredServicios = servicios.filter(servicio => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (servicio.organismo && servicio.organismo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategoria = !selectedCategoria || servicio.categoria === selectedCategoria;
    const matchesOrganismo = !selectedOrganismo || servicio.organismo === selectedOrganismo;
    return matchesSearch && matchesCategoria && matchesOrganismo && servicio.activo;
  });

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const servicio: ServicioPrecio = {
      id: editingServicio?.id || Math.random().toString(36).substr(2, 9),
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      precio: Number(formData.get('precio')),
      organismo: formData.get('organismo') as string || undefined,
      categoria: formData.get('categoria') as string,
      activo: true,
      fechaCreacion: editingServicio?.fechaCreacion || new Date(),
      fechaActualizacion: new Date(),
      plantillaId: formData.get('plantillaId') as string || undefined
    };

    if (editingServicio) {
      onEditServicio(servicio);
    } else {
      onAddServicio(servicio);
    }

    setShowForm(false);
    setEditingServicio(undefined);
  };

  const handleEdit = (servicio: ServicioPrecio) => {
    setEditingServicio(servicio);
    setShowForm(true);
  };

  const handleAplicarAumento = () => {
    if (aumentoPorcentaje > 0) {
      onAplicarAumento(aumentoPorcentaje, aumentoCategoria || undefined);
      setAumentoPorcentaje(0);
      setAumentoCategoria('');
      alert(`Aumento del ${aumentoPorcentaje}% aplicado correctamente`);
    }
  };

  const servicioStats = {
    total: servicios.filter(s => s.activo).length,
    promedio: servicios.length > 0 ? servicios.reduce((sum, s) => sum + s.precio, 0) / servicios.length : 0,
    masCaro: servicios.length > 0 ? Math.max(...servicios.map(s => s.precio)) : 0,
    masBarato: servicios.length > 0 ? Math.min(...servicios.map(s => s.precio)) : 0,
    notificacionesPendientes: notificacionesNoLeidas.length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Precios</h2>
        <button
          onClick={() => {
            setEditingServicio(undefined);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Precio</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-blue-600">{servicioStats.total}</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-green-600">
                ${Math.round(servicioStats.promedio).toLocaleString()}
              </p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Más Caro</p>
              <p className="text-2xl font-bold text-purple-600">
                ${servicioStats.masCaro.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Más Barato</p>
              <p className="text-2xl font-bold text-orange-600">
                ${servicioStats.masBarato.toLocaleString()}
              </p>
            </div>
            <DollarSign className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notificaciones</p>
              <p className="text-2xl font-bold text-red-600">{servicioStats.notificacionesPendientes}</p>
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
              <span>Lista de Precios ({servicioStats.total})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('aumentos')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'aumentos'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>Aplicar Aumentos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notificaciones')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'notificaciones'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell size={16} />
              <span>Notificaciones ({servicioStats.notificacionesPendientes})</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'precios' && (
            <>
              {/* Notificaciones de Precios Faltantes */}
              {serviciosPlantilla.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-yellow-800 mb-3">
                    ⚠️ Servicios sin Precio Asignado ({serviciosPlantilla.length})
                  </h4>
                  <div className="space-y-2">
                    {serviciosPlantilla.slice(0, 5).map((servicio, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-yellow-700">{servicio}</span>
                        <button
                          onClick={() => {
                            setEditingServicio({
                              id: '',
                              nombre: servicio,
                              descripcion: '',
                              precio: 0,
                              categoria: 'Registros',
                              activo: true,
                              fechaCreacion: new Date(),
                              fechaActualizacion: new Date()
                            });
                            setShowForm(true);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Agregar Precio
                        </button>
                      </div>
                    ))}
                    {serviciosPlantilla.length > 5 && (
                      <p className="text-sm text-yellow-600">
                        ...y {serviciosPlantilla.length - 5} servicios más
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedOrganismo}
                  onChange={(e) => setSelectedOrganismo(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los organismos</option>
                  {organismos.map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>

              {/* Lista de precios */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organismo
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
                      <tr key={servicio.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{servicio.nombre}</div>
                            {servicio.descripcion && (
                              <div className="text-sm text-gray-500">{servicio.descripcion}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {servicio.organismo || '-'}
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
                          {servicio.fechaActualizacion.toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(servicio)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Editar precio"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
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
            </>
          )}

          {activeTab === 'aumentos' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Aplicar Aumentos Masivos</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Puedes aplicar aumentos porcentuales a todos los servicios o filtrar por categoría específica.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Porcentaje de Aumento
                    </label>
                    <input
                      type="number"
                      value={aumentoPorcentaje}
                      onChange={(e) => setAumentoPorcentaje(Number(e.target.value))}
                      placeholder="Ej: 15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría (Opcional)
                    </label>
                    <select
                      value={aumentoCategoria}
                      onChange={(e) => setAumentoCategoria(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleAplicarAumento}
                      disabled={aumentoPorcentaje <= 0}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                      <TrendingUp size={16} />
                      <span>Aplicar Aumento</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview de cambios */}
              {aumentoPorcentaje > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">Vista Previa de Cambios</h4>
                  <div className="space-y-2">
                    {filteredServicios
                      .filter(s => !aumentoCategoria || s.categoria === aumentoCategoria)
                      .slice(0, 5)
                      .map(servicio => {
                        const nuevoPrecio = Math.round(servicio.precio * (1 + aumentoPorcentaje / 100));
                        return (
                          <div key={servicio.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{servicio.nombre}</span>
                            <span className="text-blue-700">
                              ${servicio.precio.toLocaleString()} → ${nuevoPrecio.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    {filteredServicios.filter(s => !aumentoCategoria || s.categoria === aumentoCategoria).length > 5 && (
                      <p className="text-sm text-gray-600">
                        ...y {filteredServicios.filter(s => !aumentoCategoria || s.categoria === aumentoCategoria).length - 5} servicios más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="space-y-4">
              {notificaciones.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle size={64} className="mx-auto mb-4 text-green-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No hay notificaciones
                  </h3>
                  <p className="text-gray-500">
                    Todas las notificaciones están al día
                  </p>
                </div>
              ) : (
                notificaciones.map((notificacion) => (
                  <div
                    key={notificacion.id}
                    className={`p-4 rounded-lg border ${
                      notificacion.leida 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          notificacion.tipo === 'precio_faltante' ? 'bg-red-100' :
                          notificacion.tipo === 'nuevo_procedimiento' ? 'bg-blue-100' :
                          'bg-yellow-100'
                        }`}>
                          {notificacion.tipo === 'precio_faltante' ? (
                            <AlertTriangle className="text-red-600" size={20} />
                          ) : (
                            <Bell className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {notificacion.procedimiento} - {notificacion.organismo}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notificacion.mensaje}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notificacion.fecha.toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </div>
                      {!notificacion.leida && (
                        <button
                          onClick={() => onMarcarNotificacionLeida(notificacion.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">
                  {editingServicio ? 'Editar Precio' : 'Nuevo Precio'}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Servicio *
                    </label>
                    <select
                      name="nombre"
                      defaultValue={editingServicio?.nombre}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar servicio...</option>
                      {plantillasProcedimientos.map(plantilla => (
                        <option key={plantilla.id} value={plantilla.nombre}>
                          {plantilla.nombre} - {plantilla.organismo}
                        </option>
                      ))}
                    </select>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organismo
                    </label>
                    <select
                      name="organismo"
                      defaultValue={editingServicio?.organismo}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar organismo...</option>
                      {organismos.map(org => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
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
                    {editingServicio ? 'Actualizar' : 'Crear'} Precio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Estado vacío */}
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
    </div>
  );
};

export default PricingView;