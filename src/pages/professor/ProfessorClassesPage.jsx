import React from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Clock, MapPin, Users, ChevronRight } from 'lucide-react';

export const ProfessorClassesPage = () => {
  const { classes, reservations, currentUser, setSelectedClassId, setCurrentView } = useGym();

  const professorClasses = currentUser?.rol === 'profesor'
    ? classes.filter(c => c.profesorId === currentUser.id)
    : classes;

  const handleOpenClassDetail = classId => {
    setSelectedClassId(classId);
    setCurrentView('profesor-detalle-clase');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Panel de Profesor
          </div>
          <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
            Mis Clases Asignadas
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestiona tus sesiones grupales, monitorea cupos y toma asistencia de alumnos en tiempo real.
          </p>
        </div>

        <div className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 self-start sm:self-auto">
          Coach: <span className="font-semibold text-neutral-200">{currentUser?.nombre} {currentUser?.apellido}</span>
        </div>
      </div>

      {/* Classes list */}
      <div className="space-y-4">
        {professorClasses.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-3">
            <Users className="w-8 h-8 text-neutral-600 mx-auto" />
            <div className="text-sm font-semibold text-neutral-300">No tienes clases asignadas actualmente</div>
            <p className="text-xs text-neutral-500">Comunícate con el administrador para vincular clases a tu perfil.</p>
          </div>
        ) : (
          professorClasses.map(cls => {
            const classReservations = reservations.filter(
              r => r.claseId === cls.id && r.estado !== 'cancelada'
            );
            const attendedCount = classReservations.filter(r => r.asistenciaRegistrada).length;
            const registeredCount = classReservations.length;

            return (
              <div
                key={cls.id}
                className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 sm:p-6 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={cls.imagen}
                    alt={cls.nombre}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover shrink-0 ring-1 ring-neutral-800 hidden sm:block"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {cls.categoria}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {cls.intensidad}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-100">
                      {cls.nombre}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{cls.horario}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{cls.sala}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quotas & Attendance Badge */}
                <div className="flex flex-wrap items-center gap-6 self-stretch md:self-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-neutral-400">Alumnos Inscritos</div>
                    <div className="text-base font-bold font-mono text-neutral-100 tabular-nums">
                      {registeredCount} <span className="text-xs text-neutral-500 font-sans">/ {cls.cupoMaximo} cupos</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      {attendedCount} asistencias marcadas
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenClassDetail(cls.id)}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    <span>Tomar Asistencia</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
