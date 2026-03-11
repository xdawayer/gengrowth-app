import React from 'react';
import { Package, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Package,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-white',
      className
    )}>
      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-6">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 max-w-xs mb-8">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
