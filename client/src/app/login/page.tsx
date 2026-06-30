"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, AlertCircle, Loader } from 'lucide-react';

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithEmail, signUpWithEmail, loginWithMock, isMock } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name) {
          setError('Name is required for registration.');
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      router.push('/dashboard');
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoBypass = () => {
    setError('');
    setIsLoading(true);
    try {
      loginWithMock();
      router.push('/dashboard');
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="p-3 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30">
            <Compass className="w-8 h-8 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            DeadlinePilot
          </span>
          <p className="text-xs text-slate-400 max-w-xs">
            Authenticate to sync your schedules and pilot your deadlines.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border-white/10 bg-slate-950/50 shadow-2xl relative overflow-hidden">
          {isMock && (
            <div className="absolute top-0 left-0 right-0 py-1 bg-amber-500/20 border-b border-amber-500/35 text-[10px] text-center font-semibold text-amber-300 uppercase tracking-wider">
              ⚡ Demo Offline Mode Active
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-400 mb-6">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 pl-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vibe Pilot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:bg-slate-900 focus:border-indigo-500/50 text-sm text-slate-100 outline-none transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 pl-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:bg-slate-900 focus:border-indigo-500/50 text-sm text-slate-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 pl-1">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 focus:bg-slate-900 focus:border-indigo-500/50 text-sm text-slate-100 outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Google Login */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          {/* Demo Bypass button */}
          <button 
            type="button"
            onClick={handleDemoBypass}
            disabled={isLoading}
            className="w-full py-3 mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            ⚡ Continue in Demo Mode
          </button>
        </div>

        {/* Toggle link */}
        <div className="text-center">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "New to DeadlinePilot? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
