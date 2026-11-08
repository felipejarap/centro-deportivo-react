import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 shadow-xl transition-all ${
        hover ? 'hover:border-neutral-700 hover:bg-neutral-900/60 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
