import React from 'react';
import { GraduationCap, ArrowRightCircle } from 'lucide-react';

interface StudyTopic {
  name: string;
  duration: string;
  difficulty?: string;
  steps: string[];
}

interface StudyPlanCardProps {
  planTitle: string;
  topics: StudyTopic[];
}

export const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ planTitle, topics }) => {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#0E1626]/90 backdrop-blur-md shadow-lg space-y-4 text-left">
      <div className="flex items-center gap-2 text-cyan-400 border-b border-white/5 pb-2.5">
        <GraduationCap className="w-4.5 h-4.5 text-cyan-300" />
        <span className="text-xs font-black tracking-wider uppercase">{planTitle || 'Executive Study Plan'}</span>
      </div>

      <div className="space-y-4">
        {topics.map((topic, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-black text-slate-100">{topic.name}</span>
              <div className="flex items-center gap-2">
                {topic.difficulty && (
                  <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                    topic.difficulty === 'Hard' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                      : topic.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {topic.difficulty}
                  </span>
                )}
                <span className="text-[10px] text-cyan-400 font-bold font-mono">{topic.duration}</span>
              </div>
            </div>

            <div className="space-y-1.5 pl-1.5 border-l border-cyan-500/20">
              {topic.steps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                  <ArrowRightCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanCard;
