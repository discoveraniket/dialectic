import React, { useState } from 'react';
import { Copy, Check, AlertCircle, Bot, User } from 'lucide-react';
import { ChatMessage } from '../../types/chat';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col space-y-1.5 p-3 rounded-lg text-xs leading-relaxed transition-colors ${
      isUser 
        ? 'bg-[#252525] border border-[#333333] ml-4' 
        : 'bg-[#1e1e1e] border border-[#2b2b2b] mr-2'
    }`}>
      {/* Header: Role indicator + Copy action */}
      <div className="flex items-center justify-between text-[#858585] select-none text-[11px]">
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

        <button
          onClick={handleCopy}
          title="Copy message"
          className="p-1 hover:text-white rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Message Content */}
      <div className="text-[#cccccc] whitespace-pre-wrap break-words font-sans selection:bg-[#264f78]">
        {message.content}
        {message.status === 'streaming' && (
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#38bdf8] animate-pulse align-middle" />
        )}
      </div>

      {/* Error notification if applicable */}
      {message.status === 'error' && (
        <div className="flex items-center space-x-1.5 text-red-400 text-[11px] pt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{message.error || 'Failed to generate response'}</span>
        </div>
      )}
    </div>
  );
};
