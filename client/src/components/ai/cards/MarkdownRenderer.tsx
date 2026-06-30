import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  if (!text) return null;

  // Split by newlines to handle blocks (paragraphs and bullet points)
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 whitespace-pre-wrap text-left break-words">
      {lines.map((line, lIdx) => {
        // Detect bullet list items starting with '-' or '*'
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;

        // Parse bold elements (**text**)
        const boldParts = cleanLine.split('**');
        const formattedLine = boldParts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return (
              <strong key={pIdx} className="font-extrabold text-cyan-300">
                {part}
              </strong>
            );
          }
          // Inside non-bold parts, parse italic elements (*text*)
          const italicParts = part.split('*');
          return italicParts.map((iPart, iIdx) => {
            if (iIdx % 2 === 1) {
              return (
                <em key={iIdx} className="italic text-indigo-300">
                  {iPart}
                </em>
              );
            }
            return iPart;
          });
        });

        if (isBullet) {
          return (
            <div key={lIdx} className="flex items-start gap-2 pl-3 mt-1">
              <span className="text-cyan-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-slate-200 text-sm leading-relaxed">{formattedLine}</span>
            </div>
          );
        }

        return (
          <p key={lIdx} className="text-slate-200 text-sm leading-relaxed min-h-[1rem]">
            {formattedLine}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
