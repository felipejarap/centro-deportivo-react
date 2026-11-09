import React from 'react';

export const PageHeader = ({
  category,
  title,
  description,
  action,
  children
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-6">
      <div>
        {category && (
          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
            {category}
          </div>
        )}
        <h1 className="text-3xl font-display font-extrabold text-neutral-100 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-neutral-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {(action || children) && (
        <div className="self-start sm:self-auto flex items-center gap-2">
          {action || children}
        </div>
      )}
    </div>
  );
};