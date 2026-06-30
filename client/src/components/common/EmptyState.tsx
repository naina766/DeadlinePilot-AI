import React from 'react';
import { Inbox, CalendarX, BarChart2, MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  type: 'tasks' | 'calendar' | 'analytics' | 'chat';
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, title, message }) => {
  const configs = {
    tasks: {
      icon: Inbox,
      title: title || 'No tasks yet',
      message: message || 'Your pending list is clear. Add a new task to pilot it.'
    },
    calendar: {
      icon: CalendarX,
      title: title || 'No events today',
      message: message || 'Your schedule is clear. Make time to focus and rest.'
    },
    analytics: {
      icon: BarChart2,
      title: title || 'No analytics available',
      message: message || 'Finish focus sessions or complete tasks to log insights.'
    },
    chat: {
      icon: MessageSquare,
      title: title || 'Ask me anything...',
      message: message || 'Hello! I am your AI Executive Co-Pilot. Ask me about your tasks, schedule, or productivity.'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-md max-w-sm mx-auto">
      <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-slate-500 mb-4 animate-pulse">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider mb-1">{config.title}</h3>
      <p className="text-xs text-slate-400 leading-normal max-w-xs">{config.message}</p>
    </div>
  );
};

export default EmptyState;
