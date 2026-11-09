import React from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Dumbbell, ArrowRight, ShieldCheck, Flame, Trophy, CheckCircle2 } from 'lucide-react';

export const HomePage = () => {
  const { setCurrentView, setPreselectedPlanId, plans } = useGym();

  const handleSelectPlan = planId => {
    setPreselectedPlanId(planId);
    setCurrentView('registro');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/hero_gym_modern_1794172172469.jpg"
            alt="Instalaciones de alto estándar KRONOFIT"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <SparklesIcon className="w-3.5 h-3.5" />
              Temporada 2026 · Cupos Limitados
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-neutral-100 tracking-tight leading-[1.1] text-balance">
              Eleva tu estándar físico con <span className="text-amber-500">entrenamiento</span> de clase mundial.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              Instalaciones de nivel olímpico, programación guiada por entrenadores certificados y reserva inteligente de clases en tiempo real.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('registro')}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 cursor-pointer group"
              >
                Comenzar Ahora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('planes')}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                Ver Planes de Membresía
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar with Tabular Figures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-900/60 border border-neutral-800/80 rounded-xl">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-neutral-100">
              1.450<span className="text-amber-500">+</span>
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">
              Socios Activos
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-neutral-100">
              48<span className="text-amber-500">/sem</span>
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">
              Clases Grupales
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-neutral-100">
              100<span className="text-amber-500">%</span>
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">
              Coaches Certificados
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-neutral-100">
              1.200<span className="text-amber-500">m²</span>
            </div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mt-1">
              Área de Entrenamiento
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines & Visual Classes Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
              Entrenamiento Especializado
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight">
              Disciplinas diseñadas para rendimiento real
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('clases')}
            className="text-xs font-semibold text-neutral-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
          >
            Explorar todas las clases
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden flex flex-col transition-all hover:border-neutral-700">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <img
                src="/src/assets/class_functional_1794172184894.jpg"
                alt="Clase funcional y crossfit"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-semibold text-amber-400 px-2.5 py-1 rounded">
                CrossFit & Fuerza
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  CrossFit, HIIT & Acondicionamiento Metabólico
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                  Entrena con barras olímpicas, kettlebells, trineos de empuje y cuerdas. Sesiones guiadas de 60 minutos con aforo controlado para corrección técnica personalizada.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span>Intensidad Alta / Extrema</span>
                <span>Max 16 atletas</span>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden flex flex-col transition-all hover:border-neutral-700">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <img
                src="/src/assets/class_wellness_1794172196807.jpg"
                alt="Clase de yoga y movilidad"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-semibold text-emerald-400 px-2.5 py-1 rounded">
                Movilidad & Bienestar
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Vinyasa Flow, Pilates Mat & Regeneración
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                  Optimiza la postura corporal, amplía el rango de movilidad articular y acelera la recuperación neuromuscular en nuestro estudio zen con piso de madera natural.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span>Intensidad Media</span>
                <span>Max 20 atletas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plans Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Planes Transparentes
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight">
            Elige la membresía que impulse tus metas
          </h2>
          <p className="text-xs text-neutral-400">
            Sin contratos de permanencia forzada. Cancela o renueva cuando desees desde tu panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-xl p-6 flex flex-col justify-between transition-all ${
                plan.destacado
                  ? 'bg-neutral-900 border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10'
                  : 'bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                {plan.destacado && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded mb-3">
                    Más Elegido por Alumnos
                  </span>
                )}
                <h3 className="text-lg font-bold text-neutral-100">{plan.nombre}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-neutral-100">
                    ${plan.precio.toLocaleString('es-CL')}
                  </span>
                  <span className="text-xs text-neutral-400">/{plan.periodo}</span>
                </div>
                <p className="text-xs text-amber-400/90 font-medium mt-1">{plan.clasesPorMes}</p>

                <div className="mt-6 pt-6 border-t border-neutral-800 space-y-2.5">
                  {plan.beneficios.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full mt-8 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                  plan.destacado
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100'
                }`}
              >
                Inscribirme con {plan.nombre}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-100">Aforo y Cupos Garantizados</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Sistema de reservas en tiempo real. Nunca entrenarás en una sala hacinada; cada alumno cuenta con su puesto y material asignado.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-100">Coaches Profesionales</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Nuestros profesores registran tu progreso y asistencia en cada clase para ayudarte a cumplir tus metas con seguridad técnica.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-100">Comunidad y Rendimiento</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Un ambiente exigente pero acogedor. Únete a sesiones grupales que te motivan a superar tus propios límites día a día.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 tracking-tight">
            ¿Listo para comenzar a entrenar en serio?
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Crea tu cuenta de socio en menos de 2 minutos y reserva tu primera sesión hoy mismo.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentView('registro')}
              className="px-8 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
            >
              Registrarme como Alumno
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
