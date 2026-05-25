import React, { useState } from 'react';
import { Expense, formatUSD } from '../types';
import { Search, Plus, Edit2, Trash2, Filter, Receipt, DollarSign } from 'lucide-react';

interface ExpensesScreenProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (id: string, updated: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states
  const [category, setCategory] = useState<'Telas' | 'Lavada/Plancha' | 'Bordado' | 'Gorras' | 'Otros'>('Otros');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setCategory('Otros');
    setDescription('');
    setAmount('');
    setProvider('');
    setInvoiceNumber('');
    setPaymentMethod('Efectivo');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setEditingExpense(null);
  };

  const openAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditingExpense(e);
    setCategory(e.category);
    setDescription(e.description);
    setAmount(e.amount.toString());
    setProvider(e.provider);
    setInvoiceNumber(e.invoiceNumber || '');
    setPaymentMethod(e.paymentMethod);
    setDate(e.date);
    setNotes(e.notes || '');
    setShowAddModal(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!description.trim() || !amount) return;

    const dataPayload = {
      category,
      description: description.trim(),
      amount: parseFloat(amount) || 0,
      provider: provider.trim() || 'Varios',
      invoiceNumber: invoiceNumber.trim() || undefined,
      paymentMethod,
      date,
      notes: notes.trim() || undefined,
    };

    if (editingExpense) {
      onUpdateExpense(editingExpense.id, dataPayload);
    } else {
      onAddExpense({
        id: 'GST-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        ...dataPayload,
      });
    }
    setShowAddModal(false);
    resetForm();
  };

  // Filter
  const filtered = expenses.filter(e => {
    const term = search.toLowerCase();
    const matchesSearch = 
      e.description.toLowerCase().includes(term) ||
      e.provider.toLowerCase().includes(term) ||
      (e.invoiceNumber && e.invoiceNumber.toLowerCase().includes(term));

    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalExpenses = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  // Grouped by Category totals
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Registro de Gastos Operativos</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Controla egresos, facturas de talleres de costura, lavandería y pulseras.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Gasto</span>
        </button>
      </div>

      {/* Resumen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gasto Filtrado</span>
            <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">{formatUSD(totalExpenses)}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {['Telas', 'Lavada/Plancha', 'Bordado', 'Otros'].map((cat) => (
          <div key={cat} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-xl">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{cat}</span>
            <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200">
              {formatUSD(categoryTotals[cat] || 0)}
            </span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-3 flex items-center gap-3 md:col-span-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por descripción, proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-700 dark:text-slate-200 focus:outline-none w-full"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none w-full ml-2 cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Telas">Telas</option>
            <option value="Lavada/Plancha">Lavada/Plancha</option>
            <option value="Bordado">Bordado</option>
            <option value="Gorras">Gorras</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Lista de gastos */}
      <div className="bg-white dark:bg-slate-900 border border-slate-202/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex-grow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Factura</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Método</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3.5 text-right text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs text-slate-505 dark:text-slate-400">
                    No se registran egresos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold font-sans text-slate-800 dark:text-slate-200">{e.description}</span>
                        {e.notes && <span className="text-[10px] text-slate-400 mt-0.5">{e.notes}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-605 dark:text-slate-305">
                      {e.provider}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {e.invoiceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {e.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {e.date}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {formatUSD(e.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(e)}
                          className="p-1 px-2 border border-slate-200 hover:border-slate-305 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que desea eliminar este gasto?`)) {
                              onDeleteExpense(e.id);
                            }
                          }}
                          className="p-1 px-2 border border-rose-200 hover:border-rose-355 text-rose-605 rounded hover:bg-rose-50/10 text-xs font-bold transition-all cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar Gasto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full animate-fade-in text-slate-800 dark:text-slate-205">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-850 dark:text-white mb-4">
              {editingExpense ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(ev) => setCategory(ev.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Telas">Telas</option>
                    <option value="Lavada/Plancha">Lavada/Plancha</option>
                    <option value="Bordado">Bordado</option>
                    <option value="Gorras">Gorras</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Monto ($ USD)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(ev) => setAmount(ev.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descripción / Notas del Gasto *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  placeholder="Ej. Compra de 50 yardas de seda azul"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Proveedor / Taller</label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(ev) => setProvider(ev.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                    placeholder="Ej. Costura Santiago"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">No. Factura / Comprobante</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(ev) => setInvoiceNumber(ev.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                    placeholder="B01-XXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Método de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={(ev) => setPaymentMethod(ev.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(ev) => setDate(ev.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notas Adicionales</label>
                <textarea
                  value={notes}
                  onChange={(ev) => setNotes(ev.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs resize-none"
                  rows={2}
                  placeholder="Detalles ampliados..."
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg font-bold text-xs uppercase cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
