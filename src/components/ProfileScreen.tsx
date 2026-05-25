import React, { useState } from 'react';
import { Header } from './Header';
import { User, Phone, Image, Save, Camera, Check } from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  imageUrl: string;
  phone: string;
}

interface ProfileScreenProps {
  profile: ProfileData;
  onUpdateProfile: (data: ProfileData) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'amber' | 'error') => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onToggleSidebar?: () => void;
  onNavigate?: (screen: any) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onShowToast,
  darkMode = false,
  onToggleDarkMode,
  onToggleSidebar,
  onNavigate
}) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone);
  const [imageUrl, setImageUrl] = useState(profile.imageUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      onShowToast('Error', 'El nombre y apellido no pueden estar vacíos', 'error');
      return;
    }
    
    onUpdateProfile({
      firstName,
      lastName,
      phone,
      imageUrl
    });
    
    onShowToast('Éxito', '¡Perfil actualizado correctamente!', 'success');
  };

  return (
    <div id="profile-workspace" className="flex-grow flex flex-col bg-[#FAF5EC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors bg-[#FAF5EC]">
      <Header 
        title="Configuración de Perfil" 
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onNavigate={onNavigate}
        profile={profile}
        onToggleSidebar={onToggleSidebar}
      />
      
      <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-tight mb-1">
            Mi Perfil de Usuario
          </h2>
          <p className="text-xs text-slate-400">
            Configure sus datos personales, información de contacto de caja y fotografía de perfil para las facturas.
          </p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar Display & Presets */}
          <div className="md:col-span-4 flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl space-y-5 h-fit shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 self-start">Foto de Perfil</h3>
            
            <div className="relative group w-32 h-32">
              <img
                src={imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt="Avatar grande"
                referrerPolicy="no-referrer"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
              />
              <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                <Camera className="w-5 h-5 mb-1 mr-1" />Editar
              </div>
            </div>

            {/* Presets Grid Selector */}
            <div className="w-full space-y-2.5">
              <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider">Avatares Sugeridos</p>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {PRESET_AVATARS.map((url, i) => {
                  const isSelected = imageUrl === url;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(url)}
                      className="relative w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      style={{ borderColor: isSelected ? '#38bdf8' : '#e2e8f0' }}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      {isSelected && (
                        <span className="absolute inset-0 bg-sky-500/60 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Editable Inputs */}
          <div className="md:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Datos Personales</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider" htmlFor="prof-first-name">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="prof-first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-sans font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider" htmlFor="prof-last-name">
                  Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="prof-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-sans font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider" htmlFor="prof-phone">
                  Teléfono de Contacto
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="prof-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 809-555-1234"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-sans font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider" htmlFor="prof-img">
                  URL de Imagen de Perfil
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="prof-img"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-sans font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f172a] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white hover:text-[#38bdf8] dark:hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
