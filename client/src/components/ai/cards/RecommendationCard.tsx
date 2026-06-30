import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
interface RecommendationCardProps {
  recommendation: string;
  estimatedImpact: string; 
  timeRequired: string;
  actionButtonText?: string;
  actionPrompt?: string;
  onActionClick?: (prompt: string) => void;
}
export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  estimatedImpact,
  timeRequired,
  actionButtonText,
  actionPrompt,
  onActionClick
}) => {
  return (
    <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2 text-amber-400">
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black tracking-wider uppercase">AI Recommendation</span>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
          estimatedImpact === 'High' 
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
            : estimatedImpact === 'Medium'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          Impact: {estimatedImpact}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-[13px] leading-[1.6] text-slate-200 font-medium">
          {recommendation}
        </p>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          ESTIMATED TIME: <span className="text-cyan-400 font-mono font-bold">{timeRequired}</span>
        </div>
      </div>
      {actionButtonText && actionPrompt && onActionClick && (
        <button
          onClick={() => onActionClick(actionPrompt)}
          className="w-full py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md group"
        >
          {actionButtonText}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
export default RecommendationCard;
