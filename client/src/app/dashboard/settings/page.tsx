"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings, 
  Clock, 
  GraduationCap, 
  Trash2, 
  Plus, 
  Check, 
  Loader,
  Cpu
} from 'lucide-react';
interface ClassItem {
  name: string;
  days: number[]; 
  start: string;
  end: string;
}
export default function SettingsPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [workStart, setWorkStart] = useState("09:00");
  const [workEnd, setWorkEnd] = useState("17:00");
  const [sleepStart, setSleepStart] = useState("23:00");
  const [sleepEnd, setSleepEnd] = useState("07:00");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [habits, setHabits] = useState({ avgCompletionSpeed: 1.0, delayRatio: 0.15 });

  const [newClassName, setNewClassName] = useState('');
  const [newClassDays, setNewClassDays] = useState<number[]>([]);
  const [newClassStart, setNewClassStart] = useState('10:00');
  const [newClassEnd, setNewClassEnd] = useState('11:30');
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await res.json();

        setWorkStart(profile.workStart);
        setWorkEnd(profile.workEnd);
        setSleepStart(profile.sleepStart);
        setSleepEnd(profile.sleepEnd);
        setClasses(profile.classes || []);
        if (profile.habits) {
          setHabits(profile.habits);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);
  const handleAddClass = () => {
    if (!newClassName.trim() || newClassDays.length === 0) return;
    const newClass: ClassItem = {
      name: newClassName,
      days: newClassDays,
      start: newClassStart,
      end: newClassEnd
    };
    setClasses(prev => [...prev, newClass]);
    setNewClassName('');
    setNewClassDays([]);
  };
  const handleRemoveClass = (idx: number) => {
    setClasses(prev => prev.filter((_, i) => i !== idx));
  };
  const toggleDaySelection = (day: number) => {
    setNewClassDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workStart,
          workEnd,
          sleepStart,
          sleepEnd,
          classes,
          habits
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  const weekdays = [
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 },
  ];
  const getDayNames = (days: number[]) => {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(d => names[d]).join(', ');
  };
  return (
    <div className="space-y-6 text-left">
      {loading ? (
        <div className="py-20 flex justify-center"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {}
          <div className="glass-card p-6 border-white/10 bg-slate-900/60 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase">Time Constraints</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sleep Start</label>
                  <input 
                    type="time" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sleep End</label>
                  <input 
                    type="time" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50 text-slate-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Work/Study Start</label>
                  <input 
                    type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Work/Study End</label>
                  <input 
                    type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50 text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Column 2: Classes / Timetables */}
          <div className="glass-card p-6 border-white/10 bg-slate-900/60 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase">Lectures & Timetables</h3>
            </div>
            {}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {classes.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 pl-1">No locked classes. AI has full weekday slot access.</p>
              ) : (
                classes.map((cls, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/5 bg-slate-950/40 flex justify-between items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-200">{cls.name}</span>
                      <span className="block text-[9px] text-slate-500 pt-0.5">
                        {getDayNames(cls.days)} • {cls.start} - {cls.end}
                      </span>
                    </div>
                    <button 
                      type="button" onClick={() => handleRemoveClass(idx)}
                      className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {}
            <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 space-y-3 pt-4">
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Lock Lecture hours</span>
              <input 
                type="text" placeholder="e.g. Distributed Systems"
                value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/5 bg-slate-950/40 text-xs outline-none focus:border-indigo-500/50"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500">Days:</span>
                <div className="flex gap-1">
                  {weekdays.map(d => (
                    <button
                      key={d.value} type="button"
                      onClick={() => toggleDaySelection(d.value)}
                      className={`w-6 h-6 rounded-md text-[9px] font-bold border transition-all ${newClassDays.includes(d.value) ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-white/5 bg-slate-950/40 text-slate-400'}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="time" value={newClassStart} onChange={(e) => setNewClassStart(e.target.value)}
                  className="px-2 py-1.5 rounded border border-white/5 bg-slate-950/40 text-xs text-slate-200 outline-none"
                />
                <input 
                  type="time" value={newClassEnd} onChange={(e) => setNewClassEnd(e.target.value)}
                  className="px-2 py-1.5 rounded border border-white/5 bg-slate-950/40 text-xs text-slate-200 outline-none"
                />
              </div>
              <button
                type="button" onClick={handleAddClass}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Lecture
              </button>
            </div>
          </div>
          {/* Column 3: AI Coefficients & Save */}
          <div className="glass-card p-6 border-white/10 bg-slate-900/60 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-slate-200 text-sm tracking-wider uppercase">AI Coefficients</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Work Speed factor</span>
                  <span>{habits.avgCompletionSpeed}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1"
                  value={habits.avgCompletionSpeed}
                  onChange={(e) => setHabits(prev => ({ ...prev, avgCompletionSpeed: parseFloat(e.target.value) }))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[9px] text-slate-500 block leading-normal pt-1">
                  1.0 is normal speed. Increase if you need larger safety buffers.
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Past Delays index</span>
                  <span>{Math.round(habits.delayRatio * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.0" max="1.0" step="0.05"
                  value={habits.delayRatio}
                  onChange={(e) => setHabits(prev => ({ ...prev, delayRatio: parseFloat(e.target.value) }))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-[9px] text-slate-500 block leading-normal pt-1">
                  Historical late clearance index. AI increases task risk scores accordingly.
                </span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <button 
                type="submit" disabled={saving}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-lg"
              >
                {saving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Pilot Profile
                  </>
                )}
              </button>
              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-400 font-bold text-center">
                  ✓ Profile settings updated successfully.
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
