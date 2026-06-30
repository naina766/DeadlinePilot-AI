
"use client";
import React, { useState, useEffect } from 'react';
import { formatISTDate, formatISTTime, getCurrentISTDate, getISTWeekday } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar as CalIcon, 
  RefreshCw, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles,
  Loader,
  Layers,
  ArrowRight
} from 'lucide-react';
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'task' | 'meeting' | 'personal';
  sourceTaskId?: string;
}
export default function CalendarPage({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const { token } = useAuth();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const fetchCalendar = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/calendar/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      const sorted = data.sort((a: CalendarEvent, b: CalendarEvent) => 
        new Date(a.start).getTime() - new Date(b.start).getTime()
      );
      setEvents(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCalendar();
  }, [token, refreshTrigger]);
  const handleSyncGCal = async () => {
    if (!token) return;
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/calendar/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSyncMessage(data.message);
      fetchCalendar();
    } catch (err) {
      console.error(err);
      setSyncMessage('Google Calendar synchronization failed.');
    } finally {
      setSyncing(false);
    }
  };

  const getNext7Days = () => {
    const days = [];
    const today = getCurrentISTDate();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const getEventsForDay = (date: Date) => {
    const targetDateStr = formatISTDate(date);
    return events.filter(e => {
      return formatISTDate(e.start) === targetDateStr;
    });
  };
  const next7Days = getNext7Days();
  const getEventTypeStyle = (type: string) => {
    switch (type) {
      case 'task': return 'border-indigo-500/20 bg-indigo-500/5 text-indigo-300';
      case 'meeting': return 'border-cyan-500/20 bg-cyan-500/5 text-cyan-300';
      default: return 'border-purple-500/20 bg-purple-500/5 text-purple-300';
    }
  };
  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 max-w-md text-left">
          Schedule slots automatically avoiding conflicts. Connect to Google Calendar to integrate external lecture logs and meetings.
        </p>
        <button
          onClick={handleSyncGCal}
          disabled={syncing}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all"
        >
          {syncing ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync Google Calendar
            </>
          )}
        </button>
      </div>
      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 text-left font-semibold">
          💡 {syncMessage}
        </div>
      )}
      {/* Week Timeline View */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <div className="space-y-6">
          {next7Days.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isToday = formatISTDate(day) === formatISTDate(getCurrentISTDate());

            return (
              <div 
                key={idx} 
                className={`glass-card p-6 border-white/5 bg-slate-900/30 flex flex-col md:flex-row gap-6 items-start ${isToday ? 'border-indigo-500/25 bg-indigo-950/5 active-border-glow' : ''}`}
              >
                {/* Left side: Date Badge */}
                <div className="w-full md:w-36 shrink-0 flex md:flex-col justify-between md:justify-start items-center md:items-start border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 pr-0 md:pr-4 gap-2 text-left">
                  <div>
                    <h4 className={`text-sm font-black ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>
                      {getISTWeekday(day)}
                    </h4>
                    <span className="text-xl font-extrabold text-slate-200 mt-1 block">
                      {formatISTDate(day)}
                    </span>
                  </div>
                  {isToday && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>

                {}
                <div className="flex-grow w-full space-y-2 text-left">
                  {dayEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2 pl-1">No tasks or blocks scheduled. Enjoy your open space!</p>
                  ) : (
                    dayEvents.map((event, idx) => {
                      const startT = formatISTTime(event.start);
                      const endT = formatISTTime(event.end);

                      return (
                        <div 
                          key={event.id || idx}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all hover:bg-white/5 ${getEventTypeStyle(event.type)}`}
                        >
                          <div className="space-y-1">
                            <span className="text-sm font-bold block">{event.title}</span>
                            {event.description && (
                              <p className="text-[10px] text-slate-400 leading-normal pl-0.5">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-xs font-bold font-mono">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {startT} - {endT}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
