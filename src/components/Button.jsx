import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all rounded-lg cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-[11px] gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-xs gap-2.5'
  }[size] || 'px-4 py-2 text-xs gap-2';

  const variantClasses = {
    primary:
      'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/10 active:scale-[0.98]',
    secondary:
      'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 active:scale-[0.98]',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/10 active:scale-[0.98]',
    dangerOutline:
      'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 active:scale-[0.98]',
    outline:
      'bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-amber-400 border border-neutral-800 hover:border-neutral-700 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100'
  }[variant] || 'bg-amber-500 hover:bg-amber-400 text-neutral-950';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};
