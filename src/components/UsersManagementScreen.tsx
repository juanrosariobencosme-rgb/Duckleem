import React, { useState } from 'react';
import { AppUser } from '../types';
import { Search, Plus, Edit2, Trash2, Key, UserCheck, Shield } from 'lucide-react';

interface UsersManagementScreenProps {
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
  onUpdateUser: (id: string, updated: Partial<AppUser>) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersManagementScreen: React.FC<UsersManagementScreenProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'empleado' | 'seller'>('seller');
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('seller');
    setActive(true);
    setEditingUser(null);
  };

  const openAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEdit = (u: AppUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
    setActive(u.active);
    setShowAddModal(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const dataPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      active,
    };

    if (editingUser) {
      onUpdateUser(editingUser.id, dataPayload);
    } else {
      onAddUser({
        id: 'USR-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        ...dataPayload,
      });
    }
    setShowAddModal(false);
    resetForm();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 tracking-tight">Gestión de Usuarios</h2>
          <p className="text-xs text-slate-505 dark:text-slate-400">Controla quiénes tienen acceso al sistema, sus roles corporativos y privilegios.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Buscar bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205/50 dark:border-slate-800 rounded-xl p-3 mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar usuarios por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-0 text-xs text-slate-700 dark:text-slate-200 focus:outline-none w-full"
        />
      </div>

      {/* Grid de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded leading-none">
                    {u.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-805 dark:text-slate-200 mt-1 font-sans">
                    {u.name}
                  </h3>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-105 text-rose-800'
                }`}>
                  {u.active ? 'Activo' : 'Suspendido'}
                </span>
              </div>

              <div className="space-y-2 py-3 border-t border-b border-slate-100 dark:border-slate-800 my-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Email:</span> {u.email}
                </p>
                <p className="text-xs text-slate-605 dark:text-slate-400">
                  <span className="font-bold">Teléfono:</span> {u.phone || 'No registrado'}
                </p>
                <p className="text-xs text-slate-605 dark:text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-bold">Rol:</span> 
                  <span className="bg-sky-50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-300 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    {u.role}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => openEdit(u)}
                className="p-1.5 bg-sky-50 hover:bg-sky-100 dark:hover:bg-sky-950/40 rounded text-sky-600 dark:text-sky-400 transition-colors cursor-pointer text-xs font-bold"
              >
                Editar / Configurar
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Seguro que desea remover al usuario ${u.name}?`)) {
                    onDeleteUser(u.id);
                  }
                }}
                className="p-1.5 text-rose-600 dark:text-rose-450 hover:bg-rose-50/10 rounded transition-colors cursor-pointer"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agregar / Editar modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full animate-fade-in text-slate-800 dark:text-slate-205">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-850 dark:text-white mb-4">
              {editingUser ? 'Editar Atribuciones' : 'Dar de Alta Nuevo Colaborador'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  placeholder="Ej. Sofía Rodríguez"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  placeholder="sofia@boutique.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                    placeholder="809-555-0105"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rol Operativo</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-205 dark:bg-slate-800 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="empleado">Empleado</option>
                    <option value="seller">Seller / Vendedor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="user-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                />
                <label htmlFor="user-active" className="text-xs text-slate-600 dark:text-slate-400 select-none">Habilitar acceso (Estado Activo)</label>
              </div>

              <div className="flex gap-2.5 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-205 rounded-lg font-bold text-xs uppercase cursor-pointer"
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
