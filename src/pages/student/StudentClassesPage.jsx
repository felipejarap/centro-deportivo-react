import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Clock, MapPin, User, CheckCircle2, Filter, Calendar } from 'lucide-react';

export const StudentClassesPage = () => {
  const { classes, reservations, currentUser, bookClass, setCurrentView } = useGym();
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const categories = ['todas', 'CrossFit & Funcional', 'Fuerza & Levantamiento', 'Yoga & Movilidad', 'Cardio & HIIT'];

  const filteredClasses = selectedCategory === 'todas'
    ? classes
    : classes.filter(c => c.categoria === selectedCategory);

  const handleBook = classId => {
    bookClass(classId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Portal del Alumno
          </div>
          <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
            Clases Disponibles para Reserva
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Reserva tu puesto en nuestras sesiones presenciales. Los cupos se actualizan en tiempo real.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('alumno-reservas')}
          className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-amber-500" />
          Ver Mis Reservas Activas
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 p-1 bg-neutral-900/60 rounded-xl border border-neutral-800">
        <span className="text-neutral-500 text-xs px-3 font-semibold uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Filtrar:
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
            {cat === 'todas' ? 'Todas las Categorías' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => {
          const isAlreadyReserved = reservations.some(
            r => r.claseId === cls.id && r.alumnoId === currentUser?.id && r.estado === 'confirmada'
          );
          const isSoldOut = cls.cupoDisponible <= 0;

          return (
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
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded">
                    {cls.categoria}
                  </div>
                  <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded">
                    {cls.intensidad}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                      {cls.nombre}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {cls.descripcion}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-neutral-300 pt-3 border-t border-neutral-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{cls.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{cls.sala}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Profesor: {cls.profesorNombre}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Action Footer */}
              <div className="p-5 pt-0 border-t border-neutral-800/50 mt-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-500">Cupos Libres</div>
                  <div className={`text-sm font-bold font-mono tabular-nums ${isSoldOut ? 'text-rose-400' : 'text-neutral-200'}`}>
                    {cls.cupoDisponible} / {cls.cupoMaximo}
                  </div>
                </div>

                {isAlreadyReserved ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ya Reservado</span>
                  </div>
                ) : isSoldOut ? (
                  <div className="px-3 py-1.5 bg-neutral-800 text-neutral-500 text-xs font-semibold rounded-lg">
                    Agotado
                  </div>
                ) : (
                  <button
                    onClick={() => handleBook(cls.id)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    Reservar Cupo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
