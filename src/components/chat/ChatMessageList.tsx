import React from 'react';
import { TimelineTurn } from '../../types/chat';
import { AgentTimelineStream } from './AgentTimelineStream';

interface ChatMessageListProps {
  messages: TimelineTurn[];
  isLoading?: boolean;
  onEmptyStateAction?: () => void;
  onDeleteMessage?: (id: string) => void;
  onSelectChip?: (chip: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  onEmptyStateAction,
  onDeleteMessage,
  onSelectChip,
}) => {
  return (
    <AgentTimelineStream
      turns={messages}
      isLoading={isLoading}
      onEmptyStateAction={onEmptyStateAction}
      onDeleteTurn={onDeleteMessage}
      onSelectChip={onSelectChip}
    />
  );
};

export default ChatMessageList;
