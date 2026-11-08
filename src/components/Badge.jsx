import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  icon: Icon,
  className = ''
}) => {
  const variantClasses = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    neutral: 'text-neutral-300 bg-neutral-800/80 border-neutral-700'
  }[variant] || 'text-neutral-300 bg-neutral-800/80 border-neutral-700';

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border select-none ${variantClasses} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};
