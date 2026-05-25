export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'billing' 
  | 'inventory' 
  | 'receivables' 
  | 'customers' 
  | 'sales' 
  | 'expenses' 
  | 'reports' 
  | 'offers' 
  | 'profile' 
  | 'users' 
  | 'backup';

export interface Product {
  id: string; // AP-2042, etc.
  name: string;
  price: number; // Precio final
  originalPrice?: number; // Precio inicial
  stock: number;
  category: 'Camisas' | 'Gorras' | 'Crop-top' | 'Abrigos' | 'Pulseras';
  imageUrl: string;
  criticalLimit: number;
  costPrice?: number; // Costo para ganancias
}

export interface Customer {
  id: string;
  name: string;
  rnc: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  balance: number;
  active: boolean;
}

export interface Sale {
  id: string;
  invoiceId: string;
  customerName: string;
  seller: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'Completada' | 'Cancelada' | 'Reembolsada';
  date: string;
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
    amount: number;
  }>;
}

export interface Expense {
  id: string;
  category: 'Telas' | 'Lavada/Plancha' | 'Bordado' | 'Gorras' | 'Otros';
  description: string;
  amount: number;
  provider: string;
  invoiceNumber?: string;
  paymentMethod: string;
  date: string;
  notes?: string;
}

export interface Backup {
  id: string;
  fileName: string;
  fileSize: string;
  date: string;
  totalSales: number;
  totalRevenue: number;
  itemsSold: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'empleado' | 'seller';
  active: boolean;
}


export interface Offer {
  id: string;
  title: string;
  discountPercentage: number;
  category: 'Camisas' | 'Gorras' | 'Crop-top' | 'Abrigos' | 'Pulseras' | 'Todas';
  description: string;
  imageUrl: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number; // percentage or amount
}

export interface Invoice {
  id: string; // e.g. #INV-9821
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerIdentification?: string;
  date: string;
  dueDate: string;
  description?: string; // Descripción del cobro
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
    discount: number;
    amount: number;
  }>;
  seller: string;
  totalAmount: number;
  daysOverdue: number; // 0 if paid, or positive integer if pending and overdue
  status: 'Paid' | 'Pending' | 'Partial';
  paymentMethod: string;
}

export interface Stats {
  todaySales: number;
  totalPending: number;
  lowStockAlerts: number;
  collectionRate: number; // percentage
  avgDaysToPay: number;
}

// Dominican Peso Exchange Rate
export const USD_TO_DOP = 59.50;

export function formatUSD(val: number): string {
  return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDOP(val: number): string {
  const rs = val * USD_TO_DOP;
  return rs.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' }).replace("DOP", "RD$");
}

export function formatDualPrice(val: number): string {
  return `${formatUSD(val)} / ${formatDOP(val)}`;
}

