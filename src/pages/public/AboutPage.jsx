import React from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Award, Shield, Users, CheckCircle } from 'lucide-react';

export const AboutPage = () => {
  const { users } = useGym();
  const professors = users.filter(u => u.rol === 'profesor');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Sobre KRONOFIT
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-neutral-100 tracking-tight leading-tight">
            Redefiniendo el entrenamiento de fuerza y salud integral.
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Fundado en 2021, KRONOFIT nació para romper con los gimnasios convencionales sobrepoblados y sin guía profesional. Construimos un espacio pensado tanto para atletas de alto rendimiento como para personas que buscan salud duradera y vitalidad diaria.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Barras olímpicas Eleiko y calibradas para levantamientos seguros.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Estudio exclusivo de movilidad, yoga y descompresión neuromuscular.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Ratio garantizado: 1 coach por cada 14 alumnos como máximo.</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/3]">
          <img
            src="/src/assets/hero_gym_modern_1794172172469.jpg"
            alt="Instalaciones KRONOFIT"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-sm font-bold text-neutral-100">Sede El Golf, Las Condes</div>
            <div className="text-xs text-amber-400">1.200 m² de ingeniería deportiva</div>
          </div>
        </div>
      </div>

      {/* Coaches Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Cuerpo Técnico
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight">
            Entrenadores y Coaches Certificados
          </h2>
          <p className="text-xs text-neutral-400">
            Profesionales comprometidos con tu técnica, seguridad y superación personal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {professors.map(prof => (
            <div
              key={prof.id}
              className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start hover:border-neutral-700 transition-colors"
            >
              <img
                src={prof.avatar}
                alt={prof.nombre}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-xl object-cover shrink-0 ring-1 ring-amber-500/30"
              />
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100">
                    {prof.nombre} {prof.apellido}
                  </h3>
                  <div className="text-xs font-semibold text-amber-400 mt-0.5">
                    {prof.especialidad || 'Head Coach'}
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {prof.bio}
                </p>
                <div className="pt-2 text-[11px] text-neutral-500">
                  <span>Contacto: {prof.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-neutral-900">
        <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-bold text-neutral-200">Certificación Internacional</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Nuestros planes de entrenamiento se adhieren a las normativas de la NSCA y CrossFit HQ.
          </p>
        </div>

        <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-bold text-neutral-200">Seguridad Biomecánica</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Evaluación física inicial obligatoria para identificar desbalances posturales y adecuar las cargas.
          </p>
        </div>

        <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-2">
          <Users className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-bold text-neutral-200">Comunidad Motivadora</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Eventos internos trimestrales, talleres de nutrición y desafíos amistosos para mantenerte activo.
          </p>
        </div>
      </div>
    </div>
  );
};
