
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  TrendingUp, 
  Clock, 
  Lightbulb, 
  Sparkles, 
  Play, 
  Square,
  CheckCircle,
  Award,
  Loader
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
interface AnalyticsData {
  completionRate: number;
  tasksCompleted: number;
  tasksMissed: number;
  tasksPending: number;
  focusTimeHours: number;
  productivityScore: number;
  insights: string[];
  recommendations: string[];
  summary: string;
  dailyCompletionTrend: Array<{ day: string; completed: number }>;
}
export default function AnalyticsPage() {
  const { token } = useAuth();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [logMessage, setLogMessage] = useState('');
  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, [token]);
  const handleTimerComplete = async () => {
    setTimerRunning(false);
    if (!token) return;
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/analytics/log-focus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ minutes: 25 })
      });
      if (res.ok) {
        setLogMessage('Pomodoro Session Saved! 25 minutes logged.');
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (timerRunning) {
      const id = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(prev => prev - 1);
          setTimerSeconds(59);
        } else {

          handleTimerComplete();
        }
      }, 1000);
      setTimerIntervalId(id);
      return () => clearInterval(id);
    } else {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    }
  }, [timerRunning, timerMinutes, timerSeconds]);
  const handleStartTimer = () => {
    setTimerRunning(true);
    setLogMessage('');
  };
  const handleStopTimer = () => {
    setTimerRunning(false);
  };
  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
    setLogMessage('');
  };
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="py-20 flex justify-center"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {}
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block border-b border-white/5 pb-2">Productivity Rating</span>
                <div className="py-4">
                  <span className="text-5xl font-black text-white">{data?.productivityScore || 70}</span>
                  <span className="text-xs text-indigo-400 font-semibold block pt-1">Executive Coach Score</span>
                </div>
              </div>
              {/* Card 2: Focus Hours */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block border-b border-white/5 pb-2">Focus Logged</span>
                <div className="py-4">
                  <span className="text-5xl font-black text-white">{data?.focusTimeHours || 0}h</span>
                  <span className="text-xs text-cyan-400 font-semibold block pt-1">Total Focus Hours</span>
                </div>
              </div>
              {/* Card 3: Completion percentage */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block border-b border-white/5 pb-2">Completed Odds</span>
                <div className="py-4">
                  <span className="text-5xl font-black text-white">{data?.completionRate || 100}%</span>
                  <span className="text-xs text-emerald-400 font-semibold block pt-1">Total Completion Rate</span>
                </div>
              </div>
            </div>
            {/* Recharts chart */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase border-b border-white/5 pb-2">Completion History</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.dailyCompletionTrend || []}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* AI report summary */}
            {data?.summary && (
              <div className="glass-card p-6 border-indigo-500/25 bg-indigo-950/15 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] w-60 h-60 rounded-full bg-indigo-500/5 blur-[50px]" />
                <div className="space-y-3 relative text-left">
                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-black tracking-widest uppercase">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Pilot executive summary
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-semibold">{data.summary}</p>
                </div>
              </div>
            )}
          </div>
          {}
          <div className="space-y-6">
            {}
            <div className="glass-card p-6 border-white/10 bg-slate-900/60 shadow-xl space-y-4 text-center">
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block border-b border-white/5 pb-2 text-left">Pomodoro Focus Timer</span>
              <div className="py-4">
                <div className="text-6xl font-black text-white font-mono tracking-tight">
                  {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block pt-2">Concentrated study/work block</span>
              </div>
              <div className="flex gap-2">
                {timerRunning ? (
                  <button 
                    onClick={handleStopTimer}
                    className="flex-1 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Square className="w-3.5 h-3.5" /> Stop Focus
                  </button>
                ) : (
                  <button 
                    onClick={handleStartTimer}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Focus
                  </button>
                )}
                <button 
                  onClick={handleResetTimer}
                  className="px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 text-xs font-bold transition-all"
                >
                  Reset
                </button>
              </div>
              {logMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  {logMessage}
                </div>
              )}
            </div>
            {}
            <div className="glass-card p-6 space-y-4 text-left">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 tracking-wider uppercase border-b border-white/5 pb-2">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                Coaching Nudges
              </div>
              <div className="space-y-3">
                {data?.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    💡 {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
