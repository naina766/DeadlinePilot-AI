import React from 'react';
import { ShieldAlert, AlertTriangle, Calendar } from 'lucide-react';
interface DeadlineCardProps {
  task: string;
  deadline: string;
  urgency: string; 
  risk: string; 
}
export const DeadlineCard: React.FC<DeadlineCardProps> = ({
  task,
  deadline,
  urgency,
  risk
}) => {
  return (
    <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 backdrop-blur-md shadow-lg shadow-rose-950/5 space-y-4 text-left animate-pulse">
      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-spin duration-3000" />
          <span className="text-xs font-black tracking-wider uppercase">Deadline Alert</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase tracking-wider">
          {urgency}
        </span>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Task at Risk</span>
        <h4 className="text-sm font-black text-slate-100">{task}</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/5">
          <Calendar className="w-3.5 h-3.5 text-rose-400" />
          <span>Due: {deadline}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 border border-white/5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Risk Level: {risk}</span>
        </div>
      </div>
    </div>
  );
};
export default DeadlineCard;
