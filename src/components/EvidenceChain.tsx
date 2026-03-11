import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, Calculator, Link as LinkIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface EvidenceStep {
  id: string;
  type: 'source' | 'calculation' | 'link';
  label: string;
  value: string | number;
  description?: string;
  source_url?: string;
}

interface EvidenceChainProps {
  title: string;
  steps: EvidenceStep[];
  className?: string;
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({
  title,
  steps,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'source': return Database;
      case 'calculation': return Calculator;
      case 'link': return LinkIcon;
      default: return Info;
    }
  };

  return (
    <div className={cn('bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Calculator size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">Evidence Chain • {steps.length} Steps</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-400" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-100"
          >
            <div className="p-6 space-y-6 relative">
              {/* Vertical line */}
              <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-zinc-100" />

              {steps.map((step, index) => {
                const Icon = getIcon(step.type);
                return (
                  <div key={step.id} className="flex gap-6 relative z-10">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white',
                      step.type === 'source' ? 'bg-emerald-100 text-emerald-600' : 
                      step.type === 'calculation' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                    )}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{step.label}</h4>
                        <span className="text-xs font-bold text-zinc-800">{step.value}</span>
                      </div>
                      {step.description && (
                        <p className="text-[11px] text-zinc-500 mb-2">{step.description}</p>
                      )}
                      {step.source_url && (
                        <a 
                          href={step.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1"
                        >
                          <LinkIcon size={10} />
                          View Source Data
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
