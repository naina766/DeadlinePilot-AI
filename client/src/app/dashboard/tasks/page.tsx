
"use client";
import React, { useState, useEffect } from 'react';
import { formatISTDate, formatISTTime, formatISTDateTime } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, 
  Trash2, 
  Calendar as CalIcon, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  Paperclip,
  CheckSquare,
  Check,
  X,
  Loader,
  Cpu,
  Filter
} from 'lucide-react';
interface SubTask {
  title: string;
  status: 'pending' | 'completed';
  estimatedHours: number;
}
interface Task {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  category: string;
  tags: string[];
  attachments: string[];
  subtasks: SubTask[];
  scheduledStart?: string;
  scheduledEnd?: string;
  deadlineRiskPercent: number;
}
export default function TasksPage({ refreshTrigger = 0, onRefresh }: { refreshTrigger?: number; onRefresh?: () => void }) {
  const { token } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('1');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Medium');
  const [tags, setTags] = useState('');

  const [aiLoading, setAiLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [token, refreshTrigger]);
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !title || !deadline) return;
    setCreateLoading(true);
    try {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
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
          estimatedHours: parseFloat(estimatedHours) || 1.0,
          category,
          tags: parsedTags,
          priority
        })
      });
      if (res.ok) {
        setIsCreateOpen(false);
        setTitle('');
        setDescription('');
        setDeadline('');
        setEstimatedHours('1');
        setCategory('General');
        setPriority('Medium');
        setTags('');
        fetchTasks();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };
  const handleToggleSubtask = async (task: Task, subIdx: number) => {
    if (!token) return;

    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subIdx].status = updatedSubtasks[subIdx].status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setActiveTask(updatedTask);
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAutoSchedule = async (taskId: string) => {
    if (!token) return;
    setAiLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/ai/schedule-task/${taskId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks();

        const updatedTaskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${taskId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updatedTask = await updatedTaskRes.json();
        setActiveTask(updatedTask);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this pilot task?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setActiveTask(null);
        fetchTasks();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTasks();
        const updatedTask = await res.json();
        setActiveTask(updatedTask);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'High': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Medium': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };
  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 glass-card px-4 py-2 border-white/5 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-semibold">Workspace Pilot Filters</span>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Create Task Objective
        </button>
      </div>
      {/* Task Grid Columns */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Pending */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 px-2">
              <span className="text-xs font-black text-slate-400 tracking-wider uppercase">Pending Blocks</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 font-semibold">
                {tasks.filter(t => t.status === 'Pending').length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Pending').map((task, idx) => (
                <TaskCard key={task._id || `pending-${idx}`} task={task} onClick={() => setActiveTask(task)} getPriorityClass={getPriorityClass} />
              ))}
            </div>
          </div>
          {/* Column 2: In Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 px-2">
              <span className="text-xs font-black text-indigo-400 tracking-wider uppercase">In Flight Pilot</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 font-semibold">
                {tasks.filter(t => t.status === 'In Progress').length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'In Progress').map((task, idx) => (
                <TaskCard key={task._id || `progress-${idx}`} task={task} onClick={() => setActiveTask(task)} getPriorityClass={getPriorityClass} />
              ))}
            </div>
          </div>
          {/* Column 3: Completed */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 px-2">
              <span className="text-xs font-black text-emerald-400 tracking-wider uppercase">Cleared Objectives</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 font-semibold">
                {tasks.filter(t => t.status === 'Completed').length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Completed').map((task, idx) => (
                <TaskCard key={task._id || `completed-${idx}`} task={task} onClick={() => setActiveTask(task)} getPriorityClass={getPriorityClass} />
              ))}
            </div>
          </div>
        </div>
      )}
      {}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-slate-100">
          <div className="w-full max-w-lg glass-card border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
              <span className="font-extrabold text-sm tracking-wider uppercase text-slate-200">New Task Objective</span>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded hover:bg-white/5"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Objective Title</label>
                <input 
                  type="text" required placeholder="e.g. Write DBMS Project Report"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Task Description</label>
                <textarea 
                  placeholder="Details of required action steps..." rows={2}
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Target Deadline</label>
                  <input 
                    type="datetime-local" required
                    value={deadline} onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Estimated Hours</label>
                  <input 
                    type="number" step="0.5" required
                    value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900 text-sm outline-none focus:border-indigo-500/50 text-slate-100"
                  >
                    <option value="General" className="bg-slate-900 text-slate-100">General</option>
                    <option value="Study" className="bg-slate-900 text-slate-100">Study</option>
                    <option value="Work" className="bg-slate-900 text-slate-100">Work</option>
                    <option value="Personal" className="bg-slate-900 text-slate-100">Personal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Priority Rating</label>
                  <select 
                    value={priority} onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900 text-sm outline-none focus:border-indigo-500/50 text-slate-100"
                  >
                    <option value="Low" className="bg-slate-900 text-slate-100">Low</option>
                    <option value="Medium" className="bg-slate-900 text-slate-100">Medium</option>
                    <option value="High" className="bg-slate-900 text-slate-100">High</option>
                    <option value="Critical" className="bg-slate-900 text-slate-100">Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tags (comma-separated)</label>
                <input 
                  type="text" placeholder="e.g. code, report, slides"
                  value={tags} onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-sm outline-none focus:border-indigo-500/50"
                />
              </div>
              <button 
                type="submit" disabled={createLoading}
                className="w-full py-3 mt-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-lg"
              >
                {createLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Task Objective
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* DETAIL VIEW MODAL */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-slate-100">
          <div className="w-full max-w-2xl glass-card border-white/10 bg-slate-900 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Section: Details */}
            <div className="flex-grow p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-100 leading-tight">{activeTask.title}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Category: {activeTask.category}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${getPriorityClass(activeTask.priority)}`}>
                  {activeTask.priority}
                </span>
              </div>
              {activeTask.description && (
                <p className="text-xs text-slate-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  {activeTask.description}
                </p>
              )}
              {/* Subtasks checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">AI Agent Subtask breakdown</span>
                {activeTask.subtasks && activeTask.subtasks.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                    {activeTask.subtasks.map((sub, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleToggleSubtask(activeTask, idx)}
                        className="p-2.5 rounded-xl border border-white/5 bg-slate-950/20 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${sub.status === 'completed' ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400' : 'border-white/20'}`}>
                          {sub.status === 'completed' && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-xs text-slate-200 ${sub.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                          {sub.title} ({sub.estimatedHours} hrs)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic pl-1">No execution plan generated for this task.</p>
                )}
              </div>
            </div>
            {}
            <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-white/5 bg-slate-950/20 p-6 flex flex-col justify-between shrink-0 text-left">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">Urgency Status</span>
                  <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      DEADLINE REPORT
                    </div>
                    <span className="block text-xs font-bold text-slate-200">
                      {formatISTDate(activeTask.deadline)}
                    </span>
                    {activeTask.deadlineRiskPercent > 40 ? (
                      <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {activeTask.deadlineRiskPercent}% Missing Risk
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        ✓ Stable clearance track
                      </span>
                    )}
                  </div>
                </div>
                {/* Auto schedule view */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">AI Calendar Auto-Slot</span>
                  {activeTask.scheduledStart ? (
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[10px] text-cyan-300">
                      <span className="block font-bold">Scheduled Block:</span>
                      <span className="block font-mono text-[9px] mt-0.5">
                        {formatISTDateTime(activeTask.scheduledStart)} - {formatISTTime(activeTask.scheduledEnd!)}
                      </span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAutoSchedule(activeTask._id)}
                      disabled={aiLoading}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      {aiLoading ? (
                        <Loader className="w-4.5 h-4.5 animate-spin" />
                      ) : (
                        <>
                          <Cpu className="w-4 h-4" />
                          Auto-Schedule Slot
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              {/* Modify State & Delete */}
              <div className="space-y-2.5 pt-6 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">Clearance State</span>
                  <div className="flex gap-2">
                    {['Pending', 'In Progress', 'Completed'].map(st => (
                      <button 
                        key={st}
                        onClick={() => updateTaskStatus(activeTask._id, st)}
                        className={`flex-1 py-1.5 rounded-lg border text-[9px] font-bold transition-all ${activeTask.status === st ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleDeleteTask(activeTask._id)}
                    className="w-10 py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/15 text-rose-400 flex items-center justify-center transition-all"
                    title="Delete objective"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTask(null)}
                    className="flex-grow py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all text-center"
                  >
                    Close Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
interface TaskCardProps {
  task: Task;
  onClick: () => void;
  getPriorityClass: (lvl: string) => string;
}
const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, getPriorityClass }) => {
  const completedSubs = task.subtasks ? task.subtasks.filter(s => s.status === 'completed').length : 0;
  const totalSubs = task.subtasks ? task.subtasks.length : 0;
  const progressPercent = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;
  return (
    <div 
      onClick={onClick}
      className="glass-card p-4 border-white/5 hover:border-white/10 bg-slate-900/40 cursor-pointer flex flex-col justify-between gap-3 text-left"
    >
      <div className="space-y-1.5">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-semibold">
            {task.category}
          </span>
          <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{task.title}</h4>
      </div>
      {}
      {totalSubs > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
            <span>PLAN PROGRESS</span>
            <span>{completedSubs}/{totalSubs} ITEMS</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}
      {/* Card footer details */}
      <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] text-slate-500 font-mono">
        <div className="flex items-center gap-1 font-bold">
          <CalIcon className="w-3.5 h-3.5 text-slate-400" />
          {formatISTDate(task.deadline)}
        </div>
        {task.deadlineRiskPercent > 40 && (
          <span className="text-rose-400 font-bold flex items-center gap-0.5">
            ⚠️ Risk
          </span>
        )}
      </div>
    </div>
  );
};
