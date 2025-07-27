import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar, User, FileText, Download, Receipt, Building, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Presupuesto, Cliente, ServicioPrecio, ItemFactura } from '../../types';
import { plantillasProcedimientos } from '../../data/plantillas';

interface BudgetsViewProps {
  presupuestos: Presupuesto[];
  clientes: Cliente[];
  servicios: ServicioPrecio[];
  onAddPresupuesto: (presupuesto: Presupuesto) => void;
  onEditPresupuesto: (presupuesto: Presupuesto) => void;
  onDeletePresupuesto: (presupuestoId: string) => void;
  onCreateProcess: (presupuesto: Presupuesto) => void;
}

const BudgetsView: React.FC<BudgetsViewProps> = ({
  presupuestos,
  clientes,
  servicios,
  onAddPresupuesto,
  onEditPresupuesto,
  onDeletePresupuesto,
  onCreateProcess
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'items' | 'procesos' | 'facturacion'>('general');
  const [selectedEstado, setSelectedEstado] = useState('');
  
  // Estados para el formulario de creación
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedPlantillas, setSelectedPlantillas] = useState<string[]>([]);
  const [tipoOperacion, setTipoOperacion] = useState('');
  const [descripcionPresupuesto, setDescripcionPresupuesto] = useState('');
  const [searchPlantillas, setSearchPlantillas] = useState('');

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    const matchesSearch = presupuesto.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         presupuesto.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !selectedEstado || presupuesto.estado === selectedEstado;
    return matchesSearch && matchesEstado;
  });

  const filteredPlantillas = plantillasProcedimientos.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(searchPlantillas.toLowerCase()) ||
    plantilla.organismo.toLowerCase().includes(searchPlantillas.toLowerCase())
  );

  const stats = {
    total: presupuestos.length,
    borradores: presupuestos.filter(p => p.estado === 'borrador').length,
    enviados: presupuestos.filter(p => p.estado === 'enviado').length,
    aprobados: presupuestos.filter(p => p.estado === 'aprobado').length,
    montoTotal: presupuestos.reduce((sum, p) => sum + (p.total || 0), 0)
  };

  const handlePlantillaToggle = (plantillaId: string) => {
    setSelectedPlantillas(prev => 
      prev.includes(plantillaId)
        ? prev.filter(id => id !== plantillaId)
        : [...prev, plantillaId]
    );
  };

  const calcularTotales = () => {
    const plantillasSeleccionadas = plantillasProcedimientos.filter(p => 
      selectedPlantillas.includes(p.id)
    );
    
    const subtotal = plantillasSeleccionadas.reduce((sum, plantilla) => {
      const servicio = servicios.find(s => s.plantillaId === plantilla.id);
      return sum + (servicio?.precio || plantilla.costo || 10000); // Precio por defecto si no existe
    }, 0);
    
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    
    return { subtotal, iva, total };
  };

  const handleSubmit = () => {
    if (!selectedCliente || selectedPlantillas.length === 0) {
      alert('Debe seleccionar un cliente y al menos una gestión');
      return;
    }

    const cliente = clientes.find(c => c.id === selectedCliente);
    if (!cliente) return;

    const plantillasSeleccionadas = plantillasProcedimientos.filter(p => 
      selectedPlantillas.includes(p.id)
    );

    const items: ItemFactura[] = plantillasSeleccionadas.map((plantilla, index) => {
      const servicio = servicios.find(s => s.plantillaId === plantilla.id);
      const precio = servicio?.precio || plantilla.costo || 10000;
      
      return {
        id: (index + 1).toString(),
        descripcion: `${plantilla.nombre} - ${plantilla.organismo}`,
        cantidad: 1,
        precioUnitario: precio,
        total: precio
      };
    });

    const { subtotal, iva, total } = calcularTotales();

    const nuevoPresupuesto: Presupuesto = {
      id: Date.now().toString(),
      numero: `PRES-${new Date().getFullYear()}-${(presupuestos.length + 1).toString().padStart(3, '0')}`,
      clienteId: cliente.id,
      cliente,
      tipoOperacion,
      descripcion: descripcionPresupuesto,
      items,
      subtotal,
      iva,
      total,
      estado: 'borrador',
      fechaCreacion: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      procesoIds: [],
      plantillasIds: selectedPlantillas
    };

    onAddPresupuesto(nuevoPresupuesto);
    
    // Limpiar formulario
    setSelectedCliente('');
    setSelectedPlantillas([]);
    setTipoOperacion('');
    setDescripcionPresupuesto('');
    setShowForm(false);
  };

  const handleAprobarPresupuesto = (presupuesto: Presupuesto) => {
    const presupuestoAprobado = {
      ...presupuesto,
      estado: 'aprobado' as const,
      fechaAprobacion: new Date()
    };
    
    onEditPresupuesto(presupuestoAprobado);
    
    // Mostrar confirmación para crear proceso
    if (window.confirm('Presupuesto aprobado. ¿Desea crear el proceso automáticamente?')) {
      onCreateProcess(presupuestoAprobado);
    }
  };

  const estadoColors = {
    borrador: 'bg-gray-100 text-gray-800',
    enviado: 'bg-blue-100 text-blue-800',
    aprobado: 'bg-green-100 text-green-800',
    rechazado: 'bg-red-100 text-red-800',
    vencido: 'bg-orange-100 text-orange-800'
  };

  const estadoLabels = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    vencido: 'Vencido'
  };

  const { subtotal: totalCalculado, iva: ivaCalculado, total: granTotal } = calcularTotales();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Gestión de Presupuestos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Presupuesto</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Receipt className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Borradores</p>
              <p className="text-2xl font-bold text-gray-600">{stats.borradores}</p>
            </div>
            <FileText className="text-gray-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enviados</p>
              <p className="text-2xl font-bold text-blue-600">{stats.enviados}</p>
            </div>
            <Clock className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aprobados</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprobados}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monto Total</p>
              <p className="text-2xl font-bold text-purple-600">${stats.montoTotal.toLocaleString()}</p>
            </div>
            <DollarSign className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar presupuestos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="">Todos los estados</option>
            {Object.entries(estadoLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Presupuestos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo Operación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPresupuestos.map((presupuesto) => (
                <tr key={presupuesto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {presupuesto.numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {presupuesto.cliente.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {presupuesto.tipoOperacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${presupuesto.total?.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[presupuesto.estado]}`}>
                      {estadoLabels[presupuesto.estado]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {format(presupuesto.fechaCreacion, 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPresupuesto(presupuesto);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {presupuesto.estado === 'enviado' && (
                        <button
                          onClick={() => handleAprobarPresupuesto(presupuesto)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Aprobar presupuesto"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de que quieres eliminar el presupuesto "${presupuesto.numero}"?`)) {
                            onDeletePresupuesto(presupuesto.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar presupuesto"
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

      {/* Modal de Creación con Plantillas */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Nuevo Presupuesto</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cliente *
                    </label>
                    <select
                      value={selectedCliente}
                      onChange={(e) => setSelectedCliente(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Operación *
                    </label>
                    <select
                      value={tipoOperacion}
                      onChange={(e) => setTipoOperacion(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    >
                      <option value="">Seleccionar tipo...</option>
                      <option value="Importación">Importación</option>
                      <option value="Exportación">Exportación</option>
                      <option value="Registro">Registro</option>
                      <option value="Certificación">Certificación</option>
                      <option value="Autorización">Autorización</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={descripcionPresupuesto}
                      onChange={(e) => setDescripcionPresupuesto(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                      placeholder="Descripción del presupuesto..."
                    />
                  </div>
                </div>

                {/* Búsqueda de plantillas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buscar Gestiones a Presupuestar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o organismo..."
                      value={searchPlantillas}
                      onChange={(e) => setSearchPlantillas(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>

                {/* Lista de plantillas seleccionables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Seleccionar Gestiones ({selectedPlantillas.length} seleccionadas)
                    </h4>
                    
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {filteredPlantillas.map(plantilla => {
                        const isSelected = selectedPlantillas.includes(plantilla.id);
                        const servicio = servicios.find(s => s.plantillaId === plantilla.id);
                        const precio = servicio?.precio || plantilla.costo || 10000;
                        
                        return (
                          <div
                            key={plantilla.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                            onClick={() => handlePlantillaToggle(plantilla.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handlePlantillaToggle(plantilla.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                                    {plantilla.nombre}
                                  </h5>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center">
                                    <Building size={14} className="mr-1" />
                                    <span>{plantilla.organismo}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    <span>{plantilla.tiempoEstimado} días</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FileText size={14} className="mr-1" />
                                    <span>{plantilla.documentosRequeridos.length} docs</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-semibold text-green-600">
                                  ${precio.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resumen del presupuesto */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sticky top-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Resumen del Presupuesto
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Gestiones seleccionadas:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{selectedPlantillas.length}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">${totalCalculado.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">IVA (21%):</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">${ivaCalculado.toLocaleString()}</span>
                        </div>
                        
                        <hr className="border-gray-300 dark:border-gray-600" />
                        
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-gray-800 dark:text-gray-200">Total:</span>
                          <span className="text-blue-600">${granTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {selectedPlantillas.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gestiones incluidas:
                          </h5>
                          <div className="space-y-1">
                            {selectedPlantillas.slice(0, 3).map(plantillaId => {
                              const plantilla = plantillasProcedimientos.find(p => p.id === plantillaId);
                              return (
                                <div key={plantillaId} className="text-xs text-gray-600 dark:text-gray-400">
                                  • {plantilla?.nombre}
                                </div>
                              );
                            })}
                            {selectedPlantillas.length > 3 && (
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                ...y {selectedPlantillas.length - 3} más
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t dark:border-gray-700 flex justify-between">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedCliente || selectedPlantillas.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
                >
                  Crear Presupuesto
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de Detalles */}
      {showDetails && selectedPresupuesto && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowDetails(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Presupuesto: {selectedPresupuesto.numero}
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Cliente:</strong> {selectedPresupuesto.cliente.nombre}</p>
                      <p><strong>Tipo:</strong> {selectedPresupuesto.tipoOperacion}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${estadoColors[selectedPresupuesto.estado]}`}>
                          {estadoLabels[selectedPresupuesto.estado]}
                        </span>
                      </p>
                      <p><strong>Fecha:</strong> {format(selectedPresupuesto.fechaCreacion, 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Resumen Financiero</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${selectedPresupuesto.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (21%):</span>
                        <span className="font-medium">${selectedPresupuesto.iva.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-blue-600">${selectedPresupuesto.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items del presupuesto */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Items del Presupuesto</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Descripción</th>
                          <th className="px-4 py-2 text-left">Cantidad</th>
                          <th className="px-4 py-2 text-left">Precio Unit.</th>
                          <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedPresupuesto.items.map((item) => (
                          <tr key={item.id}>
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
              </div>

              <div className="p-6 border-t dark:border-gray-700 flex justify-between">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                
                <div className="flex space-x-3">
                  {selectedPresupuesto.estado === 'enviado' && (
                    <button
                      onClick={() => {
                        handleAprobarPresupuesto(selectedPresupuesto);
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                    >
                      Aprobar Presupuesto
                    </button>
                  )}
                  
                  {selectedPresupuesto.estado === 'aprobado' && !selectedPresupuesto.procesoIds?.length && (
                    <button
                      onClick={() => {
                        onCreateProcess(selectedPresupuesto);
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Crear Proceso
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Estado vacío */}
      {filteredPresupuestos.length === 0 && (
        <div className="text-center py-12">
          <Receipt size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No se encontraron presupuestos
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {searchTerm ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza creando tu primer presupuesto'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetsView;