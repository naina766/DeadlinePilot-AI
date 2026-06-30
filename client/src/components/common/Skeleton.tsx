import React from 'react';

export const SkeletonPulse: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800/40 rounded-xl ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card p-5 border-white/5 bg-slate-900/10 space-y-4">
    <SkeletonPulse className="h-5 w-1/3" />
    <div className="space-y-2">
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-5/6" />
    </div>
  </div>
);

export const SkeletonTask: React.FC = () => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/10">
    <div className="flex items-center gap-3 w-2/3">
      <SkeletonPulse className="w-5 h-5 rounded" />
      <div className="space-y-1.5 w-full">
        <SkeletonPulse className="h-4 w-1/2" />
        <SkeletonPulse className="h-3 w-1/3" />
      </div>
    </div>
    <SkeletonPulse className="h-6 w-16 rounded-full" />
  </div>
);

export const SkeletonAnalytics: React.FC = () => (
  <div className="glass-card p-6 border-white/5 bg-slate-900/10 space-y-6">
    <div className="flex justify-between items-center">
      <SkeletonPulse className="h-5 w-1/4" />
      <SkeletonPulse className="h-5 w-16" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-2">
          <SkeletonPulse className="h-3 w-1/2" />
          <SkeletonPulse className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonCalendar: React.FC = () => (
  <div className="glass-card p-6 border-white/5 bg-slate-900/10 space-y-4">
    <SkeletonPulse className="h-5 w-1/4" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <SkeletonPulse className="w-12 h-12 rounded-xl" />
          <div className="space-y-1.5 flex-1">
            <SkeletonPulse className="h-4 w-1/2" />
            <SkeletonPulse className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChat: React.FC = () => (
  <div className="space-y-4 p-4">
    <div className="flex gap-3 justify-start">
      <SkeletonPulse className="w-8 h-8 rounded-full" />
      <div className="space-y-1 w-2/3">
        <SkeletonPulse className="h-10 w-full" />
        <SkeletonPulse className="h-3 w-1/4" />
      </div>
    </div>
    <div className="flex gap-3 justify-end">
      <div className="space-y-1 w-2/3">
        <SkeletonPulse className="h-12 w-full" />
        <SkeletonPulse className="h-3 w-1/4 ml-auto" />
      </div>
      <SkeletonPulse className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

export default SkeletonCard;
