import React, { useState } from 'react';
import { 
  Store, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  Loader2,
  User,
  Phone,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (profile: { firstName: string; lastName: string; phone: string; email: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  // Toggle between login and registration views
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('manager@boutique.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration Form States
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);
  
  // UX Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Local storage management for user accounts
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('boutique-registered-users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    // Default account list
    return [
      {
        firstName: 'Alex',
        lastName: 'Sterling',
        email: 'manager@boutique.com',
        phone: '+1 809-555-7777',
        password: 'admin'
      }
    ];
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      
      // Support default credentials shortcut
      if (loginEmail === 'manager@boutique.com' && (loginPassword === '••••••••' || loginPassword === 'admin')) {
        setIsSubmitting(false);
        onLogin({
          firstName: 'Alex',
          lastName: 'Sterling',
          phone: '+1 809-555-7777',
          email: 'manager@boutique.com'
        });
        return;
      }

      // Check against stored accounts
      const matchedUser = users.find(
        u => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim() && u.password === loginPassword
      );

      if (matchedUser) {
        setIsSubmitting(false);
        onLogin({
          firstName: matchedUser.firstName,
          lastName: matchedUser.lastName,
          phone: matchedUser.phone,
          email: matchedUser.email
        });
      } else {
        setIsSubmitting(false);
        setErrorMessage('Credenciales incorrectas. Verifique su correo o contraseña o regístrese como nuevo usuario.');
      }
    }, 1000);
  };

  // Registration handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validations
    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (!regTermsAccepted) {
      setErrorMessage('Debe aceptar los términos de servicio de la boutique.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      
      // Check if email already exists
      const emailExists = users.some(u => u.email.toLowerCase().trim() === regEmail.toLowerCase().trim() || regEmail.toLowerCase().trim() === 'manager@boutique.com');
      if (emailExists) {
        setIsSubmitting(false);
        setErrorMessage('Este correo electrónico ya se encuentra registrado.');
        return;
      }

      // Register new user
      const newUser = {
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        email: regEmail.toLowerCase().trim(),
        phone: regPhone.trim(),
        password: regPassword
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('boutique-registered-users', JSON.stringify(updatedUsers));

      setIsSubmitting(false);
      setSuccessMessage('¡Cuenta creada con éxito! Ahora puede iniciar sesión con sus credenciales.');
      
      // Auto-prefill login fields and switch to login mode after 2 seconds
      setLoginEmail(newUser.email);
      setLoginPassword(newUser.password);
      
      setTimeout(() => {
        setIsRegisterMode(false);
        setSuccessMessage('');
      }, 2000);
    }, 1200);
  };

  return (
    <div 
      id="login-screen-bg"
      className="bg-[#FAF6F0] text-[#2C231E] min-h-screen flex flex-col justify-between relative overflow-hidden font-sans"
    >
      {/* Luxurious soft ambient glow spots reflecting cream/champagne/gold vibes */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-[#EED8C1]/30 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-[#C2A378]/15 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Page Content wrapper */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-16 z-10">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          
          {/* Brand Identity / Top decoration */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#9B7F56] to-[#C2A378] rounded-2xl flex items-center justify-center mb-1 shadow-xl shadow-[#C2A378]/25 border border-[#E1D1BB]/40 active:scale-95 duration-150 transform hover:rotate-3 transition-all">
              <Store className="text-white w-7 h-7 stroke-[2]" />
            </div>
            
            <span className="bg-[#C2A378]/10 text-[#8C6D43] text-[9px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full border border-[#C2A378]/10 mb-1">
              Boutique Autenticación Élite
            </span>

            <h1 className="text-2.5xl font-black text-[#2C231E] tracking-tight font-sans uppercase">
              {isRegisterMode ? 'Crear Cuenta Operativa' : 'Duckleem Manager'}
            </h1>
            <p className="text-xs text-[#605249] max-w-[340px]">
              {isRegisterMode 
                ? 'Registre sus accesos para gestionar inventarios, ventas y controlar reportes bajo la exclusiva firma.' 
                : 'Gestión inteligente, control de inventario y facturación de alta costura.'}
            </p>
          </div>

          {/* Feedback Notices */}
          {errorMessage && (
            <div className="bg-[#DF9D8D]/10 border border-[#E17253]/30 text-[#8B3A25] text-xs px-4 py-3.5 rounded-xl flex items-start gap-2.5 shadow-sm">
              <span className="shrink-0 text-[#E17253] text-sm">⚠️</span>
              <p className="font-semibold leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-[#A4E0B6]/10 border border-[#48B36E]/30 text-[#216738] text-xs px-4 py-3.5 rounded-xl flex items-start gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#48B36E] shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{successMessage}</p>
            </div>
          )}

          {/* Authentication Panel Box (Chic Menu Style with elegant cream container) */}
          <div className="bg-white/90 backdrop-blur-md border border-[#E5DCCB] p-6 md:p-8 rounded-2xl shadow-xl relative">
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#C2A378]/70 to-transparent"></div>
            
            {!isRegisterMode ? (
              /* LOGIN VIEW */
              <form onSubmit={handleLoginSubmit} id="loginForm" className="flex flex-col gap-5">
                
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[#605249] uppercase tracking-widest" htmlFor="email-input">
                    Dirección de Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A2978F] w-4.5 h-4.5" />
                    <input
                      id="email-input"
                      name="email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="manager@boutique.com"
                      className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#E5DCCB] rounded-xl text-sm text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-[#605249] uppercase tracking-widest" htmlFor="password-input">
                      Contraseña de Acceso
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A2978F] w-4.5 h-4.5" />
                    <input
                      id="password-input"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] border border-[#E5DCCB] rounded-xl text-sm text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans font-medium"
                    />
                    <button
                      id="btn-password-toggle"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A2978F] hover:text-[#2C231E] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#C2A378] bg-white text-[#9B7F56] focus:ring-[#C2A378]/40 cursor-pointer accent-[#9B7F56]"
                  />
                  <label htmlFor="remember-checkbox" className="text-xs text-[#605249] cursor-pointer select-none">
                    Recordar esta sesión operativa
                  </label>
                </div>

                {/* Submit Button in Premium Gold-Bronze */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#9B7F56] to-[#C2A378] hover:from-[#826944] hover:to-[#AF9165] hover:shadow-lg hover:shadow-[#C2A378]/20 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#C2A378]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                      <span>Verificando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Sistema</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Register Action Prompt */}
                <div className="mt-2 text-center border-t border-[#F0E6D2] pt-4">
                  <p className="text-xs text-[#7F7166]">
                    ¿Nuevo Gerente o Vendedor?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMessage('');
                      }}
                      className="text-[#9B7F56] hover:text-[#7A603A] hover:underline font-bold font-sans cursor-pointer whitespace-nowrap"
                    >
                      Registrar Nueva Cuenta
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* REGISTRATION VIEW */
              <form onSubmit={handleRegisterSubmit} id="registerForm" className="flex flex-col gap-4">
                
                {/* Visual Back Arrow to login */}
                <button 
                  type="button" 
                  onClick={() => setIsRegisterMode(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9B7F56] hover:text-[#7A603A] self-start transition-colors mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Inicio de Sesión</span>
                </button>

                {/* Nombre & Apellido Columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-[#605249] uppercase tracking-wider" htmlFor="reg-first-name">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2978F] w-4 h-4" />
                      <input
                        id="reg-first-name"
                        type="text"
                        required
                        placeholder="Ej. Juan"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E5DCCB] rounded-lg text-xs text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-[#605249] uppercase tracking-wider" htmlFor="reg-last-name">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2978F] w-4 h-4" />
                      <input
                        id="reg-last-name"
                        type="text"
                        required
                        placeholder="Ej. Pérez"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E5DCCB] rounded-lg text-xs text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[#605249] uppercase tracking-wider" htmlFor="reg-email">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A2978F] w-4.5 h-4.5" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="perez@boutique.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DCCB] rounded-lg text-xs text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Contact Phone Number Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[#605249] uppercase tracking-wider" htmlFor="reg-phone">
                    Número de Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A2978F] w-4.5 h-4.5" />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      placeholder="+1 809-555-1234"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DCCB] rounded-lg text-xs text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Contraseña & Confirmar Columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-[#605249] uppercase tracking-wider" htmlFor="reg-pass">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2978F] w-4 h-4" />
                      <input
                        id="reg-pass"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Mín. 4 carac."
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E5DCCB] rounded-lg text-xs text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <label className="text-[10px] font-black text-[#605249] uppercase tracking-wider" htmlFor="reg-pass-conf">
                        Confirmar
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="text-[9px] font-bold text-[#9B7F56] hover:underline cursor-pointer select-none"
                      >
                        {showRegPassword ? 'Ocultar' : 'Ver'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A2978F] w-4 h-4" />
                      <input
                        id="reg-pass-conf"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-escriba"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E5DCCB] rounded-lg text-xs text-[#2C231E] placeholder-[#BCB2A8] focus:outline-none focus:ring-2 focus:ring-[#C2A378]/20 focus:border-[#9B7F56] transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    required
                    checked={regTermsAccepted}
                    onChange={(e) => setRegTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E5DCCB] bg-[#FAF8F5] text-[#9B7F56] focus:ring-[#C2A378]/20 cursor-pointer accent-[#9B7F56]"
                  />
                  <label htmlFor="terms-checkbox" className="text-[10px] text-[#605249] cursor-pointer select-none">
                    Acepto los términos de uso y exclusividad de confidencialidad comercial.
                  </label>
                </div>

                {/* Register Submit Button */}
                <button
                  id="btn-register-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#9B7F56] hover:bg-[#826944] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#C2A378]/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 active:scale-[0.98] mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                      <span>Registrando operador...</span>
                    </>
                  ) : (
                    <>
                      <span>Registrar Nuevo Operador</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center my-5 select-none">
              <div className="flex-grow h-[1px] bg-[#E5DCCB]"></div>
              <span className="px-3 text-[9px] text-[#8C7A6D] font-bold uppercase tracking-widest font-sans">O Ingrese como</span>
              <div className="flex-grow h-[1px] bg-[#E5DCCB]"></div>
            </div>

            {/* Google Authentication Button */}
            <button
              id="btn-login-google"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  onLogin({
                    firstName: 'Vendedor',
                    lastName: 'Demostración',
                    phone: '+1 809-555-0101',
                    email: 'vendedor.duckleem@gmail.com'
                  });
                }, 1100);
              }}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-[#E5DCCB] hover:bg-[#F5EFE6] text-[#605249] bg-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              <svg className="w-4 h-4 shrink-0 shadow-sm" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.6 2.8C6.01 7.23 8.78 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.46h6.45c-.28 1.47-1.11 2.72-2.36 3.56l3.67 2.84c2.14-1.97 3.74-4.88 3.74-8.51z" />
                <path fill="#FBBC05" d="M5.1 14.7c-.23-.7-.35-1.44-.35-2.2s.12-1.5.35-2.2L1.5 7.5C.54 9.42 0 11.64 0 14s.54 4.58 1.5 6.5l3.6-2.8z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.67-2.84c-1.02.68-2.33 1.09-4.28 1.09-3.22 0-5.99-2.19-6.9-5.26l-3.6 2.8C3.39 20.35 7.35 23 12 23z" />
              </svg>
              <span>Acceso de Cortesía Google</span>
            </button>

            {/* Role Access Notice */}
            <div className="mt-5 pt-4 border-t border-[#F0E6D2] flex items-start gap-2.5">
              <ShieldCheck className="text-[#9B7F56] w-4.5 h-4.5 shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#7F7166] italic leading-snug font-sans">
                Acceso registrado y cifrado local para fines de auditoría del Administrador de Boutique.
              </p>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex justify-center gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[9px] font-bold text-[#8C7A6D] hover:text-[#9B7F56] transition-colors uppercase tracking-wider font-mono">Privacidad</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[9px] font-bold text-[#8C7A6D] hover:text-[#9B7F56] transition-colors uppercase tracking-wider font-mono">Términos de Uso</a>
            <a href="#support" onClick={(e) => e.preventDefault()} className="text-[9px] font-bold text-[#8C7A6D] hover:text-[#9B7F56] transition-colors uppercase tracking-wider font-mono">Soporte Boutique</a>
          </div>

        </div>
      </main>

      {/* Decorative credit notice */}
      <footer className="py-4 text-center text-[10px] text-[#8C7A6D] font-mono select-none uppercase tracking-widest border-t border-[#E5DCCB] bg-[#FAF6F0] z-10">
        Duckleem Manager System v4.3.0 • Registro de Operaciones y Conciliación Local
      </footer>
    </div>
  );
};
