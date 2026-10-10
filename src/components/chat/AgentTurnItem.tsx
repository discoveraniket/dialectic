import React, { useState } from 'react';
import { AgentTurn } from '../../types/chat';
import { ToolExecutionBadge } from './ToolExecutionBadge';
import { ReasoningDisclosure } from './ReasoningDisclosure';
import { MarkdownAndLatexRenderer } from '../../utils/markdownRenderer';
import { StagedProposalCard } from './StagedProposalCard';
import { SocraticInquiryGroup } from './SocraticInquiryGroup';
import { PerformanceMetricsBar } from './PerformanceMetricsBar';
import { Copy, Check, Trash2, AlertCircle } from 'lucide-react';

interface AgentTurnItemProps {
  turn: AgentTurn;
  onSelectChip?: (chip: string) => void;
  onDelete?: (id: string) => void;
}

export const AgentTurnItem: React.FC<AgentTurnItemProps> = ({
  turn,
  onSelectChip,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(turn.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group/turn flex flex-col py-2.5 transition-colors relative text-xs leading-relaxed font-sans">
      {/* 1. Tool Execution Badge (e.g., terminal:esbuild + Worked for 4m >) */}
      {turn.toolSteps && turn.toolSteps.length > 0 && (
        <div className="space-y-1">
          {turn.toolSteps.map((tool) => (
            <ToolExecutionBadge key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {/* 2. Collapsible Epistemic Reasoning Disclosure */}
      {(turn.reasoning?.thinking || turn.thinking) && (
        <ReasoningDisclosure
          thinking={turn.reasoning?.thinking || turn.thinking || ''}
          durationText={turn.reasoning?.durationText}
          durationMs={turn.metrics?.totalTimeMs}
          isStreaming={turn.status === 'streaming' && !turn.content}
        />
      )}

      {/* 3. Structured Content Canvas (Markdown, LaTeX, Code Blocks) */}
      <div className="text-[#cccccc]">
        <MarkdownAndLatexRenderer content={turn.content} />
        {turn.status === 'streaming' && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#38bdf8] animate-pulse align-middle" />
        )}
      </div>

      {/* 4. Staged Action Proposals ("AI Proposes, Human Disposes") */}
      {turn.proposals && turn.proposals.length > 0 && (
        <div className="space-y-2">
          {turn.proposals.map((proposal) => (
            <StagedProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}

      {/* 5. Clickable Socratic Inquisitor Follow-Up Chips */}
      {turn.followUpChips && turn.followUpChips.length > 0 && (
        <SocraticInquiryGroup chips={turn.followUpChips} onSelectChip={onSelectChip} />
      )}

      {/* 6. Error Banner if generation failed */}
      {turn.status === 'error' && (
        <div className="flex items-center space-x-1.5 text-red-400 text-[11px] pt-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{turn.error || 'Agentic turn generation encountered an error.'}</span>
        </div>
      )}

      {/* 7. Turn Utility Row: Telemetry Bar & Action Icons */}
      <div className="flex items-center justify-between pt-1 select-none">
        <PerformanceMetricsBar metrics={turn.metrics} />

        <div className="opacity-0 group-hover/turn:opacity-100 flex items-center space-x-1 transition-opacity ml-auto">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy response"
            className="p-1 text-[#777777] hover:text-white rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(turn.id)}
              title="Delete turn"
              className="p-1 text-[#777777] hover:text-red-400 rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentTurnItem;
