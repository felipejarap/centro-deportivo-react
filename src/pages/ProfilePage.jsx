import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import {
  User as UserIcon,
  Lock,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const {
    currentUser,
    users,
    viewingProfileUserId,
    setViewingProfileUserId,
    subscriptions,
    plans,
    reservations,
    updateUser,
    changePassword,
    setCurrentView,
    selectedClassId
  } = useGym();

  const targetUser = viewingProfileUserId
    ? users.find(u => u.id === viewingProfileUserId) || currentUser
    : currentUser;

  const isInspectingStudent = !!viewingProfileUserId && viewingProfileUserId !== currentUser?.id;

  const [formData, setFormData] = useState({
    nombre: targetUser?.nombre || '',
    apellido: targetUser?.apellido || '',
    telefono: targetUser?.telefono || '',
    rut: targetUser?.rut || '',
    bio: targetUser?.bio || '',
    contactoEmergencia: targetUser?.contactoEmergencia || ''
  });

  const [formErrors, setFormErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMsg, setPasswordMsg] = useState(null);

  if (!targetUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-neutral-400">Usuario no encontrado.</p>
        <button
          onClick={() => setCurrentView('inicio')}
          className="px-4 py-2 text-xs font-bold bg-amber-500 text-neutral-950 rounded-lg cursor-pointer"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  const userSub = subscriptions.find(s => s.usuarioId === targetUser.id);
  const userPlan = plans.find(p => p.id === (userSub?.planId || targetUser.planId));

  const userReservations = reservations.filter(r => r.alumnoId === targetUser.id);
  const attendedCount = userReservations.filter(r => r.asistenciaRegistrada).length;

  const calculateDaysLeft = vencimientoStr => {
    if (!vencimientoStr) return 0;
    const diff = new Date(vencimientoStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDaysLeft(userSub?.fechaVencimiento);

  // Pure JavaScript validation for Profile Info
  const validateProfileForm = () => {
    const errs = {};
    if (!formData.nombre || !formData.nombre.trim()) {
      errs.nombre = 'El nombre no puede quedar vacío.';
    }
    if (!formData.apellido || !formData.apellido.trim()) {
      errs.apellido = 'El apellido no puede quedar vacío.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateProfile = e => {
    e.preventDefault();
    if (!targetUser) return;

    if (!validateProfileForm()) {
      return;
    }

    updateUser(targetUser.id, formData);
  };

  // Pure JavaScript validation for Password Change
  const validatePasswordForm = () => {
    const errs = {};
    if (!passwordData.oldPassword) {
      errs.oldPassword = 'Debes ingresar tu contraseña actual.';
    }
    if (!passwordData.newPassword) {
      errs.newPassword = 'La nueva contraseña es obligatoria.';
    } else if (passwordData.newPassword.length < 6) {
      errs.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres.';
    }

    if (!passwordData.confirmNewPassword) {
      errs.confirmNewPassword = 'Por favor confirma la nueva contraseña.';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errs.confirmNewPassword = 'Las contraseñas no coinciden.';
    }

    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();
    setPasswordMsg(null);

    // Validate with JS instead of HTML required
    if (!validatePasswordForm()) {
      return;
    }

    const res = changePassword(targetUser.id, passwordData.newPassword);
    if (res.success) {
      setPasswordMsg({ success: 'Contraseña actualizada exitosamente.' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setPasswordErrors({});
    } else {
      setPasswordMsg({ error: res.message });
    }
  };

  const handleBack = () => {
    setViewingProfileUserId(null);
    if (currentUser?.rol === 'profesor') {
      if (selectedClassId) {
        setCurrentView('profesor-detalle-clase');
      } else {
        setCurrentView('profesor-clases');
      }
    } else if (currentUser?.rol === 'admin') {
      setCurrentView('admin-usuarios');
    } else {
      setCurrentView('alumno-clases');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button or Inspection Notice */}
      {isInspectingStudent ? (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Ficha del Alumno (Modo Consulta)
              </div>
              <div className="text-sm font-semibold text-neutral-100">
                Visualizando perfil de: {targetUser.nombre} {targetUser.apellido}
              </div>
            </div>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Clase
          </button>
        </div>
      ) : (
        <div className="border-b border-neutral-900 pb-6 space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Cuenta de Usuario
          </div>
          <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
            Mi Perfil & Preferencias
          </h1>
          <p className="text-xs text-neutral-400">
            Gestiona tu información personal, revisa tu estado de suscripción y actualiza tus credenciales de acceso.
          </p>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Header Avatar and Basic Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-5">
            <img
              src={targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={targetUser.nombre}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/40"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
                  {targetUser.nombre} {targetUser.apellido}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {targetUser.rol}
                </span>
              </div>
              <div className="text-xs text-neutral-400 flex items-center gap-3">
                <span>{targetUser.email}</span>
                <span>·</span>
                <span>RUT: {targetUser.rut || 'No registrado'}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-neutral-400">
            <span className="block text-[10px] uppercase font-bold text-neutral-500">Miembro desde</span>
            <span className="font-mono text-neutral-200">{targetUser.fechaRegistro}</span>
          </div>
        </div>

        {/* Plan & Subscription Card */}
        {targetUser.rol === 'alumno' && (
          <div className="p-5 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                  Membresía Activa
                </div>
                <div className="text-lg font-bold text-neutral-100 mt-0.5">
                  {userPlan?.nombre || userSub?.planNombre || 'Plan Black KRONOFIT'}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400">Tiempo restante: </span>
                <span className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                  {userSub?.estado === 'activa' ? `${daysLeft} días` : 'Vencida'}
                </span>
                <div className="text-[11px] text-neutral-500">
                  Vence: {userSub?.fechaVencimiento || '2026-11-15'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-neutral-800/80 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Clases del Plan</span>
                <span className="font-semibold text-neutral-300">{userPlan?.clasesPorMes || 'Ilimitadas'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total Asistencias</span>
                <span className="font-semibold text-emerald-400">{attendedCount} sesiones</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Estado</span>
                <span className="capitalize font-semibold text-neutral-300">{userSub?.estado || 'activa'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Professor Specialty & Bio */}
        {targetUser.rol === 'profesor' && (
          <div className="p-5 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Especialidad Docente & Certificaciones
            </div>
            <div className="text-sm font-semibold text-neutral-200">
              {targetUser.especialidad || 'CrossFit & Fuerza'}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mt-2">
              {targetUser.bio}
            </p>
          </div>
        )}

        {/* Editable Personal Details */}
        {!isInspectingStudent ? (
          <form onSubmit={handleUpdateProfile} noValidate className="space-y-6 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-amber-500" />
              Editar Información Personal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Nombre <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => {
                    setFormData({ ...formData, nombre: e.target.value });
                    if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: null });
                  }}
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                    formErrors.nombre ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
                {formErrors.nombre && <p className="text-[11px] text-rose-400 mt-1">{formErrors.nombre}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Apellido <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={e => {
                    setFormData({ ...formData, apellido: e.target.value });
                    if (formErrors.apellido) setFormErrors({ ...formErrors, apellido: null });
                  }}
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                    formErrors.apellido ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
                {formErrors.apellido && <p className="text-[11px] text-rose-400 mt-1">{formErrors.apellido}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  RUT
                </label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={e => setFormData({ ...formData, rut: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Contacto de Emergencia
              </label>
              <input
                type="text"
                value={formData.contactoEmergencia}
                onChange={e => setFormData({ ...formData, contactoEmergencia: e.target.value })}
                placeholder="Nombre y teléfono de familiar"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Bio / Objetivos
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
              >
                Actualizar Datos
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Datos de Contacto del Alumno
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Teléfono</span>
                <span className="text-neutral-200">{targetUser.telefono}</span>
              </div>
              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Contacto Emergencia</span>
                <span className="text-neutral-200">{targetUser.contactoEmergencia || 'No registrado'}</span>
              </div>
            </div>

            {targetUser.bio && (
              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg text-xs">
                <span className="text-neutral-500 block text-[10px] uppercase font-semibold mb-1">Notas / Objetivos del Alumno</span>
                <p className="text-neutral-300">{targetUser.bio}</p>
              </div>
            )}
          </div>
        )}

        {/* Change Password Section */}
        {!isInspectingStudent && (
          <div className="pt-8 border-t border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              Cambiar Contraseña
            </h3>

            {passwordMsg?.error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordMsg.error}</span>
              </div>
            )}

            {passwordMsg?.success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordMsg.success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Contraseña Actual <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={e => {
                    setPasswordData({ ...passwordData, oldPassword: e.target.value });
                    if (passwordErrors.oldPassword) setPasswordErrors({ ...passwordErrors, oldPassword: null });
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                    passwordErrors.oldPassword ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
                {passwordErrors.oldPassword && (
                  <p className="text-[11px] text-rose-400 mt-1">{passwordErrors.oldPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Nueva Contraseña <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={e => {
                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: null });
                  }}
                  placeholder="Mín. 6 caracteres"
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                    passwordErrors.newPassword ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
                {passwordErrors.newPassword && (
                  <p className="text-[11px] text-rose-400 mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Confirmar Nueva <span className="text-amber-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={e => {
                    setPasswordData({ ...passwordData, confirmNewPassword: e.target.value });
                    if (passwordErrors.confirmNewPassword) setPasswordErrors({ ...passwordErrors, confirmNewPassword: null });
                  }}
                  placeholder="Mín. 6 caracteres"
                  className={`w-full bg-neutral-950 border rounded-lg px-3 py-2 text-sm text-neutral-100 focus:outline-none transition-colors ${
                    passwordErrors.confirmNewPassword ? 'border-rose-500' : 'border-neutral-800 focus:border-amber-500'
                  }`}
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="text-[11px] text-rose-400 mt-1">{passwordErrors.confirmNewPassword}</p>
                )}
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Guardar Nueva Contraseña
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
