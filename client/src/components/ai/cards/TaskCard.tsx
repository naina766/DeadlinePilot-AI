import React from 'react';
import { ClipboardList, Calendar, ShieldAlert } from 'lucide-react';

interface Task {
  title: string;
  priority: string;
  deadline: string;
  riskScore: number;
  completionPercent: number;
}

interface TaskCardProps {
  tasks: Task[];
}

export const TaskCard: React.FC<TaskCardProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-2xl border border-[#6C4DFF]/20 bg-[#0E1626]/90 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-2.5">
        <ClipboardList className="w-4 h-4 text-indigo-300" />
        <span className="text-xs font-black tracking-wider uppercase">Active Tasks</span>
      </div>

      <div className="space-y-3.5">
        {tasks.map((task, idx) => (
          <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-bold text-slate-100">{task.title}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                task.priority === 'High' 
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                  : task.priority === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {task.priority}
              </span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.2 h-3.2 text-indigo-400" />
                {task.deadline}
              </span>
              <span className="flex items-center gap-1 font-bold text-rose-400">
                <ShieldAlert className="w-3.2 h-3.2" />
                Risk: {task.riskScore}%
              </span>
            </div>

            {/* Completion Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                <span>PROGRESS</span>
                <span>{task.completionPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6C4DFF] to-[#7C3AED] transition-all duration-500" 
                  style={{ width: `${task.completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
