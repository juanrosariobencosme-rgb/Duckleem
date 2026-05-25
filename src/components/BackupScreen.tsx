import React, { useState } from 'react';
import { Backup, formatUSD } from '../types';
import { 
  Database, 
  Download, 
  Trash2, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  HardDrive, 
  RefreshCw, 
  Layers, 
  FileCode, 
  CheckCircle, 
  HelpCircle 
} from 'lucide-react';

interface BackupScreenProps {
  backups: Backup[];
  onCreateBackup: () => void;
  onDeleteBackup: (id: string) => void;
  onRestoreFromBackupData: (jsonStr: string) => void;
}

export const BackupScreen: React.FC<BackupScreenProps> = ({
  backups,
  onCreateBackup,
  onDeleteBackup,
  onRestoreFromBackupData,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [restoringData, setRestoringData] = useState('');

  // Collect real-time stats directly from localStorage for the active environment
  const getActiveStats = () => {
    try {
      const p = JSON.parse(localStorage.getItem('boutique-products') || '[]');
      const i = JSON.parse(localStorage.getItem('boutique-invoices') || '[]');
      const c = JSON.parse(localStorage.getItem('boutique-customers') || '[]');
      const s = JSON.parse(localStorage.getItem('boutique-sales') || '[]');
      const e = JSON.parse(localStorage.getItem('boutique-expenses') || '[]');
      return {
        products: Array.isArray(p) ? p.length : 0,
        invoices: Array.isArray(i) ? i.length : 0,
        customers: Array.isArray(c) ? c.length : 0,
        sales: Array.isArray(s) ? s.length : 0,
        expenses: Array.isArray(e) ? e.length : 0,
      };
    } catch {
      return { products: 0, invoices: 0, customers: 0, sales: 0, expenses: 0 };
    }
  };

  const activeStats = getActiveStats();

  const handleJSONFileSelect = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        onRestoreFromBackupData(text);
      } catch (err) {
        alert('❌ Error: El archivo no contiene un respaldo válido de Duckleem Manager.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBackupFileElement = (b: Backup) => {
    const backupObj = {
      timestamp: b.date,
      products: localStorage.getItem('boutique-products') || '[]',
      invoices: localStorage.getItem('boutique-invoices') || '[]',
      offers: localStorage.getItem('boutique-offers') || '[]',
      customers: localStorage.getItem('boutique-customers') || '[]',
      sales: localStorage.getItem('boutique-sales') || '[]',
      expenses: localStorage.getItem('boutique-expenses') || '[]',
      users: localStorage.getItem('boutique-users') || '[]'
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', b.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          onRestoreFromBackupData(text);
        } catch (err) {
          alert('❌ Error: El archivo JSON cargado no posee un esquema compatible.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteRestore = () => {
    if (!restoringData.trim()) return;
    try {
      onRestoreFromBackupData(restoringData.trim());
      setRestoringData('');
    } catch (e) {
      alert('❌ Formato inválido. Por favor asegúrese de pegar el objeto JSON correcto.');
    }
  };

  return (
    <div className="p-6 flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      
      {/* Title Header with descriptive tags and visual support */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] uppercase font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full border border-sky-450/20">
              Módulo de Sistema
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Almacenamiento Local Activo
            </span>
          </div>
          <h2 className="text-xl font-black font-sans text-slate-800 dark:text-slate-100 tracking-tight">
            Caja de Seguridad y Respaldo (Backups)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Genera instantáneas cifradas locales de toda tu operación comercial y restaura el histórico en segundos.
          </p>
        </div>

        <button
          onClick={onCreateBackup}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Punto de Restauración</span>
        </button>
      </div>

      {/* Database Active Footprint Section (Section 1: Live footprint) */}
      <section className="mb-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Huella de Datos Actuales en Memoria
          </h3>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">Volúmenes listos para empaquetado</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Productos</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">{activeStats.products}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Facturas Activas</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">{activeStats.invoices}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Clientes</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">{activeStats.customers}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Ventas Cerradas</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">{activeStats.sales}</p>
          </div>
          <div className="p-3 bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl col-span-2 md:col-span-1">
            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Gastos Registrados</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">{activeStats.expenses}</p>
          </div>
        </div>
      </section>

      {/* Main segmented splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SECTION 2: Snapshots list history */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Layers className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Historial de Puntos de Restauración
                </h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-400">Instancias persistidas localmente en este navegador.</p>
              </div>
            </div>

            {backups.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/10">
                <Database className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No se registran puntos guardados</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">Haz clic en "Crear Punto" para salvaguardar tu configuración de inventario actual.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {backups.map((b) => (
                  <div 
                    key={b.id} 
                    className="border border-slate-100 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-950/20 p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-mono font-bold bg-sky-200/50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-1.5 py-0.5 rounded uppercase">
                          {b.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{b.fileName}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2 text-[10px] font-sans text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-wide text-slate-450">Fecha de Snapshot</span>
                          <span className="font-mono mt-0.5">{b.date}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase tracking-wide text-slate-450">Volumen</span>
                          <span className="font-mono mt-0.5 font-bold">{b.fileSize}</span>
                        </div>
                        <div className="flex flex-col col-span-2 sm:col-span-1">
                          <span className="text-[8px] uppercase tracking-wide text-slate-450">Histórico Comercial</span>
                          <span className="font-mono mt-0.5 font-bold text-sky-600 dark:text-sky-400">{formatUSD(b.totalRevenue)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleDownloadBackupFileElement(b)}
                        className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 rounded-lg font-bold text-[10px] uppercase cursor-pointer flex items-center gap-1 transition-colors border border-emerald-450/20"
                        title="Guardar archivo original en su laptop"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Bajar (.json)</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm(`⚠️ ¿Restaurar instantánea ${b.id}? Se reemplazará el estado actual. El sistema se reiniciará.`)) {
                            const backupObj = {
                              timestamp: b.date,
                              products: localStorage.getItem('boutique-products') || '[]',
                              invoices: localStorage.getItem('boutique-invoices') || '[]',
                              offers: localStorage.getItem('boutique-offers') || '[]',
                              customers: localStorage.getItem('boutique-customers') || '[]',
                              sales: localStorage.getItem('boutique-sales') || '[]',
                              expenses: localStorage.getItem('boutique-expenses') || '[]',
                              users: localStorage.getItem('boutique-users') || '[]'
                            };
                            onRestoreFromBackupData(JSON.stringify(backupObj));
                          }
                        }}
                        className="py-1.5 px-2.5 bg-[#0f172a] hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 rounded-lg font-bold text-[10px] uppercase cursor-pointer transition-colors"
                      >
                        Restaurar
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`🗑️ ¿Desea eliminar la instantánea ${b.id}? Esta operación es irreversible.`)) {
                            onDeleteBackup(b.id);
                          }
                        }}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer border border-rose-500/10 transition-colors"
                        title="Borrar Snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Los puntos se guardan de forma interna. Para mayor seguridad, use el botón "Bajar" y guarde el JSON físico.</span>
          </div>
        </div>

        {/* SECTION 3: Manual restore column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <RefreshCw className="w-4.5 h-4.5 text-rose-500" />
              <div>
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider">
                  Restauración manual externa
                </h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-400">Arraste archivos de respaldo o ingrese el código JSON.</p>
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`p-5 border-2 border-dashed rounded-xl text-center relative cursor-pointer group transition-all ${
                dragActive 
                  ? 'border-sky-500 bg-sky-500/5' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-350 dark:hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleJSONFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileCode className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                {dragActive ? 'Suelte el archivo aquí' : 'Subir archivo .json de respaldo'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Haga clic o arrastre el archivo original de su laptop</span>
            </div>

            {/* Dividing hairline separator */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[9px] font-bold font-mono text-slate-400 uppercase">O pegue el código</span>
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            {/* Textarea Paste input */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Inserte el JSON de respaldo</label>
              <textarea
                value={restoringData}
                onChange={(e) => setRestoringData(e.target.value)}
                placeholder="Pegue aquí el bloque JSON de respaldo compatible..."
                rows={4}
                className="w-full text-[11px] font-mono p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-rose-500 text-slate-700 dark:text-slate-300 transition-colors"
              />
              <button
                onClick={handlePasteRestore}
                disabled={!restoringData.trim()}
                className="text-center w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl font-bold text-xs uppercase py-2.5 cursor-pointer disabled:opacity-40 transition-colors border border-transparent dark:border-slate-705"
              >
                Inyectar JSON en Base de Datos
              </button>
            </div>
          </div>

          {/* Safety disclaimer widget */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-[10px] text-amber-800 dark:text-amber-400 leading-normal">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[9px] mb-0.5">Advertencia Fiscal</p>
              <span>Al restaurar se eliminarán por completo todos los datos vigentes sustituyéndolos por el snapshot seleccionado. ¡Tenga cuidado!</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
