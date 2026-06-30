import React from 'react';
import { Bell, Clock, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

interface Notification {
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationCardProps {
  notifications: Notification[];
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 text-slate-400 text-xs flex flex-col items-center gap-1">
        <Bell className="w-6 h-6 text-slate-600" />
        <span>No recent alerts.</span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-left space-y-3.5 shadow-xl">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <Bell className="w-4 h-4 text-indigo-300 animate-bounce" />
          <span className="text-xs font-black tracking-wider uppercase">Active Alerts</span>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n, idx) => (
          <div 
            key={idx} 
            className="p-3 rounded-xl border border-white/5 bg-slate-950/40 space-y-1 relative group hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
              <span className="text-[8px] text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {n.timestamp}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SimpleCardProps {
  title: string;
  message: string;
  timestamp?: string;
}

export const SuccessCard: React.FC<SimpleCardProps> = ({ title, message, timestamp }) => (
  <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/5 text-left flex items-start gap-3 hover:border-emerald-500/30 transition-all">
    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
      <CheckCircle2 className="w-4.5 h-4.5" />
    </div>
    <div className="space-y-1.5 flex-1 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <h4 className="text-xs font-bold text-emerald-300 truncate">{title}</h4>
        {timestamp && <span className="text-[8px] text-slate-500 font-mono shrink-0">{timestamp}</span>}
      </div>
      <p className="text-xs text-emerald-400/80 leading-relaxed break-words">{message}</p>
    </div>
  </div>
);

export const WarningCard: React.FC<SimpleCardProps> = ({ title, message, timestamp }) => (
  <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/5 text-left flex items-start gap-3 hover:border-amber-500/30 transition-all">
    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
      <AlertTriangle className="w-4.5 h-4.5" />
    </div>
    <div className="space-y-1.5 flex-1 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <h4 className="text-xs font-bold text-amber-300 truncate">{title}</h4>
        {timestamp && <span className="text-[8px] text-slate-500 font-mono shrink-0">{timestamp}</span>}
      </div>
      <p className="text-xs text-amber-400/80 leading-relaxed break-words">{message}</p>
    </div>
  </div>
);

export const InfoCard: React.FC<SimpleCardProps> = ({ title, message, timestamp }) => (
  <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-950/5 text-left flex items-start gap-3 hover:border-sky-500/30 transition-all">
    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
      <Info className="w-4.5 h-4.5" />
    </div>
    <div className="space-y-1.5 flex-1 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <h4 className="text-xs font-bold text-sky-300 truncate">{title}</h4>
        {timestamp && <span className="text-[8px] text-slate-500 font-mono shrink-0">{timestamp}</span>}
      </div>
      <p className="text-xs text-sky-400/80 leading-relaxed break-words">{message}</p>
    </div>
  </div>
);

export const ErrorCard: React.FC<SimpleCardProps> = ({ title, message, timestamp }) => (
  <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-950/5 text-left flex items-start gap-3 hover:border-rose-500/30 transition-all">
    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
      <XCircle className="w-4.5 h-4.5 animate-pulse" />
    </div>
    <div className="space-y-1.5 flex-1 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <h4 className="text-xs font-bold text-rose-300 truncate">{title}</h4>
        {timestamp && <span className="text-[8px] text-slate-500 font-mono shrink-0">{timestamp}</span>}
      </div>
      <p className="text-xs text-rose-400/80 leading-relaxed break-words">{message}</p>
    </div>
  </div>
);

export default NotificationCard;
