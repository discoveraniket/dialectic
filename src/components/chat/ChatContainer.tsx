import React, { useState } from 'react';
import { ChatMessage } from '../../types/chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatPromptInput } from './ChatPromptInput';

interface ChatContainerProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClose: () => void;
  messages?: ChatMessage[];
  isLoading?: boolean;
  onSendMessage?: (content: string) => void;
  onNewChat?: () => void;
  selectedModelName?: string;
  onSelectModel?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  isMaximized = false,
  onToggleMaximize,
  onClose,
  messages: externalMessages,
  isLoading = false,
  onSendMessage,
  onNewChat,
  selectedModelName = 'Auto',
  onSelectModel,
}) => {
  const [internalPrompt, setInternalPrompt] = useState('');
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([]);

  const messages = externalMessages ?? internalMessages;

  const handleSubmit = () => {
    const text = internalPrompt.trim();
    if (!text) return;

    if (onSendMessage) {
      onSendMessage(text);
    } else {
      // Local placeholder fallback for zero-regression during refactoring phase
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: Date.now(),
        status: 'complete',
      };
      setInternalMessages((prev) => [...prev, userMsg]);
    }
    setInternalPrompt('');
  };

  const handleResetChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      setInternalMessages([]);
    }
  };

  return (
    <div className="w-full h-full bg-[#181818] flex flex-col relative z-10 font-sans overflow-hidden">
      {/* 1. Header with tab pill & panel window controls */}
      <ChatHeader
        isMaximized={isMaximized}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
        onNewChat={handleResetChat}
      />

      {/* 2. Message History Feed or Empty State */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        
      />

      {/* 3. Bottom Prompt Box with 4 unboxed controls */}
      <ChatPromptInput
        value={internalPrompt}
        onChange={setInternalPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        selectedModelName={selectedModelName}
        onSelectModel={onSelectModel}
      />
    </div>
  );
};

export default ChatContainer;
