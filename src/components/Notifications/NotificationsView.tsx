import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NotificacionPrecio } from '../../types';

interface NotificationsViewProps {
  notificaciones: NotificacionPrecio[];
  onMarcarLeida: (notificacionId: string) => void;
  onEliminarNotificacion: (notificacionId: string) => void;
}

const NotificationsView: React.FC<NotificationsViewProps> = ({
  notificaciones,
  onMarcarLeida,
  onEliminarNotificacion
}) => {
  const [filtro, setFiltro] = useState<'all' | 'unread' | 'read'>('all');
  const [moduloFiltro, setModuloFiltro] = useState<'all' | 'procesos' | 'clientes' | 'presupuestos' | 'facturas' | 'documentos'>('all');

  const notificacionesFiltradas = notificaciones.filter(notif => {
    const matchesFiltro = filtro === 'all' || 
                         (filtro === 'unread' && !notif.leida) ||
                         (filtro === 'read' && notif.leida);
    const matchesModulo = moduloFiltro === 'all' || notif.modulo === moduloFiltro;
    return matchesFiltro && matchesModulo;
  });

  const stats = {
    total: notificaciones.length,
    noLeidas: notificaciones.filter(n => !n.leida).length,
    leidas: notificaciones.filter(n => n.leida).length,
    procesos: notificaciones.filter(n => n.modulo === 'procesos').length,
    clientes: notificaciones.filter(n => n.modulo === 'clientes').length,
    presupuestos: notificaciones.filter(n => n.modulo === 'presupuestos').length
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_proceso':
        return <Info className="text-blue-600" size={20} />;
      case 'nuevo_cliente':
        return <User className="text-green-600" size={20} />;
      case 'nuevo_presupuesto':
        return <Receipt className="text-purple-600" size={20} />;
      case 'precio_faltante':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'proceso_modificado':
        return <Edit className="text-orange-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_proceso':
        return 'Nuevo Proceso';
      case 'nuevo_cliente':
        return 'Nuevo Cliente';
      case 'nuevo_presupuesto':
        return 'Nuevo Presupuesto';
      case 'precio_faltante':
        return 'Precio Faltante';
      case 'proceso_modificado':
        return 'Proceso Modificado';
      default:
        return 'Notificación';
    }
  };

  const marcarTodasLeidas = () => {
    notificaciones
      .filter(n => !n.leida)
      .forEach(n => onMarcarLeida(n.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Centro de Notificaciones</h2>
        {stats.noLeidas > 0 && (
          <button
            onClick={marcarTodasLeidas}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CheckCircle size={20} />
            <span>Marcar Todas como Leídas</span>
          </button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Bell className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">No Leídas</p>
              <p className="text-2xl font-bold text-red-600">{stats.noLeidas}</p>
            </div>
            <AlertTriangle className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leídas</p>
              <p className="text-2xl font-bold text-green-600">{stats.leidas}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Procesos</p>
              <p className="text-2xl font-bold text-orange-600">{stats.procesos}</p>
            </div>
            <FileText className="text-orange-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas ({stats.total})</option>
              <option value="unread">No leídas ({stats.noLeidas})</option>
              <option value="read">Leídas ({stats.leidas})</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Módulo
            </label>
            <select
              value={moduloFiltro}
              onChange={(e) => setModuloFiltro(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los módulos</option>
              <option value="procesos">Procesos</option>
              <option value="clientes">Clientes</option>
              <option value="presupuestos">Presupuestos</option>
              <option value="facturas">Facturas</option>
              <option value="documentos">Documentos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-4">
        {notificacionesFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-300" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {filtro === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
            </h3>
            <p className="text-gray-500">
              {filtro === 'unread' 
                ? 'Todas las notificaciones están al día' 
                : 'Las notificaciones aparecerán aquí cuando se generen'
              }
            </p>
          </div>
        ) : (
          notificacionesFiltradas
            .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
            .map((notificacion) => (
              <div
                key={notificacion.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition-all ${
                  notificacion.leida 
                    ? 'border-gray-300 opacity-75' 
                    : notificacion.prioridad === 'alta'
                      ? 'border-red-500 bg-red-50' 
                      : notificacion.tipo === 'nuevo_proceso'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      notificacion.prioridad === 'alta' ? 'bg-red-100' :
                      notificacion.tipo === 'nuevo_proceso' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {getIconoTipo(notificacion.tipo)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          notificacion.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                          notificacion.tipo === 'nuevo_proceso' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getTipoLabel(notificacion.tipo)}
                        </span>
                        {!notificacion.leida && (
                          <span className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="w-1 h-1 bg-white rounded-full"></span>
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {notificacion.titulo}
                      </h3>
                      
                      <p className="text-gray-700 mb-3">
                        {notificacion.mensaje}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {format(notificacion.fecha, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!notificacion.leida && (
                      <button
                        onClick={() => onMarcarLeida(notificacion.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Marcar como leída"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
                          onEliminarNotificacion(notificacion.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar notificación"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Resumen de acciones */}
      {stats.noLeidas > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-600" size={20} />
            <div>
              <h4 className="font-medium text-yellow-800">
                Tienes {stats.noLeidas} notificación{stats.noLeidas !== 1 ? 'es' : ''} sin leer
              </h4>
              <p className="text-sm text-yellow-700">
                Revisa las notificaciones pendientes para mantener tu sistema actualizado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsView;