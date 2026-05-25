import React, { useState } from 'react';
import { Customer } from '../types';
import { Search, Plus, Edit2, Trash2, ShieldCheck, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

interface CustomersScreenProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (id: string, updated: Partial<Customer>) => void;
  onDeleteCustomer: (id: string) => void;
  darkMode?: boolean;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [rnc, setRnc] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [balance, setBalance] = useState('');
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setName('');
    setRnc('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCreditLimit('5000');
    setBalance('0');
    setActive(true);
    setEditingCustomer(null);
  };

  const openAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setRnc(c.rnc);
    setPhone(c.phone);
    setEmail(c.email);
    setAddress(c.address);
    setCreditLimit(c.creditLimit.toString());
    setBalance(c.balance.toString());
    setActive(c.active);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dataPayload = {
      name: name.trim(),
      rnc: rnc.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      creditLimit: parseFloat(creditLimit) || 0,
      balance: parseFloat(balance) || 0,
      active,
    };

    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, dataPayload);
    } else {
      onAddCustomer({
        id: 'CTE-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        ...dataPayload,
      });
    }
    setShowAddModal(false);
    resetForm();
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.rnc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Directorio de Clientes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Administra el límite de crédito, RNC y balances de tus compradores exclusivos.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Cliente</span>
        </button>
      </div>

      {/* Buscar bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-3 mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o RNC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 text-xs text-slate-700 dark:text-slate-200 focus:outline-none w-full"
        />
      </div>

      {/* Grid de clientes */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-sm text-slate-505 dark:text-slate-400">No se encontraron clientes registrados en el sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                      {c.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-1 font-sans">
                      {c.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {c.rnc && (
                  <p className="text-[11px] text-slate-500 font-mono mb-3">RNC: {c.rnc}</p>
                )}

                <div className="space-y-1.5 py-3 border-t border-b border-slate-100 dark:border-slate-800 my-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.phone || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.email || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.address || 'No especificado'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Límite Crédito</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">${c.creditLimit.toLocaleString()} USD</span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Balance Actual</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">${c.balance.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openEdit(c)}
                  className="p-1.5 bg-sky-55 hover:bg-sky-100 dark:hover:bg-sky-950/40 rounded text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Seguro que desea eliminar al cliente ${c.name}?`)) {
                      onDeleteCustomer(c.id);
                    }
                  }}
                  className="p-1.5 bg-rose-55 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded text-rose-600 dark:text-rose-450 transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agregar / Editar modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full animate-fade-in text-slate-800 dark:text-slate-150">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-850 dark:text-white mb-4">
              {editingCustomer ? 'Editar Datos de Cliente' : 'Registrar Nuevo Cliente'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">RNC (Opcional)</label>
                  <input
                    type="text"
                    value={rnc}
                    onChange={(e) => setRnc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                    placeholder="101-XXXXX-X"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                    placeholder="809-555-0100"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="cliente@ejemplo.com"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dirección Física</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  placeholder="Av. Winston Churchill, Santo Domingo"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Límite Crédito ($ USD)</label>
                  <input
                    type="number"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Balance Inicial ($ USD)</label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="client-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="client-active" className="text-xs text-slate-600 dark:text-slate-400 select-none">Cliente Activo (Permite facturación a crédito)</label>
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
