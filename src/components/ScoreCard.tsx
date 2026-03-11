import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../utils/cn';

interface ScoreMetric {
  subject: string;
  A: number;
  fullMark: number;
}

interface ScoreCardProps {
  title: string;
  score: number;
  metrics: ScoreMetric[];
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  metrics,
  className
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'bg-emerald-50';
    if (s >= 60) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  return (
    <div className={cn('bg-white border border-zinc-200 rounded-xl p-6 shadow-sm', className)}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{title}</h3>
          <div className={cn('text-4xl font-bold mt-2', getScoreColor(score))}>
            {score}
            <span className="text-sm text-zinc-400 font-medium ml-1">/ 100</span>
          </div>
        </div>
        <div className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', getScoreBg(score), getScoreColor(score))}>
          {score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : 'POOR'}
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#1a73e8"
              fill="#1a73e8"
              fillOpacity={0.1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {metrics.map((m) => (
          <div key={m.subject} className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">{m.subject}</span>
            <span className="text-[11px] font-bold text-zinc-800">{m.A}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
