import React from 'react';
import { Target, Zap, Clock } from 'lucide-react';

interface FocusCardProps {
  goal: string;
  duration: string;
  sessionCount: number;
}

export const FocusCard: React.FC<FocusCardProps> = ({
  goal,
  duration,
  sessionCount
}) => {
  return (
    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/5 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-2.5">
        <Target className="w-4 h-4 text-indigo-300" />
        <span className="text-xs font-black tracking-wider uppercase">Focus Block Goal</span>
      </div>

      <p className="text-[13px] leading-[1.6] text-slate-200 font-semibold italic">
        &quot;{goal}&quot;
      </p>

      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 font-semibold font-mono">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Duration: {duration}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/5">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Sessions: {sessionCount}</span>
        </div>
      </div>
    </div>
  );
};

export default FocusCard;
