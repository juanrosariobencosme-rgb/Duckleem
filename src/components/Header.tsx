import React from 'react';
import { Bell, Settings, Search, Menu, Sun, Moon } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  title: string;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  profile?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    phone: string;
  };
  onNavigate?: (screen: Screen) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Buscar en inventario, facturas o clientes...',
  profile,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar
}) => {
  const displayAvatar = profile?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDSe7boQvElrQVjbht0yOfiCSIEx6d0kQOCsp-FhRSVLGRkdWEcX7upuEVuWjtyXyZrcie8xDEFElPsbi0GSDNdK1W3PMF27V5uHO_vFOwxcsIizuwuyUFqy1e_ys154PZLSlVjR47bftcp4KDMZA9XQ70k2GDgQTtQGhOvryS3nTX9siqHSOx2G5vIavLeLSh3sJzMSMSUrmGTG8_-D7FdcgmRBm26zMaNS4WNS55qE8m01Mbzr28OUc6l-lKDDT0hZw8IGRMVG_w";
  const displayFullName = profile ? `${profile.firstName} ${profile.lastName}` : "Alex Sterling";

  return (
    <header 
      id="top-navbar-hdr" 
      className="flex justify-between items-center h-16 px-4 md:px-8 w-full z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 transition-colors"
    >
      <div className="flex items-center gap-4 flex-grow max-w-xl">
        {/* Hamburger Menu trigger for Mobile */}
        {onToggleSidebar && (
          <button
            id="btn-sidebar-hamburger"
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded md:hidden transition-colors cursor-pointer"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
        )}

        {/* Title or Search */}
        {onSearchChange ? (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              id="top-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans"
            />
          </div>
        ) : (
          <h2 className="font-semibold text-sm md:text-lg text-slate-800 dark:text-slate-100 font-sans tracking-tight truncate">
            {title}
          </h2>
        )}
      </div>

      {/* User Area Actions */}
      <div className="flex items-center gap-1.5 md:gap-3 shrink-0">

        {/* Notifications */}
        <button
          id="btn-header-notif"
          onClick={() => alert('No hay notificaciones nuevas. El sistema de boutique es óptimo.')}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Global Settings Gear Profile Shortcut */}
        <button
          id="btn-header-settings"
          onClick={() => onNavigate ? onNavigate('profile') : alert('Configuración')}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          title="Ver Perfil"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 md:mx-2"></div>

        {/* User Info Card Link to Profile */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-85"
          onClick={() => onNavigate && onNavigate('profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="font-sans text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[120px]">
              {displayFullName}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">Store Manager</p>
          </div>
          <img
            id="user-profile-avatar"
            alt="Manager Profile Avatar"
            src={displayAvatar}
            referrerPolicy="no-referrer"
            className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 dark:border-slate-850 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};
