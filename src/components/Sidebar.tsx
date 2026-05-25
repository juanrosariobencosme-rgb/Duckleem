import React from 'react';
import { Screen } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  FileText,  
  TrendingUp, 
  LogOut, 
  HelpCircle,
  Plus,
  X,
  User,
  Users,
  Coins,
  BarChart3,
  ShieldAlert,
  Percent,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  pendingInvoicesCount: number;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  profile?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentScreen, 
  onNavigate,
  pendingInvoicesCount,
  sidebarOpen = false,
  onToggleSidebar,
  profile
}) => {
  // Organized sections by classifications
  const sections = [
    {
      title: 'Operaciones de Venta',
      items: [
        {
          id: 'nav-dashboard',
          label: 'Panel Principal',
          screen: 'dashboard' as Screen,
          icon: <LayoutDashboard className="w-4 h-4" />
        },
        {
          id: 'nav-billing',
          label: 'Punto de Venta',
          screen: 'billing' as Screen,
          icon: <Receipt className="w-4 h-4" />
        },
        {
          id: 'nav-sales',
          label: 'Historial de Ventas',
          screen: 'sales' as Screen,
          icon: <FileText className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Inventario & Catálogo',
      items: [
        {
          id: 'nav-inventory',
          label: 'Inventario de Ropa',
          screen: 'inventory' as Screen,
          icon: <Package className="w-4 h-4" />
        },
        {
          id: 'nav-offers',
          label: 'Ofertas & Descuentos',
          screen: 'offers' as Screen,
          icon: <Percent className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Clientes & Cobros',
      items: [
        {
          id: 'nav-customers',
          label: 'Clientes Registrados',
          screen: 'customers' as Screen,
          icon: <Users className="w-4 h-4" />
        },
        {
          id: 'nav-receivables',
          label: 'Cuentas por Cobrar',
          screen: 'receivables' as Screen,
          icon: <ShieldAlert className="w-4 h-4" />,
          badge: pendingInvoicesCount > 0 ? pendingInvoicesCount : undefined
        }
      ]
    },
    {
      title: 'Finanzas & Reportes',
      items: [
        {
          id: 'nav-expenses',
          label: 'Gastos Operativos',
          screen: 'expenses' as Screen,
          icon: <Coins className="w-4 h-4" />
        },
        {
          id: 'nav-reports',
          label: 'Reportes y Auditoría',
          screen: 'reports' as Screen,
          icon: <BarChart3 className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Herramientas de Control',
      items: [
        {
          id: 'nav-users',
          label: 'Gestión de Usuarios',
          screen: 'users' as Screen,
          icon: <Users className="w-4 h-4" />
        },
        {
          id: 'nav-backup',
          label: 'Respaldo de Base de Datos',
          screen: 'backup' as Screen,
          icon: <Database className="w-4 h-4" />
        },
        {
          id: 'nav-profile',
          label: 'Mi Perfil',
          screen: 'profile' as Screen,
          icon: <User className="w-4 h-4" />
        }
      ]
    }
  ];

  const handleItemClick = (screen: Screen) => {
    onNavigate(screen);
    if (onToggleSidebar && sidebarOpen) {
      onToggleSidebar();
    }
  };

  const displayAvatar = profile?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDSe7boQvElrQVjbht0yOfiCSIEx6d0kQOCsp-FhRSVLGRkdWEcX7upuEVuWjtyXyZrcie8xDEFElPsbi0GSDNdK1W3PMF27V5uHO_vFOwxcsIizuwuyUFqy1e_ys154PZLSlVjR47bftcp4KDMZA9XQ70k2GDgQTtQGhOvryS3nTX9siqHSOx2G5vIavLeLSh3sJzMSMSUrmGTG8_-D7FdcgmRBm26zMaNS4WNS55qE8m01Mbzr28OUc6l-lKDDT0hZw8IGRMVG_w";
  const displayFullName = profile ? `${profile.firstName} ${profile.lastName}` : "Alex Sterling";

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity cursor-pointer"
        />
      )}

      <aside 
        id="sidebar-container" 
        className={`fixed left-0 top-0 h-full flex flex-col py-6 w-60 bg-[#FAF6F0] text-[#2C231E] border-r border-[#E5DCCB] z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with elegant high-fashion touch */}
        <div className="px-6 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-gradient-to-tr from-[#9B7F56] to-[#C2A378] flex items-center justify-center text-white shadow-md shadow-[#C2A378]/25 shrink-0">
              <TrendingUp className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-[#2C231E] tracking-tight leading-none uppercase">
                Duckleem
              </h1>
              <p className="text-[9px] text-[#8C6D43] font-bold uppercase tracking-wider mt-1 font-sans">
                MANAGER ÉLITE
              </p>
            </div>
          </div>

          {/* Close trigger button for Mobile sidebar view */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1 text-[#8C7A6D] hover:text-[#2C231E] hover:bg-[#EED8C1]/30 rounded md:hidden transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick User summary card styled beautifully in luxury theme */}
        <div className="px-4 mb-4">
          <div className="p-3 bg-white/90 rounded-xl border border-[#E5DCCB] flex items-center gap-3 shadow-xs">
            <img 
              src={displayAvatar} 
              alt="Avatar sidebar" 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-[#C2A378]/30" 
            />
            <div className="min-w-0">
              <p className="text-[11px] font-sans font-bold text-[#2C231E] leading-none truncate">{displayFullName}</p>
              <p className="text-[9px] font-bold text-[#8C6D43] uppercase tracking-widest mt-1">Gerente Boutique</p>
            </div>
          </div>
        </div>

        {/* Categories / Sections of menu with customized styling */}
        <nav 
          id="sidebar-nav" 
          className="flex-grow px-3 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-transparent"
        >
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {/* Category sub-header */}
              <h3 className="px-3 text-[9px] font-black text-[#8C7A6D] uppercase tracking-widest font-sans mb-1.5 opacity-80">
                {sec.title}
              </h3>
              
              {/* Children links */}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = currentScreen === item.screen;
                  return (
                    <button
                      key={item.id}
                      id={item.id}
                      onClick={() => handleItemClick(item.screen)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive 
                          ? 'bg-[#E5DCCB] text-[#2C231E] font-bold shadow-xs border-l-4 border-[#9B7F56]' 
                          : 'text-[#605249] hover:bg-[#F2EAE0] hover:text-[#2C231E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`${isActive ? 'text-[#9B7F56]' : 'text-[#8C7A6D]'}`}>
                          {item.icon}
                        </span>
                        <span className="font-sans text-[11px]">{item.label}</span>
                      </div>
                      
                      {item.badge !== undefined && (
                        <span className="bg-[#E17253] text-white text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full leading-none">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="mt-auto px-3 pt-3 border-t border-[#E5DCCB]/60 space-y-1.5">
          <button
            id="btn-sidebar-new-sale-action"
            onClick={() => handleItemClick('billing')}
            className="w-full bg-[#9B7F56] hover:bg-[#826944] text-white font-bold text-xs py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Nueva Venta de Caja</span>
          </button>

          <button
            id="btn-sidebar-logout-sec"
            onClick={() => handleItemClick('login')}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-[#8B3A25] hover:bg-[#DF9D8D]/15 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#E17253]" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
