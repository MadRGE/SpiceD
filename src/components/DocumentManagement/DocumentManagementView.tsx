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
  const menuItems = [
    { id: 'dashboard', label: 'Tablero Principal', icon: LayoutDashboard },
        <h2 className="text-2xl font-bold text-gray-800">Administración Documental</h2>
    { id: 'accounting', label: 'Administración Contable', icon: Receipt },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'document-management', label: 'Administración Documental', icon: FolderOpen },
    { id: 'analytics', label: 'Reportes', icon: BarChart3 },
  ];

  const settingsItems = [
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
  ];

  // Si es fija, no mostrar overlay y usar posición diferente
  if (isFixed) {
    return (
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header */}
        <div className="p-4 border-b bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold">
                  Import/Export Manager
                </h2>
                <p className="text-sm text-blue-100">
                  Gestión de Procedimientos
                </p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleFixed}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                title={isFixed ? "Desanclar sidebar" : "Anclar sidebar"}
              >
                {isFixed ? <PinOff size={16} /> : <Pin size={16} />}
              </button>
              <button
                onClick={onToggleCollapsed}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                title={isCollapsed ? "Expandir" : "Colapsar"}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-2 overflow-y-auto h-full pb-20">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuSelect(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="text-gray-600 group-hover:text-blue-600 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
          
          <hr className="my-4" />
          
          <div className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuSelect(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors group ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} className="text-gray-600 group-hover:text-blue-600 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
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
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Import/Export Manager
              </h2>
              <p className="text-sm text-blue-100">
                Gestión de Procedimientos
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onToggleFixed();
                  onClose();
                }}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                title="Anclar sidebar"
              >
                <Pin size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <nav className="p-4 overflow-y-auto h-full pb-20">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuSelect(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 group"
                >
                  <Icon size={20} className="text-gray-600 group-hover:text-blue-600" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <hr className="my-4" />
          
          <div className="space-y-2">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onMenuSelect(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <Icon size={20} className="text-gray-600 group-hover:text-blue-600" />
                  <span className="font-medium">{item.label}</span>
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