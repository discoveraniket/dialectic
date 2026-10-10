import React, { useState } from 'react';
import { StagedProposal } from '../../types/chat';
import { FileText, Check, X, CheckCircle2 } from 'lucide-react';

interface StagedProposalCardProps {
  proposal: StagedProposal;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const StagedProposalCard: React.FC<StagedProposalCardProps> = ({
  proposal,
  onAccept,
  onReject,
}) => {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(
    proposal.status || 'pending'
  );

  const handleAccept = () => {
    setStatus('accepted');
    onAccept?.(proposal.id);
  };

  const handleReject = () => {
    setStatus('rejected');
    onReject?.(proposal.id);
  };

  return (
    <div className="my-3 rounded-lg bg-[#181818] border border-[#2e2e2e] p-3 text-xs select-none shadow-sm">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
        <div className="flex items-center space-x-1.5 min-w-0">
          <FileText className="w-3.5 h-3.5 text-[#007acc] flex-shrink-0" />
          <span className="font-semibold text-white tracking-tight truncate">
            STAGED PROPOSAL: {proposal.title}
          </span>
        </div>
        {proposal.target && (
          <span className="text-[10px] text-[#888888] bg-[#222222] px-1.5 py-0.5 rounded border border-[#303030]">
            {proposal.target}
          </span>
        )}
      </div>

      {/* 2. Diff Lines Preview */}
      <div className="py-2.5 space-y-1 font-mono text-[11px]">
        {proposal.diffLines.map((line, idx) => (
          <div
            key={idx}
            className={`px-2 py-0.5 rounded leading-relaxed ${
              line.type === 'add'
                ? 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500'
                : line.type === 'remove'
                ? 'bg-rose-950/30 text-rose-300 border-l-2 border-rose-500'
                : 'text-[#999999]'
            }`}
          >
            {line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : '  '}
            {line.text}
          </div>
        ))}
      </div>

      {/* 3. Action CTAs */}
      <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
        {status === 'pending' ? (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAccept}
              className="px-2.5 py-1 bg-[#16385c] hover:bg-[#1d4775] text-sky-200 rounded text-[11px] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3 text-sky-300" />
              <span>Accept into Dossier</span>
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="px-2.5 py-1 bg-[#242424] hover:bg-[#2e2e2e] text-[#aaaaaa] hover:text-white rounded text-[11px] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3 text-[#888888]" />
              <span>Reject</span>
            </button>
          </div>
        ) : status === 'accepted' ? (
          <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Staged to Project Dossier</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-[#777777] text-[11px]">
            <span>Proposal dismissed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StagedProposalCard;
