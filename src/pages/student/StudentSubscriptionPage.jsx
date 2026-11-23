import React, { useState } from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { CreditCard, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const StudentSubscriptionPage = () => {
  const { subscriptions, plans, currentUser, renewSubscription, cancelSubscription, setCurrentView } = useGym();

  const mySubscription = subscriptions
    .filter(subscription => subscription.usuarioId === currentUser?.id)
    .sort((left, right) => {
      const activeDifference = Number(right.estado === 'activa') - Number(left.estado === 'activa');
      return activeDifference || String(right.fechaInicio || '').localeCompare(String(left.fechaInicio || ''));
    })[0];
  const currentPlan = plans.find(p => p.id === mySubscription?.planId);
  const subscriptionPrice = mySubscription?.precio ?? mySubscription?.monto ?? currentPlan?.precio;
  const canRenew = Boolean(mySubscription && currentPlan?.estado === 'activo');

  const [confirmCancelModal, setConfirmCancelModal] = useState(false);

  const calculateDaysLeft = vencimientoDateStr => {
    if (!vencimientoDateStr) return 0;
    const diff = new Date(vencimientoDateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDaysLeft(mySubscription?.fechaVencimiento);
  const isActive = mySubscription?.estado === 'activa';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-900 pb-6 space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Portal del Alumno
        </div>
        <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
          Mi Suscripción & Membresía
        </h1>
        <p className="text-xs text-neutral-400">
          Consulta los detalles de tu plan activo, fecha de vencimiento y gestiona renovaciones o cancelaciones.
        </p>
      </div>

      {!mySubscription ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-neutral-100">No tienes una suscripción registrada</h2>
          <p className="text-sm text-neutral-400">
            Revisa los planes disponibles para elegir una membresía.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('planes')}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
          >
            Ver planes disponibles
          </button>
        </div>
      ) : (
      <>
        {/* Main Subscription Card */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}
              >
                {isActive ? 'Membresía Activa' : 'Suscripción Cancelada / Vencida'}
              </span>
              {mySubscription?.renovacionAutomatica && (
                <span className="text-[10px] text-neutral-400">· Cobro automático activo</span>
              )}
            </div>

            <h2 className="text-2xl font-display font-bold text-neutral-100">
              {currentPlan?.nombre || mySubscription.planNombre || 'Plan no disponible'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Titular: {currentUser?.nombre} {currentUser?.apellido} ({currentUser?.email})
            </p>
          </div>

          <div className="sm:text-right">
            <div className="text-xs text-neutral-400">Tarifa Vigente</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-100 tabular-nums">
              ${subscriptionPrice?.toLocaleString('es-CL') || '—'}
              <span className="text-xs text-neutral-400 font-sans font-normal">
                {' / '}{currentPlan?.period || `${currentPlan?.duracionDias || 30} días`}
              </span>
            </div>
          </div>
        </div>

        {/* Days Left Bar */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Tiempo restante de suscripción:</span>
            <span className="font-bold font-mono tabular-nums text-amber-400">
              {isActive ? `${daysLeft} días restantes` : '0 días (vencida)'}
            </span>
          </div>

          <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                daysLeft > 7 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-neutral-400">
            <div>
              <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Fecha de Inicio</span>
              <span className="font-mono text-neutral-200">{mySubscription.fechaInicio || '—'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Fecha de Vencimiento</span>
              <span className="font-mono text-neutral-200">{mySubscription.fechaVencimiento || '—'}</span>
            </div>
          </div>
        </div>

        {/* Payment Method & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Método de Pago Vinculado
            </h3>
            <div className="flex items-center gap-3 p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg text-xs text-neutral-300">
              <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{mySubscription.metodoPago || 'No registrado'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Beneficios de tu Plan
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              {currentPlan?.beneficios.slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
              {!currentPlan && (
                <li>No se encontró el plan asociado en los planes disponibles.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons: Renovar o Cancelar */}
        <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            {isActive
              ? `Puedes renovar tu plan de forma manual para sumar ${currentPlan?.duracionDias || 'los'} días.`
              : 'Tu suscripción está inactiva. Renueva para volver a reservar clases.'}
            {!currentPlan && ' El plan asociado no está disponible, así que no se puede renovar.'}
          </div>

          <div className="flex items-center gap-3">
            {isActive && (
              <button
                type="button"
                onClick={() => setConfirmCancelModal(true)}
                className="px-4 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar Suscripción
              </button>
            )}

            <button
              type="button"
              onClick={() => canRenew && renewSubscription(mySubscription.id)}
              disabled={!canRenew}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-amber-500 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Renovar Membresía
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Cancel */}
      {confirmCancelModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-neutral-100">¿Cancelar tu suscripción?</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Al cancelar tu membresía se desactivará el cobro automático. Podrás seguir disfrutando de tus clases hasta la fecha de vencimiento actual ({mySubscription.fechaVencimiento}).
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setConfirmCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Mantener Suscripción
              </button>
              <button
                onClick={() => {
                  if (mySubscription) cancelSubscription(mySubscription.id);
                  setConfirmCancelModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
