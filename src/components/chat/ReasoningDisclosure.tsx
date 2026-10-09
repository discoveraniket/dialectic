import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Brain, Loader2 } from 'lucide-react';

interface ReasoningDisclosureProps {
  thinking: string;
  durationMs?: number;
  isStreaming?: boolean;
}

export const ReasoningDisclosure: React.FC<ReasoningDisclosureProps> = ({
  thinking,
  durationMs,
  isStreaming = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking && !isStreaming) return null;

  const durationText = durationMs
    ? `${(durationMs / 1000).toFixed(1)}s`
    : undefined;

  return (
    <div className="mb-2 text-xs select-none">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-1.5 text-[#888888] hover:text-[#cccccc] transition-colors py-1 cursor-pointer group"
      >
        {isStreaming ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
        ) : (
          <Brain className="w-3.5 h-3.5 text-[#38bdf8] group-hover:text-white transition-colors" />
        )}

        <span className="font-medium text-[11px]">
          {isStreaming
            ? 'Thinking & evaluating constraints...'
            : durationText
            ? `Thought for ${durationText}`
            : 'Epistemic Reasoning'}
        </span>

        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-[#777777] group-hover:text-white transition-colors" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#777777] group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Expandable Thinking Drawer */}
      {isOpen && (
        <div className="mt-1 p-2.5 rounded bg-[#151515] border border-[#292929] text-[#999999] text-[11px] leading-relaxed whitespace-pre-wrap font-sans selection:bg-[#264f78]">
          {thinking || 'Formulating epistemic problem decomposition...'}
          {isStreaming && (
            <span className="inline-block w-1.5 h-3 ml-1 bg-[#38bdf8] animate-pulse align-middle" />
          )}
        </div>
      )}
    </div>
  );
};

export default ReasoningDisclosure;
