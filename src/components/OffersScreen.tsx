import React, { useState } from 'react';
import { Offer } from '../types';
import { Header } from './Header';
import { 
  Plus, 
  Trash2, 
  Tag, 
  Layers, 
  X, 
  Check, 
  Upload, 
  FileText, 
  Percent, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

interface OffersScreenProps {
  offers: Offer[];
  onAddOffer: (offer: Offer) => void;
  onToggleActiveOffer: (id: string) => void;
  onDeleteOffer: (id: string) => void;
  profile?: any;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar?: () => void;
}

export const OffersScreen: React.FC<OffersScreenProps> = ({
  offers,
  onAddOffer,
  onToggleActiveOffer,
  onDeleteOffer,
  profile,
  darkMode,
  onToggleDarkMode,
  onToggleSidebar
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [category, setCategory] = useState<'Camisas' | 'Gorras' | 'Crop-top' | 'Abrigos' | 'Pulseras' | 'Todas'>('Todas');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande (máximo 2MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('¡El título de la oferta es requerido!');
      return;
    }
    if (!description.trim()) {
      alert('¡La descripción de la oferta es requerida!');
      return;
    }

    const newOffer: Offer = {
      id: `OFF-${Math.floor(100 + Math.random() * 900)}`,
      title,
      discountPercentage: Number(discountPercentage) || 15,
      category,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=400',
      active: true
    };

    onAddOffer(newOffer);

    // Reset fields
    setTitle('');
    setDiscountPercentage(15);
    setCategory('Todas');
    setDescription('');
    setImageUrl('');
    setShowAddModal(false);
  };

  const filteredOffers = offers.filter(o => {
    if (activeTab === 'active') return o.active;
    if (activeTab === 'inactive') return !o.active;
    return true;
  });

  return (
    <div id="offers-screen-wrapper" className="flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 transition-colors">
      <Header 
        title="Promociones y Ofertas de Temporada"
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onToggleSidebar={onToggleSidebar}
      />

      <section className="p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] flex-grow">
        
        {/* Top Summary Banner card */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-600 dark:text-sky-400 font-sans">
              Rebajas Estratégicas e Incentivos
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white mt-1 leading-tight">
              Ofertas Comerciales de Boutique
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Cree, deshabilite y administre descuentos que afecten las categorías de productos o artículos específicos en el catálogo de ventas en tiempo real.
            </p>
          </div>

          <button
            id="btn-trigger-add-offer-modal"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#0f172a] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shadow-[#0f172a]/10 hover:shadow-lg hover:shadow-sky-500/10 transition-all select-none self-start md:self-auto uppercase tracking-wider shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Oferta</span>
          </button>
        </div>

        {/* Tab Filters and Stats Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
            {[
              { id: 'all', label: `Todas (${offers.length})` },
              { id: 'active', label: `Activas (${offers.filter(o => o.active).length})` },
              { id: 'inactive', label: `Inactivas (${offers.filter(o => !o.active).length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer select-none ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-850 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-505 dark:text-slate-400">
            <Tag className="w-4 h-4 text-[#38bdf8]" />
            <span>Las ofertas activas se aplican automáticamente en la pantalla de <strong>Punto de Venta</strong>.</span>
          </div>
        </div>

        {/* Offers lists as a clean catalog layout */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400 flex flex-col justify-center items-center">
            <Percent className="w-12 h-12 text-slate-300 dark:text-slate-705 mb-4 stroke-[1.5]" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No se encontraron ofertas</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[280px]">No existen ofertas registradas en esta categoría. Cree una ahora para incentivar compras.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              return (
                <div 
                  key={offer.id}
                  className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative group ${
                    !offer.active ? 'opacity-80' : ''
                  }`}
                >
                  {/* Top discount Badge on top of image */}
                  <div className="h-44 bg-slate-50 dark:bg-slate-950 relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider shadow-md">
                          -{offer.discountPercentage}% OFF
                        </span>
                        
                        <button
                          onClick={() => {
                            if (confirm(`¿Está seguro de eliminar la oferta "${offer.title}"?`)) {
                              onDeleteOffer(offer.id);
                            }
                          }}
                          className="p-1 px-2.5 bg-black/55 hover:bg-rose-600 rounded text-slate-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center justify-center gap-1 shadow-sm"
                          title="Eliminar Oferta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-white">
                        <span className="text-[9px] bg-sky-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest font-sans inline-block mb-1.5 shadow-sm">
                          {offer.category === 'Todas' ? 'Todas las Categorías' : offer.category}
                        </span>
                        <p className="text-[10px] font-mono font-bold text-slate-350">{offer.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body textual information */}
                  <div className="p-5 flex-grow space-y-2 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-sky-505 transition-colors">
                        {offer.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    {/* Bottom activation triggers */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-805 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 -mx-5 -mb-5 p-4 mt-2">
                      <span className="text-[10px] font-display font-semibold text-slate-400 dark:text-slate-500">
                        Estado de Promoción
                      </span>

                      <button
                        onClick={() => onToggleActiveOffer(offer.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all uppercase tracking-wider cursor-pointer select-none ${
                          offer.active
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-220 dark:border-slate-700'
                        }`}
                      >
                        {offer.active ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Activa</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>Inactiva</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* CREATION MODAL overlay popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-850 dark:text-slate-100">
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4.5 h-4.5 text-amber-500" />
                <span>Crear Nueva Oferta Comercial</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-705 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-5 md:p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-off-title">
                  Título de la Oferta / Campaña
                </label>
                <input
                  id="m-off-title"
                  type="text"
                  required
                  placeholder="Ej. Liquidación de Invierno, Especial de Primavera"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-off-percentage">
                    Porcentaje de Descuento (%)
                  </label>
                  <input
                    id="m-off-percentage"
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Math.max(1, Math.min(99, Number(e.target.value) || 15)))}
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-off-cat">
                    Categoría Aplicable
                  </label>
                  <select
                    id="m-off-cat"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-lg px-2.5 py-2.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Todas">Todas las Categorías</option>
                    <option value="Camisas">Camisas</option>
                    <option value="Gorras">Gorras</option>
                    <option value="Crop-top">Crop-top</option>
                    <option value="Abrigos">Abrigos</option>
                    <option value="Pulseras">Pulseras</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="m-off-desc">
                  Detalles y Condiciones de la Oferta
                </label>
                <textarea
                  id="m-off-desc"
                  required
                  rows={2}
                  placeholder="Detalles sobre qué productos aplican y fecha límite de la rebaja..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Functional uploader instead of a link uploader */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Imagen de Presentación de Oferta
                </label>
                
                <div className="flex gap-3.5 items-center">
                  <div className="flex-grow">
                    <label 
                      htmlFor="m-off-image-file"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg px-4 py-3 cursor-pointer text-center group transition-colors"
                    >
                      <Upload className="w-5 h-5 text-slate-450 group-hover:text-sky-500 mb-1 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        Seleccionar imagen local
                      </span>
                      <span className="text-[8px] text-slate-400 block mt-0.5">
                        Formatos JPG, PNG, WEBP (Max 2MB)
                      </span>
                    </label>
                    <input 
                      id="m-off-image-file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>

                  {imageUrl && (
                    <div className="relative shrink-0 border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-950 rounded-md">
                      <img
                        src={imageUrl}
                        alt="Preview de oferta"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 shadow-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-850 dark:bg-sky-600 dark:hover:bg-sky-700 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg transition-all"
                >
                  <Check className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Crear Oferta</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
