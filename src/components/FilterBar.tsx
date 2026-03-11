import React from 'react';
import { Filter, Calendar, Package, Layers, ChevronDown, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface FilterOption {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
}

interface FilterBarProps {
  filters: FilterOption[];
  onClearAll?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onClearAll,
  className
}) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl', className)}>
      <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 border-r border-zinc-200 mr-2">
        <Filter size={16} />
        <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
      </div>

      {filters.map((filter) => {
        const Icon = filter.icon || ChevronDown;
        return (
          <div key={filter.id} className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg hover:border-blue-600 transition-all cursor-pointer">
              {filter.icon && <filter.icon size={14} className="text-zinc-400" />}
              <span className="text-xs font-medium text-zinc-500">{filter.label}:</span>
              <span className="text-xs font-bold text-zinc-800">
                {filter.options.find(o => o.value === filter.value)?.label || 'All'}
              </span>
              <ChevronDown size={14} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
            </div>
            
            {/* Simple dropdown mock */}
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filter.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => filter.onChange(option.value)}
                    className={cn(
                      'w-full text-left px-4 py-2 text-xs transition-colors',
                      filter.value === option.value 
                        ? 'bg-blue-50 text-blue-700 font-bold' 
                        : 'text-zinc-600 hover:bg-zinc-50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors ml-auto"
        >
          <X size={14} />
          CLEAR ALL
        </button>
      )}
    </div>
  );
};
