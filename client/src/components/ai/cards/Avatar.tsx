import React from 'react';
import { Sparkles } from 'lucide-react';

export const Avatar: React.FC = () => {
  return (
    <div className="relative shrink-0">
      <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-300 shadow-md shadow-cyan-500/5 hover:border-cyan-400/50 transition-all duration-300">
        <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
      </div>
      {/* Glowing active indicator */}
      <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#0B1220]"></span>
      </span>
    </div>
  );
};

export default Avatar;
