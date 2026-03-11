import React, { useState } from 'react';
import { Check, X, ShieldAlert, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface ApprovalButtonProps {
  onApprove: () => void;
  onReject: () => void;
  onOverride: (reason: string) => void;
  className?: string;
}

export const ApprovalButton: React.FC<ApprovalButtonProps> = ({
  onApprove,
  onReject,
  onOverride,
  className
}) => {
  const [showOverride, setShowOverride] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={onApprove}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all border border-emerald-200"
      >
        <Check size={14} />
        APPROVE
      </button>
      <button
        onClick={onReject}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all border border-rose-200"
      >
        <X size={14} />
        REJECT
      </button>
      <button
        onClick={() => setShowOverride(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all border border-amber-200"
      >
        <ShieldAlert size={14} />
        OVERRIDE
      </button>

      <AnimatePresence>
        {showOverride && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 w-full max-w-md rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Force Override</h3>
                    <p className="text-xs text-zinc-500">Please provide a justification for this override.</p>
                  </div>
                </div>

                <div className="relative mb-6">
                  <MessageSquare size={16} className="absolute left-3 top-3 text-zinc-400" />
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for override..."
                    className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-0 rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowOverride(false);
                      setReason('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!reason.trim()}
                    onClick={() => {
                      onOverride(reason);
                      setShowOverride(false);
                      setReason('');
                    }}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                  >
                    Confirm Override
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
