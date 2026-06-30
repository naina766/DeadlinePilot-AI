/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface TypingIndicatorProps {
  text: string;
  speed?: number;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ text, speed = 12 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }

    setDisplayedText('');
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(idx));
      idx++;
      if (idx >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="relative text-left">
      <MarkdownRenderer text={displayedText} />
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-4 ml-0.5 bg-cyan-400 animate-pulse align-middle" />
      )}
    </div>
  );
};

export default TypingIndicator;
