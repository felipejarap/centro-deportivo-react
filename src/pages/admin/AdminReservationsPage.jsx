import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { FilterBar } from '../../components/FilterBar.jsx';
import { Badge } from '../../components/Badge.jsx';
import { CheckCircle2 } from 'lucide-react';

export const AdminReservationsPage = () => {
  const {
    reservations,
    classes,
    updateReservationStatus,
    cancelReservation,
    confirmReservation,
    addToast
  } = useGym();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filteredReservations = reservations.filter(res => {
    const matchesSearch =
      res.alumnoNombre.toLowerCase().includes(search.toLowerCase()) ||
      res.alumnoEmail.toLowerCase().includes(search.toLowerCase()) ||
      res.claseNombre.toLowerCase().includes(search.toLowerCase()) ||
      res.profesorNombre.toLowerCase().includes(search.toLowerCase());

    const matchesClass = classFilter === 'todas' || res.claseId === classFilter;
    const matchesStatus = statusFilter === 'todos' || res.estado === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Reusable PageHeader */}
      <PageHeader
        category="Administración · Auditoría de Clases"
        title="Control General de Reservas"
        description="Supervisa el aforo, cancelaciones, asistencias y turnos tomados por los alumnos en todas las clases."
      />

      {/* Reusable FilterBar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por alumno, correo, clase o coach..."
      >
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-[11px] uppercase font-bold text-neutral-500">Clase:</span>
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="todas">Todas las Clases</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-[11px] uppercase font-bold text-neutral-500">Estado:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="todos">Todos los Estados</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </FilterBar>

      {/* Reservations Table */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Alumno</th>
                <th className="py-3 px-4">Clase Reservada</th>
                <th className="py-3 px-4">Coach</th>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Cupo</th>
                <th className="py-3 px-4">Asistencia</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No se encontraron reservas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-200">{res.alumnoNombre}</div>
                      <div className="text-[11px] text-neutral-400">{res.alumnoEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-neutral-100">
                      {res.claseNombre}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300">
                      {res.profesorNombre}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300">
                      <div>{res.fecha}</div>
                      <div className="text-[11px] text-neutral-400">{res.horario}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-200">
                      #{res.cupoAsignado}
                    </td>

                    <td className="py-3.5 px-4">
                      {res.asistio ? (
                        <Badge variant="emerald" icon={CheckCircle2}>
                          Presente
                        </Badge>
                      ) : (
                        <Badge variant="neutral">
                          No Registrada
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          res.estado === 'confirmada'
                            ? 'emerald'
                            : res.estado === 'pendiente'
                            ? 'amber'
                            : 'rose'
                        }
                      >
                        {res.estado}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.estado === 'pendiente' && (
                          <button
                            type="button"
                            onClick={() => {
                              confirmReservation(res.id);
                              addToast('success', 'Reserva confirmada.');
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors cursor-pointer"
                          >
                            Confirmar
                          </button>
                        )}
                        {res.estado !== 'cancelada' && (
                          <button
                            type="button"
                            onClick={() => {
                              cancelReservation(res.id);
                              addToast('info', 'Reserva cancelada.');
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                        <select
                          value={res.estado}
                          onChange={e => {
                            updateReservationStatus(res.id, e.target.value);
                            addToast('info', `Estado actualizado a ${e.target.value}`);
                          }}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-[10px] text-neutral-300"
                        >
                          <option value="confirmada">Confirmada</option>
                          <option value="pendiente">Pendiente</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
