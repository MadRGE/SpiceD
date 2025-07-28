import React, { useState, useEffect } from 'react';
import { Settings, User, Building, DollarSign, Bell, Key, Database, FileText, Link, Save, Edit, Trash2, Plus, Search, Upload, Download, CheckCircle, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { plantillasProcedimientos, organismos } from '../../data/plantillas';
import { supabase } from '../../lib/supabase';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'empresa' | 'base-datos' | 'notificaciones' | 'api'>('general');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [dbStats, setDbStats] = useState({
    plantillas: 0,
    usuarios: 0,
    procesos: 0,
    facturas: 0
  });
  const [plantillasEnBD, setPlantillasEnBD] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Configuración general
  const [configuracion, setConfiguracion] = useState({
    empresa: {
      nombre: 'Estudio de Despachante de Aduana',
      cuit: '30-12345678-9',
      direccion: 'Av. Corrientes 1234, CABA',
      telefono: '+54 11 4567-8900',
      email: 'contacto@estudio.com.ar',
      sitioWeb: 'https://www.estudio.com.ar'
    },
    facturacion: {
      ivaPorcentaje: 21,
      gananciasPorcentaje: 35,
      numeracionAutomatica: true,
      prefijo: 'FAC'
    },
    notificaciones: {
      emailNotificaciones: true,
      notificacionesVencimiento: true,
      diasAnticipacion: 7,
      notificacionesDocumentos: true
    },
    apiKeys: {
      openai: '',
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      }
    }
  });

  // Cargar estadísticas de la BD
  const cargarEstadisticasBD = async () => {
    try {
      setLoading(true);
      
      const [plantillas, usuarios, procesos, facturas] = await Promise.all([
        supabase.from('plantillas_procedimientos').select('*', { count: 'exact' }),
        supabase.from('usuarios').select('*', { count: 'exact' }),
        supabase.from('procesos').select('*', { count: 'exact' }),
        supabase.from('facturas').select('*', { count: 'exact' })
      ]);

      setDbStats({
        plantillas: plantillas.count || 0,
        usuarios: usuarios.count || 0,
        procesos: procesos.count || 0,
        facturas: facturas.count || 0
      });

      setPlantillasEnBD(plantillas.data || []);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar plantillas con la BD
  const sincronizarPlantillas = async () => {
    try {
      setSyncStatus('syncing');
      setSyncMessage('Sincronizando plantillas con la base de datos...');

      // Preparar datos para insertar
      const plantillasParaInsertar = plantillasProcedimientos.map(plantilla => ({
        id: plantilla.id,
        nombre: plantilla.nombre,
        codigo: `${plantilla.organismo.substring(0, 6).toUpperCase()}-${plantilla.id.substring(0, 8)}`,
        organismo: plantilla.organismo,
        documentos_requeridos: plantilla.documentosRequeridos,
        etapas: ['Presentación', 'Evaluación', 'Aprobación'],
        dias_estimados: plantilla.tiempoEstimado,
        descripcion: `Procedimiento para ${plantilla.nombre.toLowerCase()}`,
        activo: true
      }));

      // Insertar en lotes de 10
      const batchSize = 10;
      let insertados = 0;

      for (let i = 0; i < plantillasParaInsertar.length; i += batchSize) {
        const batch = plantillasParaInsertar.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('plantillas_procedimientos')
          .upsert(batch, { onConflict: 'id' });

        if (error) throw error;
        
        insertados += batch.length;
        setSyncMessage(`Sincronizando... ${insertados}/${plantillasParaInsertar.length} plantillas`);
      }

      setSyncStatus('success');
      setSyncMessage(`✅ ${plantillasParaInsertar.length} plantillas sincronizadas correctamente`);
      
      // Recargar estadísticas
      await cargarEstadisticasBD();
      
    } catch (error: any) {
      setSyncStatus('error');
      setSyncMessage(`❌ Error: ${error.message}`);
      console.error('Error sincronizando plantillas:', error);
    }
  };

  // Limpiar base de datos
  const limpiarBaseDatos = async () => {
    if (!window.confirm('¿Estás seguro de que quieres limpiar TODA la base de datos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setSyncStatus('syncing');
      setSyncMessage('Limpiando base de datos...');

      const tablas = ['notificaciones', 'documentos', 'facturas', 'procesos', 'plantillas_procedimientos', 'usuarios'];
      
      for (const tabla of tablas) {
        const { error } = await supabase.from(tabla).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
      }

      setSyncStatus('success');
      setSyncMessage('✅ Base de datos limpiada correctamente');
      await cargarEstadisticasBD();
      
    } catch (error: any) {
      setSyncStatus('error');
      setSyncMessage(`❌ Error limpiando BD: ${error.message}`);
    }
  };

  // Exportar datos a CSV
  const exportarDatos = async () => {
    try {
      setSyncStatus('syncing');
      setSyncMessage('Exportando datos...');

      const { data: plantillas } = await supabase.from('plantillas_procedimientos').select('*');
      const { data: usuarios } = await supabase.from('usuarios').select('*');
      const { data: procesos } = await supabase.from('procesos').select('*');

      // Crear CSV de plantillas
      if (plantillas) {
        const csvContent = [
          'id,nombre,codigo,organismo,dias_estimados,descripcion',
          ...plantillas.map(p => `${p.id},"${p.nombre}","${p.codigo}","${p.organismo}",${p.dias_estimados},"${p.descripcion}"`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantillas_exportadas.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }

      setSyncStatus('success');
      setSyncMessage('✅ Datos exportados correctamente');
      
    } catch (error: any) {
      setSyncStatus('error');
      setSyncMessage(`❌ Error exportando: ${error.message}`);
    }
  };

  useEffect(() => {
    if (activeTab === 'base-datos') {
      cargarEstadisticasBD();
    }
  }, [activeTab]);

  const handleSaveConfig = () => {
    // Guardar configuración en localStorage
    localStorage.setItem('app-config', JSON.stringify(configuracion));
    alert('Configuración guardada correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
        <button
          onClick={handleSaveConfig}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={20} />
          <span>Guardar Configuración</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>General</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('empresa')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'empresa'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building size={16} />
              <span>Empresa</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('base-datos')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'base-datos'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Database size={16} />
              <span>Base de Datos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notificaciones')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'notificaciones'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell size={16} />
              <span>Notificaciones</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Key size={16} />
              <span>API Keys</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Configuración General</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Facturación</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Porcentaje IVA (%)
                      </label>
                      <input
                        type="number"
                        value={configuracion.facturacion.ivaPorcentaje}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          facturacion: { ...prev.facturacion, ivaPorcentaje: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Porcentaje Ganancias (%)
                      </label>
                      <input
                        type="number"
                        value={configuracion.facturacion.gananciasPorcentaje}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          facturacion: { ...prev.facturacion, gananciasPorcentaje: Number(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prefijo de Facturas
                      </label>
                      <input
                        type="text"
                        value={configuracion.facturacion.prefijo}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          facturacion: { ...prev.facturacion, prefijo: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Preferencias</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={configuracion.facturacion.numeracionAutomatica}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          facturacion: { ...prev.facturacion, numeracionAutomatica: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Numeración automática de facturas
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'empresa' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Información de la Empresa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={configuracion.empresa.nombre}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, nombre: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CUIT
                  </label>
                  <input
                    type="text"
                    value={configuracion.empresa.cuit}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, cuit: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={configuracion.empresa.telefono}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, telefono: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={configuracion.empresa.email}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    value={configuracion.empresa.direccion}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, direccion: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={configuracion.empresa.sitioWeb}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, sitioWeb: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'base-datos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Gestión de Base de Datos</h3>
                <button
                  onClick={cargarEstadisticasBD}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>Actualizar</span>
                </button>
              </div>

              {/* Estado de conexión */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Database className="text-blue-600" size={20} />
                  <div>
                    <h4 className="font-medium text-blue-800">Estado de Conexión</h4>
                    <p className="text-sm text-blue-700">
                      Conectado a: {configuracion.apiKeys.supabase.url ? 
                        configuracion.apiKeys.supabase.url.replace('https://', '').split('.')[0] + '.supabase.co' : 
                        'No configurado'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Estadísticas de la BD */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{dbStats.plantillas}</div>
                  <div className="text-sm text-gray-600">Plantillas</div>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{dbStats.usuarios}</div>
                  <div className="text-sm text-gray-600">Usuarios</div>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{dbStats.procesos}</div>
                  <div className="text-sm text-gray-600">Procesos</div>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{dbStats.facturas}</div>
                  <div className="text-sm text-gray-600">Facturas</div>
                </div>
              </div>

              {/* Estado de sincronización */}
              {syncStatus !== 'idle' && (
                <div className={`p-4 rounded-lg border ${
                  syncStatus === 'syncing' ? 'bg-blue-50 border-blue-200' :
                  syncStatus === 'success' ? 'bg-green-50 border-green-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {syncStatus === 'syncing' && <RefreshCw className="animate-spin text-blue-600" size={20} />}
                    {syncStatus === 'success' && <CheckCircle className="text-green-600" size={20} />}
                    {syncStatus === 'error' && <AlertTriangle className="text-red-600" size={20} />}
                    <span className={`font-medium ${
                      syncStatus === 'syncing' ? 'text-blue-800' :
                      syncStatus === 'success' ? 'text-green-800' :
                      'text-red-800'
                    }`}>
                      {syncMessage}
                    </span>
                  </div>
                </div>
              )}

              {/* Acciones de sincronización */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center">
                    <Zap className="mx-auto mb-3 text-green-600" size={32} />
                    <h4 className="font-semibold text-green-800 mb-2">Sincronizar Plantillas</h4>
                    <p className="text-sm text-green-700 mb-4">
                      Sube las 76 plantillas de procedimientos a la base de datos
                    </p>
                    <button
                      onClick={sincronizarPlantillas}
                      disabled={syncStatus === 'syncing'}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Sincronizar Plantillas
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <Download className="mx-auto mb-3 text-blue-600" size={32} />
                    <h4 className="font-semibold text-blue-800 mb-2">Exportar Datos</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Descarga los datos actuales en formato CSV
                    </p>
                    <button
                      onClick={exportarDatos}
                      disabled={syncStatus === 'syncing'}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Exportar CSV
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="text-center">
                    <Trash2 className="mx-auto mb-3 text-red-600" size={32} />
                    <h4 className="font-semibold text-red-800 mb-2">Limpiar BD</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Elimina todos los datos de la base de datos
                    </p>
                    <button
                      onClick={limpiarBaseDatos}
                      disabled={syncStatus === 'syncing'}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Limpiar Todo
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparación de plantillas */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Estado de Plantillas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">En el Sistema (76 plantillas)</h5>
                    <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                      {organismos.map(org => (
                        <div key={org} className="text-sm mb-1">
                          <strong>{org}:</strong> {plantillasProcedimientos.filter(p => p.organismo === org).length} plantillas
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">En la Base de Datos ({dbStats.plantillas} plantillas)</h5>
                    <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                      {dbStats.plantillas === 0 ? (
                        <p className="text-sm text-gray-500 italic">No hay plantillas en la BD</p>
                      ) : (
                        <p className="text-sm text-green-600">✅ Plantillas sincronizadas</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Instrucciones</h4>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. <strong>Sincronizar Plantillas:</strong> Sube las 76 plantillas predefinidas</li>
                  <li>2. <strong>Verificar Estado:</strong> Revisa que los datos se hayan cargado correctamente</li>
                  <li>3. <strong>Exportar:</strong> Descarga backups de tus datos cuando sea necesario</li>
                  <li>4. <strong>Limpiar:</strong> Solo en caso de necesitar resetear completamente</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Configuración de Notificaciones</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracion.notificaciones.emailNotificaciones}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      notificaciones: { ...prev.notificaciones, emailNotificaciones: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Recibir notificaciones por email
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracion.notificaciones.notificacionesVencimiento}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      notificaciones: { ...prev.notificaciones, notificacionesVencimiento: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Alertas de vencimiento de procesos
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de anticipación para alertas
                  </label>
                  <input
                    type="number"
                    value={configuracion.notificaciones.diasAnticipacion}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      notificaciones: { ...prev.notificaciones, diasAnticipacion: Number(e.target.value) }
                    }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={configuracion.notificaciones.notificacionesDocumentos}
                    onChange={(e) => setConfiguracion(prev => ({
                      ...prev,
                      notificaciones: { ...prev.notificaciones, notificacionesDocumentos: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Notificaciones de documentos pendientes
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Configuración de APIs</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Supabase</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL del Proyecto
                      </label>
                      <input
                        type="url"
                        value={configuracion.apiKeys.supabase.url}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          apiKeys: { ...prev.apiKeys, supabase: { ...prev.apiKeys.supabase, url: e.target.value } }
                        }))}
                        placeholder="https://tu-proyecto.supabase.co"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Configurado en variables de entorno</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anon Key
                      </label>
                      <input
                        type="password"
                        value={configuracion.apiKeys.supabase.anonKey}
                        onChange={(e) => setConfiguracion(prev => ({
                          ...prev,
                          apiKeys: { ...prev.apiKeys, supabase: { ...prev.apiKeys.supabase, anonKey: e.target.value } }
                        }))}
                        placeholder="eyJ..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Configurado en variables de entorno</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-4">OpenAI (para validación IA)</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={configuracion.apiKeys.openai}
                      onChange={(e) => setConfiguracion(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, openai: e.target.value }
                      }))}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Necesario para la validación automática de documentos</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;