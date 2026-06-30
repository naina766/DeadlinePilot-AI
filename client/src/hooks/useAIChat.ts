import { useState, useEffect } from 'react';
import { sendChatMessage } from '@/lib/api/chat.api';
import { formatISTTime, getCurrentISTDate } from '@/utils/date';

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: any[];
}

export const useAIChat = (token: string | null, onRefreshTasks?: () => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize chat history from session or use standard greeting
  useEffect(() => {
    const localHistory = sessionStorage.getItem('deadline_pilot_chat_history');
    if (localHistory) {
      try {
        setMessages(JSON.parse(localHistory));
        return;
      } catch (e) {
        console.warn("Failed to load session chat history:", e);
      }
    }

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
    setMessages([defaultGreeting]);
  }, []);

  const saveHistory = (newMessages: Message[]) => {
    setMessages(newMessages);
    sessionStorage.setItem('deadline_pilot_chat_history', JSON.stringify(newMessages));
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !token) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: formatISTTime(getCurrentISTDate())
    };

    const updated = [...messages, userMsg];
    saveHistory(updated);
    setLoading(true);

    try {
      const data = await sendChatMessage(text, token);
      
      const aiMsg: Message = {
        sender: 'ai',
        text: data.reply,
        timestamp: formatISTTime(getCurrentISTDate()),
        actions: data.suggestedActions
      };

      saveHistory([...updated, aiMsg]);
      
      if (data.suggestedActions && data.suggestedActions.length > 0 && onRefreshTasks) {
        onRefreshTasks();
      }
    } catch (err) {
      console.error(err);
      const errReply = JSON.stringify({
        type: "general",
        title: "📋 Workspace Summary",
        summary: "I'm temporarily unable to generate an AI response, but here's your current workspace summary.",
        cards: [],
        quickActions: ["📅 Show today's schedule", "📋 Show pending tasks"]
      });
      saveHistory([...updated, {
        sender: 'ai',
        text: errReply,
        timestamp: formatISTTime(getCurrentISTDate())
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    sessionStorage.removeItem('deadline_pilot_chat_history');
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
    setMessages([defaultGreeting]);
  };

  return {
    messages,
    loading,
    sendMessage: handleSendMessage,
    clearHistory: clearChatHistory
  };
};

export default useAIChat;
