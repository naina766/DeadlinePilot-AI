
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Mic,  AlertCircle } from 'lucide-react';
interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}
export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<any>(null);
  useEffect(() => {

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };
      rec.onresult = (event: any) => {
        const transcriptText = event.results[0][0].transcript;
        onTranscript(transcriptText);
      };
      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied.');
        } else {
          setErrorMsg('Error capturing speech.');
        }
        setIsListening(false);
      };
      rec.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, [onTranscript]);
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg('Speech recognition not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setErrorMsg('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`p-3 rounded-full flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-rose-600 hover:bg-rose-500 animate-pulse text-white ring-4 ring-rose-600/30' 
            : 'bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isListening ? "Listening..." : "Trigger Voice Pilot Input"}
      >
        {isListening ? (
          <Mic className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>
      {errorMsg && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 rounded-lg bg-rose-950/80 border border-rose-500/30 text-[10px] text-rose-300 text-center flex items-center gap-1 shadow-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
