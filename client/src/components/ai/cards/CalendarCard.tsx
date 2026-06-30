import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';

interface CalendarSlot {
  title: string;
  timeRange: string;
  description?: string;
}

interface CalendarCardProps {
  slots: CalendarSlot[];
}

export const CalendarCard: React.FC<CalendarCardProps> = ({ slots }) => {
  if (!slots || slots.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-[#0E1626]/90 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-2.5">
        <CalendarDays className="w-4 h-4 text-cyan-300" />
        <span className="text-xs font-black tracking-wider uppercase">Calendar Schedule</span>
      </div>

      <div className="space-y-3">
        {slots.map((slot, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-black text-slate-100">{slot.title}</span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-bold shrink-0">
                <Clock className="w-3.2 h-3.2" />
                {slot.timeRange}
              </span>
            </div>
            {slot.description && (
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                {slot.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;
