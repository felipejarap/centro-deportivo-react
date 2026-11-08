import React from 'react';
import { useGym } from '../../context/GymContext.jsx';
import {
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  CheckSquare,
  Square,
  ExternalLink
} from 'lucide-react';

export const ClassDetailPage = () => {
  const {
    classes,
    reservations,
    users,
    selectedClassId,
    setCurrentView,
    setViewingProfileUserId,
    toggleAttendance
  } = useGym();

  const selectedClass = classes.find(c => c.id === selectedClassId);

  if (!selectedClass) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-neutral-400">No se ha seleccionado ninguna clase.</p>
        <button
          onClick={() => setCurrentView('profesor-clases')}
          className="px-4 py-2 text-xs font-bold bg-amber-500 text-neutral-950 rounded-lg cursor-pointer"
        >
          Volver a Mis Clases
        </button>
      </div>
    );
  }

  const classReservations = reservations.filter(
    r => r.claseId === selectedClass.id && r.estado !== 'cancelada'
  );

  const attendedTotal = classReservations.filter(r => r.asistenciaRegistrada).length;
  const attendanceRate = classReservations.length > 0
    ? Math.round((attendedTotal / classReservations.length) * 100)
    : 0;

  const handleViewStudentProfile = studentId => {
    setViewingProfileUserId(studentId);
    setCurrentView('perfil');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top back navigation */}
      <button
        onClick={() => setCurrentView('profesor-clases')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Mis Clases
      </button>

      {/* Class Overview Header */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {selectedClass.categoria}
            </span>
            <span className="text-xs text-neutral-400">· Intensidad {selectedClass.intensidad}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
            {selectedClass.nombre}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{selectedClass.horario}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{selectedClass.sala}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Coach: {selectedClass.profesorNombre}</span>
            </div>
          </div>
        </div>

        {/* Attendance Summary Stat Card */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-5 flex items-center gap-6 shrink-0">
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Control de Asistencia
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-neutral-100 mt-0.5">
              {attendedTotal} / {classReservations.length}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {attendanceRate}% presentismo
            </div>
          </div>

          <div className="w-16 h-16 rounded-full bg-neutral-900 border-4 border-amber-500/30 flex items-center justify-center font-mono font-bold text-sm text-amber-400">
            {attendanceRate}%
          </div>
        </div>
      </div>

      {/* Student List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Listado de Alumnos Inscritos ({classReservations.length})
          </h2>
          <span className="text-xs text-neutral-400">
            Haz clic en la casilla para registrar la asistencia del alumno
          </span>
        </div>

        {classReservations.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-2">
            <p className="text-neutral-400 text-sm">Aún no hay alumnos inscritos en esta clase.</p>
            <p className="text-xs text-neutral-600">Las reservas realizadas por los alumnos aparecerán automáticamente aquí.</p>
          </div>
        ) : (
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
            {classReservations.map(reservation => {
              const student = users.find(u => u.id === reservation.alumnoId);
              const isAttended = reservation.asistenciaRegistrada;

              return (
                <div
                  key={reservation.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isAttended ? 'bg-amber-500/[0.03]' : 'hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Interactive Checkbox for Attendance Registration */}
                    <button
                      type="button"
                      onClick={() => toggleAttendance(reservation.id, !isAttended)}
                      className="p-1 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer group"
                      title={isAttended ? 'Desmarcar asistencia' : 'Marcar presente'}
                    >
                      {isAttended ? (
                        <div className="w-6 h-6 rounded bg-emerald-500 text-neutral-950 flex items-center justify-center transition-transform scale-105">
                          <CheckSquare className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded border-2 border-neutral-600 group-hover:border-amber-400 flex items-center justify-center transition-colors">
                          <Square className="w-3.5 h-3.5 text-transparent" />
                        </div>
                      )}
                    </button>

                    {/* Student Info */}
                    <img
                      src={student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={reservation.alumnoNombre}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-700"
                    />

                    <div>
                      <div className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                        <span>{reservation.alumnoNombre}</span>
                        {isAttended && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded">
                            Presente {reservation.asistenciaHora && `(${reservation.asistenciaHora})`}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {reservation.alumnoEmail} · RUT: {student?.rut || 'Sin RUT'}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: View Profile */}
                  <div className="flex items-center gap-3 pl-10 sm:pl-0">
                    <button
                      type="button"
                      onClick={() => handleViewStudentProfile(reservation.alumnoId)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                      Ver Perfil del Alumno
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
