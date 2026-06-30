import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/10 bg-rose-950/5 max-w-sm mx-auto space-y-4">
      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider">Sync Failure</h3>
        <p className="text-xs text-slate-400 leading-normal max-w-xs">
          {message || 'Apologies, I encountered an issue updating that request.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-md"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
