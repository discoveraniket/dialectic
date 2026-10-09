import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
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
  isLoading: externalIsLoading,
  onSendMessage,
  onNewChat,
  selectedModelName,
  onSelectModel,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const chatHook = useChat();

  const messages = externalMessages ?? chatHook.messages;
  const isLoading = externalIsLoading ?? chatHook.isLoading;

  const handleSubmit = () => {
    const text = inputPrompt.trim();
    if (!text || isLoading) return;

    if (onSendMessage) {
      onSendMessage(text);
    } else {
      chatHook.sendMessage(text);
    }
    setInputPrompt('');
  };

  const handleReset = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      chatHook.newChat();
    }
  };

  const currentModelId = chatHook.selectedModel;
  const modelLabel =
    selectedModelName ??
    (currentModelId === 'auto'
      ? 'Auto'
      : currentModelId);

  const handleSelectModel = (modelId: string) => {
    if (onSelectModel) {
      onSelectModel();
    }
    chatHook.setSelectedModel(modelId);
  };

  return (
    <div className="w-full h-full bg-[#181818] flex flex-col relative z-10 font-sans overflow-hidden">
      {/* 1. Header with tab pill & panel window controls */}
      <ChatHeader
        isMaximized={isMaximized}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
        onNewChat={handleReset}
      />

      {/* 2. Message History Feed or Empty State */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onEmptyStateAction={() => setInputPrompt('I want to define my research boundaries and constraints. Challenge my assumptions.')}
      />

      {/* 3. Bottom Prompt Box with 4 unboxed controls */}
      <ChatPromptInput
        value={inputPrompt}
        onChange={setInputPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        selectedModelId={currentModelId}
        selectedModelName={modelLabel}
        onSelectModel={handleSelectModel}
      />
    </div>
  );
};

export default ChatContainer;
