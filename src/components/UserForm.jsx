import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  FileText,
  Activity,
  AlertCircle
} from 'lucide-react';
import { FormField } from './FormField.jsx';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';

/**
 * Pure presentational UserForm component.
 * Validations and state are maintained in the parent view (RegisterPage or AdminUsersPage).
 */
export const UserForm = ({
  formData,
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  roles = [],
  plans = [],
  isRegister = false,
  isEdit = false,
  isSubmitting = false,
  generalError = null
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {generalError && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Role notice in register mode */}
      {isRegister && (
        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Tipo de cuenta:
          </span>
          <Badge variant="amber">
            Socio / Alumno de KRONOFIT
          </Badge>
        </div>
      )}

      {/* Personal Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.nombre} required>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={onChange}
              placeholder="Ej: Sofía"
              className={`w-full bg-neutral-900 border rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.nombre
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-amber-500'
              }`}
            />
          </div>
        </FormField>

        <FormField label="Apellido" error={errors.apellido} required>
          <input
            type="text"
            name="apellido"
            value={formData.apellido || ''}
            onChange={onChange}
            placeholder="Ej: Valenzuela"
            className={`w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
              errors.apellido
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-neutral-800 focus:border-amber-500'
            }`}
          />
        </FormField>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Correo Electrónico" error={errors.email} required>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={onChange}
              placeholder="ejemplo@correo.com"
              className={`w-full bg-neutral-900 border rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-neutral-800 focus:border-amber-500'
              }`}
            />
          </div>
        </FormField>

        <FormField label="Teléfono Móvil" error={errors.telefono}>
          <div className="relative">
            <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="tel"
              name="telefono"
              value={formData.telefono || ''}
              onChange={onChange}
              placeholder="+56 9 1234 5678"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </FormField>
      </div>

      {/* RUT & Emergency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="RUT / Identificación" error={errors.rut}>
          <div className="relative">
            <FileText className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              name="rut"
              value={formData.rut || ''}
              onChange={onChange}
              placeholder="12.345.678-9"
              className={`w-full bg-neutral-900 border rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.rut ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
              }`}
            />
          </div>
        </FormField>

        <FormField label="Contacto de Emergencia" error={errors.contactoEmergencia}>
          <input
            type="text"
            name="contactoEmergencia"
            value={formData.contactoEmergencia || ''}
            onChange={onChange}
            placeholder="Familiar y teléfono"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </FormField>
      </div>

      {/* Role & Status (In Admin mode) */}
      {!isRegister && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-900/60 border border-neutral-800 rounded-lg">
          <FormField label="Rol Asignado" error={errors.rol} required>
            <select
              name="rol"
              value={formData.rol || 'alumno'}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.nombre} ({r.id})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Estado de Cuenta" error={errors.estado} required>
            <select
              name="estado"
              value={formData.estado || 'activo'}
              onChange={onChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="activo">Activo (Acceso Completo)</option>
              <option value="inactivo">Inactivo (Pausado)</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </FormField>
        </div>
      )}

      {/* Conditional: Specialty for Professor */}
      {formData.rol === 'profesor' && (
        <div className="p-4 bg-sky-950/20 border border-sky-800/40 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            Perfil Profesional del Coach
          </div>
          <FormField label="Especialidad / Disciplina" error={errors.especialidad} required>
            <input
              type="text"
              name="especialidad"
              value={formData.especialidad || ''}
              onChange={onChange}
              placeholder="Ej: Powerlifting & Fuerza, HIIT Funcional, Yoga..."
              className={`w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.especialidad ? 'border-rose-500' : 'border-neutral-800 focus:border-sky-500'
              }`}
            />
          </FormField>
          <FormField label="Biografía o Certificaciones" error={errors.bio}>
            <textarea
              name="bio"
              rows={2}
              value={formData.bio || ''}
              onChange={onChange}
              placeholder="Breve reseña sobre experiencia o credenciales..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-sky-500 resize-none transition-colors"
            />
          </FormField>
        </div>
      )}

      {/* Conditional: Plan for Student */}
      {isRegister && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-3">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Plan de Membresía Inicial
          </label>
          <select
            name="planId"
            value={formData.planId || 'plan-black'}
            onChange={onChange}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
          >
            {plans.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} — ${Number(p.precio).toLocaleString('es-CL')}/mes
              </option>
            ))}
          </select>
          <p className="text-[11px] text-neutral-400">
            Podrás gestionar o cambiar tu plan en cualquier momento desde tu panel de suscripción.
          </p>
        </div>
      )}

      {/* Password Fields */}
      {(!isEdit || isRegister) && (
        <div className="space-y-4 pt-2 border-t border-neutral-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Contraseña"
              error={errors.password}
              required
              helperText="Mínimo 6 caracteres"
            >
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password || ''}
                  onChange={onChange}
                  placeholder="••••••••"
                  className={`w-full bg-neutral-900 border rounded-lg pl-9 pr-10 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            {isRegister && (
              <FormField
                label="Confirmar Contraseña"
                error={errors.confirmPassword}
                required
              >
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={onChange}
                    placeholder="••••••••"
                    className={`w-full bg-neutral-900 border rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors ${
                      errors.confirmPassword
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-amber-500'
                    }`}
                  />
                </div>
              </FormField>
            )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Guardando...'
            : isRegister
            ? 'Completar Registro'
            : isEdit
            ? 'Guardar Cambios'
            : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};
