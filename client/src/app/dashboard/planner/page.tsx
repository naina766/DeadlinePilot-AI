"use client";

import React, { useState } from 'react';
import { formatISTDate, formatISTTime } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Calendar as CalIcon, 
  ShieldAlert, 
  Check, 
  Loader
} from 'lucide-react';

interface SubTask {
  title: string;
  estimatedHours: number;
  status: string;
}

interface GeneratedPlan {
  title: string;
  priority: string;
  deadlineRiskPercent: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  subtasks: SubTask[];
}

export default function PlannerPage({ onRefresh }: { onRefresh?: () => void }) {
  const { token } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('2');
  const [category, setCategory] = useState('Study');
  
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title || !deadline) return;
    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          deadline,
          estimatedHours: parseFloat(estimatedHours) || 2.0,
          category
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Auto-schedule task immediately
        const schRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/ai/schedule-task/${data._id}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const schData = await schRes.json();

        setPlan({
          title: data.title,
          priority: data.priority,
          deadlineRiskPercent: data.deadlineRiskPercent,
          scheduledStart: schData.scheduledStart,
          scheduledEnd: schData.scheduledEnd,
          subtasks: data.subtasks || []
        });

        // Reset inputs
        setTitle('');
        setDescription('');
        setDeadline('');
        setEstimatedHours('2');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form Input */}
        <div className="glass-card p-6 border-white/10 bg-slate-900/60 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase">AI Agent Scheduler Plan</h3>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Objective Goal</label>
              <input 
                type="text" required placeholder="e.g. Polish Deep Learning Model"
                value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Urgency/Goal context</label>
              <textarea 
                placeholder="Include study codes, references, or outline objectives..." rows={3}
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Goal Deadline</label>
              <input 
                type="datetime-local" required
                value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50 text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Duration (Hours)</label>
                <input 
                  type="number" step="0.5" required
                  value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Category</label>
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900 text-sm outline-none focus:border-indigo-500/50 text-slate-100"
                >
                  <option value="Study" className="bg-slate-900 text-slate-100">Study</option>
                  <option value="Work" className="bg-slate-900 text-slate-100">Work</option>
                  <option value="Personal" className="bg-slate-900 text-slate-100">Personal</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Generate AI Execution Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Visualization Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {plan ? (
            <div className="space-y-6">
              {/* Header metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 border-white/5 bg-slate-900/30 text-left">
                  <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">PRIORITY</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block">{plan.priority}</span>
                </div>
                <div className="glass-card p-4 border-white/5 bg-slate-900/30 text-left">
                  <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">DEADLINE RISK</span>
                  <span className="text-sm font-bold text-rose-400 mt-1 block">{plan.deadlineRiskPercent}% chance of delay</span>
                </div>
                <div className="glass-card p-4 border-white/5 bg-slate-900/30 text-left">
                  <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">CALENDAR SLOT</span>
                  {plan.scheduledStart ? (
                    <span className="text-xs font-bold text-cyan-400 mt-1 block truncate">
                      {formatISTDate(plan.scheduledStart)} at {formatISTTime(plan.scheduledStart)}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 mt-1 block italic">Not scheduled</span>
                  )}
                </div>
              </div>

              {/* Connected Step flow chart */}
              <div className="glass-card p-6 border-white/5 bg-slate-900/30 relative">
                <div className="absolute top-[20%] bottom-[20%] left-10 w-0.5 bg-slate-800 pointer-events-none hidden sm:block" />
                
                <div className="space-y-6 relative">
                  <div className="pb-2 border-b border-white/5">
                    <h3 className="font-extrabold text-sm tracking-wider uppercase text-slate-400">Chronological Flow Chart</h3>
                  </div>

                  <div className="space-y-4">
                    {plan.subtasks.map((sub, idx) => (
                      <div key={idx} className="flex gap-4 items-start text-left">
                        {/* Step circle */}
                        <div className="w-8 h-8 rounded-full border border-indigo-500/30 bg-indigo-950 flex items-center justify-center shrink-0 text-indigo-400 text-xs font-bold font-mono">
                          {idx + 1}
                        </div>
                        {/* Step Details card */}
                        <div className="flex-grow p-4 rounded-xl border border-white/5 bg-slate-950/40 relative">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-sm font-bold text-slate-200">{sub.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">{sub.estimatedHours} hrs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 border-dashed border-white/5 bg-slate-900/10 flex flex-col items-center justify-center text-center text-slate-500 min-h-[400px]">
              <Sparkles className="w-12 h-12 text-slate-700 animate-pulse mb-4" />
              <h3 className="font-bold text-slate-400 text-base">Execution Plan Visualizer</h3>
              <p className="text-xs text-slate-500 max-w-sm pt-1.5 leading-relaxed">
                Provide a title and a target deadline, then click Generate. The AI agents will assemble a custom flow chart step structure.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
