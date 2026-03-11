import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      btnBg: 'bg-rose-600 hover:bg-rose-700',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      btnBg: 'bg-blue-600 hover:bg-blue-700',
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-zinc-200 w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.iconBg, config.iconColor)}>
              <Icon size={20} />
            </div>
            <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full text-zinc-400">
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 mb-8">{description}</p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn('px-6 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm', config.btnBg)}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
