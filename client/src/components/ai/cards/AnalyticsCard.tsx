import React from 'react';
import { BarChart3, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

interface TrendDay {
  day: string;
  hours: number;
}

interface AnalyticsCardProps {
  focusHours: number;
  productivityScore: number;
  completedTasks: number;
  weeklyTrend: TrendDay[];
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  focusHours, 
  productivityScore, 
  completedTasks, 
  weeklyTrend 
}) => {
  return (
    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#0E1626]/90 backdrop-blur-md shadow-lg space-y-5 text-left">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-2.5">
        <BarChart3 className="w-4 h-4 text-cyan-300" />
        <span className="text-xs font-black tracking-wider uppercase">Productivity Analytics</span>
      </div>

      {/* Primary stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-xl border border-white/5 bg-white/5 space-y-1">
          <Clock className="w-4 h-4 mx-auto text-indigo-400" />
          <span className="text-lg font-black text-slate-100 block font-mono">{focusHours}h</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Focus Time</span>
        </div>
        <div className="p-2.5 rounded-xl border border-white/5 bg-white/5 space-y-1">
          <TrendingUp className="w-4 h-4 mx-auto text-cyan-400" />
          <span className="text-lg font-black text-slate-100 block font-mono">{productivityScore}%</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Score</span>
        </div>
        <div className="p-2.5 rounded-xl border border-white/5 bg-white/5 space-y-1">
          <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-400" />
          <span className="text-lg font-black text-slate-100 block font-mono">{completedTasks}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Completed</span>
        </div>
      </div>

      {/* Weekly Trend progress bars */}
      {weeklyTrend && weeklyTrend.length > 0 && (
        <div className="space-y-3.5 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block pl-0.5">Focus Duration Trend</span>
          <div className="space-y-2">
            {weeklyTrend.map((t, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-bold w-8">{t.day}</span>
                <div className="flex-1 h-3 rounded-full bg-slate-950 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (t.hours / 12) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-cyan-400 font-mono font-bold w-10 text-right">{t.hours} hrs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;
