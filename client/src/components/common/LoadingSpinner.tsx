import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6">
      <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
        Synchronizing...
      </span>
    </div>
  );
};

export default LoadingSpinner;
