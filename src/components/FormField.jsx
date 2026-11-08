import React from 'react';

export const FormField = ({
  label,
  error,
  required = false,
  helperText,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className="text-[11px] text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-neutral-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
