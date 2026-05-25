import React, { useState } from 'react';
import { Product, CartItem, Invoice, Screen } from '../types';
import { Header } from './Header';
import { 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  FileText, 
  Printer, 
  X,
  Filter
} from 'lucide-react';

interface BillingScreenProps {
  products: Product[];
  onAddNewInvoice: (invoice: Invoice) => void;
  onDeductStock: (productId: string, qty: number) => void;
  onShowToast?: (title: string, message: string, type: 'success' | 'amber' | 'error') => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onNavigate?: (screen: Screen) => void;
  onToggleSidebar?: () => void;
  profile?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    phone: string;
  };
}

export const BillingScreen: React.FC<BillingScreenProps> = ({
  products,
  onAddNewInvoice,
  onDeductStock,
  onShowToast: onShowToastProp,
  darkMode = false,
  onToggleDarkMode,
  onNavigate,
  onToggleSidebar,
  profile
}) => {
  const onShowToast = onShowToastProp || ((title: string, message: string, type: 'success' | 'amber' | 'error') => {});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');
  
  // Checkout Form Details
  const [customerName, setCustomerName] = useState('Cliente General');
  const [customerAddress, setCustomerAddress] = useState('Calle Lorenzo Despradel No. 36, Los Prados');
  const [customerPhone, setCustomerPhone] = useState('+1 809-555-7777');
  const [customerEmail, setCustomerEmail] = useState('cliente@shop.dom');
  const [customerIdentification, setCustomerIdentification] = useState('RNC 131-00000-0');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<string>('Efectivo');

  // Interactive Adding Product Popup state
  const [activeAddingProduct, setActiveAddingProduct] = useState<Product | null>(null);
  const [addQtyValue, setAddQtyValue] = useState<number>(1);
  const [addDiscountValue, setAddDiscountValue] = useState<number>(0);

  // Alegra PDF Dialog Trigger
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [renderedInvoice, setRenderedInvoice] = useState<Invoice | null>(null);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // POS Actions
  const handleProductSelection = (product: Product) => {
    if (product.stock <= 0) {
      onShowToast('Agotado', `El producto ${product.name} no tiene existencias en stock.`, 'error');
      return;
    }
    setActiveAddingProduct(product);
    setAddQtyValue(1);
    setAddDiscountValue(0);
  };

  const addToCartWithQty = (product: Product, qtyToAdd: number, discount: number) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      const newQty = existing.quantity + qtyToAdd;
      if (newQty > product.stock) {
        onShowToast('Stock insuficiente', `La cantidad agregada (${newQty}) excede el stock disponible (${product.stock}).`, 'amber');
        return;
      }
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: newQty, discount: Math.max(item.discount, discount) } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: qtyToAdd, discount }]);
    }
    onShowToast('Producto Agregado', `¡${qtyToAdd}x de ${product.name} fue agregado correctamenete!`, 'success');
  };

  const updateQuantity = (productId: string, val: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;
    
    const newQty = item.quantity + val;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.product.id !== productId));
      onShowToast('Eliminado', `${item.product.name} fue removido del carrito.`, 'success');
    } else {
      if (newQty > item.product.stock) {
        onShowToast('Límite de Stock', `Solo hay ${item.product.stock} unidades en existencia.`, 'amber');
        return;
      }
      setCart(cart.map(i => 
        i.product.id === productId 
          ? { ...i, quantity: newQty } 
          : i
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(cart.filter(i => i.product.id !== productId));
    if (item) {
      onShowToast('Eliminado', `${item.product.name} fue removido de la facturación.`, 'success');
    }
  };

  // Cart Totals
  const subTotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.price * item.quantity;
    const discountAmt = itemPrice * (item.discount / 100);
    return sum + (itemPrice - discountAmt);
  }, 0);
  const tax = subTotal * 0.18; // Standard 18% ITBIS
  const totalVal = subTotal + tax;

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      onShowToast('Facturación Fallida', 'No se puede registrar una factura sin productos en el carrito.', 'error');
      return;
    }

    const nInvoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDateStr = new Date().toISOString().split('T')[0];
    const displaySeller = profile ? `${profile.firstName} ${profile.lastName}` : 'Alex Sterling';

    const newInvoice: Invoice = {
      id: nInvoiceNumber,
      customerName: customerName || 'Cliente General',
      customerAddress: customerAddress,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
      customerIdentification: customerIdentification,
      date: currentDateStr,
      dueDate: currentDateStr,
      items: cart.map(item => ({
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        discount: item.discount,
        amount: (item.product.price * item.quantity) * (1 - item.discount / 100)
      })),
      seller: displaySeller,
      totalAmount: totalVal,
      daysOverdue: paymentStatus === 'Pending' ? 1 : 0,
      status: paymentStatus,
      paymentMethod: paymentMethod
    };

    // Trigger deductions on products
    cart.forEach(item => {
      onDeductStock(item.product.id, item.quantity);
    });

    onAddNewInvoice(newInvoice);
    setRenderedInvoice(newInvoice);
    setCart([]);
    onShowToast('Factura Registrada', `Venta registrada de manera exitosa bajo el folio ${nInvoiceNumber}.`, 'success');
    
    // Automatically open invoice view modal
    setShowInvoiceModal(true);
  };

  const handleViewMockInvoice = () => {
    const displaySeller = profile ? `${profile.firstName} ${profile.lastName}` : 'Alex Sterling';
    const mockupInvoice: Invoice = {
      id: 'INV-2377',
      customerName: customerName || 'Cliente General',
      customerAddress: customerAddress || '',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || 'mensajerodecompra@gmail.com',
      customerIdentification: customerIdentification || '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: cart.length > 0 ? cart.map(item => ({
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        discount: item.discount,
        amount: (item.product.price * item.quantity) * (1 - item.discount / 100)
      })) : [
        { productName: 'Crop-top Especial Verde', price: 2000.00, quantity: 1, discount: 0, amount: 2000.00 }
      ],
      seller: displaySeller,
      totalAmount: cart.length > 0 ? totalVal : 2000.00,
      daysOverdue: 0,
      status: 'Paid',
      paymentMethod: paymentMethod
    };
    
    setRenderedInvoice(mockupInvoice);
    setShowInvoiceModal(true);
  };

  return (
    <div id="billing-workspace-div" className="flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      <Header 
        title="Módulo de Facturación POS" 
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onNavigate={onNavigate}
        profile={profile}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Mobile/Tablet Tab Switcher */}
      <div id="pos-mobile-tabs" className="lg:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20 shrink-0 select-none">
        <button
          id="btn-pos-tab-catalog"
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
            mobileTab === 'catalog' 
              ? 'border-sky-500 text-sky-500 bg-sky-50/10' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Catálogo ({filteredProducts.length})
        </button>
        <button
          id="btn-pos-tab-cart"
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === 'cart' 
              ? 'border-sky-500 text-sky-500 bg-sky-50/10' 
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Factura Actual
          {cart.length > 0 && (
            <span className="bg-sky-500 text-white text-[10px] rounded-full px-2 py-0.5 font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <section className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden lg:max-h-[calc(100vh-4rem)]">
        
        {/* LEFT: Product Selector Grid */}
        <div className={`w-full lg:w-2/3 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors ${mobileTab === 'catalog' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Search controls & filter tabs */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Seleccionar Productos</h2>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                Catálogo: {products.length} Items
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  id="search-pos-input"
                  type="text"
                  placeholder="Filtrar catálogo por nombre, ID o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-sans"
                />
              </div>

              {/* Categorization controls */}
              <select
                id="billing-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none focus:border-sky-500 transition-all cursor-pointer"
              >
                <option value="All Categories">Todas las Categorías</option>
                <option value="Camisas">Camisas</option>
                <option value="Gorras">Gorras</option>
                <option value="Crop-top">Crop-top</option>
                <option value="Abrigos">Abrigos</option>
                <option value="Pulseras">Pulseras</option>
              </select>
            </div>
          </div>

          {/* Catalog grid representation */}
          <div id="pos-product-grid" className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[350px]">
            {filteredProducts.map((p) => {
              const isLowStock = p.stock <= p.criticalLimit;
              const isOut = p.stock === 0;

              return (
                <div
                  key={p.id}
                  id={`product-card-${p.id}`}
                  onClick={() => handleProductSelection(p)}
                  className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div className="h-28 overflow-hidden relative border-b border-slate-100 dark:border-slate-805 bg-slate-50 dark:bg-slate-950 flex items-center justify-center select-none">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Stock level badge overlay */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-wider ${
                      isOut 
                        ? 'bg-rose-500' 
                        : isLowStock 
                          ? 'bg-amber-500/90' 
                          : 'bg-slate-900/80 backdrop-blur-xs'
                    }`}>
                      {isOut ? 'Agotado' : `Stock: ${p.stock}`}
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5 flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{p.id}</p>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 group-hover:text-[#38bdf8] transition-colors">{p.name}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        RD${p.price.toFixed(2)}
                      </span>
                      <span className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0f172a] dark:group-hover:bg-sky-500 group-hover:text-white transition-all text-slate-600 dark:text-slate-400">
                        <Plus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT: POS Sale cart summary & forms */}
        <div className={`w-full lg:w-1/3 flex flex-col bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800/80 transition-colors ${mobileTab === 'cart' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Main heading */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-[#0f172a] dark:text-slate-100 tracking-tight uppercase">Factura Actual</h2>
              <span className="text-[9px] uppercase font-bold tracking-widest bg-[#0f172a] dark:bg-sky-600 text-sky-400 dark:text-white px-2.5 py-0.5 rounded-full">
                POS REGISTRY
              </span>
            </div>

            {/* Customer form inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-cust-name2">
                    Cliente
                  </label>
                  <input
                    id="pos-cust-name2"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-cust-id2">
                    RNC / Identificación
                  </label>
                  <input
                    id="pos-cust-id2"
                    type="text"
                    value={customerIdentification}
                    placeholder="e.g. 001-00000-0"
                    onChange={(e) => setCustomerIdentification(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-cust-phone2">
                    Teléfono
                  </label>
                  <input
                    id="pos-cust-phone2"
                    type="text"
                    value={customerPhone}
                    placeholder="e.g. 809-555-7777"
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-cust-email2">
                    Correo
                  </label>
                  <input
                    id="pos-cust-email2"
                    type="email"
                    value={customerEmail}
                    placeholder="cliente@email.com"
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-cust-address2">
                  Dirección
                </label>
                <input
                  id="pos-cust-address2"
                  type="text"
                  value={customerAddress}
                  placeholder="e.g. Los Prados, Santo Domingo"
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-pay-status2">
                    Estado de Pago
                  </label>
                  <select
                    id="pos-pay-status2"
                    value={paymentStatus}
                    onChange={(e: any) => setPaymentStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Paid">Pagado</option>
                    <option value="Pending">Pendiente de Cobro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold" htmlFor="pos-pay-method2">
                    Método de Pago
                  </label>
                  <select
                    id="pos-pay-method2"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Item rows list */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 min-h-[160px]">
            {cart.length === 0 ? (
              <div className="h-full py-10 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Printer className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">El carrito está vacío</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-[180px]">Seleccione productos del catálogo a la izquierda para armar la factura.</p>
              </div>
            ) : (
              cart.map((item) => {
                const totalItemPrice = item.product.price * item.quantity;
                const appliedDiscount = totalItemPrice * (item.discount / 100);
                const finalItemAmt = totalItemPrice - appliedDiscount;
                
                return (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded object-cover border border-slate-100 dark:border-slate-800 shrink-0 select-none"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate leading-none">{item.product.name}</h4>
                      <p className="text-[9px] text-[#3d8ef8] dark:text-[#38bdf8] font-bold mt-1 tracking-wider">
                        {item.product.id} • RD${item.product.price.toFixed(2)}
                        {item.discount > 0 && <span className="ml-1 px-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded text-[8px] font-sans font-bold">-{item.discount}% Desc</span>}
                      </p>
                    </div>

                    {/* Quantity trigger adjusters */}
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-md p-1 shrink-0 select-none">
                      <button
                        id={`btn-minus-${item.product.id}`}
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-4.5 h-4.5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer font-bold text-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-[10px] font-bold w-4 text-center text-slate-800 dark:text-slate-200">{item.quantity}</span>
                      <button
                        id={`btn-plus-${item.product.id}`}
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-4.5 h-4.5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded cursor-pointer font-bold text-xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Pricing and trash action */}
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        RD${finalItemAmt.toFixed(2)}
                      </p>
                      <button
                        id={`btn-trash-${item.product.id}`}
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[9px] text-rose-500 font-semibold hover:underline cursor-pointer flex items-center gap-0.5 mt-0.5"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary receipt checkout triggers */}
          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-4 shadow-[0_-4px_16px_rgba(15,23,42,0.03)] transition-colors">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold">
                <span>Subtotal</span>
                <span className="font-mono">RD${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold">
                <span>ITBIS / Impuesto (18%)</span>
                <span className="font-mono">RD${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Total Facturado</span>
                <span className="text-sm font-mono font-bold text-[#0f172a] dark:text-white">
                  RD${totalVal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions CTA triggers */}
            <div className="flex flex-col gap-2">
              <button
                id="btn-pos-finalize-sale"
                type="submit"
                onClick={handleFinalizeSale}
                className="w-full py-2.5 bg-[#0f172a] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs uppercase tracking-wider"
              >
                <CheckCircle className="w-4 h-4 text-sky-400 dark:text-white" />
                <span>Registrar Factura</span>
              </button>

              <button
                id="btn-pos-download-receipt"
                onClick={handleViewMockInvoice}
                className="w-full py-2 border border-[#0f172a] dark:border-slate-700 text-[#0f172a] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4 text-sky-605" />
                <span>Elegra Vista Previa PDF</span>
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* DETAILED INTERACTIVE PRODUCT SELECTION OVERLAY MODAL */}
      {activeAddingProduct && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex justify-center items-center z-55 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full border border-slate-205 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100">
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-955">
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wide font-sans">Añadir a la Factura</h3>
              <button 
                onClick={() => setActiveAddingProduct(null)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Product interactive image container */}
              <div className="relative h-44 w-full rounded-lg overflow-hidden border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <img 
                  src={activeAddingProduct.imageUrl} 
                  alt={activeAddingProduct.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 right-2 bg-slate-900/85 backdrop-blur-xs text-sky-400 font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-slate-800">
                  Stock Físico: {activeAddingProduct.stock} unidades
                </span>
              </div>

              <div>
                <p className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">{activeAddingProduct.id}</p>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight mt-0.5">{activeAddingProduct.name}</h4>
                <p className="text-xs text-sky-600 dark:text-sky-450 font-bold mt-0.5 font-mono">RD${activeAddingProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>

              {/* Form quantity & discount modifiers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setAddQtyValue(prev => Math.max(1, prev - 1))}
                      className="w-6 h-6 flex items-center justify-center text-slate-650 dark:text-slate-450 hover:bg-slate-200 dark:hover:bg-slate-800 rounded cursor-pointer font-bold text-sm select-none"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={activeAddingProduct.stock}
                      value={addQtyValue}
                      onChange={(e) => setAddQtyValue(Math.min(activeAddingProduct.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="flex-1 text-center font-bold font-sans text-xs text-slate-800 dark:text-slate-100 bg-transparent outline-none w-8"
                    />
                    <button
                      type="button"
                      onClick={() => setAddQtyValue(prev => Math.min(activeAddingProduct.stock, prev + 1))}
                      className="w-6 h-6 flex items-center justify-center text-slate-650 dark:text-slate-450 hover:bg-slate-200 dark:hover:bg-slate-800 rounded cursor-pointer font-bold text-sm select-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-semibold">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={addDiscountValue}
                    onChange={(e) => setAddDiscountValue(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-201 dark:border-slate-805 rounded-lg px-2.5 py-1.5 text-xs text-center font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Subtotal preview container */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 p-2.5 rounded-lg flex justify-between items-center text-xs">
                <span className="text-slate-400 dark:text-slate-550 font-semibold font-sans">Subtotal Neto</span>
                <span className="font-bold text-slate-800 dark:text-white font-mono">
                  RD${((activeAddingProduct.price * addQtyValue) * (1 - addDiscountValue / 100)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAddingProduct(null)}
                  className="flex-1 py-1.5 text-xs border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 font-bold rounded-lg cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCartWithQty(activeAddingProduct, addQtyValue, addDiscountValue);
                    setActiveAddingProduct(null);
                  }}
                  className="flex-1 py-1.5 bg-[#0f172a] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wider"
                >
                  Añadir
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ALEGRA PDF INVOICE MOCKUP MODAL DIALOG */}
      {showInvoiceModal && renderedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-55 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] text-slate-800">
            
            {/* Modal actions bars */}
            <div className="bg-[#0f172a] text-white p-4 px-6 flex justify-between items-center rounded-t-xl shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="text-sky-400 w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm tracking-tight font-sans">Alegra Invoice Template Preview</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{renderedInvoice.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  id="btn-print-real"
                  onClick={() => alert('Impresión de factura iniciada éxitosamente. Todos los folios sincro.')}
                  className="bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button
                  id="btn-close-invoice-modal"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content Frame (Strict Alegra replica mockup style) */}
            <div className="p-4 md:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex-1 flex justify-center transition-colors">
              
              {/* Invoice Layout Sheet */}
              <div 
                id="alegra-invoice-sheet" 
                className="bg-white border border-slate-300 w-full max-w-[800px] p-4 md:p-10 flex flex-col justify-between shadow-lg relative min-h-[1050px] font-sans text-slate-800"
              >
                
                {/* Horizontal / Vertical Alegra line badge */}
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#9ca3af] font-bold rotate-90 origin-right translate-x-[150px] select-none tracking-wider uppercase hidden md:inline">
                  Facturación realizada con Alegra www.alegra.com
                </span>

                <div>
                  
                  {/* Top Block: Brand Header & Invoice Badge */}
                  <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    
                    {/* Brand & Address */}
                    <div className="space-y-3">
                      {/* Logo duck layout */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 border-2 border-slate-700 rounded-full flex items-center justify-center p-1.5 shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="none" stroke="currentColor" strokeWidth="6">
                            <path d="M 30,50 C 40,40 50,40 55,25 C 60,28 65,33 70,30 C 75,25 78,15 75,5 C 65,10 55,5 45,15 C 35,25 25,35 15,55 C 20,65 35,70 50,75 C 65,80 80,75 90,60 C 80,55 70,60 55,50 Z" />
                            <circle cx="58" cy="18" r="4" fill="currentColor" />
                          </svg>
                        </div>
                        <div>
                          <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Duckleem Boutique</h1>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Retail Master</p>
                        </div>
                      </div>

                      {/* Contact metadata */}
                      <div className="text-[11px] text-slate-600 space-y-0.5 leading-snug">
                        <p className="font-bold">LORENZO DESPRADEL NO.36 PLAZA DM 3 - DO - LOS PRADOS</p>
                        <p className="font-semibold">Teléfono: +1 809-555-7777</p>
                        <p className="text-slate-550 font-mono">mkduckleem@gmail.com</p>
                      </div>
                    </div>

                    {/* Invoice ID Block */}
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">FACOLA REGISTRO FISCAL</p>
                      <h2 className="text-[#0f172a] text-xl font-semibold">Folio: {renderedInvoice.id.replace('#', '')}</h2>
                    </div>

                  </div>

                  {/* Middle Block: BILL TO & Dates Grid details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
                    
                    {/* Bill To table border matrix */}
                    <div className="md:col-span-8 border border-slate-300">
                      <div className="grid grid-cols-4 divide-x divide-slate-300">
                        <div className="bg-slate-100 p-2.5 text-[9px] font-bold text-slate-700 uppercase col-span-1">ADQUIRIENTE</div>
                        <div className="p-2.5 text-[11px] font-bold text-slate-900 col-span-3">{renderedInvoice.customerName}</div>
                      </div>

                      <div className="border-t border-slate-300 grid grid-cols-4 divide-x divide-slate-300">
                        <div className="bg-slate-105 p-2 text-[9px] font-bold text-slate-600 uppercase col-span-1">DIRECCIÓN</div>
                        <div className="p-2 text-[11px] text-slate-700 col-span-3">{renderedInvoice.customerAddress || 'Plaza DM, Los Prados, Santo Domingo, R.D.'}</div>
                      </div>

                      <div className="border-t border-slate-300 grid grid-cols-4 divide-x divide-slate-300">
                        <div className="bg-slate-105 p-2 text-[9px] font-bold text-slate-600 uppercase col-span-1">TELEFONO</div>
                        <div className="p-2 text-[11px] text-slate-700 col-span-3">{renderedInvoice.customerPhone || '+1 809-555-7777'}</div>
                      </div>

                      <div className="border-t border-slate-300 grid grid-cols-4 divide-x divide-slate-300">
                        <div className="bg-slate-105 p-2 text-[9px] font-bold text-slate-600 uppercase col-span-1 leading-snug">RNC / IDENTIFICACIÓN</div>
                        <div className="p-2 text-[11px] font-mono font-bold text-slate-800 col-span-3">{renderedInvoice.customerIdentification || 'RNC 131-00000-0'}</div>
                      </div>
                    </div>

                    {/* Dates Card Grid */}
                    <div className="md:col-span-4 border border-slate-300 h-fit">
                      <div className="bg-slate-100 p-1.5 text-center text-[9px] font-bold text-slate-700 uppercase border-b border-slate-300">
                        FECHA DE EXPEDICIÓN
                      </div>
                      <div className="p-1 px-2 text-center text-[11px] font-bold text-slate-800">
                        {renderedInvoice.date.replace(/-/g, '/')}
                      </div>

                      <div className="bg-slate-100 p-1.5 text-center text-[9px] font-bold text-slate-700 uppercase border-y border-slate-300">
                        VENCIMIENTO
                      </div>
                      <div className="p-1 px-2 text-center text-[11px] font-bold text-slate-800">
                        {renderedInvoice.dueDate.replace(/-/g, '/')}
                      </div>
                    </div>

                  </div>

                  {/* Main Line Items Table */}
                  <div className="border border-slate-300 mb-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-semibold text-slate-700">
                          <th className="p-3 uppercase">Producto / Detalle</th>
                          <th className="p-3 uppercase text-right">Precio</th>
                          <th className="p-3 uppercase text-center">Cant.</th>
                          <th className="p-3 uppercase text-center">Desct.</th>
                          <th className="p-3 uppercase text-right">Monto Neto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-250 text-[12px] text-slate-800">
                        {renderedInvoice.items.map((lineItem, idx) => {
                          const matchingProduct = products.find(p => p.name === lineItem.productName);
                          return (
                            <tr key={idx}>
                              <td className="p-3 font-medium text-slate-900">
                                <div className="flex items-center gap-2">
                                  {matchingProduct && (
                                    <img
                                      src={matchingProduct.imageUrl}
                                      alt={lineItem.productName}
                                      referrerPolicy="no-referrer"
                                      className="w-8 h-8 rounded object-cover border border-slate-100 shrink-0 select-none"
                                    />
                                  )}
                                  <span>{lineItem.productName}</span>
                                </div>
                              </td>
                              <td className="p-3 text-right font-mono font-medium">RD${lineItem.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td className="p-3 text-center font-mono">{lineItem.quantity}</td>
                              <td className="p-3 text-center text-slate-400 font-mono">
                                {lineItem.discount > 0 ? `${lineItem.discount}%` : '0%'}
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-slate-900">RD${lineItem.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Bottom section totals mapping */}
                <div className="mt-auto">
                  <div className="flex justify-end">
                    <div className="w-64 border border-slate-300 text-xs shadow-sm bg-slate-50">
                      <div className="flex justify-between p-2.5 border-b border-slate-201">
                        <span className="font-semibold text-slate-500 uppercase text-[9px]">Sub-Total</span>
                        <span className="font-mono font-semibold text-slate-800">
                          RD${(renderedInvoice.totalAmount / 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-100">
                        <span className="font-bold text-slate-700 uppercase text-[9px]">Total Facturado (con ITBIS)</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          RD${renderedInvoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment details block footer */}
                  <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-450">
                    <p>Operaciones Comerciales R.D. • Contribuyente Fiscal Autorizado</p>
                    <p className="font-bold text-sky-600 font-mono uppercase tracking-wider">Pago en: {renderedInvoice.paymentMethod}</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
