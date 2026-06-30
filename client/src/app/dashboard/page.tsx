"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { formatISTDate, formatISTDateTime, getRelativeISTTime } from '@/utils/date/index';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar as CalIcon,
  TrendingUp,
  Play,
  ArrowRight,
  Plus,
  Loader,
  Activity,
  Award,
  Lightbulb,
  Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SkeletonCard, SkeletonTask } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import Link from 'next/link';
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
interface DashboardPageProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}
export default function DashboardPage({ refreshTrigger = 0, onRefresh }: DashboardPageProps) {
  const { token, user } = useAuth();
  const { tasks, loading: tasksLoading, createTask, updateTask } = useTasks(token, refreshTrigger);

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [brief, setBrief] = useState('Checking your workspace metrics...');
  const [quickTitle, setQuickTitle] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const getGreeting = () => {
    if (!mounted) return "Welcome Back 👋";
    const hr = new Date().getHours();
    const name = user?.displayName || user?.email?.split('@')[0] || 'Pilot';
    if (hr < 12) return `Good morning, ${name} 👋`;
    if (hr < 17) return `Good afternoon, ${name} 👋`;
    return `Good evening, ${name} 👋`;
  };
  const fetchDashboardData = async () => {
    if (!token) return;
    try {

      const analRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/analytics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (analRes.ok) {
        const analData = await analRes.json();
        setAnalytics(analData);
      }

      const briefRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/ai/brief?type=morning`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (briefRes.ok) {
        const briefData = await briefRes.json();
        setBrief(briefData.brief);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoadingStats(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, [token, refreshTrigger]);
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !token) return;
    setSubmittingTask(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/ai/natural-add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: quickTitle })
      });
      if (res.ok) {
        setQuickTitle('');
        fetchDashboardData();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingTask(false);
    }
  };
  const toggleTaskComplete = async (taskId: string, currentStatus: string) => {
    const targetStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await updateTask(taskId, { status: targetStatus });
      fetchDashboardData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };
  const getPriorityColor = (lvl: string) => {
    switch (lvl) {
      case 'Critical': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'High': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Medium': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 5);
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
            {getGreeting()}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Clear skies ahead. Today is {mounted ? formatISTDate(new Date()) : '...'}.
          </p>
        </div>
        {/* NLP Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="flex gap-2 w-full md:w-96">
          <input 
            type="text" 
            placeholder="Add task naturally (e.g. math project by friday)..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            disabled={submittingTask}
            className="flex-grow px-4 py-2.5 text-xs rounded-xl border border-white/5 bg-slate-900/60 placeholder-slate-500 text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={submittingTask || !quickTitle.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            {submittingTask ? <Loader className="w-4.5 h-4.5 animate-spin" /> : <Plus className="w-4.5 h-4.5" />}
          </button>
        </form>
      </div>
      {/* AI Daily Briefing Banner */}
      <div className="glass-card p-5 border-indigo-500/20 bg-indigo-950/20 active-border-glow overflow-hidden relative text-left">
        <div className="absolute top-[-20%] right-[-5%] w-60 h-60 rounded-full bg-cyan-500/5 blur-[50px]" />
        <div className="flex gap-4 items-start relative">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">📋 Workspace Summary</span>
            {loadingStats ? (
              <div className="space-y-1.5 py-1">
                <div className="h-3.5 w-64 bg-slate-800/40 rounded animate-pulse" />
                <div className="h-3.5 w-48 bg-slate-800/40 rounded animate-pulse" />
              </div>
            ) : (
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">{brief}</p>
            )}
          </div>
        </div>
      </div>
      {/* Grid: Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        {/* Productivity Score dial */}
        <div className="glass-card p-6 flex flex-col justify-between items-center text-center">
          <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block border-b border-white/5 pb-2 w-full">Productivity Pilot Score</span>
          <div className="relative flex justify-center py-4">
            <div className="w-28 h-28 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/20">
              {loadingStats ? (
                <Loader className="w-5 h-5 text-indigo-400 animate-spin" />
              ) : (
                <>
                  <span className="text-3xl font-black text-white">{analytics?.productivityScore || 70}</span>
                  <span className="text-[9px] text-slate-500 font-bold tracking-widest">PTS</span>
                </>
              )}
            </div>
            <div className="absolute top-4 w-28 h-28 rounded-full border-4 border-t-indigo-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin duration-3000 pointer-events-none" />
          </div>
          <span className="text-xs text-indigo-300 font-medium">Performance Clearance Rating</span>
        </div>
        {}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Focus Duration</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="py-4">
            <h3 className="text-4xl font-extrabold text-white">
              {loadingStats ? "..." : `${analytics?.focusTimeHours || 0.0}`}
            </h3>
            <p className="text-xs text-slate-500 pt-1 font-semibold">Total focus hours logged</p>
          </div>
          <span className="text-xs text-cyan-400 font-semibold">Based on target calculations</span>
        </div>
        {}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Task Clearance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="py-4">
            <h3 className="text-4xl font-extrabold text-white">
              {loadingStats ? "..." : `${analytics?.tasksCompleted || 0}`}
            </h3>
            <p className="text-xs text-slate-500 pt-1 font-semibold">Completed Tasks</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="text-emerald-400">Done: {analytics?.tasksCompleted || 0}</span>
            <span className="text-rose-400">Missed: {analytics?.tasksMissed || 0}</span>
          </div>
        </div>
        {}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="py-4">
            <h3 className="text-4xl font-extrabold text-white">
              {loadingStats ? "..." : `${analytics?.completionRate || 100}%`}
            </h3>
            <p className="text-xs text-slate-500 pt-1 font-semibold">Clearance probability</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500" 
              style={{ width: `${analytics?.completionRate || 100}%` }}
            />
          </div>
        </div>
      </div>
      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">

        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase">Active Task Dashboard</h3>
              <Link href="/dashboard/tasks" className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-0.5">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {tasksLoading ? (
              <div className="space-y-3">
                <SkeletonTask />
                <SkeletonTask />
                <SkeletonTask />
              </div>
            ) : pendingTasks.length === 0 ? (
              <div className="py-6">
                <EmptyState type="tasks" />
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((t) => (
                  <div 
                    key={t._id} 
                    className="p-3.5 rounded-xl border border-white/5 bg-slate-950/20 hover:border-indigo-500/20 hover:bg-slate-950/40 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <button 
                        onClick={() => toggleTaskComplete(t._id, t.status)}
                        className="w-5 h-5 rounded border border-white/20 hover:border-indigo-500 flex items-center justify-center shrink-0 transition-all"
                      >
                        {t.status === 'Completed' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                      <div className="truncate text-left">
                        <span className={`block text-xs font-bold text-slate-200 truncate ${t.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                          {t.title}
                        </span>
                        <span className="text-[9px] text-slate-500 block pt-0.5">
                          {t.category} • Deadline: {mounted ? getRelativeISTTime(t.deadline) : '...'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {t.deadlineRiskPercent > 40 && (
                        <div className="px-2 py-0.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-[8px] text-rose-400 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Risk</span>
                        </div>
                      )}
                      <span className={`text-[8px] px-2 py-0.5 rounded-full border font-bold ${getPriorityColor(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase border-b border-white/5 pb-2">
              Weekly Task Clearance Trends
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.dailyCompletionTrend || []}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase">AI Productivity Coach</h3>
              <Lightbulb className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="space-y-4">
              {loadingStats ? (
                <div className="space-y-3">
                  <div className="h-12 w-full bg-slate-800/40 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-800/40 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">Focus Insights</span>
                    {analytics?.insights && analytics.insights.length > 0 ? (
                      analytics.insights.map((ins, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
                          {ins}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No focus insights generated yet.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">Recommendations</span>
                    {analytics?.recommendations && analytics.recommendations.length > 0 ? (
                      analytics.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-indigo-950/15 border border-indigo-500/10 text-xs text-indigo-300 leading-relaxed">
                          💡 {rec}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No recommendations logged.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
