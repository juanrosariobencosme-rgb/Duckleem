import React, { useState, useEffect } from 'react';
import { Screen, Product, Invoice, Offer, Customer, Sale, Expense, Backup, AppUser } from './types';
import { INITIAL_PRODUCTS, INITIAL_INVOICES, INITIAL_OFFERS } from './data';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { BillingScreen } from './components/BillingScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { ReceivablesScreen } from './components/ReceivablesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OffersScreen } from './components/OffersScreen';
import { CustomersScreen } from './components/CustomersScreen';
import { SalesScreen } from './components/SalesScreen';
import { ExpensesScreen } from './components/ExpensesScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { UsersManagementScreen } from './components/UsersManagementScreen';
import { BackupScreen } from './components/BackupScreen';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  
  // Real Local Database Engine synchronizing instantly with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('boutique-products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('boutique-invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('boutique-offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('boutique-customers');
    return saved ? JSON.parse(saved) : [
      { id: 'CTE-A9B3C', name: 'Rosario Bencosme', rnc: '101-85231-4', phone: '809-555-1234', email: 'rosario@ejemplo.com', address: 'Av. Winston Churchill, Santo Domingo', creditLimit: 12000, balance: 1450, active: true },
      { id: 'CTE-E2D5F', name: 'Laura Medina', rnc: '131-49210-2', phone: '829-444-5678', email: 'laura@ejemplo.com', address: 'Calle Los Prados #12, Santo Domingo', creditLimit: 8000, balance: 0, active: true },
      { id: 'CTE-K8L9M', name: 'Carlos Mendoza', rnc: '', phone: '809-333-9012', email: 'carlos@ejemplo.com', address: 'Santiago de los Caballeros', creditLimit: 5000, balance: 0, active: false }
    ];
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('boutique-sales');
    return saved ? JSON.parse(saved) : [
      { id: 'VTA-7782A', invoiceId: 'INV-2024-001', customerName: 'Aurelius J. Design', seller: 'S. Miller', paymentMethod: 'Bank Transfer', totalAmount: 12450.00, status: 'Completada', date: '2026-04-12', items: [ { productName: 'Architectural Blazer', price: 540.00, quantity: 20, amount: 10800.00 } ] },
      { id: 'VTA-4412B', invoiceId: 'INV-2024-089', customerName: 'Celestial Homes', seller: 'R. Vance', paymentMethod: 'Credit Card', totalAmount: 45000.00, status: 'Completada', date: '2026-01-05', items: [ { productName: 'Gold Link Watch', price: 950.00, quantity: 45, amount: 40612.50 } ] },
      { id: 'VTA-8122C', invoiceId: 'INV-2377', customerName: 'shop Courier', seller: 'Alice Sterling', paymentMethod: 'Cash', totalAmount: 2000.00, status: 'Completada', date: '2026-05-19', items: [ { productName: 'MunnekAmarilla', price: 2000.00, quantity: 1, amount: 2000.00 } ] }
    ];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('boutique-expenses');
    return saved ? JSON.parse(saved) : [
      { id: 'GST-XP01', category: 'Telas', description: 'Compra de 100 yardas de Algodón Premium', amount: 450, provider: 'Telas Dominicanas S.A.', invoiceNumber: 'B01-098273', paymentMethod: 'Transferencia', date: '2026-05-10', notes: 'Para nueva colección de camisas de lino' },
      { id: 'GST-XP02', category: 'Lavada/Plancha', description: 'Planchado y desinfección de lote primavera', amount: 120, provider: 'Lavandería Bella Vista', invoiceNumber: 'B02-45214', paymentMethod: 'Efectivo', date: '2026-05-18', notes: 'Servicio express' },
      { id: 'GST-XP03', category: 'Bordado', description: 'Bordados de logos dorados en gorras', amount: 180, provider: 'Bordados del Norte', invoiceNumber: 'B01-44321', paymentMethod: 'Tarjeta', date: '2026-05-20', notes: 'Lote AP-111' }
    ];
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('boutique-users');
    return saved ? JSON.parse(saved) : [
      { id: 'USR-SA01', name: 'Super Admin', email: 'superadmin@duckleem.com', phone: '809-555-9000', role: 'super_admin', active: true },
      { id: 'USR-AD02', name: 'Juan Rosario Bencosme', email: 'juan@duckleem.com', phone: '809-555-7777', role: 'admin', active: true },
      { id: 'USR-EM03', name: 'Sofía AI', email: 'sofia@duckleem.com', phone: '800-AI-ROBOT', role: 'seller', active: true }
    ];
  });

  const [backups, setBackups] = useState<Backup[]>(() => {
    const saved = localStorage.getItem('boutique-backups');
    return saved ? JSON.parse(saved) : [
      { id: 'BKP-001', fileName: 'duckleem_snap_mayo_2026.json', fileSize: '45 KB', date: '2026-05-15 14:30', totalSales: 3, totalRevenue: 59450.00, itemsSold: 66 }
    ];
  });

  // Automated sync effects
  useEffect(() => {
    localStorage.setItem('boutique-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('boutique-invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('boutique-offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('boutique-customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('boutique-sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('boutique-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('boutique-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('boutique-backups', JSON.stringify(backups));
  }, [backups]);

  // Responsive sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Persistent Dark Mode state (Deprecated - Forced Cream Theme)
  const darkMode = false;

  // Keep dark mode cleaned
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Persistent User profile state
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('boutique-user-profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Safe fallback
      }
    }
    return {
      firstName: 'Alex',
      lastName: 'Sterling',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      phone: '+1 809-555-7777'
    };
  });

  // Custom high-end Toast notification manager state
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: 'success' | 'amber' | 'error' }>>([]);

  const showToast = (title: string, message: string, type: 'success' | 'amber' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Auto-dismiss in 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleToggleDarkMode = () => {
    showToast('Estilo Exclusivo', 'Duckleem Manager emplea este exclusivo tema crema de alta gama.', 'success');
  };

  const handleUpdateProfile = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    localStorage.setItem('boutique-user-profile', JSON.stringify(updatedProfile));
  };

  const handleAddNewInvoice = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
  };

  const handleDeductStock = (productId: string, qty: number) => {
    setProducts(prev => {
      let isDepleted = false;
      let isLow = false;
      let pName = '';
      let remainingStock = 0;

      const next = prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock - qty);
          pName = p.name;
          remainingStock = newStock;
          if (newStock === 0) {
            isDepleted = true;
          } else if (newStock <= p.criticalLimit) {
            isLow = true;
          }
          return { ...p, stock: newStock };
        }
        return p;
      });

      // Trigger dynamic toast notifications for depleted or low stock
      if (isDepleted) {
        showToast('¡Producto Agotado!', `El artículo "${pName}" se ha quedado sin stock físico en tienda.`, 'error');
      } else if (isLow) {
        showToast('Stock Crítico', `Alerta: "${pName}" está en nivel crítico (${remainingStock} unids. restantes).`, 'amber');
      }

      return next;
    });
  };

  const handleRestockProduct = (productId: string, qty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: p.stock + qty };
      }
      return p;
    }));
  };

  const handleUpdateStock = (productId: string, exactQty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, exactQty) };
      }
      return p;
    }));
  };

  const handleUpdateProduct = (productId: string, fields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, ...fields };
      }
      return p;
    }));
  };

  const handleUpdateInvoice = (invoiceId: string, fields: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, ...fields };
      }
      return inv;
    }));
  };

  const handleMarkInvoiceAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'Paid', daysOverdue: 0 };
      }
      return inv;
    }));
    showToast('Cobro Procesado', `Se marcó la factura ${invoiceId} como pagada.`, 'success');
  };

  // Sidebar count of pending collection accounts
  const pendingInvoicesCount = invoices.filter(inv => inv.status === 'Pending').length;

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <DashboardScreen
              products={products}
              invoices={invoices}
              onNavigate={setCurrentScreen}
              onRestockProduct={handleRestockProduct}
              profile={profile}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          </motion.div>
        );
      case 'billing':
        return (
          <motion.div
            key="billing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col bg-white dark:bg-slate-900"
          >
            <BillingScreen
              products={products}
              onAddNewInvoice={handleAddNewInvoice}
              onDeductStock={handleDeductStock}
              onShowToast={showToast}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onNavigate={setCurrentScreen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              profile={profile}
            />
          </motion.div>
        );
      case 'inventory':
        return (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <InventoryScreen
              products={products}
              onAddProduct={(p) => {
                setProducts([p, ...products]);
                showToast('Producto Añadido', `El producto ${p.name} se registró con éxito.`, 'success');
              }}
              onRestockProduct={handleRestockProduct}
              onUpdateStock={handleUpdateStock}
              onUpdateProduct={handleUpdateProduct}
              profile={profile}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onNavigate={setCurrentScreen}
            />
          </motion.div>
        );
      case 'receivables':
        return (
          <motion.div
            key="receivables"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <ReceivablesScreen
              invoices={invoices}
              onMarkInvoiceAsPaid={handleMarkInvoiceAsPaid}
              onUpdateInvoice={handleUpdateInvoice}
              profile={profile}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onNavigate={setCurrentScreen}
            />
          </motion.div>
        );
      case 'offers':
        return (
          <motion.div
            key="offers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <OffersScreen
              offers={offers}
              onAddOffer={(o) => {
                setOffers([o, ...offers]);
                showToast('Oferta Creada', `Se creó la oferta "${o.title}" con éxito.`, 'success');
              }}
              onToggleActiveOffer={(id) => {
                setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
              }}
              onDeleteOffer={(id) => {
                setOffers(prev => prev.filter(o => o.id !== id));
                showToast('Oferta Eliminada', 'Se eliminó la oferta.', 'amber');
              }}
              profile={profile}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          </motion.div>
        );
      case 'customers':
        return (
          <motion.div
            key="customers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <CustomersScreen
              customers={customers}
              onAddCustomer={(c) => {
                setCustomers([c, ...customers]);
                showToast('Cliente Registrado', `Se registró a ${c.name} en el directorio.`, 'success');
              }}
              onUpdateCustomer={(id, fields) => {
                setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
                showToast('Cliente Actualizado', 'Los datos del comprador fuesen modificados.', 'success');
              }}
              onDeleteCustomer={(id) => {
                setCustomers(prev => prev.filter(c => c.id !== id));
                showToast('Cliente Removido', 'Se eliminó al cliente de los directorios.', 'amber');
              }}
              darkMode={darkMode}
            />
          </motion.div>
        );
      case 'sales':
        return (
          <motion.div
            key="sales"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <SalesScreen
              sales={sales}
              products={products}
              onUpdateSaleStatus={(id, status) => {
                setSales(prev => prev.map(s => s.id === id ? { ...s, status } : s));
                showToast('Venta Actualizada', `La venta se marcó como ${status}.`, 'amber');
              }}
              onRestockProduct={(pName, qty) => {
                setProducts(prev => prev.map(p => p.name.toLowerCase() === pName.toLowerCase() ? { ...p, stock: p.stock + qty } : p));
              }}
            />
          </motion.div>
        );
      case 'expenses':
        return (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <ExpensesScreen
              expenses={expenses}
              onAddExpense={(e) => {
                setExpenses([e, ...expenses]);
                showToast('Egresos Registrado', `Se archivó el gasto por: ${e.description}.`, 'success');
              }}
              onUpdateExpense={(id, fields) => {
                setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e));
                showToast('Gasto Actualizado', 'Gasto modificado exitosamente.', 'success');
              }}
              onDeleteExpense={(id) => {
                setExpenses(prev => prev.filter(e => e.id !== id));
                showToast('Gasto Removido', 'Se canceló el registro del egreso.', 'amber');
              }}
            />
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div
            key="reports"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <ReportsScreen
              sales={sales}
              expenses={expenses}
              products={products}
            />
          </motion.div>
        );
      case 'users':
        return (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <UsersManagementScreen
              users={users}
              onAddUser={(u) => {
                setUsers([u, ...users]);
                showToast('Colaborador Registrado', `Se dio de alta a ${u.name}.`, 'success');
              }}
              onUpdateUser={(id, fields) => {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
                showToast('Usuario Configurado', 'Privilegios y credenciales actualizados.', 'success');
              }}
              onDeleteUser={(id) => {
                setUsers(prev => prev.filter(u => u.id !== id));
                showToast('Colaborador Removido', 'Se quitó el acceso al usuario.', 'amber');
              }}
            />
          </motion.div>
        );
      case 'backup':
        return (
          <motion.div
            key="backup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <BackupScreen
              backups={backups}
              onCreateBackup={() => {
                const id = 'BKP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
                const newBkp: Backup = {
                  id,
                  fileName: `duckleem_snap_${new Date().toISOString().split('T')[0]}_${Math.random().toString(36).substring(2, 5)}.json`,
                  fileSize: `${Math.round(40 + Math.random() * 15)} KB`,
                  date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  totalSales: sales.length,
                  totalRevenue: sales.reduce((acc, curr) => curr.status !== 'Cancelada' ? acc + curr.totalAmount : acc, 0),
                  itemsSold: sales.reduce((acc, curr) => curr.status !== 'Cancelada' ? acc + curr.items.reduce((s, it) => s + it.quantity, 0) : acc, 0)
                };
                setBackups([newBkp, ...backups]);
                showToast('Backup Generado', `Se creó el punto de restauración listo para descargar.`, 'success');
              }}
              onDeleteBackup={(id) => {
                setBackups(prev => prev.filter(b => b.id !== id));
                showToast('Backup Eliminado', 'Se purgó el snapshot corporativo.', 'amber');
              }}
              onRestoreFromBackupData={(jsonStr) => {
                try {
                  const parsed = JSON.parse(jsonStr);
                  if (parsed.products) setProducts(JSON.parse(parsed.products));
                  if (parsed.invoices) setInvoices(JSON.parse(parsed.invoices));
                  if (parsed.offers) setOffers(JSON.parse(parsed.offers));
                  if (parsed.customers) setCustomers(JSON.parse(parsed.customers));
                  if (parsed.sales) setSales(JSON.parse(parsed.sales));
                  if (parsed.expenses) setExpenses(JSON.parse(parsed.expenses));
                  if (parsed.users) setUsers(JSON.parse(parsed.users));
                  showToast('Copia Restaurada', 'Los datos del sistema han sido restablecidos con éxito.', 'success');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1200);
                } catch (err) {
                  alert('Formato de archivo corrupto o inválido.');
                }
              }}
            />
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col"
          >
            <ProfileScreen
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onShowToast={showToast}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onNavigate={setCurrentScreen}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // If on login, do not render side frame elements containing the system navigation rail
  if (currentScreen === 'login') {
    return <LoginScreen onLogin={(userProfile) => {
      const mergedProfile = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        email: userProfile.email,
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      };
      handleUpdateProfile(mergedProfile);
      setCurrentScreen('dashboard');
      showToast('¡Sesión Iniciada!', `Bienvenido de vuelta, ${userProfile.firstName}.`, 'success');
    }} />;
  }

  return (
    <div 
      id="app-root-frame" 
      className={`min-h-screen flex text-slate-800 transition-colors ${darkMode ? 'dark bg-slate-950 text-slate-200' : 'bg-[#FAF5EC] text-slate-800'}`}
    >
      
      {/* Toast Notification Container Stack */}
      <div 
        id="toast-notification-hub"
        className="fixed top-4 right-4 z-[99] flex flex-col gap-2 max-w-sm w-full p-4 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`p-3.5 rounded-xl border shadow-2xl flex gap-3 pointer-events-auto items-center ${
                t.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900 text-rose-970 dark:text-rose-100'
                  : t.type === 'amber'
                    ? 'bg-amber-50 dark:bg-amber-955 border-amber-200 dark:border-amber-900 text-amber-970 dark:text-amber-100'
                    : 'bg-emerald-50 dark:bg-emerald-955 border-emerald-200 dark:border-emerald-900 text-emerald-970 dark:text-emerald-100'
              }`}
            >
              <div className="shrink-0 text-sm select-none">
                {t.type === 'error' ? '🔴' : t.type === 'amber' ? '⚠️' : '🟢'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs font-sans tracking-tight leading-none">{t.title}</h4>
                <p className="text-[10px] mt-1 font-sans leading-relaxed opacity-90">{t.message}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setToasts(prev => prev.filter(item => item.id !== t.id));
                }}
                className="hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded-md text-slate-400 hover:text-slate-650 cursor-pointer text-[10px] select-none shrink-0"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Centered navigation sidebar with theme overrides */}
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
        pendingInvoicesCount={pendingInvoicesCount}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        profile={profile}
      />

      {/* Main Workspace Frame container offset by sidebar width (240px / md:pl-60) */}
      <main className="ml-0 md:ml-60 flex-grow flex flex-col min-h-screen w-full overflow-x-hidden">
        <div className="flex-grow flex flex-col w-full h-full">
          
          {/* Main active screen */}
          <div className="flex-grow flex flex-col min-w-0">
            <AnimatePresence mode="wait">
              {renderActiveScreen()}
            </AnimatePresence>
          </div>

        </div>
      </main>

    </div>
  );
}
