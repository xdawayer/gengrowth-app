import React from 'react';
import { Clock, User, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface TimelineItem {
  id: string;
  type: 'log' | 'change' | 'alert' | 'success';
  label: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface TimelineViewProps {
  items: TimelineItem[];
  className?: string;
  onItemClick?: (item: TimelineItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  items,
  className,
  onItemClick
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'log': return Activity;
      case 'change': return Clock;
      case 'alert': return AlertCircle;
      case 'success': return CheckCircle2;
      default: return Activity;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'log': return 'text-blue-600 bg-blue-50';
      case 'change': return 'text-zinc-600 bg-zinc-50';
      case 'alert': return 'text-rose-600 bg-rose-50';
      case 'success': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-zinc-600 bg-zinc-50';
    }
  };

  return (
    <div className={cn('space-y-6 relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-zinc-100" />

      {items.map((item) => {
        const Icon = getIcon(item.type);
        return (
          <div 
            key={item.id} 
            className={cn(
              "flex gap-6 relative z-10",
              onItemClick && "cursor-pointer hover:translate-x-1 transition-transform"
            )}
            onClick={() => onItemClick?.(item)}
          >
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white', getColor(item.type))}>
              <Icon size={14} />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-zinc-900">{item.label}</h4>
                <span className="text-[11px] text-zinc-400 font-medium">{item.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-500 mb-2">{item.description}</p>
              {item.user && (
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  <User size={10} />
                  {item.user}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
