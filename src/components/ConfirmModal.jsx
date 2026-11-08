import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button.jsx';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Confirmar acción?',
  message = '¿Estás seguro de que deseas continuar con esta operación?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex items-center gap-3 ${isDanger ? 'text-rose-400' : 'text-amber-400'}`}>
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="text-lg font-bold text-neutral-100">{title}</h3>
        </div>

        <div className="text-xs text-neutral-400 leading-relaxed">
          {message}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
