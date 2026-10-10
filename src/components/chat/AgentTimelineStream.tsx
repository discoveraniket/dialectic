import React, { useEffect, useRef, useState } from 'react';
import { TimelineTurn, UserTurn, AgentTurn, ChatMessage } from '../../types/chat';
import { UserTurnItem } from './UserTurnItem';
import { AgentTurnItem } from './AgentTurnItem';
import { ChatEmptyState } from './ChatEmptyState';
import { Loader2, ArrowDown } from 'lucide-react';

interface AgentTimelineStreamProps {
  turns: (TimelineTurn | ChatMessage)[];
  isLoading?: boolean;
  onEmptyStateAction?: () => void;
  onSelectChip?: (chip: string) => void;
  onDeleteTurn?: (id: string) => void;
  onAcceptProposal?: (id: string) => void;
  onRejectProposal?: (id: string) => void;
}

export const AgentTimelineStream: React.FC<AgentTimelineStreamProps> = ({
  turns,
  isLoading = false,
  onEmptyStateAction,
  onSelectChip,
  onDeleteTurn,
  onAcceptProposal,
  onRejectProposal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  useEffect(() => {
    if (!showScrollBottom) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [turns, isLoading, showScrollBottom]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 160);
  };

  if (turns.length === 0) {
    return <ChatEmptyState onActionClick={onEmptyStateAction} />;
  }

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-[#333333] font-sans selection:bg-[#264f78]"
      >
        {turns.map((turn) => {
          const isUser =
            turn.kind === 'user' ||
            (turn as { role?: string }).role === 'user';

          if (isUser) {
            return (
              <UserTurnItem
                key={turn.id}
                turn={turn as UserTurn}
                onDelete={onDeleteTurn}
              />
            );
          }

          return (
            <AgentTurnItem
              key={turn.id}
              turn={turn as AgentTurn}
              onSelectChip={onSelectChip}
              onDelete={onDeleteTurn}
              onAcceptProposal={onAcceptProposal}
              onRejectProposal={onRejectProposal}
            />
          );
        })}

        {/* Streaming / Loading indicator when agent is processing */}
        {isLoading && (turns[turns.length - 1]?.role === 'user' || turns[turns.length - 1]?.kind === 'user') && (
          <div className="flex items-center space-x-2 text-[#858585] text-xs py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
            <span>Generating agentic action plan...</span>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          title="Scroll to bottom"
          className="absolute bottom-2 right-4 p-1.5 bg-[#252525] hover:bg-[#333333] border border-[#3c3c3c] rounded-full text-[#cccccc] hover:text-white shadow-lg transition-all animate-in fade-in zoom-in-90 cursor-pointer z-30"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default AgentTimelineStream;
