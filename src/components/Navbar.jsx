import { useState } from 'react';
import { useGym } from '../context/GymContext.jsx';
import { User as UserIcon, LogOut, ChevronDown, Dumbbell } from 'lucide-react';

export const Navbar = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    logout,
    setViewingProfileUserId
  } = useGym();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isPublicView = ['inicio', 'planes', 'clases', 'nosotros', 'login', 'registro'].includes(currentView);

  const handleNavClick = view => {
    setViewingProfileUserId(null);
    setCurrentView(view);
  };

  const handleProfileClick = () => {
    setViewingProfileUserId(null);
    setCurrentView('perfil');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in display face */}
        <div
          onClick={() => handleNavClick(currentUser ? (currentUser.rol === 'admin' ? 'admin-usuarios' : currentUser.rol === 'profesor' ? 'profesor-clases' : 'alumno-clases') : 'inicio')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-neutral-100 group-hover:text-amber-400 transition-colors">
            KRONO<span className="text-amber-500">FIT</span>
          </span>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {(!currentUser || isPublicView) && (
            <>
              <button
                onClick={() => handleNavClick('inicio')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'inicio' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavClick('planes')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'planes' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Planes
              </button>
              <button
                onClick={() => handleNavClick('clases')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'clases' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Clases
              </button>
              <button
                onClick={() => handleNavClick('nosotros')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'nosotros' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Nosotros
              </button>
              {!currentUser && (
                <button
                  onClick={() => handleNavClick('login')}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currentView === 'login' ? 'text-amber-400' : 'hover:text-neutral-100'
                  }`}
                >
                  Login
                </button>
              )}
            </>
          )}

          {/* Student Navigation */}
          {currentUser && currentUser.rol === 'alumno' && !isPublicView && (
            <>
              <button
                onClick={() => handleNavClick('alumno-clases')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'alumno-clases' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Clases Disponibles
              </button>
              <button
                onClick={() => handleNavClick('alumno-reservas')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'alumno-reservas' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Mis Reservas
              </button>
              <button
                onClick={() => handleNavClick('alumno-suscripcion')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'alumno-suscripcion' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Mi Suscripción
              </button>
              <button
                onClick={handleProfileClick}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'perfil' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Mi Perfil
              </button>
            </>
          )}

          {/* Professor Navigation */}
          {currentUser && currentUser.rol === 'profesor' && !isPublicView && (
            <>
              <button
                onClick={() => handleNavClick('profesor-clases')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'profesor-clases' || currentView === 'profesor-detalle-clase' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Mis Clases
              </button>
              <button
                onClick={handleProfileClick}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'perfil' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Mi Perfil
              </button>
            </>
          )}

          {/* Admin Navigation */}
          {currentUser && currentUser.rol === 'admin' && !isPublicView && (
            <>
              <button
                onClick={() => handleNavClick('admin-usuarios')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'admin-usuarios' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Usuarios
              </button>
              <button
                onClick={() => handleNavClick('admin-roles')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'admin-roles' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => handleNavClick('admin-clases')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'admin-clases' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Clases
              </button>
              <button
                onClick={() => handleNavClick('admin-planes')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'admin-planes' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Planes
              </button>
              <button
                onClick={() => handleNavClick('admin-reservas')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'admin-reservas' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Reservas
              </button>
              <button
                onClick={() => handleNavClick('admin-suscripciones')}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentView === 'admin-suscripciones' ? 'text-amber-400' : 'hover:text-neutral-100'
                }`}
              >
                Suscripciones
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <div
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 hover:border-neutral-700 cursor-pointer transition-all"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.nombre}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500/40"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-neutral-100 leading-tight">
                    {currentUser.nombre}
                  </div>
                  <div className="text-[10px] text-amber-400 uppercase font-mono tracking-wider">
                    {currentUser.rol}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </div>

              {/* Dropdown Menu */}
              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-neutral-800">
                    <p className="text-xs font-semibold text-neutral-200">{currentUser.nombre} {currentUser.apellido}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-300 hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                    Mi Perfil
                  </button>

                  <div className="border-t border-neutral-800 mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Ingresar
              </button>
              <button
                onClick={() => handleNavClick('registro')}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                Registrarme
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
