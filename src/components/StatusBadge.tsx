import React from 'react';
import { cn } from '../utils/cn';

export type StatusType = 'active' | 'pending' | 'paused' | 'error' | 'success' | 'intake' | 'probing' | 'connected' | 'archived' | 'completed' | 'running' | 'partial';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  success: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  connected: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  intake: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  probing: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  running: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  partial: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  paused: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    dot: 'bg-zinc-400',
  },
  archived: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    dot: 'bg-zinc-400',
  },
  error: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const config = statusConfig[status] || statusConfig.paused;
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-transparent',
      config.bg,
      config.text,
      className
    )}>
      <div className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {label || status}
    </div>
  );
};
