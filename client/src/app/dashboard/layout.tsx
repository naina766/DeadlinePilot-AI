"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AIChatDrawer } from '@/components/AIChatDrawer';
import { 
  Compass, 
  LayoutDashboard, 
  ListTodo, 
  Calendar as CalIcon, 
  TrendingUp, 
  Settings, 
  Cpu, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Loader
} from 'lucide-react';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs uppercase tracking-widest font-semibold">Aligning Pilot Instruments...</span>
      </div>
    );
  }
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Task Pilot", href: "/dashboard/tasks", icon: ListTodo },
    { name: "AI Planner", href: "/dashboard/planner", icon: Cpu },
    { name: "Calendar View", href: "/dashboard/calendar", icon: CalIcon },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];
  const handleRefresh = () => {
    // Increment to propagate tasks updates
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-white/5 bg-slate-900/30 backdrop-blur-md shrink-0">
        <div className="space-y-6">
          <div className="px-6 py-5 flex items-center gap-2 border-b border-white/5">
            <div className="p-1.5 rounded-lg bg-indigo-600 shadow-md shadow-indigo-600/30">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              DeadlinePilot
            </span>
          </div>
          <nav className="px-4 space-y-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* User profile footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20 space-y-3">
          <div className="flex items-center gap-3">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-xl border border-white/10 bg-slate-800"
            />
            <div className="truncate text-left">
              <span className="block text-sm font-bold text-slate-200">{user.displayName}</span>
              <span className="block text-[10px] text-slate-500 truncate">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full py-2.5 rounded-xl border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
      {}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {}
        <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-900/10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-300 lg:hidden transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-extrabold text-slate-100 text-lg uppercase tracking-wider">
              {menuItems.find(m => m.href === pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {}
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/15 flex items-center gap-2 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
              ASK CO-PILOT
            </button>
          </div>
        </header>
        {}
        <main className="flex-grow overflow-y-auto p-6 relative">
          {}
          {React.cloneElement(children as React.ReactElement<any>, { refreshTrigger, onRefresh: handleRefresh })}
        </main>
      </div>
      {}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden flex">
          <div className="w-64 bg-slate-950 border-r border-white/5 flex flex-col justify-between p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  DeadlinePilot
                </span>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                >
                  <X className="w-4 h-4 text-slate-300" />
                </button>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={idx}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-lg"
                />
                <div className="truncate">
                  <span className="block text-xs font-bold text-slate-200">{user.displayName}</span>
                  <span className="block text-[8px] text-slate-500 truncate">{user.email}</span>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full py-2 rounded-lg border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-[10px] font-bold transition-all flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      {}
      {chatOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[6px] transition-all duration-300"
          onClick={() => setChatOpen(false)}
        />
      )}
      {/* Floating AI Chat Drawer */}
      <AIChatDrawer 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        onRefreshTasks={handleRefresh}
      />
    </div>
  );
}
