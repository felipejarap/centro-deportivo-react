import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Clock, MapPin, User as UserIcon, Filter, ArrowRight } from 'lucide-react';

export const ClassesPage = () => {
  const { classes, setCurrentView, currentUser } = useGym();
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const categories = ['todas', 'CrossFit & Funcional', 'Fuerza & Levantamiento', 'Yoga & Movilidad', 'Cardio & HIIT'];

  const filteredClasses = selectedCategory === 'todas'
    ? classes
    : classes.filter(c => c.categoria === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-900 pb-8">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Catálogo & Horarios
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 tracking-tight">
            Clases guiadas por entrenadores de élite
          </h1>
          <p className="text-xs text-neutral-400">
            Explora nuestra oferta semanal. Inscríbete como socio para reservar tu cupo en tiempo real.
          </p>
        </div>

        {currentUser?.rol === 'alumno' ? (
          <button
            onClick={() => setCurrentView('alumno-clases')}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            Ir a Reservar Cupo
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('registro')}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            Registrarme para Reservar
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 p-1 bg-neutral-900/60 rounded-xl border border-neutral-800">
        <span className="text-neutral-500 text-xs px-3 font-semibold uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Categoría:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
            }`}
          >
            {cat === 'todas' ? 'Todas las Clases' : cat}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
          <div
            key={cls.id}
            className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all group"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-950">
                <img
                  src={cls.imagen}
                  alt={cls.nombre}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded uppercase tracking-wider">
                  {cls.categoria}
                </div>
                <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded">
                  {cls.intensidad}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                    {cls.nombre}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {cls.descripcion}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{cls.horario}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{cls.sala}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Coach: {cls.profesorNombre}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-neutral-800/50 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Cupos Disponibles</span>
                <span className="text-sm font-bold font-mono text-neutral-200 tabular-nums">
                  {cls.cupoDisponible} / {cls.cupoMaximo}
                </span>
              </div>

              {currentUser?.rol === 'alumno' ? (
                <button
                  onClick={() => setCurrentView('alumno-clases')}
                  className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
                >
                  Reservar
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('registro')}
                  className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Inscribirse
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
