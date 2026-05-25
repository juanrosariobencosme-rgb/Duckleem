import React, { useState } from 'react';
import { Sale, Product, formatUSD } from '../types';
import { Search, Calendar, FileText, XCircle, RotateCcw, Eye, ArrowRight, Printer, Download, CheckCircle } from 'lucide-react';

interface SalesScreenProps {
  sales: Sale[];
  products: Product[];
  onUpdateSaleStatus: (id: string, newStatus: 'Completada' | 'Cancelada' | 'Reembolsada') => void;
  onRestockProduct: (pName: string, qty: number) => void;
}

export const SalesScreen: React.FC<SalesScreenProps> = ({
  sales,
  products,
  onUpdateSaleStatus,
  onRestockProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filter sales
  const filtered = sales.filter(s => {
    const term = search.toLowerCase();
    const matchesSearch = 
      s.id.toLowerCase().includes(term) ||
      s.invoiceId.toLowerCase().includes(term) ||
      s.customerName.toLowerCase().includes(term) ||
      s.seller.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (selectedPeriod === 'all') return true;

    const saleDate = new Date(s.date);
    const now = new Date();

    if (selectedPeriod === 'today') {
      return saleDate.toDateString() === now.toDateString();
    }

    if (selectedPeriod === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return saleDate >= oneWeekAgo;
    }

    if (selectedPeriod === 'month') {
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }

    return true;
  });

  const handleCancelSale = (s: Sale) => {
    if (confirm(`¿Seguro que desea Cancelar la Venta ${s.id}? Se reabastecerá el stock automáticamente.`)) {
      onUpdateSaleStatus(s.id, 'Cancelada');
      // restock
      s.items.forEach(it => {
        onRestockProduct(it.productName, it.quantity);
      });
      alert(`Venta ${s.id} cancelada. Inventario repuesto.`);
    }
  };

  const handleRefundSale = (s: Sale) => {
    if (confirm(`¿Seguro que desea marcar la Venta ${s.id} como Reembolsada? Se reingresará la mercancía al inventario.`)) {
      onUpdateSaleStatus(s.id, 'Reembolsada');
      // restock
      s.items.forEach(it => {
        onRestockProduct(it.productName, it.quantity);
      });
      alert(`Venta reembolsada.`);
    }
  };

  return (
    <div className="p-6 flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Historial de Ventas</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Verifica todas las transacciones realizadas, reembolsos y estados de facturas ligadas.</p>
      </div>

      {/* Filtros Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-205/50 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por ID de venta, factura, cliente o vendedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-700 dark:text-slate-250 focus:outline-none w-full"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-205/50 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="bg-transparent border-0 text-xs text-slate-700 dark:text-slate-250 font-medium focus:outline-none cursor-pointer w-full"
          >
            <option value="all">Cualquier Período</option>
            <option value="today">Ventas de Hoy</option>
            <option value="week">Últimos 7 días</option>
            <option value="month">Este Mes</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex-grow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">ID Venta</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Factura</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cliente / Vendedor</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pago</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3.5 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                    No se registran transacciones bajo este filtro.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {s.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {s.invoiceId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-sans text-slate-800 dark:text-slate-200">{s.customerName}</span>
                        <span className="text-[10px] text-slate-400">Atm: {s.seller}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-550 dark:text-slate-450 font-mono">
                      {s.date}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {s.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                      {formatUSD(s.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        s.status === 'Completada' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : s.status === 'Cancelada'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                          : 'bg-amber-105 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedSale(s)}
                          className="p-1 px-2 border border-slate-200 hover:border-slate-305 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                        {s.status === 'Completada' && (
                          <>
                            <button
                              onClick={() => handleCancelSale(s)}
                              className="p-1 px-2 border border-rose-200 hover:border-rose-405 text-rose-600 dark:text-rose-450 rounded hover:bg-rose-50/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              title="Anular venta"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRefundSale(s)}
                              className="p-1 px-2 border border-amber-200 hover:border-amber-405 text-amber-600 dark:text-amber-450 rounded hover:bg-amber-50/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              title="Hacer Reembolso"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale detail overlay formatted as A4 PDF document */}
      {selectedSale && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            
            {/* Modal sticky bar */}
            <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
                  Vista de Factura PDF • Original de Venta
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Enviando factura de ${selectedSale.customerName} a la cola de impresión...`)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={() => alert(`Iniciando descarga del archivo: DUCKLEEM_${selectedSale.invoiceId || selectedSale.id}.pdf`)}
                  className="px-3 py-1.5 border border-[#38bdf8] bg-[#0284c7]/10 hover:bg-[#0284c7]/20 text-[#0284c7] dark:text-sky-300 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PDF</span>
                </button>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="ml-2 w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document sheet body (styled as white print card) */}
            <div className="p-6 md:p-8 overflow-y-auto bg-slate-200/50 dark:bg-slate-900/30 flex-grow">
              <div className="bg-white dark:bg-slate-950 p-6 md:p-10 rounded-xl border border-slate-300/85 dark:border-slate-800/80 shadow-md max-w-3xl mx-auto shadow-slate-300/30 dark:shadow-none text-slate-800 dark:text-slate-250 font-sans leading-relaxed relative">
                
                {/* PDF Stamp Status */}
                <div className="absolute top-5 right-5 rotate-12 shrink-0">
                  <div className={`border-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    selectedSale.status === 'Completada'
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50/10'
                      : 'border-rose-500 text-rose-600 bg-rose-50/10'
                  }`}>
                    {selectedSale.status}
                  </div>
                </div>

                {/* Company & Register block headers */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-300 dark:border-slate-800 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#0f172a] dark:bg-sky-500 flex items-center justify-center font-bold text-lg text-[#38bdf8] dark:text-[#0f172a]">
                        DK
                      </div>
                      <div>
                        <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white font-sans uppercase">DUCKLEEM MANAGER</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Retail Master POS</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-550 dark:text-slate-400 space-y-0.5 mt-2">
                      <p className="font-bold uppercase">Lorenzo Despradel No.36, Plaza DM - Los Prados</p>
                      <p>Teléfono: +1 809-555-7777 • Santo Domingo, D.N.</p>
                      <p className="font-mono text-sky-600 dark:text-sky-450">soporte@duckleem.com</p>
                    </div>
                  </div>

                  <div className="md:text-right md:self-end">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">REGISTRO FISCAL AUTORIZADO</p>
                    <h2 className="text-[#0f172a] dark:text-slate-100 text-lg font-black font-mono">FOLIO: {selectedSale.invoiceId.replace('#', '') || selectedSale.id}</h2>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase font-mono">NIF: RNC-131-00000-0</p>
                  </div>
                </div>

                {/* Billing details grid blocks */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6">
                  <div className="md:col-span-8 border border-slate-300 dark:border-slate-800 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 divide-x divide-slate-300 dark:divide-slate-800 bg-slate-50 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
                      <div className="p-2 text-[9px] font-bold text-slate-500 uppercase col-span-1">CLIENTE</div>
                      <div className="p-2 text-[11px] font-bold text-slate-900 dark:text-white col-span-3">{selectedSale.customerName}</div>
                    </div>
                    
                    <div className="grid grid-cols-4 divide-x divide-slate-300 dark:divide-slate-800 border-b border-slate-300 dark:border-slate-800">
                      <div className="p-2 text-[9px] font-bold text-slate-500 uppercase col-span-1">DIRECCIÓN</div>
                      <div className="p-2 text-[11px] text-slate-700 dark:text-slate-300 col-span-3">Calle Lorenzo Despradel, Santo Domingo</div>
                    </div>

                    <div className="grid grid-cols-4 divide-x divide-slate-300 dark:divide-slate-800 border-b border-slate-300 dark:border-slate-800">
                      <div className="p-2 text-[9px] font-bold text-slate-500 uppercase col-span-1">Identificar</div>
                      <div className="p-2 text-[11px] text-slate-700 dark:text-slate-300 font-mono col-span-3">RNC 131-00000-0 / Registrado</div>
                    </div>

                    <div className="grid grid-cols-4 divide-x divide-slate-300 dark:divide-slate-800">
                      <div className="p-2 text-[9px] font-bold text-slate-500 uppercase col-span-1">Vendedor</div>
                      <div className="p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 col-span-3">{selectedSale.seller}</div>
                    </div>
                  </div>

                  <div className="md:col-span-4 border border-slate-300 dark:border-slate-800 rounded-lg h-fit text-center font-mono">
                    <div className="bg-slate-50 dark:bg-slate-900 p-1.5 text-[9px] font-bold text-slate-500 uppercase border-b border-slate-300 dark:border-slate-800">
                      FECHA EXPEDICIÓN
                    </div>
                    <div className="p-1 px-2 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {selectedSale.date.substring(0, 10).replace(/-/g, '/')}
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-1.5 text-[9px] font-bold text-slate-500 uppercase border-y border-slate-300 dark:border-slate-800">
                      VENCIMIENTO
                    </div>
                    <div className="p-1 px-2 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      {new Date(new Date(selectedSale.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10).replace(/-/g, '/')}
                    </div>
                  </div>
                </div>

                {/* Line Items Table with high density style */}
                <div className="border border-slate-300 dark:border-slate-800 rounded-lg overflow-x-auto mb-6">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-300 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                        <th className="p-3.5 uppercase">PRODUCTO / DETALLE</th>
                        <th className="p-3.5 uppercase text-right">PRECIO UNIT.</th>
                        <th className="p-3.5 uppercase text-center">CANT.</th>
                        <th className="p-3.5 uppercase text-center">DESC.</th>
                        <th className="p-3.5 uppercase text-right">MONTO NETO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-300">
                      {selectedSale.items.map((lineItem, idx) => {
                        const matchedProduct = products.find(p => p.name.toLowerCase() === lineItem.productName.toLowerCase());
                        const imageUrl = matchedProduct?.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400';
                        
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-3 font-medium text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={imageUrl}
                                  alt={lineItem.productName}
                                  referrerPolicy="no-referrer"
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0 select-none bg-slate-100"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-[11px] truncate">{lineItem.productName}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">{matchedProduct?.category || 'Otros'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-right font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-450">RD${lineItem.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">{lineItem.quantity}</td>
                            <td className="p-3 text-center text-slate-400 font-mono text-[11px]">-</td>
                            <td className="p-3 text-right font-mono font-bold text-slate-950 dark:text-slate-100">RD${lineItem.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals Bracket Row design */}
                <div className="flex justify-between items-end gap-6 mt-8">
                  <div className="hidden sm:block text-[10px] text-slate-400 leading-normal max-w-[280px]">
                    <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">REGULACIONES FISCALES DOMINICANAS</p>
                    <p>Factura emitida en cumplimiento de la Ley No. 11-92 del Código Tributario de la República Dominicana. Contribuyente acoplado al régimen general.</p>
                  </div>

                  <div className="w-72 border border-slate-300 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 text-xs">
                    <div className="flex justify-between p-2.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-500 uppercase text-[9px] font-mono">SUB-TOTAL</span>
                      <span className="font-mono text-slate-800 dark:text-slate-300">
                        RD${(selectedSale.totalAmount / 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between p-2.5 border-b border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-500 uppercase text-[9px] font-mono">ITBIS (18%)</span>
                      <span className="font-mono text-slate-800 dark:text-slate-300">
                        RD${(selectedSale.totalAmount - (selectedSale.totalAmount / 1.18)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-200/55 dark:bg-slate-850">
                      <span className="font-bold text-slate-700 dark:text-slate-200 uppercase text-[9px] self-center font-mono">TOTAL FACTURADO</span>
                      <span className="font-mono font-black text-[#0f172a] dark:text-sky-400 text-sm">
                        RD${selectedSale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer receipt details */}
                <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-3">
                  <p>Operaciones Comerciales R.D. • Contribuyente registrado para transacciones locales</p>
                  <p className="font-bold text-sky-600 dark:text-sky-400 font-mono uppercase tracking-wider bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded">
                    MÉTODO: {selectedSale.paymentMethod || 'Efectivo'}
                  </p>
                </div>

              </div>
            </div>

            {/* Modal action bar footer */}
            <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4.5 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">Original Digital Autorizado</span>
              <button
                onClick={() => setSelectedSale(null)}
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl font-bold text-xs uppercase tracking-wider select-none cursor-pointer transition-all border border-transparent dark:border-slate-700"
              >
                Cerrar Documento
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
