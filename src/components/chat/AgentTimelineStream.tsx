import React, { useEffect, useRef } from 'react';
import { TimelineTurn, UserTurn, AgentTurn, ChatMessage } from '../../types/chat';
import { UserTurnItem } from './UserTurnItem';
import { AgentTurnItem } from './AgentTurnItem';
import { ChatEmptyState } from './ChatEmptyState';
import { Loader2 } from 'lucide-react';

interface AgentTimelineStreamProps {
  turns: (TimelineTurn | ChatMessage)[];
  isLoading?: boolean;
  onEmptyStateAction?: () => void;
  onSelectChip?: (chip: string) => void;
  onDeleteTurn?: (id: string) => void;
}

export const AgentTimelineStream: React.FC<AgentTimelineStreamProps> = ({
  turns,
  isLoading = false,
  onEmptyStateAction,
  onSelectChip,
  onDeleteTurn,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isLoading]);

  if (turns.length === 0) {
    return <ChatEmptyState onActionClick={onEmptyStateAction} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-[#333333] font-sans selection:bg-[#264f78]">
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
  );
};

export default AgentTimelineStream;
