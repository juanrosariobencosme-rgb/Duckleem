import React, { useState } from 'react';
import { Product, Invoice } from '../types';
import { Header } from './Header';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ShoppingBag, 
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  Star
} from 'lucide-react';

interface DashboardScreenProps {
  products: Product[];
  invoices: Invoice[];
  onNavigate: (s: any) => void;
  onRestockProduct: (id: string, count: number) => void;
  profile?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    phone: string;
  };
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  products,
  invoices,
  onNavigate,
  onRestockProduct,
  profile,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar
}) => {
  const [activeTab, setActiveTab2] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Day Data Structure
  const dayData = [
    { label: '08:00 AM', value: 1200, orders: 4 },
    { label: '10:05 AM', value: 3200, orders: 11 },
    { label: '12:00 PM', value: 5800, orders: 18 },
    { label: '02:00 PM', value: 4100, orders: 12 },
    { label: '04:00 PM', value: 7200, orders: 22 },
    { label: '06:00 PM', value: 6100, orders: 19 },
    { label: '08:00 PM', value: 2900, orders: 8 }
  ];

  // Week Data Structure
  const weekData = [
    { label: 'Lunes', value: 8500, orders: 25 },
    { label: 'Martes', value: 12400, orders: 38 },
    { label: 'Miércoles', value: 10200, orders: 31 },
    { label: 'Jueves', value: 15100, orders: 44 },
    { label: 'Viernes', value: 18900, orders: 56 },
    { label: 'Sábado', value: 22400, orders: 74 },
    { label: 'Domingo', value: 14200, orders: 41 }
  ];

  // Month Data Structure
  const monthData = [
    { label: 'Semana 1', value: 45000, orders: 130 },
    { label: 'Semana 2', value: 52000, orders: 148 },
    { label: 'Semana 3', value: 48000, orders: 135 },
    { label: 'Semana 4', value: 68000, orders: 192 }
  ];

  // Year Data Structure
  const yearData = [
    { label: 'Ene', value: 160000, orders: 450 },
    { label: 'Feb', value: 185000, orders: 520 },
    { label: 'Mar', value: 210000, orders: 590 },
    { label: 'Abr', value: 195000, orders: 540 },
    { label: 'May', value: 245000, orders: 680 },
    { label: 'Jun', value: 280000, orders: 790 },
    { label: 'Jul', value: 260000, orders: 720 },
    { label: 'Ago', value: 290000, orders: 810 },
    { label: 'Sep', value: 310000, orders: 880 },
    { label: 'Oct', value: 340000, orders: 950 },
    { label: 'Nov', value: 420000, orders: 1200 },
    { label: 'Dic', value: 550000, orders: 1600 }
  ];

  // Calculate dynamic sales added through standard POS workflow
  const dynamicSalesTotal = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const activeDayData = dayData.map((d, index) => {
    if (index === 4) {
      return { ...d, value: d.value + dynamicSalesTotal, orders: d.orders + invoices.length };
    }
    return d;
  });

  const activeWeekData = weekData.map(w => {
    if (w.label === 'Miércoles') {
      return { ...w, value: w.value + dynamicSalesTotal, orders: w.orders + invoices.length };
    }
    return w;
  });

  const activeMonthData = monthData.map((m, index) => {
    if (index === 2) {
      return { ...m, value: m.value + dynamicSalesTotal, orders: m.orders + invoices.length };
    }
    return m;
  });

  const activeYearData = yearData.map(y => {
    if (y.label === 'May') {
      return { ...y, value: y.value + dynamicSalesTotal, orders: y.orders + invoices.length };
    }
    return y;
  });

  const currentDataset = activeTab === 'day' 
    ? activeDayData 
    : activeTab === 'week' 
      ? activeWeekData 
      : activeTab === 'month' 
        ? activeMonthData 
        : activeYearData;

  const datasetMax = Math.max(...currentDataset.map(d => d.value)) || 1000;
  const datasetTotalRevenue = currentDataset.reduce((sum, d) => sum + d.value, 0);
  const datasetTotalOrders = currentDataset.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = datasetTotalOrders > 0 ? (datasetTotalRevenue / datasetTotalOrders) : 0;

  // Compute Stats dynamically from state
  const totalSalesVal = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0) + 12450.00; // preload with base

  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending');
  const totalPendingVal = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stock <= p.criticalLimit);
  const lowStockCount = lowStockProducts.length;

  // Let's take the top products for the sidebar
  const topProducts = [
    { name: 'Premium Silk Blazer', count: 142, max: 150 },
    { name: 'Minimalist Chelsea Boots', count: 98, max: 150 },
    { name: 'Organic Cotton Tote', count: 85, max: 150 },
    { name: 'Linen Wrap Dress', count: 74, max: 150 },
    { name: 'Merino Wool Sweater', count: 61, max: 150 },
  ];

  return (
    <div id="dashboard-screen-container" className="flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Header 
        title="Dashboard - Analíticas y Resumen" 
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onToggleSidebar={onToggleSidebar}
        onNavigate={onNavigate}
      />

      {/* Main Canvas Area */}
      <div className="p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
        
        {/* Metric Cards Row */}
        <section id="bento-metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Today's Sales Card */}
          <div 
            id="metric-today-sales"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center justify-between shadow-sm transition-colors"
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">VENTAS DE HOY</p>
              <h2 className="text-3xl font-display font-bold text-[#0f172a] dark:text-slate-100 tracking-tight">
                RD${totalSalesVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-sky-600 mt-2 font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <span>+8.2% de incremento</span>
              </p>
            </div>
            <div className="p-4 bg-sky-500/10 text-sky-600 rounded-xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
          </div>

          {/* Total Pending Card */}
          <div 
            id="metric-total-pending"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex items-center justify-between shadow-sm transition-colors"
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TOTAL PENDIENTE</p>
              <h2 className="text-3xl font-display font-bold text-[#0f172a] dark:text-slate-100 tracking-tight text-amber-600 dark:text-amber-500">
                RD${totalPendingVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                {pendingInvoices.length} Facturas por Cobrar
              </p>
            </div>
            <div className="p-4 bg-amber-500/10 text-amber-600 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          {/* Low Stock Alerts Card */}
          <div 
            id="metric-low-stock"
            className="bg-white dark:bg-slate-900 border border-[#fca5a5] dark:border-rose-950 rounded-xl p-6 flex items-center justify-between shadow-sm cursor-pointer hover:border-rose-450 dark:hover:border-rose-500 transition-colors"
            onClick={() => onNavigate('inventory')}
          >
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ALERTAS DE STOCK BAJO</p>
              <h2 className="text-3xl font-display font-bold text-rose-600 tracking-tight">
                {String(lowStockCount).padStart(2, '0')}
              </h2>
              <p className="text-xs text-rose-500 mt-2 font-semibold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>Requiere Acción</span>
              </p>
            </div>
            <div className="p-4 bg-rose-500/10 text-rose-600 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>

        </section>

        {/* Sales Progression Advanced Analytics Section */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 transition-colors text-slate-800 dark:text-slate-100">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white tracking-tight text-base font-sans flex items-center gap-2">
                <span className="w-2.5 h-5 rounded bg-[#0f172a] dark:bg-sky-500"></span>
                Analítica de Ventas
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Progreso histórico interactivo de rendimiento comercial y participación de categorías.
              </p>
            </div>

            {/* Selector de periodo tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg self-start sm:self-auto border border-slate-200 dark:border-slate-800">
              {[
                { id: 'day', label: 'Diario' },
                { id: 'week', label: 'Semanal' },
                { id: 'month', label: 'Mensual' },
                { id: 'year', label: 'Anual' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab2(tab.id as any);
                      setHoveredIndex(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer select-none ${
                      isActive 
                        ? 'bg-[#0f172a] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-[#0f172a]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Subgrid of the active tab */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">INGRESOS DEL PERIODO</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                RD${datasetTotalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PEDIDOS TOTALES</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                {datasetTotalOrders} Transacciones
              </h4>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PROMEDIO POR VENTA</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                RD${avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PICO MÁXIMO REGISTRADO</p>
              <h4 className="text-lg font-bold text-sky-600 font-mono mt-0.5 font-sans">
                RD${datasetMax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
          </div>

          {/* Grid Layout containing Timeline (Left) and Pie Donut Chart (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Timeline Column */}
            <div className="col-span-1 lg:col-span-2 relative w-full overflow-x-auto pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-3">Evolución de Ingresos</span>
              <div className="min-w-[450px] h-[240px] relative">
                <svg 
                  className="w-full h-full overflow-visible" 
                  viewBox="0 0 550 240"
                >
                  {/* Horizontal reference lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const y = 20 + ratio * 160;
                    const labelValue = datasetMax * (1 - ratio);
                    return (
                      <g key={index} className="opacity-40">
                        <line 
                          x1="55" 
                          y1={y} 
                          x2="530" 
                          y2={y} 
                          stroke="#e2e8f0" 
                          strokeWidth="1" 
                          strokeDasharray="4,4" 
                        />
                        <text 
                          x="10" 
                          y={y + 4} 
                          fill="#94a3b8" 
                          className="text-[9px] font-mono font-bold"
                        >
                          {labelValue >= 1000 ? `${(labelValue / 1000).toFixed(0)}k` : labelValue.toFixed(0)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw beautiful Bars / Lines according to tab selection */}
                  {currentDataset.map((d, idx) => {
                    const stepWidth = 475 / currentDataset.length;
                    const x = 55 + idx * stepWidth + stepWidth / 3.5;
                    const height = (d.value / datasetMax) * 160 || 4; // safety fallback height
                    const y = 180 - height;
                    const isHovered = hoveredIndex === idx;

                    return (
                      <g 
                        key={idx}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="cursor-pointer"
                      >
                        {/* Active Indicator Hover card column background */}
                        {isHovered && (
                          <rect
                            x={55 + idx * stepWidth}
                            y="10"
                            width={stepWidth}
                            height="185"
                            fill="#f8fafc"
                            rx="4"
                            className="transition-all duration-150 opacity-40 dark:opacity-5"
                          />
                        )}

                        {/* Bar Rectangle with rounded top */}
                        <rect
                          x={x}
                          y={y}
                          width={Math.max(5, stepWidth / 2.5)}
                          height={height}
                          fill={isHovered ? '#0284c7' : '#0f172a'}
                          rx="3"
                          className="transition-all duration-300 dark:fill-sky-500 dark:hover:fill-sky-400"
                        />

                        {/* Spark dots for maximum point */}
                        {d.value === datasetMax && (
                          <circle 
                            cx={x + (stepWidth / 5)} 
                            cy={y} 
                            r="3" 
                            fill="#38bdf8" 
                            className="animate-ping" 
                          />
                        )}

                        {/* X Axis Labels */}
                        <text
                          x={x + (stepWidth / 5)}
                          y="205"
                          textAnchor="middle"
                          fill={isHovered ? '#1e293b' : '#64748b'}
                          className={`text-[9px] font-sans transition-all ${isHovered ? 'font-bold' : 'font-medium'}`}
                        >
                          {d.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Bottom line axis */}
                  <line 
                    x1="55" 
                    y1="180" 
                    x2="530" 
                    y2="180" 
                    stroke="#cbd5e1" 
                    strokeWidth="1.5" 
                  />
                </svg>

                {/* Dynamic premium Tooltip content on Hover */}
                {hoveredIndex !== null && currentDataset[hoveredIndex] && (
                  <div 
                    className="absolute bg-[#0f172a]/95 text-white p-3 rounded-lg shadow-xl text-[11px] font-sans border border-slate-700 pointer-events-none transition-all duration-250 z-10"
                    style={{
                      left: `${Math.min(
                        350,
                        Math.max(
                          30,
                          55 + hoveredIndex * (475 / currentDataset.length) - 15
                        )
                      )}px`,
                      top: '20px'
                    }}
                  >
                    <p className="font-bold text-sky-400 font-mono tracking-wide">{currentDataset[hoveredIndex].label}</p>
                    <p className="mt-1 font-semibold">Ventas: <span className="font-mono text-white">RD${currentDataset[hoveredIndex].value.toLocaleString('en-US')}</span></p>
                    <p className="text-slate-400">Total Pedidos: <span className="text-white font-mono">{currentDataset[hoveredIndex].orders}</span></p>
                  </div>
                )}
              </div>
            </div>

            {/* Pie/Donut Chart Column (Pastel) */}
            <div className="col-span-1 flex flex-col justify-between pt-2 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-3">Participación por Categoría</span>
                
                {/* Math parsing for slice paths */}
                {(() => {
                  const categorySalesTotals: Record<string, number> = {};
                  invoices.forEach(inv => {
                    inv.items.forEach(it => {
                      const prod = products.find(p => p.name.toLowerCase() === it.productName.toLowerCase());
                      const cat = prod?.category || 'Otros';
                      categorySalesTotals[cat] = (categorySalesTotals[cat] || 0) + it.amount;
                    });
                  });

                  const categoriesBaseline: Record<string, number> = {
                    'Abrigos': 15600,
                    'Pulseras': 3400,
                    'Gorras': 1850,
                    'Camisas': 5440,
                    'Crop-top': 2900,
                  };

                  const mergedCategorySales = { ...categoriesBaseline };
                  Object.entries(categorySalesTotals).forEach(([cat, amt]) => {
                    mergedCategorySales[cat] = (mergedCategorySales[cat] || 0) + amt;
                  });

                  const pieData = Object.entries(mergedCategorySales).map(([label, value]) => ({
                    label,
                    value,
                  })).sort((a, b) => b.value - a.value);

                  const totalPieValue = pieData.reduce((sum, d) => sum + d.value, 0) || 1;
                  
                  let cumulativePercent = 0;
                  const pieColors = ['#0f172a', '#0284c7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                  
                  const getCoordinatesForPercent = (percent: number) => {
                    const x = Math.cos(2 * Math.PI * percent - Math.PI / 2);
                    const y = Math.sin(2 * Math.PI * percent - Math.PI / 2);
                    return [x, y];
                  };

                  const slices = pieData.map((slice, index) => {
                    const percent = slice.value / totalPieValue;
                    const startPercent = cumulativePercent;
                    cumulativePercent += percent;
                    const endPercent = cumulativePercent;

                    const [startX, startY] = getCoordinatesForPercent(startPercent);
                    const [endX, endY] = getCoordinatesForPercent(endPercent);

                    const rOuter = 65;
                    const rInner = 38;

                    const x1_out = 100 + startX * rOuter;
                    const y1_out = 100 + startY * rOuter;
                    const x2_out = 100 + endX * rOuter;
                    const y2_out = 100 + endY * rOuter;

                    const x1_in = 100 + startX * rInner;
                    const y1_in = 100 + startY * rInner;
                    const x2_in = 100 + endX * rInner;
                    const y2_in = 100 + endY * rInner;

                    const largeArcFlag = percent > 0.5 ? 1 : 0;

                    const pathData = percent >= 0.99 
                      ? `M 100 ${100 - rOuter} A ${rOuter} ${rOuter} 0 1 1 99.9 ${100 - rOuter} M 100 ${100 - rInner} A ${rInner} ${rInner} 0 1 1 99.9 ${100 - rInner}`
                      : [
                          `M ${x1_out} ${y1_out}`,
                          `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}`,
                          `L ${x2_in} ${y2_in}`,
                          `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}`,
                          `Z`
                        ].join(' ');

                    return {
                      ...slice,
                      percent: percent * 100,
                      pathData,
                      color: pieColors[index % pieColors.length]
                    };
                  });

                  return (
                    <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-4">
                      
                      {/* SVG Canvas for the pie wedges */}
                      <div className="relative w-40 h-40 shrink-0">
                        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm rotate-12">
                          <g>
                            {slices.map((s, idx) => (
                              <path 
                                key={idx} 
                                d={s.pathData} 
                                fill={s.color} 
                                className="hover:opacity-90 transition-opacity duration-150 cursor-pointer"
                                title={`${s.label}: ${s.percent.toFixed(1)}%`}
                              />
                            ))}
                            {/* Inner hole background matching theme */}
                            <circle cx="100" cy="100" r="37" className="fill-white dark:fill-slate-900" />
                          </g>
                        </svg>
                        
                        {/* Summary badge in the donut hole center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Total</span>
                          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                            ${Math.round(totalPieValue / 1000)}k
                          </span>
                        </div>
                      </div>

                      {/* Interactive responsive side Legend */}
                      <div className="flex-grow space-y-2 text-[11px] font-medium leading-tight">
                        {slices.slice(0, 5).map((s, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[90px]" title={s.label}>{s.label}</span>
                            <span className="font-mono text-slate-400 ml-auto font-bold">{s.percent.toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })()}

              </div>
            </div>

          </div>

          {/* Business Insights recommendation based on activeTab */}
          <div className="flex gap-3 bg-sky-50/50 dark:bg-slate-950/20 border border-sky-100 dark:border-slate-800 rounded-xl p-4 text-xs">
            <span className="p-1 px-2.5 rounded-full bg-sky-500/10 text-sky-600 font-bold self-start mt-0.5 font-mono">
              IA INSIGHT
            </span>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {activeTab === 'day' && 'El ritmo comercial actual muestra repuntes de compra entre las 12:00 PM y 4:00 PM. Recomendamos mantener personal de caja optimizado en esas horas.'}
              {activeTab === 'week' && 'Las ventas semanales concentran su mayor volumen los días Viernes y Sábado. La categoría "Camisas" y "Crop-top" reportan un 42% del inventario rotado.'}
              {activeTab === 'month' && 'Se observa un incremento del 15% en el total mensual acumulado intermensual. Los ingresos proyectan un cierre saludable para el periodo actual.'}
              {activeTab === 'year' && 'El rendimiento consolidado de las ventas anuales revela un impulso estacional masivo a partir del mes de Mayo con canastas de compra optimizadas.'}
            </div>
          </div>
        </section>

        {/* Top Products & Recent Invoices Section Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Top Selling Products Distribution */}
          <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white tracking-tight text-base font-sans">
                Productos Más Vendidos
              </h3>
              <button 
                id="btn-report-top"
                onClick={() => alert('Reporte de productos solicitado éxitosamente.')}
                className="text-sky-600 hover:underline text-xs font-bold"
              >
                Ver Reporte
              </button>
            </div>

            <div className="space-y-3.5">
              {topProducts.map((p) => {
                const percentage = Math.round((p.count / p.max) * 100);
                const matchedProduct = products.find(prod => prod.name.toLowerCase() === p.name.toLowerCase());
                const imageUrl = matchedProduct?.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400';
                return (
                  <div key={p.name} className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-100/70 dark:border-slate-800">
                    <div className="relative w-12 h-12 bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-201/50 dark:border-slate-700 shrink-0">
                      <img 
                        src={imageUrl} 
                        alt={p.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                      {/* Featured Gold Star Indicator */}
                      <div className="absolute -top-0.5 -right-0.5 bg-amber-400 p-0.5 rounded-full text-white shadow-xs flex items-center justify-center animate-pulse" title="Producto Destacado">
                        <Star className="w-2.5 h-2.5 fill-white stroke-none" />
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center text-xs font-semibold gap-2 mb-1.5">
                        <span className="text-slate-800 dark:text-slate-200 truncate font-bold text-[11px]">{p.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] shrink-0 font-bold">{p.count} uds</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                           className="bg-amber-400 h-full rounded-full transition-all duration-1000" 
                           style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Invoices Table */}
          <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white tracking-tight text-base font-sans">
                  Facturas Recientes
                </h3>
                <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">Últimos movimientos cargados en el sistema de cobros.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  id="btn-export-csv"
                  onClick={() => alert('Descarga de archivo CSV iniciada: facturas_' + Date.now() + '.csv')}
                  className="flex-grow sm:flex-none px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  Exportar CSV
                </button>
                <button 
                  id="btn-view-receivables"
                  onClick={() => onNavigate('receivables')}
                  className="flex-grow sm:flex-none px-3 py-1.5 bg-[#0f172a] dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white dark:text-slate-950 rounded text-xs font-semibold cursor-pointer transition-colors"
                >
                  Ver Todo
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {invoices.slice(0, 5).map((inv) => (
                <div 
                  key={inv.id} 
                  onClick={() => onNavigate('receivables')}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center font-bold text-xs text-sky-600 dark:text-sky-400 border border-slate-150/40 dark:border-slate-800 shrink-0">
                      FA
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0f172a] dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {inv.id}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${
                          inv.status === 'Paid' 
                            ? 'bg-emerald-555/10 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'bg-amber-555/10 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {inv.status === 'Paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-550 dark:text-slate-300 truncate font-semibold mt-0.5">{inv.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">FECHA</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{inv.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">MONTO</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-105 font-mono mt-0.5">
                        RD${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Critical Inventory Needs Bar */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-[#0f172a] text-base font-sans tracking-tight">
                Necesidades Críticas de Inventario
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Artículos con existencias inferiores al nivel de seguridad.
              </p>
            </div>
            <button 
              id="btn-goto-full-inventory"
              onClick={() => onNavigate('inventory')}
              className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
            >
              <span>Ver Inventario Completo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div id="low-stock-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {lowStockProducts.length === 0 ? (
              <div className="col-span-4 text-center py-6 text-slate-400 text-sm italic bg-slate-50 rounded-lg">
                No hay artículos en estado crítico. ¡Excelente gestión!
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div 
                  key={p.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-[#0f172a] transition-all cursor-pointer relative"
                >
                  <div className="h-32 w-full rounded-lg mb-3 overflow-hidden bg-white border border-slate-100 flex items-center justify-center">
                    <img 
                      src={p.imageUrl} 
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{p.name || 'Articulo de Boutique'}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{p.id}</p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-rose-600 font-bold font-mono text-xs">
                      {p.stock === 0 ? 'Agotado' : `${p.stock} restantes`}
                    </span>
                    
                    {/* Restock instantly with quick-order btn */}
                    <button
                      id={`idx-restock-${p.id}`}
                      title="Pedido de compra rápido (reabastecer +10)"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestockProduct(p.id, 10);
                        alert(`¡Reabastecimiento exitoso de 10 unidades de ${p.name}!`);
                      }}
                      className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Pedir</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
