"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Compass, 
  Calendar as CalIcon, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <Compass className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            DeadlinePilot <span className="text-xs px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-400 font-normal">AI</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Agents</a>
          <a href="#chat" className="hover:text-white transition-colors">AI Chat</a>
          <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
        </nav>
        <div>
          <Link 
            href={user ? "/dashboard" : "/login"}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold glass-card bg-indigo-600/10 border-indigo-500/30 hover:bg-indigo-600 text-white shadow-lg hover:shadow-indigo-600/25 flex items-center gap-1.5 transition-all duration-300"
          >
            {user ? "Enter Dashboard" : "Get Started"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Productivity Companion
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            The Last-Minute <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">AI Executive Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Stop letting deadlines overwhelm you. DeadlinePilot is an active agentic coordinator that plans, schedules, prioritizes, and reflection-coaches you to success before time runs out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link 
              href={user ? "/dashboard" : "/login"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 duration-300"
            >
              Configure Your Assistant
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold glass-card border-white/5 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-1.5 transition-all duration-300"
            >
              Explore AI Agents
            </a>
          </div>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full mt-16 max-w-4xl relative glass-card p-2 rounded-2xl border-white/10 bg-slate-900/60 shadow-2xl"
        >
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-72 h-72 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />
          <div className="rounded-xl border border-white/5 overflow-hidden bg-slate-950/80 p-6 flex flex-col md:flex-row gap-6 text-left">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-sm font-semibold text-slate-400">PILOT REPORT</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">ACTIVE STATUS</span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Prepare Vibe2Ship Slide Deck</h4>
                    <p className="text-xs text-slate-400 pt-0.5">Deadline: Friday, 6:00 PM</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/5 font-semibold">
                    78% Completion Odds
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI AGENT PLAN BREAKDOWN
                  </div>
                  <div className="space-y-1 text-xs text-slate-400 pl-5 list-decimal font-mono">
                    <div>1. Outline structural slides (0.5 hrs) ✓</div>
                    <div className="text-slate-200">2. Generate product mock assets (1.5 hrs) [PENDING]</div>
                    <div>3. Polish copy & slide transition styles (1.0 hrs)</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-80 glass-card p-4 border-indigo-500/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <TrendingUp className="w-4 h-4" />
                  PRODUCTIVITY PILOT DIAL
                </div>
                <div className="relative flex justify-center py-2">
                  <div className="w-28 h-28 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">88</span>
                    <span className="text-[10px] text-slate-400 tracking-wider">PILOT SCORE</span>
                  </div>
                  <div className="absolute top-2 w-28 h-28 rounded-full border-4 border-t-indigo-500 border-r-cyan-500 border-b-transparent border-l-transparent animate-spin duration-1000 pointer-events-none" />
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
                &quot;You have two free hours now. Complete Part 2 of your presentation slide deck before your next meeting block starts.&quot;
              </p>
            </div>
          </div>
        </motion.div>
        {/* Feature Grid: The 5 Agents */}
        <section id="features" className="w-full pt-32 space-y-12 text-left">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Meet Your Co-Pilots</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              DeadlinePilot runs five specialized AI Agents simultaneously to deliver true executive planning capability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Planner Agent</h3>
              <p className="text-sm text-slate-400 pt-2 leading-relaxed">
                Deconstructs high-level objectives into chronological, micro-estimated actionable subtasks so you never wonder what step is next.
              </p>
            </div>
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Priority Agent</h3>
              <p className="text-sm text-slate-400 pt-2 leading-relaxed">
                Uses deadlines, item urgency, past delays, and user habits to classify priority levels and predict the percentage risk of missing dates.
              </p>
            </div>
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 border border-cyan-500/20">
                <CalIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Scheduling Agent</h3>
              <p className="text-sm text-slate-400 pt-2 leading-relaxed">
                Finds the optimal hours in your active calendar, avoiding sleep slots, university lecture schedules, work, and personal conflicts.
              </p>
            </div>
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Reminder Agent</h3>
              <p className="text-sm text-slate-400 pt-2 leading-relaxed">
                Generates dynamic, encouraging action nudges based on free time windows rather than standard static reminder notifications.
              </p>
            </div>
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 border border-pink-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Reflection Agent</h3>
              <p className="text-sm text-slate-400 pt-2 leading-relaxed">
                Aggregates completion statistics and focus hours logs to issue weekly analytical summaries, coaching tips, and scores.
              </p>
            </div>
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 border border-amber-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-200">Interactive Chat & Voice</h3>
              <p className="text-sm text-slate-400 pt-2 leading-relaxed">
                Quick-add tasks with voice commands or type conversational details to automatically build and assign study/work schedules.
              </p>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-slate-500 border-t border-white/5 bg-slate-950/40">
        <p>
  © 2026 DeadlinePilot AI. Your AI-powered productivity companion.
  Helping you plan, prioritize, and never miss a deadline.
</p>
      </footer>
    </div>
  );
}
