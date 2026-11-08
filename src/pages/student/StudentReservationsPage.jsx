import React from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { Calendar, Clock, MapPin, User, CheckCircle2, Plus } from 'lucide-react';

export const StudentReservationsPage = () => {
  const { reservations, currentUser, cancelReservation, confirmReservation, setCurrentView } = useGym();

  const myReservations = reservations.filter(r => r.alumnoId === currentUser?.id);
  const activeReservations = myReservations.filter(r => r.estado === 'confirmada');
  const pastOrCancelled = myReservations.filter(r => r.estado !== 'confirmada');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Portal del Alumno
          </div>
          <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
            Mis Reservas
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Revisa tus turnos agendados, confirma tu asistencia o cancela con anticipación para liberar cupos.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('alumno-clases')}
          className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-md shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          Nueva Reserva
        </button>
      </div>

      {/* Active Reservations Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          Próximas Sesiones Confirmadas ({activeReservations.length})
        </h2>

        {activeReservations.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-3">
            <p className="text-xs text-neutral-400">No tienes ninguna reserva activa en este momento.</p>
            <button
              onClick={() => setCurrentView('alumno-clases')}
              className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
            >
              Explorar clases disponibles y reservar &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map(res => (
              <div
                key={res.id}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Reserva Confirmada
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Fecha: {res.fechaClase}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-100">
                    {res.claseNombre}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{res.claseHorario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{res.claseSala}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Profesor: {res.profesorNombre}</span>
                    </div>
                  </div>
                </div>

                {/* Cancel or status actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    {res.asistenciaRegistrada ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Asistencia marcada por el coach
                      </span>
                    ) : (
                      'Presentarse 5 min antes'
                    )}
                  </span>

                  <button
                    onClick={() => cancelReservation(res.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History and Cancelled Reservations */}
      {pastOrCancelled.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-neutral-900">
          <h2 className="text-sm font-bold text-neutral-300">
            Historial de Reservas Pasadas o Canceladas
          </h2>

          <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl divide-y divide-neutral-800 overflow-hidden">
            {pastOrCancelled.map(res => (
              <div
                key={res.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400"
              >
                <div>
                  <div className="font-semibold text-neutral-200">
                    {res.claseNombre}
                  </div>
                  <div>
                    {res.fechaClase} · {res.claseHorario} · Coach: {res.profesorNombre}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {res.estado === 'asistio' && (
                    <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Asistió
                    </span>
                  )}
                  {res.estado === 'cancelada' && (
                    <span className="text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
                      Cancelada
                    </span>
                  )}
                  {res.estado === 'cancelada' && (
                    <button
                      onClick={() => confirmReservation(res.id)}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      Re-confirmar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
