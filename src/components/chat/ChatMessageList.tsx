import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types/chat';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatEmptyState } from './ChatEmptyState';
import { Loader2 } from 'lucide-react';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onEmptyStateAction?: () => void;
  onDeleteMessage?: (id: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading = false,
  onEmptyStateAction,
  onDeleteMessage,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return <ChatEmptyState onActionClick={onEmptyStateAction} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-[#333333]">
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          onDelete={onDeleteMessage}
        />
      ))}

      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex items-center space-x-2 text-[#858585] text-xs p-2.5 bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
          <span>Dialectic Agent is thinking...</span>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};

export default ChatMessageList;
