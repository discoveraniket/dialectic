import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface SocraticInquiryGroupProps {
  chips?: string[];
  onSelectChip?: (chip: string) => void;
}

export const SocraticInquiryGroup: React.FC<SocraticInquiryGroupProps> = ({
  chips,
  onSelectChip,
}) => {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pt-2 my-2 select-none">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectChip?.(chip)}
          className="group px-2.5 py-1 rounded-md bg-[#202020] hover:bg-[#292929] border border-[#303030] hover:border-[#444444] text-[#cccccc] hover:text-white text-[11px] font-normal transition-all cursor-pointer inline-flex items-center space-x-1 shadow-sm"
        >
          <span>{chip}</span>
          <ArrowUpRight className="w-3 h-3 text-[#777777] group-hover:text-sky-400 transition-colors" />
        </button>
      ))}
    </div>
  );
};

export default SocraticInquiryGroup;
