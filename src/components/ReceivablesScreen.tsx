import React, { useState } from 'react';
import { Invoice } from '../types';
import { Header } from './Header';
import { 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Search, 
  Filter, 
  Check, 
  FileDown, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight,
  Edit3,
  X,
  Coins
} from 'lucide-react';

interface ReceivablesScreenProps {
  invoices: Invoice[];
  onMarkInvoiceAsPaid: (id: string) => void;
  onUpdateInvoice?: (id: string, fields: Partial<Invoice>) => void;
  profile?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    phone: string;
  };
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar?: () => void;
  onNavigate?: (screen: any) => void;
}

export const ReceivablesScreen: React.FC<ReceivablesScreenProps> = ({
  invoices,
  onMarkInvoiceAsPaid,
  onUpdateInvoice,
  profile,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'days' | 'amount'>('days');

  // Abonos and invoice edit state
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [abonoAmount, setAbonoAmount] = useState<number>(0);
  const [invoiceDescription, setInvoiceDescription] = useState<string>('');

  // Dynamically compute bento statistics from state
  const overdueInvoicesCount = invoices.filter(i => i.status === 'Pending').length;
  
  // Total pending amount calculation
  const totalOutstanding = invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // In Santo Domingo currency context or dollars, overdue portfolio amount
  const overdue30Plus = invoices
    .filter(i => i.status === 'Pending' && i.daysOverdue >= 30)
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Filter and Sort invoices
  const processedInvoices = invoices
    .filter(i => {
      return i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
             i.seller.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'days') {
        return b.daysOverdue - a.daysOverdue; // High to Low overdue
      } else {
        return b.totalAmount - a.totalAmount; // Amount High to Low
      }
    });

  return (
    <div id="receivables-screen" className="flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Header 
        title="Control de Cuentas por Cobrar" 
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onToggleSidebar={onToggleSidebar}
        onNavigate={onNavigate}
      />

      {/* Main Container Grid */}
      <section className="p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] flex-grow">
        
        {/* Title and main buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex gap-1.5 text-xs text-slate-400 font-semibold mb-1">
              <span>Finanzas</span>
              <span>/</span>
              <span className="text-slate-600">Cuentas por Cobrar</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#0f172a] font-sans tracking-tight">Cuentas por Cobrar</h1>
          </div>
          <div className="flex gap-3">
            <button
              id="btn-receivables-export"
              onClick={() => {
                alert('¡Éxito! Base de datos de facturas pendientes compilada: cuentas_por_cobrar_' + Date.now() + '.xlsx');
              }}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-[#0f172a] font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <FileDown className="w-4 h-4 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
            <button
              id="btn-receivables-report"
              onClick={() => alert('Reporte PDF generado. Enviado a la cola de impresión de la boutique.')}
              className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-all"
            >
              <span>Generar Reporte</span>
            </button>
          </div>
        </div>

        {/* Bento Style Summary metrics Cards */}
        <section id="bento-summary-receivables" className="grid grid-cols-12 gap-6">

          {/* Large Portfolio at Risk */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
            
            <div className="z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Cartera Total Pendiente de Cobro</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-light text-[#0f172a] font-bold tracking-tight">
                  RD${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="bg-rose-150 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-rose-200">
                  <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                  <span>+12.4% de incremento</span>
                </span>
              </div>
            </div>

            <div className="flex gap-8 mt-6 pt-5 border-t border-slate-100 z-10 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Vencido (30+ Días)</p>
                <p className="text-lg font-bold text-rose-600">RD${overdue30Plus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="w-px bg-slate-200 h-8 self-center"></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Facturas Activas</p>
                <p className="text-lg font-bold text-[#0f172a]">{overdueInvoicesCount} gestiones</p>
              </div>
            </div>

            {/* Graphic SVG Wave background lines */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L100 0 L100 100 Z" fill="#0f172a" />
              </svg>
            </div>
          </div>

          {/* Average Days to Pay */}
          <div className="col-span-12 md:col-span-6 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 text-center flex flex-col justify-center items-center shadow-sm">
            <Calendar className="w-8 h-8 text-sky-500 mb-3" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promedio Días de Pago</p>
            <p className="text-4xl font-display font-bold text-[#0f172a] mt-1.5">42</p>
          </div>

          {/* Collection Rate */}
          <div className="col-span-12 md:col-span-6 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 text-center flex flex-col justify-center items-center shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tasa de Recaudo</p>
            <p className="text-4xl font-display font-bold text-[#0f172a] mt-1.5">88%</p>
          </div>

        </section>

        {/* Table Controls (Search + Sorting dropdown) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 group-focus-within:text-sky-500 transition-colors" />
            <input
              id="search-receivables-input"
              type="text"
              placeholder="Buscar en base de datos por #factura, cliente o vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/15 focus:border-sky-500 transition-all font-sans"
            />
          </div>

          <div className="flex gap-2.5 items-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Ordenar por:</span>
            <select
              id="receivables-sorting-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-sky-500 transition-all cursor-pointer"
            >
              <option value="days">Días Vencidos (Mayor a Menor)</option>
              <option value="amount">Monto (Mayor a Menor)</option>
            </select>
          </div>
        </div>

        {/* Active Overdue Invoices grid dataset table representation */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Factura #</th>
                  <th className="px-6 py-4">Fecha de Vencimiento</th>
                  <th className="px-6 py-4">Información del Cliente</th>
                  <th className="px-6 py-4">Descripción del Cobro</th>
                  <th className="px-6 py-4">Vendedor Asignado</th>
                  <th className="px-6 py-4 text-right">Total Pendiente</th>
                  <th className="px-6 py-4 text-center">Días Vencidos</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-850">
                {processedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                      Ninguna factura pendiente coincide con los filtros de búsqueda.
                    </td>
                  </tr>
                ) : (
                  processedInvoices.map((inv) => {
                    const initials = inv.customerName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    const isPaid = inv.status === 'Paid';

                    return (
                      <tr 
                        key={inv.id}
                        className={`hover:bg-slate-50/50 transition-colors group ${
                          isPaid ? 'opacity-50 line-through' : ''
                        }`}
                      >
                        {/* ID number */}
                        <td className="px-6 py-4 font-mono font-bold text-[#0f172a]" id={`cell-id-${inv.id}`}>
                          {inv.id}
                        </td>
                        
                        {/* Due Date */}
                        <td className="px-6 py-4 text-slate-500">
                          {inv.dueDate}
                        </td>

                        {/* Customer block with initials circles */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1e293b] text-[#38bdf8] text-[9px] font-bold flex items-center justify-center shrink-0">
                                {initials}
                            </div>
                            <span className="font-bold text-slate-800">{inv.customerName}</span>
                          </div>
                        </td>

                        {/* Description column */}
                        <td className="px-6 py-4 text-slate-500 max-w-xs">
                          <p className="line-clamp-2 italic leading-normal text-[11px]">
                            {inv.description || <span className="text-slate-300">Sin descripción</span>}
                          </p>
                        </td>

                        {/* Seller */}
                        <td className="px-6 py-4 text-slate-500">
                          {inv.seller}
                        </td>

                        {/* Total valuation */}
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          RD${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Days overdue indicator row */}
                        <td className="px-6 py-4 text-center">
                          {isPaid ? (
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                              Saldado
                            </span>
                          ) : (
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                              inv.daysOverdue >= 45 
                                ? 'bg-rose-50 text-rose-600 border border-rose-100 font-bold' 
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {inv.daysOverdue} días
                            </span>
                          )}
                        </td>

                        {/* Interactive Reconcile actions column */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2.5 justify-end items-center">
                            {/* Editar button */}
                            <button
                              id={`btn-manual-abono-${inv.id}`}
                              onClick={() => {
                                setEditingInvoice(inv);
                                setAbonoAmount(0);
                                setInvoiceDescription(inv.description || '');
                              }}
                              className="p-2 bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-950/40 dark:hover:bg-sky-900 rounded-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-xs border border-sky-200/50"
                              title="Editar factura / Registrar Abono"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Marcar como Pagado button */}
                            <button
                              id={`btn-reconcile-pay-${inv.id}`}
                              disabled={isPaid}
                              onClick={() => {
                                onMarkInvoiceAsPaid(inv.id);
                                alert(`¡Factura ${inv.id} marcada como Pagada con éxito!`);
                              }}
                              className={`p-2 rounded-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-xs border ${
                                isPaid 
                                  ? 'bg-emerald-600 text-white border-emerald-600 cursor-default' 
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900 border-emerald-200/50'
                              }`}
                              title={isPaid ? 'Factura Pagada' : 'Marcar como Pagado'}
                            >
                              <Check className="w-4 h-4 text-xs font-bold" />
                            </button>

                            {/* Marcar como Pendiente button */}
                            <button
                              id={`btn-reconcile-pending-${inv.id}`}
                              disabled={!isPaid}
                              onClick={() => {
                                if (onUpdateInvoice) {
                                  onUpdateInvoice(inv.id, { status: 'Pending', daysOverdue: 5 });
                                  alert(`Factura ${inv.id} marcada como Pendiente.`);
                                }
                              }}
                              className={`p-2 rounded-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer shadow-xs border ${
                                !isPaid 
                                  ? 'bg-amber-500 text-white border-amber-500 cursor-default' 
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-900 border-amber-200/50'
                              }`}
                              title={!isPaid ? 'Factura Pendiente' : 'Marcar como Pendiente'}
                            >
                              <Calendar className="w-4 h-4 text-xs" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination stats footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
            <p>Mostrando {processedInvoices.length} de {invoices.filter(i => i.status === 'Pending').length + invoices.filter(i => i.status==='Paid').length} facturas</p>
            
            <div className="flex gap-1">
              <button className="p-1 px-2 border border-slate-200 rounded hover:bg-white cursor-pointer disabled:opacity-50" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="bg-[#0f172a] text-white text-[11px] font-bold w-6 h-6 rounded flex items-center justify-center">1</button>
              <button className="p-1 px-2 border border-slate-200 rounded hover:bg-white cursor-pointer disabled:opacity-50" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* EDIT AND REGISTER ABONO MODAL OVERLAY */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-205 dark:border-slate-805 overflow-hidden text-slate-850 dark:text-slate-100">
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-955">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Coins className="w-4.5 h-4.5 text-amber-500" />
                <span>Registrar Abono o Modificar Cobro</span>
              </h3>
              <button 
                onClick={() => setEditingInvoice(null)}
                className="p-1 hover:bg-slate-205 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-250 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div className="pb-3 border-b border-slate-150 dark:border-slate-805">
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{editingInvoice.id}</p>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">Cliente: {editingInvoice.customerName}</h4>
                <p className="text-[11px] text-[#0f172a] dark:text-sky-300 font-bold mt-1">
                  Monto Pendiente Actual: <span className="font-mono text-xs">RD$ {editingInvoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>

              {/* Installment Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="edit-abono-input">
                  Registrar Abono (RD$)
                </label>
                <input
                  id="edit-abono-input"
                  type="number"
                  min="0"
                  max={editingInvoice.totalAmount}
                  placeholder="Ingrese el monto recibido de abono..."
                  value={abonoAmount || ''}
                  onChange={(e) => setAbonoAmount(Math.min(editingInvoice.totalAmount, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-805 rounded-lg px-3 py-2.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
                {abonoAmount > 0 && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
                    Nuevo balance pendiente tras abono: <span className="font-mono">RD$ {(editingInvoice.totalAmount - abonoAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </p>
                )}
              </div>

              {/* Invoice Description Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="edit-desc-input">
                  Descripción / Detalles del Cobro
                </label>
                <textarea
                  id="edit-desc-input"
                  rows={3}
                  placeholder="Detalles sobre el inventario facturado, compromisos de pago o notas de seguimiento..."
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-805 rounded-lg px-3 py-2.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="flex-1 py-2.5 text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-605 dark:text-slate-350 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateInvoice) {
                      const finalAmount = editingInvoice.totalAmount - abonoAmount;
                      const isFullySettled = finalAmount <= 0;

                      onUpdateInvoice(editingInvoice.id, {
                        totalAmount: Math.max(0, finalAmount),
                        description: invoiceDescription,
                        status: isFullySettled ? 'Paid' : 'Partial',
                        daysOverdue: isFullySettled ? 0 : editingInvoice.daysOverdue
                      });

                      if (isFullySettled) {
                        alert(`¡Factura ${editingInvoice.id} saldada en su totalidad con éxito!`);
                      } else {
                        alert(`Abono por RD$ ${abonoAmount.toLocaleString()} registrado para ${editingInvoice.customerName}. Nuevo balance deudor: RD$ ${finalAmount.toLocaleString()}.`);
                      }
                    }
                    setEditingInvoice(null);
                  }}
                  className="flex-1 py-2.5 bg-[#0f172a] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  Confirmar Ajuste
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
