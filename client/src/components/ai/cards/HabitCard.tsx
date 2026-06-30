import React from 'react';
import { Flame, CheckSquare, Settings } from 'lucide-react';

interface HabitItem {
  title: string;
  frequency: string;
  streak: number;
}

interface HabitCardProps {
  habits: HabitItem[];
}

export const HabitCard: React.FC<HabitCardProps> = ({ habits }) => {
  if (!habits || habits.length === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/5 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-emerald-400 border-b border-white/5 pb-2.5">
        <CheckSquare className="w-4 h-4 text-emerald-300" />
        <span className="text-xs font-black tracking-wider uppercase">Habit Tracker Checklist</span>
      </div>

      <div className="space-y-3">
        {habits.map((habit, idx) => (
          <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-100">{habit.title}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-semibold">
                {habit.frequency}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-[10px] font-black font-mono">
              <Flame className="w-3.5 h-3.5 fill-amber-500/10 shrink-0" />
              <span>{habit.streak}d Streak</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitCard;
