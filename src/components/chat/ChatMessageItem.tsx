import React, { useState } from 'react';
import { Copy, Check, Trash2, AlertCircle, Bot, User } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { ReasoningDisclosure } from './ReasoningDisclosure';
import { PerformanceMetricsBar } from './PerformanceMetricsBar';
import { MarkdownAndLatexRenderer } from '../../utils/markdownRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
  onDelete?: (id: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    // Copy the main text (and thinking if present)
    const textToCopy = message.thinking
      ? `[Thinking]\n${message.thinking}\n\n[Response]\n${message.content}`
      : message.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group/item flex flex-col space-y-1.5 p-3 rounded-lg text-xs leading-relaxed transition-colors relative ${
        isUser
          ? 'bg-[#252525] border border-[#333333] ml-4'
          : 'bg-[#1e1e1e] border border-[#2b2b2b] mr-2'
      }`}
    >
      {/* 1. Header: Role badge on left, Action buttons (Copy + Delete) on right */}
      <div className="flex items-center justify-between text-[#858585] select-none text-[11px] pb-1">
        <div className="flex items-center space-x-1.5 font-medium">
          {isUser ? (
            <>
              <User className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="text-[#cccccc]">You</span>
            </>
          ) : (
            <>
              <Bot className="w-3.5 h-3.5 text-[#007acc]" />
              <span className="text-[#cccccc]">Dialectic Agent</span>
            </>
          )}
        </div>

        {/* Action Controls: Copy & Delete */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy message"
            className="p-1 text-[#777777] hover:text-white rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              title="Delete message"
              className="p-1 text-[#777777] hover:text-red-400 rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Collapsible Epistemic Reasoning Disclosure (Agent only) */}
      {!isUser && (
        <ReasoningDisclosure
          thinking={message.thinking || ''}
          durationMs={message.metrics?.totalTimeMs}
          isStreaming={message.status === 'streaming' && !message.content}
        />
      )}

      {/* 3. Formatted Content with Markdown and LaTeX */}
      <div className="text-[#cccccc]">
        <MarkdownAndLatexRenderer content={message.content} />
        {message.status === 'streaming' && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#38bdf8] animate-pulse align-middle" />
        )}
      </div>

      {/* 4. Error banner if status is error */}
      {message.status === 'error' && (
        <div className="flex items-center space-x-1.5 text-red-400 text-[11px] pt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{message.error || 'Failed to generate response'}</span>
        </div>
      )}

      {/* 5. Performance Metrics Strip (Agent only) */}
      {!isUser && <PerformanceMetricsBar metrics={message.metrics} />}
    </div>
  );
};

export default ChatMessageItem;
