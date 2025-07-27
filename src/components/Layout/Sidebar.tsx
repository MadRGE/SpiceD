import React from 'react';
import { LayoutDashboard, FileText, BookTemplate as Template, BarChart3, Calendar, FolderOpen, Users, Receipt, Brain, Settings, HelpCircle, X, ChevronLeft, ChevronRight, Pin, PinOff, Building, Truck, DollarSign, Bell } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onMenuSelect: (menu: string) => void;
  isFixed: boolean;
  onToggleFixed: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  onMenuSelect, 
  isFixed, 
  onToggleFixed, 
  isCollapsed, 
  onToggleCollapsed 
}) => {
  const leftMenuItems = [
    { id: 'processes', label: 'Procesos', icon: FileText },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'templates', label: 'Plantillas', icon: FolderOpen },
  ];

  const rightMenuItems = [
    { id: 'billing', label: 'Facturación', icon: Receipt },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
  ];

  // Si es fija, no mostrar overlay y usar posición diferente
  if (isFixed) {
    return (
      <div className="fixed left-0 top-0 h-full bg-white shadow-lg z-30 w-16">
        {/* Header */}
        <div className="p-2 border-b bg-blue-600 text-white">
          <button
            onClick={onToggleFixed}
            className="w-full p-2 hover:bg-blue-700 rounded-lg transition-colors"
            title="Desanclar sidebar"
          >
            <PinOff size={16} className="mx-auto" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col h-full">
          {/* Left side items (top) */}
          <div className="p-2 space-y-1">
            {leftMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuSelect(item.id)}
                  className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                  title={item.label}
                >
                  <Icon size={20} className="group-hover:text-blue-600" />
                </button>
              );
            })}
          </div>
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Right side items (bottom) */}
          <div className="p-2 space-y-1 border-t">
            {rightMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuSelect(item.id)}
                  className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors group"
                  title={item.label}
                >
                  <Icon size={20} className="group-hover:text-blue-600" />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // Sidebar modal (comportamiento original)
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <nav className="flex flex-col h-full">
          <div className="p-2 space-y-1">
            {leftMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuSelect(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                  title={item.label}
                >
                  <Icon size={20} className="group-hover:text-blue-600" />
                </button>
              );
            })}
          </div>
          
          <div className="flex-1"></div>
          
          <div className="p-2 space-y-1 border-t">
            {rightMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuSelect(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors group"
                  title={item.label}
                >
                  <Icon size={20} className="group-hover:text-blue-600" />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;