import React from 'react';
import { useGym } from '../context/GymContext.jsx';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useGym();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.tipo === 'success';
        const isError = toast.tipo === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'bg-neutral-900/95 border-emerald-500/40 text-neutral-100'
                : isError
                ? 'bg-neutral-900/95 border-rose-500/40 text-neutral-100'
                : 'bg-neutral-900/95 border-amber-500/40 text-neutral-100'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}

            <div className="text-xs font-medium leading-relaxed flex-1">{toast.mensaje}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-500 hover:text-neutral-300 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
