import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ProcesoDisplay } from '../../types';

interface CalendarViewProps {
  procesos: ProcesoDisplay[];
  onProcessClick: (proceso: ProcesoDisplay) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ procesos, onProcessClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getProcessesForDay = (day: Date) => {
    return procesos.filter(proceso => {
      const fechaVencimiento = proceso.fechaVencimiento ? new Date(proceso.fechaVencimiento) : null;
      const fechaInicio = new Date(proceso.fechaInicio);
      
      return (fechaVencimiento && isSameDay(fechaVencimiento, day)) || 
             isSameDay(fechaInicio, day);
    });
  };

  const getDayStatus = (day: Date) => {
    const dayProcesses = getProcessesForDay(day);
    if (dayProcesses.length === 0) return 'normal';
    
    const hasOverdue = dayProcesses.some(p => {
      const vencimiento = p.fechaVencimiento ? new Date(p.fechaVencimiento) : null;
      return vencimiento && vencimiento < new Date() && p.estado !== 'aprobado' && p.estado !== 'archivado';
    });
    
    const hasUpcoming = dayProcesses.some(p => {
      const vencimiento = p.fechaVencimiento ? new Date(p.fechaVencimiento) : null;
      return vencimiento && vencimiento >= new Date();
    });

    if (hasOverdue) return 'overdue';
    if (hasUpcoming) return 'upcoming';
    return 'normal';
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Calendario de Vencimientos
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-medium min-w-48 text-center">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayProcesses = getProcessesForDay(day);
          const dayStatus = getDayStatus(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-2 border rounded-lg transition-colors ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' :
                isToday ? 'bg-blue-50 border-blue-300' :
                dayStatus === 'overdue' ? 'bg-red-50 border-red-300' :
                dayStatus === 'upcoming' ? 'bg-yellow-50 border-yellow-300' :
                'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-blue-600' : 
                  !isCurrentMonth ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  {format(day, 'd')}
                </span>
                {dayProcesses.length > 0 && (
                  <span className={`text-xs px-1 py-0.5 rounded-full ${
                    dayStatus === 'overdue' ? 'bg-red-100 text-red-600' :
                    dayStatus === 'upcoming' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {dayProcesses.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayProcesses.slice(0, 2).map(proceso => {
                  const isVencimiento = proceso.fechaVencimiento && isSameDay(new Date(proceso.fechaVencimiento), day);
                  
                  return (
                    <div
                      key={proceso.id}
                      onClick={() => onProcessClick(proceso)}
                      className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                        isVencimiento && dayStatus === 'overdue' ? 'bg-red-200 text-red-800 hover:bg-red-300' :
                        isVencimiento ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' :
                        'bg-blue-200 text-blue-800 hover:bg-blue-300'
                      }`}
                      title={`${proceso.cliente} - ${proceso.tipo}`}
                      title={`${proceso.cliente} - ${proceso.titulo}`}
                    >
                      <div className="flex items-center space-x-1">
                        {isVencimiento ? (
                          <Clock size={10} />
                        ) : (
                          <CalendarIcon size={10} />
                        )}
                        <span className="truncate">
                          {proceso.cliente}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {dayProcesses.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayProcesses.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>Vencidos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span>Próximos a vencer</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span>Fechas de inicio</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;