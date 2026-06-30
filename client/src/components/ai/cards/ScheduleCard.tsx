import React from 'react';
import { Calendar, Clock } from 'lucide-react';
interface Event {
  title: string;
  start: string;
  end: string;
  type: string;
  priority: string;
  duration?: string;
  status: string;
}
interface ScheduleCardProps {
  events: Event[];
}
export const ScheduleCard: React.FC<ScheduleCardProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-5 rounded-2xl border border-white/5 bg-white/5 text-slate-400 text-xs flex flex-col items-center gap-2">
        <Calendar className="w-8 h-8 text-slate-500 animate-pulse" />
        <span>No scheduled blocks found for today.</span>
      </div>
    );
  }
  return (
    <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#0E1626]/90 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-cyan-400 border-b border-white/5 pb-2.5">
        <Calendar className="w-4 h-4 text-cyan-300" />
        <span className="text-xs font-black tracking-wider uppercase">Today&apos;s Schedule</span>
      </div>
      <div className="relative border-l border-cyan-500/20 pl-4 ml-2.5 space-y-5">
        {events.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[22.5px] top-1.5 w-3 h-3 rounded-full bg-[#0B1220] border-2 border-cyan-400 group-hover:scale-125 transition-transform" />
            <div className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {evt.title}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  evt.priority === 'High' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : evt.priority === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {evt.priority}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono text-cyan-400">
                  <Clock className="w-3.2 h-3.2 shrink-0" />
                  {evt.start} - {evt.end}
                </span>
                {evt.duration && (
                  <span className="text-[10px] text-slate-500">
                    ({evt.duration})
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  {evt.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ScheduleCard;
