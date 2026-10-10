import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAgent } from '../../hooks/useAgent';
import { ChatMessage, TimelineTurn } from '../../types/chat';
import { CrystallizedDocument } from '../../types/agent';
import { ChatHeader } from './ChatHeader';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';
import { AgentTimelineStream } from './AgentTimelineStream';
import { ChatPromptInput } from './ChatPromptInput';

import { ActiveInquiryForm } from './ActiveInquiryForm';

interface ChatContainerProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClose: () => void;
  messages?: (ChatMessage | TimelineTurn)[];
  isLoading?: boolean;
  onSendMessage?: (content: string) => void;
  onNewChat?: () => void;
  selectedModelName?: string;
  onSelectModel?: () => void;
  onDocumentCrystallized?: (doc: CrystallizedDocument) => void;
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
  onDocumentCrystallized,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const chatHook = useChat();
  const agentHook = useAgent({
    onDocumentCrystallized: (doc) => {
      onDocumentCrystallized?.(doc);
    },
  });

  const messages = externalMessages ?? chatHook.messages;
  const isLoading = externalIsLoading ?? (chatHook.isLoading || agentHook.isAgentExecuting);

  const handleSubmit = () => {
    const text = inputPrompt.trim();
    if (!text || isLoading) return;

    if (onSendMessage) {
      onSendMessage(text);
    } else {
      // Execute via the Idea Crystallizer Agentic ReAct loop
      chatHook.sendAgentMessage(text, agentHook.executeAgentTurn);
    }
    setInputPrompt('');
  };

  const handleInquiryAnswersSubmit = (answers: Record<string, string>) => {
    const lines: string[] = ['**Answers to calibration questions:**'];
    agentHook.activeQuestions.forEach((q) => {
      const ans = answers[q.id]?.trim();
      if (ans) {
        lines.push(`- *${q.question}*: ${ans}`);
      }
    });

    const formattedMessage = lines.join('\n');
    agentHook.dismissQuestions();

    if (onSendMessage) {
      onSendMessage(formattedMessage);
    } else {
      chatHook.sendAgentMessage(formattedMessage, agentHook.executeAgentTurn);
    }
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

  const handleSelectChip = (chip: string) => {
    setInputPrompt(chip);
  };

  const handleExportMarkdown = () => {
    const lines: string[] = [`# ${chatHook.sessionTitle}\n`];
    messages.forEach((m) => {
      if (m.role === 'user' || m.kind === 'user') {
        lines.push(`### Researcher (${new Date(m.timestamp).toLocaleTimeString()})\n${m.prompt || m.content}\n`);
      } else {
        lines.push(`### Dialectic Agent\n${m.content}\n`);
      }
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chatHook.sessionTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-[#181818] flex flex-col relative z-10 font-sans overflow-hidden">
      {/* 1. Header with dynamic session title, rename, more actions & panel controls */}
      <ChatHeader
        sessionTitle={chatHook.sessionTitle}
        isHistoryOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onCloseHistory={() => setIsHistoryOpen(false)}
        historyDrawer={
          <ChatHistoryDrawer
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            sessions={chatHook.sessions}
            activeSessionId={chatHook.activeSessionId}
            onSelectSession={chatHook.switchSession}
            onDeleteSession={chatHook.deleteSession}
            onRenameSession={chatHook.renameSession}
          />
        }
        isMaximized={isMaximized}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
        onNewChat={handleReset}
        onRenameTitle={(newTitle) => chatHook.renameSession(chatHook.activeSessionId, newTitle)}
        onClearThread={chatHook.clearCurrentSession}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* 3. Modern Unboxed Action Timeline Stream */}
      <AgentTimelineStream
        turns={messages}
        isLoading={isLoading}
        onSelectChip={handleSelectChip}
        onDeleteTurn={chatHook.deleteMessage}
        onAcceptProposal={agentHook.handleAcceptProposal}
        onRejectProposal={agentHook.handleRejectProposal}
        onEmptyStateAction={() => setInputPrompt('I have an idea for an AI research agent. Challenge my assumptions and help me structure it.')}
      />

      {/* 3.5. Active Socratic Diagnostic Questionnaire Form */}
      {agentHook.activeQuestions.length > 0 && (
        <ActiveInquiryForm
          questions={agentHook.activeQuestions}
          onSubmit={handleInquiryAnswersSubmit}
          onDismiss={agentHook.dismissQuestions}
          isLoading={isLoading}
        />
      )}

      {/* 4. Bottom Floating Prompt Box with 4 unboxed controls */}
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
