import React from 'react';
import { Plus, History, MoreHorizontal, X } from 'lucide-react';

interface ChatHeaderProps {
  sessionTitle?: string;
  isHistoryOpen?: boolean;
  onToggleHistory?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClose: () => void;
  onNewChat?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  sessionTitle = 'New Session',
  isHistoryOpen = false,
  onToggleHistory,
  isMaximized = false,
  onToggleMaximize,
  onClose,
  onNewChat,
}) => {
  return (
    <div className="h-[35px] px-3 flex items-center justify-between bg-[#181818] select-none border-b border-transparent">
      {/* Left: Dynamic Session / Thread Title */}
      <div className="flex items-center min-w-0 pr-2">
        <h2
          title={sessionTitle}
          className="text-xs font-normal text-[#cccccc] hover:text-white truncate max-w-[210px] cursor-default transition-colors tracking-tight"
        >
          {sessionTitle}
        </h2>
      </div>

      {/* Right: Modern Agent Panel Utility Controls (+, History, ..., Maximize, ✕) */}
      <div className="flex items-center space-x-1 text-[#858585] flex-shrink-0">
        <button
          type="button"
          onClick={onNewChat}
          title="New Chat / Thread"
          className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggleHistory}
          title="Chat History & Sessions"
          className={`p-1 rounded transition-colors cursor-pointer ${
            isHistoryOpen
              ? 'text-white bg-[#2a2d2e]'
              : 'hover:text-white hover:bg-[#2a2d2e]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          title="More Actions"
          className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>

        {onToggleMaximize && (
          <button
            type="button"
            onClick={onToggleMaximize}
            title={isMaximized ? 'Restore Panel Size' : 'Maximize Panel'}
            className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
          >
            {isMaximized ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 2v3H2M11 2v3h3M5 14v-3H2M11 14v-3h3" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" />
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          title="Close Panel"
          className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
