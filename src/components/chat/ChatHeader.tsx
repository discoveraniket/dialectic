import React from 'react';
import { Plus, ChevronDown, MoreHorizontal, X } from 'lucide-react';

interface ChatHeaderProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClose: () => void;
  onNewChat?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isMaximized = false,
  onToggleMaximize,
  onClose,
  onNewChat,
}) => {
  return (
    <div className="h-[35px] px-3 flex items-center justify-between bg-[#181818] select-none">
      {/* Left: Chat tab (enclosed in a separate rounded box) */}
      <div className="flex items-center">
        <div className="bg-[#2b2b2b] text-white px-2.5 py-1 rounded-md text-xs font-medium flex items-center justify-center cursor-default shadow-sm">
          Chat
        </div>
      </div>

      {/* Right: Window / Panel controls */}
      <div className="flex items-center space-x-1 text-[#858585]">
        <button 
          onClick={onNewChat}
          title="New Chat" 
          className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button 
          title="More Actions" 
          className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button 
          title="Views and More Actions..." 
          className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        <span className="w-[1px] h-3 bg-[#383838] mx-0.5" />
        <button 
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
        <button 
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
