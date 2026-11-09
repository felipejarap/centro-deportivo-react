import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { PageHeader } from '../../components/PageHeader.jsx';
import { Modal } from '../../components/Modal.jsx';
import { ConfirmModal } from '../../components/ConfirmModal.jsx';
import { Button } from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { FormField } from '../../components/FormField.jsx';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Star
} from 'lucide-react';

export const AdminPlansPage = () => {
  const { plans, createPlan, updatePlan, deletePlan, addToast } = useGym();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: 39990,
    periodo: 'Mensual',
    duracionMeses: 1,
    clasesPorMes: 'Clases Ilimitadas',
    beneficiosText: 'Acceso a todas las sedes\nClases grupales ilimitadas\nCasillero incluido',
    destacado: false,
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      nombre: '',
      precio: 39990,
      periodo: 'Mensual',
      duracionMeses: 1,
      clasesPorMes: 'Clases Ilimitadas',
      beneficiosText: 'Acceso a todas las sedes\nClases grupales ilimitadas\nCasillero incluido',
      destacado: false,
      estado: 'activo'
    });
    setErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = plan => {
    setEditingPlan(plan);
    setFormData({
      nombre: plan.nombre,
      precio: plan.precio,
      periodo: plan.periodo,
      duracionMeses: plan.duracionMeses,
      clasesPorMes: plan.clasesPorMes,
      beneficiosText: plan.beneficios.join('\n'),
      destacado: Boolean(plan.destacado),
      estado: plan.estado
    });
    setErrors({});
    setGeneralError(null);
    setIsModalOpen(true);
  };

  // View-level validation for Plans
  const validateForm = () => {
    const errs = {};
    if (!formData.nombre || !formData.nombre.trim()) {
      errs.nombre = 'El nombre del plan es obligatorio.';
    }

    const price = Number(formData.precio);
    if (isNaN(price) || price < 0) {
      errs.precio = 'El precio debe ser un número igual o superior a 0.';
    }

    const months = Number(formData.duracionMeses);
    if (isNaN(months) || months < 1) {
      errs.duracionMeses = 'La duración debe ser de al menos 1 mes.';
    }

    if (!formData.beneficiosText || !formData.beneficiosText.trim()) {
      errs.beneficiosText = 'Agrega al menos un beneficio.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      setGeneralError('Por favor corrige los campos con error antes de continuar.');
      return;
    }

    const beneficiosArray = formData.beneficiosText
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean);

    const payload = {
      nombre: formData.nombre,
      precio: Number(formData.precio),
      periodo: formData.periodo,
      duracionMeses: Number(formData.duracionMeses),
      clasesPorMes: formData.clasesPorMes,
      beneficios: beneficiosArray,
      destacado: formData.destacado,
      estado: formData.estado
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, payload);
      addToast('success', `Plan "${formData.nombre}" actualizado.`);
    } else {
      createPlan(payload);
      addToast('success', `Plan "${formData.nombre}" creado exitosamente.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Reusable PageHeader */}
      <PageHeader
        category="Administración · Mantenedor de Planes"
        title="Gestión de Planes & Membresías"
        description="Configura las tarifas, beneficios, aforos de clases y periodos de suscripción ofrecidos al público."
        action={
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Crear Nuevo Plan
          </Button>
        }
      />

      {/* Plans List Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
              plan.destacado
                ? 'bg-neutral-900 border-amber-500/80 shadow-xl shadow-amber-500/10'
                : 'bg-neutral-900/40 border-neutral-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="amber">{plan.periodo}</Badge>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(plan)}
                    className="p-1 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Editar plan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmPlan(plan)}
                    className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Eliminar plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
                <span>{plan.nombre}</span>
                {plan.destacado && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
              </h3>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-mono text-neutral-100">
                  ${plan.precio.toLocaleString('es-CL')}
                </span>
                <span className="text-xs text-neutral-400">/{plan.periodo.toLowerCase()}</span>
              </div>

              <div className="text-xs text-amber-400 font-semibold mt-1">
                {plan.clasesPorMes}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 space-y-2">
                <div className="text-[10px] font-bold uppercase text-neutral-500">Beneficios:</div>
                {plan.beneficios.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
              <span>{plan.usuariosActivos} suscriptores activos</span>
              <span className="capitalize text-emerald-400 font-medium">{plan.estado}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reusable Modal for Plan Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'Editar Plan de Membresía' : 'Crear Nuevo Plan'}
        icon={CreditCard}
        maxWidth="2xl"
      >
        {generalError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg">
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Nombre del Plan" error={errors.nombre} required>
            <input
              type="text"
              value={formData.nombre}
              onChange={e => {
                setFormData({ ...formData, nombre: e.target.value });
                if (errors.nombre) setErrors({ ...errors, nombre: null });
              }}
              placeholder="Ej: Plan Black KRONOFIT"
              className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                errors.nombre ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
              }`}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Precio Mensual (CLP)" error={errors.precio} required>
              <input
                type="number"
                value={formData.precio}
                onChange={e => {
                  setFormData({ ...formData, precio: e.target.value });
                  if (errors.precio) setErrors({ ...errors, precio: null });
                }}
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  errors.precio ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>

            <FormField label="Periodo / Modalidad">
              <select
                value={formData.periodo}
                onChange={e => setFormData({ ...formData, periodo: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Mensual">Mensual</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Duración (Meses)" error={errors.duracionMeses} required>
              <input
                type="number"
                value={formData.duracionMeses}
                onChange={e => {
                  setFormData({ ...formData, duracionMeses: e.target.value });
                  if (errors.duracionMeses) setErrors({ ...errors, duracionMeses: null });
                }}
                className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                  errors.duracionMeses ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                }`}
              />
            </FormField>

            <FormField label="Cupo de Clases por Mes">
              <input
                type="text"
                value={formData.clasesPorMes}
                onChange={e => setFormData({ ...formData, clasesPorMes: e.target.value })}
                placeholder="Ej: Clases Ilimitadas, 12 clases/mes"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </FormField>
          </div>

          <FormField
            label="Beneficios (1 por línea)"
            error={errors.beneficiosText}
            required
            helperText="Escribe un beneficio por línea para mostrarlos como viñetas."
          >
            <textarea
              rows={4}
              value={formData.beneficiosText}
              onChange={e => {
                setFormData({ ...formData, beneficiosText: e.target.value });
                if (errors.beneficiosText) setErrors({ ...errors, beneficiosText: null });
              }}
              placeholder="Acceso 24/7 a sala de pesas&#10;Clases grupales ilimitadas&#10;Evaluación nutricional mensual"
              className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors resize-none ${
                errors.beneficiosText ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
              }`}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="destacado"
              checked={formData.destacado}
              onChange={e => setFormData({ ...formData, destacado: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-950 cursor-pointer"
            />
            <label htmlFor="destacado" className="text-xs text-neutral-300 select-none cursor-pointer">
              Marcar como plan Destacado / Recomendado
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md">
              {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reusable ConfirmModal for Deleting Plan */}
      <ConfirmModal
        isOpen={!!deleteConfirmPlan}
        onClose={() => setDeleteConfirmPlan(null)}
        onConfirm={() => {
          if (deleteConfirmPlan) {
            deletePlan(deleteConfirmPlan.id);
            addToast('info', `Plan "${deleteConfirmPlan.nombre}" eliminado.`);
            setDeleteConfirmPlan(null);
          }
        }}
        title="¿Eliminar Plan?"
        message={
          deleteConfirmPlan
            ? `¿Estás seguro de que deseas eliminar el plan ${deleteConfirmPlan.nombre}? Esta acción afectará las opciones de contratación.`
            : ''
        }
        confirmText="Eliminar Plan"
        cancelText="Cancelar"
        isDanger={true}
      />
    </div>
  );
};
