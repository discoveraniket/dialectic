import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Brain, Loader2 } from 'lucide-react';

interface ReasoningDisclosureProps {
  thinking: string;
  durationMs?: number;
  durationText?: string;
  isStreaming?: boolean;
}

export const ReasoningDisclosure: React.FC<ReasoningDisclosureProps> = ({
  thinking,
  durationMs,
  durationText,
  isStreaming = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking && !isStreaming) return null;

  const displayDuration = durationText
    ? durationText
    : durationMs
    ? `${(durationMs / 1000).toFixed(1)}s`
    : undefined;

  return (
    <div className="mb-2 text-xs select-none">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-1.5 text-[11px] text-[#777777] hover:text-[#cccccc] transition-colors py-0.5 cursor-pointer group"
      >
        {isStreaming ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
        ) : (
          <Brain className="w-3.5 h-3.5 text-[#38bdf8] group-hover:text-white transition-colors" />
        )}

        <span className="font-normal text-[11px]">
          {isStreaming
            ? 'Thinking & evaluating constraints...'
            : displayDuration
            ? `Thought for ${displayDuration}`
            : 'Epistemic Scrutiny'}
        </span>

        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-[#777777] group-hover:text-white transition-colors" />
        ) : (
          <ChevronRight className="w-3 h-3 text-[#777777] group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Expandable Thinking Drawer */}
      {isOpen && (
        <div className="mt-1.5 p-2.5 rounded-md bg-[#161616] border border-[#282828] text-[#999999] text-[11px] leading-relaxed whitespace-pre-wrap font-sans selection:bg-[#264f78]">
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
