import React from 'react';
import { Search } from 'lucide-react';

export const FilterBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  children,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl ${className}`}
    >
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchValue || ''}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      )}

      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};
export { FilterBar } from './FilterBar.jsx';
