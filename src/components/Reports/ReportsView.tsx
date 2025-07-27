import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Proceso, EstadoProceso } from '../../types';

interface ReportsViewProps {
  procesos: Proceso[];
  onProcessClick?: (proceso: Proceso) => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({ procesos, onProcessClick }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Estadísticas generales
  const totalProcesos = procesos.length;
  const procesosActivos = procesos.filter(p => !['aprobado', 'archivado', 'rechazado'].includes(p.estado)).length;
  const procesosCompletados = procesos.filter(p => p.estado === 'aprobado').length;
  const costoTotal = procesos.reduce((sum, p) => sum + (p.costos || 0), 0);

  // Procesos por estado
  const procesosPorEstado = procesos.reduce((acc, proceso) => {
    acc[proceso.estado] = (acc[proceso.estado] || 0) + 1;
    return acc;
  }, {} as Record<EstadoProceso, number>);

  // Procesos por organismo
  const procesosPorOrganismo = procesos.reduce((acc, proceso) => {
    acc[proceso.organismo] = (acc[proceso.organismo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Procesos por mes
  const procesosPorMes = procesos.reduce((acc, proceso) => {
    const mes = format(new Date(proceso.fechaInicio), 'yyyy-MM');
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Tiempo promedio de procesamiento
  const procesosCompletadosConTiempo = procesos.filter(p => 
    p.estado === 'aprobado' && p.fechaVencimiento
  );
  
  const tiempoPromedio = procesosCompletadosConTiempo.length > 0 
    ? procesosCompletadosConTiempo.reduce((sum, p) => {
        const inicio = new Date(p.fechaInicio);
        const fin = new Date(p.fechaVencimiento!);
        return sum + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / procesosCompletadosConTiempo.length
    : 0;

  const exportToCSV = () => {
    const headers = ['Cliente', 'Tipo', 'Organismo', 'Estado', 'Fecha Inicio', 'Fecha Vencimiento', 'Progreso', 'Costos'];
    const csvContent = [
      headers.join(','),
      ...procesos.map(p => [
        p.cliente,
        p.tipo,
        p.organismo,
        p.estado,
        format(new Date(p.fechaInicio), 'dd/MM/yyyy'),
        p.fechaVencimiento ? format(new Date(p.fechaVencimiento), 'dd/MM/yyyy') : '',
        p.progreso + '%',
        p.costos || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-procesos-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const estadoColors = {
    pendiente: 'bg-red-500',
    recopilacion: 'bg-orange-500',
    enviado: 'bg-blue-500',
    revision: 'bg-purple-500',
    aprobado: 'bg-green-500',
    rechazado: 'bg-red-600',
    archivado: 'bg-gray-500'
  };

  const estadoLabels = {
    pendiente: 'Pendiente',
    recopilacion: 'Recopilación',
    enviado: 'Enviado',
    revision: 'En Revisión',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    archivado: 'Archivado'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h2>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Procesos</p>
              <p className="text-2xl font-bold text-gray-800">{totalProcesos}</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Procesos Activos</p>
              <p className="text-2xl font-bold text-orange-600">{procesosActivos}</p>
            </div>
            <TrendingUp className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-green-600">{procesosCompletados}</p>
            </div>
            <BarChart3 className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Costo Total</p>
              <p className="text-2xl font-bold text-blue-600">
                ${costoTotal.toLocaleString('es-AR')}
              </p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Procesos por Estado */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="mr-2" size={20} />
            Procesos por Estado
          </h3>
          <div className="space-y-3">
            {Object.entries(procesosPorEstado).map(([estado, cantidad]) => {
              const porcentaje = (cantidad / totalProcesos) * 100;
              return (
                <div key={estado} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${estadoColors[estado as EstadoProceso]}`}></div>
                    <span className="text-sm font-medium">
                      {estadoLabels[estado as EstadoProceso]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${estadoColors[estado as EstadoProceso]}`}
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {cantidad}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Procesos por Organismo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Procesos por Organismo
          </h3>
          <div className="space-y-3">
            {Object.entries(procesosPorOrganismo)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([organismo, cantidad]) => {
                const porcentaje = (cantidad / totalProcesos) * 100;
                return (
                  <div key={organismo} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1 mr-2">
                      {organismo}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {cantidad}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Tiempo Promedio
          </h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(tiempoPromedio)}
            </p>
            <p className="text-sm text-gray-600">días de procesamiento</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tasa de Éxito</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {totalProcesos > 0 ? Math.round((procesosCompletados / totalProcesos) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">procesos aprobados</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Costo Promedio</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              ${totalProcesos > 0 ? Math.round(costoTotal / totalProcesos).toLocaleString('es-AR') : 0}
            </p>
            <p className="text-sm text-gray-600">por proceso</p>
          </div>
        </div>
      </div>

      {/* Procesos recientes */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Procesos Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {procesos
                .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
                .slice(0, 10)
                .map((proceso) => (
                  <tr 
                    key={proceso.id} 
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => {
                      console.log('Clic en proceso desde reportes:', proceso);
                      if (onProcessClick) {
                        onProcessClick(proceso);
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {proceso.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proceso.titulo.length > 50 ? proceso.titulo.substring(0, 50) + '...' : proceso.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${estadoColors[proceso.estado]}`}>
                        {estadoLabels[proceso.estado]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${proceso.progreso}%` }}
                          ></div>
                        </div>
                        <span>{proceso.progreso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(proceso.fechaCreacion), 'dd/MM/yyyy', { locale: es })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;