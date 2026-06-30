/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { formatISTTime, getCurrentISTDate } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { useAIChat } from '@/hooks/useAIChat';
import { VoiceInput } from './VoiceInput';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Loader, 
  Copy, 
  Volume2, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Paperclip
} from 'lucide-react';

import ScheduleCard from './ai/cards/ScheduleCard';
import TaskCard from './ai/cards/TaskCard';
import AnalyticsCard from './ai/cards/AnalyticsCard';
import RecommendationCard from './ai/cards/RecommendationCard';
import DeadlineCard from './ai/cards/DeadlineCard';
import FocusCard from './ai/cards/FocusCard';
import HabitCard from './ai/cards/HabitCard';
import CalendarCard from './ai/cards/CalendarCard';
import StudyPlanCard from './ai/cards/StudyPlanCard';
import MorningBriefCard from './ai/cards/MorningBriefCard';
import QuickActionChip from './ai/cards/QuickActionChip';
import TypingIndicator from './ai/cards/TypingIndicator';
import Avatar from './ai/cards/Avatar';
import NotificationCard from './ai/cards/NotificationCard';
import MarkdownRenderer from './ai/cards/MarkdownRenderer';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
  actions?: Array<{
    type: string;
    taskId?: string;
    title?: string;
    scheduledStart?: string;
    scheduledEnd?: string;
  }>;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshTasks?: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose, onRefreshTasks }) => {
  const { token } = useAuth();
  
  const defaultGreeting: Message = {
    sender: 'ai',
    text: JSON.stringify({
      type: "general",
      title: "Co-Pilot Workspace Activated",
      summary: "Hello! I am your AI Executive Co-Pilot. I have direct access to your tasks, calendar schedule, habits, and productivity analytics. How can I optimize your schedule today?",
      cards: [],
      quickActions: [
        "📅 Show today's schedule",
        "📋 Show pending tasks",
        "📈 Show analytics",
        "🧠 Generate study plan"
      ]
    }),
    timestamp: formatISTTime(getCurrentISTDate())
  };

  const { messages, loading, sendMessage, clearHistory } = useAIChat(token, onRefreshTasks);
  const [inputText, setInputText] = useState('');
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ [key: number]: 'up' | 'down' | null }>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const thinkingStates = [
    "🤖 Reading your schedule...",
    "📅 Checking your calendar...",
    "🧠 Analyzing priorities...",
    "⚡ Building productivity insights...",
    "🚀 Preparing your executive brief..."
  ];

  // Cycle thinking status messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setThinkingIndex(prev => (prev + 1) % thinkingStates.length);
      }, 1500);
    } else {
      setThinkingIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    await sendMessage(text);
    setInputText('');
  };

  const handleVoiceInput = (dictatedText: string) => {
    setInputText(dictatedText);
    handleSendMessage(dictatedText);
  };

  const clearChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
    }
    clearHistory();
  };

  const copyToClipboard = (text: string, idx: number) => {
    let rawText = text;
    try {
      const parsed = JSON.parse(text);
      rawText = parsed.summary || text;
    } catch {
      // ignore
    }

    navigator.clipboard.writeText(rawText);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const speakMessage = (text: string, idx: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    let rawText = text;
    try {
      const parsed = JSON.parse(text);
      rawText = parsed.summary || text;
    } catch {
      // ignore
    }

    const cleanText = rawText.replace(/[*`|#-]/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleFeedback = (idx: number, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [idx]: prev[idx] === type ? null : type
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.sender === 'user') {
      return <p className="text-slate-100 whitespace-pre-wrap">{msg.text}</p>;
    }

    let parsed = null;
    try {
      parsed = JSON.parse(msg.text);
    } catch {
      return <MarkdownRenderer text={msg.text} />;
    }

    if (!parsed || typeof parsed !== 'object') {
      return <p className="text-slate-200">{msg.text}</p>;
    }

    return (
      <div className="space-y-4">
        {/* Title and summary */}
        <div className="space-y-1">
          {parsed.title && (
            <span className="text-[10px] uppercase tracking-wider font-black text-indigo-400 block">
              {parsed.title}
            </span>
          )}
          <TypingIndicator text={parsed.summary} />
        </div>

        {/* Dynamic visual cards mapping */}
        {parsed.cards && parsed.cards.length > 0 && (
          <div className="space-y-3.5 pt-2 border-t border-white/5">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {parsed.cards.map((card: any, cIdx: number) => {
              switch (card.type) {
                case 'schedule':
                  return <ScheduleCard key={cIdx} events={card.data?.events} />;
                case 'tasks':
                  return <TaskCard key={cIdx} tasks={card.data?.tasks} />;
                case 'analytics':
                  return (
                    <AnalyticsCard 
                      key={cIdx} 
                      focusHours={card.data?.focusHours} 
                      productivityScore={card.data?.productivityScore} 
                      completedTasks={card.data?.completedTasks}
                      weeklyTrend={card.data?.weeklyTrend}
                    />
                  );
                case 'recommendation':
                  return (
                    <RecommendationCard 
                      key={cIdx} 
                      recommendation={card.data?.recommendation} 
                      estimatedImpact={card.data?.estimatedImpact}
                      timeRequired={card.data?.timeRequired}
                      actionButtonText={card.data?.actionButtonText}
                      actionPrompt={card.data?.actionPrompt}
                      onActionClick={handleSendMessage}
                    />
                  );
                case 'deadline':
                case 'warning':
                  return (
                    <DeadlineCard 
                      key={cIdx} 
                      task={card.data?.task} 
                      deadline={card.data?.deadline}
                      urgency={card.data?.urgency || 'Critical'}
                      risk={card.data?.risk || 'High'}
                    />
                  );
                case 'focus':
                  return (
                    <FocusCard 
                      key={cIdx} 
                      goal={card.data?.goal} 
                      duration={card.data?.duration}
                      sessionCount={card.data?.sessionCount || 1}
                    />
                  );
                case 'habit':
                  return <HabitCard key={cIdx} habits={card.data?.habits} />;
                case 'calendar':
                  return <CalendarCard key={cIdx} slots={card.data?.slots} />;
                case 'studyPlan':
                  return <StudyPlanCard key={cIdx} planTitle={card.data?.planTitle} topics={card.data?.topics} />;
                case 'morningBrief':
                  return <MorningBriefCard key={cIdx} summary={card.data?.summary} focusPoints={card.data?.focusPoints} />;
                case 'notification':
                case 'notifications':
                case 'reminders':
                  return <NotificationCard key={cIdx} notifications={card.data?.notifications || card.data?.reminders} />;
                default:
                  return null;
              }
            })}
          </div>
        )}

        {/* Suggestion Chips */}
        {parsed.quickActions && parsed.quickActions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
            {parsed.quickActions.map((act: string, aIdx: number) => (
              <QuickActionChip key={aIdx} label={act} onClick={handleSendMessage} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[6px] transition-opacity" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed z-50 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300
                   w-full h-full bottom-0 right-0 rounded-none
                   md:fixed md:bottom-0 md:right-0 md:h-screen md:w-[450px] md:rounded-l-3xl md:border-l md:border-white/10
                   lg:fixed lg:bottom-6 lg:right-6 lg:h-[80vh] lg:w-[440px] lg:rounded-[28px] lg:border lg:border-cyan-500/20 lg:shadow-cyan-500/5
                   bg-[#0B1220]/95 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-white/5 flex justify-between items-center bg-slate-900/30">
          <div className="flex items-center gap-3">
            <Avatar />
            <div className="text-left">
              <h3 className="font-extrabold text-slate-100 text-sm tracking-wide">DeadlinePilot AI</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Productivity Copilot</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={clearChat}
              title="New Chat"
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              title="Close Panel"
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Conversation Box */}
        <div className="flex-1 overflow-y-auto px-6 py-4.5 space-y-5">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col relative group ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`text-[15px] leading-[1.6] relative ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-[#6C4DFF] to-[#7C3AED] text-white p-3.5 rounded-2xl rounded-tr-sm max-w-[75%] shadow-lg' 
                    : 'bg-[#182234] border border-[#2A4C7A] text-slate-200 p-4 rounded-[18px] rounded-tl-sm max-w-[85%] shadow-md'
                }`}
              >
                {renderMessageContent(msg)}

                {/* Floating action bar on AI hover */}
                {msg.sender === 'ai' && (
                  <div className="absolute right-3 -bottom-4 bg-[#0F172A] border border-white/5 rounded-lg py-1 px-1.5 flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <button 
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy text"
                    >
                      {copiedIdx === idx ? <span className="text-[10px] text-emerald-400 font-bold">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => speakMessage(msg.text, idx)}
                      className={`text-slate-400 hover:text-white transition-colors ${speakingIdx === idx ? 'text-indigo-400 animate-pulse' : ''}`}
                      title={speakingIdx === idx ? "Stop speaking" : "Speak text"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    {idx > 0 && messages[idx - 1]?.sender === 'user' && (
                      <button 
                        onClick={() => handleSendMessage(messages[idx - 1].text)}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Regenerate answer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleFeedback(idx, 'up')}
                      className={`text-slate-400 hover:text-emerald-400 transition-colors ${feedback[idx] === 'up' ? 'text-emerald-400' : ''}`}
                      title="Thumbs up"
                    >
                      <ThumbsUp className="w-3.2 h-3.2" />
                    </button>
                    <button 
                      onClick={() => handleFeedback(idx, 'down')}
                      className={`text-slate-400 hover:text-rose-400 transition-colors ${feedback[idx] === 'down' ? 'text-rose-400' : ''}`}
                      title="Thumbs down"
                    >
                      <ThumbsDown className="w-3.2 h-3.2" />
                    </button>
                  </div>
                )}
              </div>

              {/* Timestamp label */}
              {msg.timestamp && (
                <span className="text-[9px] text-slate-500 mt-1 font-semibold pl-1 pr-1 font-mono">
                  {msg.timestamp}
                </span>
              )}

              {/* Action confirmations (if any) */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2.5 w-[85%] space-y-2">
                  {msg.actions.map((act, aIdx) => (
                    <div key={aIdx} className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 text-xs text-cyan-300 flex items-center gap-2">
                      <div className="text-left">
                        <span className="font-bold block">AI Agent Action:</span>
                        <span className="text-[10px] text-slate-400">
                          {act.type === 'created_task' ? '📅 Created Task:' : act.type === 'updated_task' ? '✏️ Updated Task:' : '❌ Deleted Task:'} &quot;{act.title || act.taskId}&quot;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* Cyclical loading & animated thinking dots */}
          {loading && (
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none w-fit">
              <Loader className="w-4.5 h-4.5 animate-spin text-indigo-400" />
              <span>{thinkingStates[thinkingIndex]}</span>
              <span className="flex gap-1.5 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce duration-1000"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce duration-1000 delay-150"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce duration-1000 delay-300"></span>
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-white/5 bg-slate-900/30 flex items-end gap-2.5 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                alert(`File selected: ${e.target.files[0].name}`);
              }
            }} 
          />
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all shrink-0 mb-0.5"
            title="Attach File"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>

          <VoiceInput onTranscript={handleVoiceInput} disabled={loading} />

          <textarea
            ref={textareaRef}
            rows={Math.min(5, inputText.split('\n').length || 1)}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI Co-Pilot..."
            className="flex-grow max-h-32 px-4 py-2.5 text-sm rounded-xl border border-white/5 bg-white/5 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/50 resize-none transition-all duration-150 mb-0.5"
          />

          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={loading || !inputText.trim()}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shrink-0 mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
