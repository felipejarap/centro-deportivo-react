import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { FilterBar } from '../../components/FilterBar.jsx';
import { Modal } from '../../components/Modal.jsx';
import { Button } from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { FormField } from '../../components/FormField.jsx';
import {
  CreditCard,
  Plus,
  RefreshCw
} from 'lucide-react';

export const AdminSubscriptionsPage = () => {
  const {
    subscriptions,
    plans,
    users,
    renewSubscription,
    cancelSubscription,
    createSubscription,
    addToast
  } = useGym();

  const students = users.filter(u => u.rol === 'alumno');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Modal create subscription
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    usuarioId: students[0]?.id || '',
    planId: plans[0]?.id || '',
    metodoPago: 'Tarjeta de Crédito / Débito',
    renovacionAutomatica: true
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch =
      sub.usuarioNombre.toLowerCase().includes(search.toLowerCase()) ||
      sub.usuarioEmail.toLowerCase().includes(search.toLowerCase()) ||
      sub.planNombre.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || sub.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      usuarioId: students[0]?.id || '',
      planId: plans[0]?.id || '',
      metodoPago: 'Tarjeta de Crédito / Débito',
      renovacionAutomatica: true
    });
    setErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  // View-level validation for subscription form
  const validateForm = () => {
    const errs = {};
    if (!formData.usuarioId) {
      errs.usuarioId = 'Debes seleccionar un alumno.';
    }
    if (!formData.planId) {
      errs.planId = 'Debes seleccionar un plan de membresía.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      setGeneralError('Por favor selecciona los datos requeridos.');
      return;
    }

    const selectedUser = users.find(u => u.id === formData.usuarioId);
    const selectedPlan = plans.find(p => p.id === formData.planId);

    if (!selectedUser || !selectedPlan) {
      setGeneralError('Usuario o plan no encontrado.');
      return;
    }

    createSubscription(selectedUser.id, selectedPlan.id, formData.metodoPago);
    addToast('success', `Suscripción al plan "${selectedPlan.nombre}" asignada con éxito.`);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Reusable PageHeader */}
      <PageHeader
        category="Administración · Finanzas & Membresías"
        title="Control de Suscripciones"
        description="Supervisa los cobros, renovaciones y vigencia de membresías de todos los socios de KRONOFIT."
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Nueva Suscripción
          </Button>
        }
      />

      {/* Reusable FilterBar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por socio, correo o plan..."
      >
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-[11px] uppercase font-bold text-neutral-500">Estado:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activa">Activa</option>
            <option value="vencida">Vencida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </FilterBar>

      {/* Subscriptions Table */}
      <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Socio Titular</th>
                <th className="py-3 px-4">Plan Contratado</th>
                <th className="py-3 px-4">Tarifa</th>
                <th className="py-3 px-4">Inicio & Vencimiento</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    No se encontraron suscripciones activas.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map(sub => (
                  <tr key={sub.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-200">{sub.usuarioNombre}</div>
                      <div className="text-[11px] text-neutral-400">{sub.usuarioEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-neutral-100">
                      {sub.planNombre}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-neutral-200">
                      ${sub.monto.toLocaleString('es-CL')}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-300">
                      <div>Desde: {sub.fechaInicio}</div>
                      <div className="text-[11px] text-amber-400/90">Hasta: {sub.fechaVencimiento}</div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                      <div>{sub.metodoPago}</div>
                      {sub.renovacionAutomatica && (
                        <span className="text-[10px] text-emerald-400">Renovación auto.</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          sub.estado === 'activa'
                            ? 'emerald'
                            : sub.estado === 'vencida'
                            ? 'amber'
                            : 'rose'
                        }
                      >
                        {sub.estado}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.estado !== 'activa' && (
                          <button
                            type="button"
                            onClick={() => {
                              renewSubscription(sub.id);
                              addToast('success', `Membresía renovada para ${sub.usuarioNombre}.`);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Renovar
                          </button>
                        )}
                        {sub.estado === 'activa' && (
                          <button
                            type="button"
                            onClick={() => {
                              cancelSubscription(sub.id);
                              addToast('info', `Membresía cancelada para ${sub.usuarioNombre}.`);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Modal for Subscription Creation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Asignar Nueva Suscripción"
        icon={CreditCard}
        maxWidth="lg"
      >
        {generalError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg">
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Socio / Alumno" error={errors.usuarioId} required>
            <select
              value={formData.usuarioId}
              onChange={e => {
                setFormData({ ...formData, usuarioId: e.target.value });
                if (errors.usuarioId) setErrors({ ...errors, usuarioId: null });
              }}
              className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                errors.usuarioId ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
              }`}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} {s.apellido} ({s.email})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Plan de Membresía" error={errors.planId} required>
            <select
              value={formData.planId}
              onChange={e => {
                setFormData({ ...formData, planId: e.target.value });
                if (errors.planId) setErrors({ ...errors, planId: null });
              }}
              className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                errors.planId ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
              }`}
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — ${p.precio.toLocaleString('es-CL')} / {p.periodo}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Forma de Pago">
            <select
              value={formData.metodoPago}
              onChange={e => setFormData({ ...formData, metodoPago: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
            >
              <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              <option value="Efectivo en Recepción">Efectivo en Recepción</option>
            </select>
          </FormField>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.renovacionAutomatica}
              onChange={e => setFormData({ ...formData, renovacionAutomatica: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-950 cursor-pointer"
            />
            <label htmlFor="autoRenew" className="text-xs text-neutral-300 select-none cursor-pointer">
              Activar renovación automática mensual
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md">
              Crear Suscripción
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
