import React from 'react';
import { useGym } from '../context/GymContext.jsx';
import { Dumbbell, MapPin, Clock, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  const { setCurrentView } = useGym();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-black">
                <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-neutral-100">
                KRONO<span className="text-amber-500">FIT</span>
              </span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-xs">
              Club de entrenamiento de alto rendimiento. Infraestructura de estándar olímpico, coaches certificados y comunidad enfocada en resultados sostenibles.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Navegación</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('inicio')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('planes')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Planes de Membresía
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('clases')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Horario de Clases
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('nosotros')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Sobre Nosotros & Coaches
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Horarios</h4>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Lunes a Viernes: 06:00 - 23:00 hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Sábados: 08:00 - 20:00 hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Domingos y Festivos: 09:00 - 15:00 hrs</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">Ubicación & Contacto</h4>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Av. El Golf 1450, Las Condes, Santiago</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+56 2 2980 4400</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>contacto@kronofit.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} KRONOFIT SpA. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 cursor-pointer">Términos del Servicio</span>
            <span>·</span>
            <span className="hover:text-neutral-300 cursor-pointer">Política de Privacidad</span>
            <span>·</span>
            <span className="hover:text-neutral-300 cursor-pointer">Reglamento Interno</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
