import React from 'react';
import { useGym } from '../../context/GymContext.jsx';
import { CheckCircle2, HelpCircle } from 'lucide-react';

export const PlansPage = () => {
  const { plans, setCurrentView, setPreselectedPlanId } = useGym();

  const handleChoosePlan = planId => {
    setPreselectedPlanId(planId);
    setCurrentView('registro');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Membresías Flexibles
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-100 tracking-tight">
          Elige el plan ideal para tu nivel de entrenamiento
        </h1>
        <p className="text-sm text-neutral-400">
          Todas nuestras membresías incluyen acceso a camarines de lujo, casilleros seguros y nuestra plataforma web de reservas.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map(plan => {
          const isFeatured = plan.destacado;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all ${
                isFeatured
                  ? 'bg-neutral-900 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 relative -translate-y-2'
                  : 'bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-neutral-100">{plan.nombre}</h3>
                  {isFeatured && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded">
                      Recomendado
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black font-mono text-neutral-100">
                    ${plan.precio.toLocaleString('es-CL')}
                  </span>
                  <span className="text-xs text-neutral-400">/{plan.periodo.toLowerCase()}</span>
                </div>

                <p className="text-xs text-amber-400 font-medium mt-1">
                  {plan.clasesPorMes}
                </p>

                <div className="mt-8 pt-6 border-t border-neutral-800 space-y-3">
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Beneficios Incluidos:
                  </div>
                  {plan.beneficios.map((beneficio, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/60">
                <button
                  onClick={() => handleChoosePlan(plan.id)}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    isFeatured
                      ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  Contratar este Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ or Guarantee Note */}
      <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-8 max-w-3xl mx-auto space-y-6">
        <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          Preguntas frecuentes sobre las membresías
        </h3>

        <div className="space-y-4 text-xs text-neutral-400">
          <div>
            <span className="font-semibold text-neutral-200 block mb-1">
              ¿Cómo funciona la reserva de clases con mi plan?
            </span>
            Una vez registrado, ingresas a la sección &quot;Clases Disponibles&quot; y reservas tu lugar con 1 clic. Tu cupo queda asegurado y puedes cancelarlo con hasta 2 horas de anticipación sin penalización.
          </div>
          <div>
            <span className="font-semibold text-neutral-200 block mb-1">
              ¿Puedo cambiar de plan más adelante?
            </span>
            Sí, puedes subir de plan o cambiar la modalidad desde tu panel de &quot;Mi Suscripción&quot; en cualquier momento.
          </div>
          <div>
            <span className="font-semibold text-neutral-200 block mb-1">
              ¿Hay costos de matrícula ocultos?
            </span>
            No cobramos matrícula ni cuota de inscripción. Pagas únicamente el valor mensual o anual de tu plan seleccionado.
          </div>
        </div>
      </div>
    </div>
  );
};
