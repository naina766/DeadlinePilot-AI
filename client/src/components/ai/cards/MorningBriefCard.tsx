import React from 'react';
import { Sun, Sparkles } from 'lucide-react';

interface MorningBriefCardProps {
  summary: string;
  focusPoints: string[];
}

export const MorningBriefCard: React.FC<MorningBriefCardProps> = ({ summary, focusPoints }) => {
  return (
    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/10 to-slate-900/40 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-2.5">
        <Sun className="w-4.5 h-4.5 text-amber-300 animate-spin duration-15000" />
        <span className="text-xs font-black tracking-wider uppercase">Executive Briefing</span>
      </div>

      <p className="text-[13px] leading-[1.6] text-slate-200 font-medium">
        {summary}
      </p>

      {focusPoints && focusPoints.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Today&apos;s Focus Items</span>
          <div className="space-y-1.5">
            {focusPoints.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MorningBriefCard;
