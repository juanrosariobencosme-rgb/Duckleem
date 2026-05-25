import React, { useState } from 'react';
import { Product, formatUSD, formatDOP } from '../types';
import { Header } from './Header';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Check,
  PlusSquare,
  Sparkles,
  X,
  Upload
} from 'lucide-react';

interface InventoryScreenProps {
  products: Product[];
  onAddProduct: (prod: Product) => void;
  onRestockProduct: (id: string, qty: number) => void;
  onUpdateStock?: (id: string, qty: number) => void;
  onUpdateProduct?: (id: string, fields: Partial<Product>) => void;
  profile?: {
    firstName: string;
    lastName: string;
    imageUrl: string;
    phone: string;
  };
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar?: () => void;
  onNavigate?: (screen: any) => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  products,
  onAddProduct,
  onRestockProduct,
  onUpdateStock,
  onUpdateProduct,
  profile,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  
  // Dialog Actions
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(150);
  const [newProdPrice, setNewProdPrice] = useState(120);
  const [newProdCategory, setNewProdCategory] = useState<'Camisas' | 'Gorras' | 'Crop-top' | 'Abrigos' | 'Pulseras'>('Camisas');
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdImage, setNewProdImage] = useState('');

  // Stock Editor Dialog Actions
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [editImageValue, setEditImageValue] = useState<string>('');

  // Count metrics for filters
  const countAll = products.length;
  const countCamisas = products.filter(p => p.category === 'Camisas').length;
  const countGorras = products.filter(p => p.category === 'Gorras').length;
  const countCropTop = products.filter(p => p.category === 'Crop-top').length;
  const countAbrigos = products.filter(p => p.category === 'Abrigos').length;
  const countPulseras = products.filter(p => p.category === 'Pulseras').length;

  // Process Catalog Data
  const displayedProducts = products.filter(p => {
    // Search filter
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCat = selectedCategory === 'All Items' || p.category === selectedCategory;

    // Quick Alert filter
    const matchesLowStock = !filterLowStockOnly || (p.stock <= p.criticalLimit);

    return matchesSearch && matchesCat && matchesLowStock;
  });

  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('¡El nombre del producto no puede estar vacío!');
      return;
    }

    const newID = `AP-${Math.floor(100+Math.random()*900)}`;
    const fallbackImage = newProdImage.trim() !== '' 
      ? newProdImage 
      : 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=400';

    const freshlyMintedProduct: Product = {
      id: newID,
      name: newProdName,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      imageUrl: fallbackImage,
      criticalLimit: 5
    };

    onAddProduct(freshlyMintedProduct);
    alert(`¡Éxito! Se ha creado el producto ${newProdName} con el código: ${newID}.`);

    // Reset states
    setNewProdName('');
    setNewProdImage('');
    setNewProdPrice(120);
    setNewProdOriginalPrice(150);
    setNewProdStock(15);
    setShowAddModal(false);
  };

  return (
    <div id="inventory-screen" className="flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Header 
        title="Inventario Visual y Control de Stock" 
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onToggleSidebar={onToggleSidebar}
        onNavigate={onNavigate}
      />

      {/* Screen container */}
      <section className="p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] flex-grow">
        
        {/* Header Summary & View details action bars */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a] dark:text-white font-sans tracking-tight">Inventario de la Boutique</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestione colecciones de temporada, niveles de existencias y alertas de stock crítico.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              id="btn-quick-alerts-toggle"
              onClick={() => {
                setFilterLowStockOnly(!filterLowStockOnly);
                setSelectedCategory('All Items');
              }}
              className={`px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                filterLowStockOnly 
                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{filterLowStockOnly ? 'Ver Todo el Catálogo' : 'Filtrar Stock Bajo'}</span>
            </button>

            <button 
              id="btn-add-product-modal"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#0f172a] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:shadow-lg transition-all"
            >
              <Plus className="w-4.5 h-4.5 text-sky-400 dark:text-white" />
              <span>Agregar Producto</span>
            </button>
          </div>
        </div>

        {/* Catalog grid divide Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ASIDE Filter Control blocks */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Category selection listing */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 lg:p-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#0f172a] dark:text-white uppercase tracking-wider mb-3 lg:mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Categorías</span>
              </h3>

              <div id="category-selector-nodes" className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-1 lg:pb-0 scrollbar-none snap-x whitespace-nowrap">
                {[
                  { key: 'All Items', label: 'Todos los Artículos', count: countAll },
                  { key: 'Camisas', label: 'Camisas', count: countCamisas },
                  { key: 'Gorras', label: 'Gorras', count: countGorras },
                  { key: 'Crop-top', label: 'Crop-top', count: countCropTop },
                  { key: 'Abrigos', label: 'Abrigos', count: countAbrigos },
                  { key: 'Pulseras', label: 'Pulseras', count: countPulseras }
                ].map((cat) => {
                  const isSel = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setSelectedCategory(cat.key);
                        setFilterLowStockOnly(false); // Reset to view category items
                      }}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all shrink-0 snap-start ${
                        isSel 
                          ? 'bg-slate-900 dark:bg-sky-650 text-white font-bold' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0f172a] dark:hover:text-white'
                      }`}
                    >
                      <span className="font-sans">{cat.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isSel ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick stock indicators block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#0f172a] dark:text-white uppercase tracking-wider">Leyenda de Stock</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>En Stock (Nivel Saludable)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>Margen de Seguridad</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 animate-pulse"></span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">Stock Crítico Deficitario</span>
                </div>
              </div>
            </div>

          </aside>

          {/* Core catalog Grid viewport */}
          <div className="lg:col-span-9 flex flex-col justify-between">
            
            <div id="catalog-card-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedProducts.map((p) => {
                const isCritical = p.stock <= p.criticalLimit;
                return (
                  <article 
                    key={p.id}
                    className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                      isCritical ? 'border-rose-300 dark:border-rose-800 hover:border-rose-500' : 'border-slate-200 dark:border-slate-800 hover:border-[#0f172a] dark:hover:border-sky-500'
                    }`}
                  >
                    {/* Visual head image */}
                    <div className="aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Category Pill */}
                      <span className="absolute top-3 right-3 px-2 rounded-full text-[9px] font-bold bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-[#0f172a] dark:text-white tracking-wider uppercase border border-slate-200 dark:border-slate-700">
                        {p.category}
                      </span>

                      {/* Stock Critical Warning flashing Banner */}
                      {isCritical && (
                        <div className="absolute inset-x-0 bottom-0 py-1 bg-rose-600 text-white text-[9px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>¡STOCK CRÍTICO!</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata body */}
                    <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{p.id}</p>
                          <h4 className="font-bold text-slate-900 dark:text-white tracking-tight leading-tight text-sm line-clamp-2 mt-0.5">{p.name}</h4>
                        </div>
                        <div className="flex flex-col items-end text-right shrink-0">
                          {p.originalPrice && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through leading-none mb-1 block">
                              {formatUSD(p.originalPrice)} / {formatDOP(p.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold text-slate-900 dark:text-sky-300 text-xs whitespace-nowrap leading-none block">
                            {formatUSD(p.price)} / {formatDOP(p.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            p.stock === 0 
                              ? 'bg-rose-500' 
                              : isCritical 
                                ? 'bg-amber-500 animate-pulse' 
                                : 'bg-emerald-500'
                          }`}></span>
                          <span className={`${isCritical ? 'font-bold text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            Stock: {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
                          </span>
                        </div>

                        {/* Interactive restock click triggers */}
                        <div className="flex gap-1">
                          <button
                            id={`btn-manual-edit-stock-${p.id}`}
                            onClick={() => {
                              setEditingProduct(p);
                              setEditStockValue(p.stock);
                              setEditPriceValue(p.price);
                              setEditImageValue(p.imageUrl);
                            }}
                            className="px-2 py-1 text-[9px] bg-sky-600 hover:bg-sky-700 text-white rounded font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                          >
                            Modificar
                          </button>
                          <button
                            id={`btn-manual-restock-${p.id}`}
                            onClick={() => {
                              onRestockProduct(p.id, 15);
                              alert(`¡Reabastecimiento de boutique exitoso! Se agregaron 15 unidades a ${p.name}.`);
                            }}
                            className="px-1.5 py-1 text-[9px] text-[#0f172a] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                          >
                            +15
                          </button>
                        </div>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>

            {/* Pagination Mock footer */}
            <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Mostrando {displayedProducts.length} de {products.length} productos
              </p>
              
              <div className="flex items-center gap-1 shadow-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                <button className="p-1 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 cursor-pointer disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="bg-[#0f172a] dark:bg-sky-650 text-white text-xs font-bold w-7 h-7 rounded flex items-center justify-center">
                  1
                </button>
                <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold w-7 h-7 rounded flex items-center justify-center cursor-pointer">
                  2
                </button>
                <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold w-7 h-7 rounded flex items-center justify-center cursor-pointer">
                  3
                </button>
                <span className="px-1 text-slate-400 dark:text-slate-650 text-xs">...</span>
                <button className="p-1 px-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* CREATION MODAL VIEW FOR NEW PRODUCTS */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
            
            {/* Modal Heading */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 rounded-t-xl">
              <h3 className="font-bold text-slate-850 dark:text-white text-sm font-sans tracking-tight">Agregar Nuevo Producto al Catálogo</h3>
              <button 
                id="btn-close-and-cancel"
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-250 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal fields Form */}
            <form onSubmit={handleAddNewProductSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-prod-name">
                  Nombre del Producto
                </label>
                <input
                  id="m-prod-name"
                  type="text"
                  required
                  placeholder="Ej., Blazer Informal de Lino"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Pricing section with initial & final prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="m-prod-original-price">
                    Precio Inicial (USD)
                  </label>
                  <input
                    id="m-prod-original-price"
                    type="number"
                    required
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                    Equiv: {formatDOP(newProdOriginalPrice)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block" htmlFor="m-prod-price">
                    Precio Final (USD)
                  </label>
                  <input
                    id="m-prod-price"
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                  <p className="text-[9px] text-sky-600 dark:text-sky-400 font-mono font-bold">
                    Equiv: {formatDOP(newProdPrice)}
                  </p>
                </div>
              </div>

              {/* Stock and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-prod-stock">
                    Stock Inicial
                  </label>
                  <input
                    id="m-prod-stock"
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-prod-cat">
                    Categoría
                  </label>
                  <select
                    id="m-prod-cat"
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full text-xs text-slate-850 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg px-2.5 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Camisas">Camisas</option>
                    <option value="Gorras">Gorras</option>
                    <option value="Crop-top">Crop-top</option>
                    <option value="Abrigos">Abrigos</option>
                    <option value="Pulseras">Pulseras</option>
                  </select>
                </div>
                     {/* File upload input replacing URL string input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Imagen de Presentación del Producto
                </label>
                
                <div className="flex gap-3.5 items-center">
                  <div className="flex-grow">
                    <label 
                      htmlFor="new-prod-image-file"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-4 py-3.5 cursor-pointer text-center group transition-colors"
                    >
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-sky-500 mb-1 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        Seleccionar imagen local
                      </span>
                      <span className="text-[8px] text-slate-400 block mt-0.5 font-sans">
                        Formatos JPG, PNG, WEBP (Max 2MB)
                      </span>
                    </label>
                    <input 
                      id="new-prod-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert('El archivo es demasiado grande (máximo 2MB).');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProdImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>

                  {newProdImage && (
                    <div className="relative shrink-0 border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-950 rounded-md">
                      <img
                        src={newProdImage}
                        alt="Preview de producto"
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=150';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewProdImage('')}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 shadow-xs cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>           </div>

              {/* Action triggers */}
              <div className="pt-4 flex gap-3">
                <button
                  id="btn-cancel-modal"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-and-create"
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-850 dark:bg-sky-600 dark:hover:bg-sky-700 rounded-lg flex items-center justify-center gap-1 cursor-pointer hover:shadow-lg transition-all"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Crear Artículo</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DIRECT STOCK MODIFICATION popup modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-805 overflow-hidden text-slate-850 dark:text-slate-100">
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Modificar Artículo del Catálogo</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-250 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3.5 pb-3 border-b border-slate-150 dark:border-slate-800">
                <img 
                  src={editImageValue || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=150'} 
                  alt={editingProduct.name} 
                  className="w-12 h-12 object-cover rounded-md border border-slate-200 dark:border-slate-700 shrink-0" 
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{editingProduct.id}</p>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight truncate">{editingProduct.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Categoría: <span className="font-bold">{editingProduct.category}</span></p>
                </div>
              </div>

              {/* Price Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="edit-prod-price">
                  Precio de Venta Establecido (USD)
                </label>
                <input
                  id="edit-prod-price"
                  type="number"
                  min="1"
                  required
                  value={editPriceValue}
                  onChange={(e) => setEditPriceValue(Number(e.target.value) || 0)}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-805 rounded-lg px-3 py-2.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
                <p className="text-[9px] text-sky-600 dark:text-sky-400 font-mono font-bold leading-none">
                  Equivalente en moneda nacional: {formatDOP(editPriceValue)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="edit-prod-stock">
                  Cantidad en Stock
                </label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setEditStockValue(prev => Math.max(0, prev - 1))}
                    className="w-9 h-9 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center font-bold text-slate-700 dark:text-slate-350 cursor-pointer text-lg select-none"
                  >
                    -
                  </button>
                  <input
                    id="edit-prod-stock"
                    type="number"
                    min="0"
                    required
                    value={editStockValue}
                    onChange={(e) => setEditStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 text-center font-bold text-slate-800 dark:text-slate-150 border border-slate-200 dark:border-slate-820 bg-slate-50 dark:bg-slate-950 rounded-lg py-1.5 focus:ring-1 focus:ring-sky-500 focus:outline-none text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setEditStockValue(prev => prev + 1)}
                    className="w-9 h-9 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center font-bold text-slate-700 dark:text-slate-350 cursor-pointer text-lg select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Increments recommendation shortcuts */}
              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                {[5, 10, 20, 50].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setEditStockValue(prev => prev + v)}
                    className="py-1 px-1 text-[10px] bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold border border-slate-205 dark:border-slate-750 text-slate-605 dark:text-slate-300 rounded cursor-pointer text-center select-none"
                  >
                    +{v}
                  </button>
                ))}
              </div>

              {/* Cover Image File Uploader */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Reemplazar Imagen del Producto
                </label>
                <div className="flex gap-3.5 items-center">
                  <div className="flex-grow">
                    <label 
                      htmlFor="edit-prod-image-file"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-205 dark:border-slate-750 bg-slate-50 dark:bg-slate-955 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-3 py-2 cursor-pointer text-center group transition-colors"
                    >
                      <Upload className="w-4 h-4 text-slate-450 group-hover:text-sky-500 mb-0.5 transition-colors" />
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">
                        Subir nueva imagen local
                      </span>
                    </label>
                    <input 
                      id="edit-prod-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert('El archivo es demasiado grande (máximo 2MB).');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditImageValue(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateProduct) {
                      onUpdateProduct(editingProduct.id, {
                        price: editPriceValue,
                        stock: editStockValue,
                        imageUrl: editImageValue
                      });
                    } else if (onUpdateStock) {
                      onUpdateStock(editingProduct.id, editStockValue);
                    } else {
                      // fallback safety delta
                      const delta = editStockValue - editingProduct.stock;
                      onRestockProduct(editingProduct.id, delta);
                    }
                    alert(`¡Cambios guardados con éxito para ${editingProduct.name}!`);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-[#0f172a] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
