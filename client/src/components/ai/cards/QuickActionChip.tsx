import React from 'react';
interface QuickActionChipProps {
  label: string;
  onClick: (value: string) => void;
}
export const QuickActionChip: React.FC<QuickActionChipProps> = ({ label, onClick }) => {

  return (
    <button
      onClick={() => onClick(label)}
      className="px-3.5 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-[11px] font-bold text-slate-300 hover:text-white transition-all shadow-sm shrink-0 active:scale-95 duration-100"
    >
      {label}
    </button>
  );
};
export default QuickActionChip;
