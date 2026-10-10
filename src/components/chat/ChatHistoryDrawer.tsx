import React, { useEffect, useRef } from 'react';
import { ChatSession } from '../../types/chat';
import { Check, MessageSquare, Trash2, X } from 'lucide-react';

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession?: (id: string) => void;
}

export const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-[35px] left-2 right-2 z-50 bg-[#202020] border border-[#333333] rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[320px] animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-3 py-2 flex items-center justify-between border-b border-[#2b2b2b] bg-[#1a1a1a]">
        <span className="text-[11px] font-semibold text-[#cccccc] tracking-tight uppercase">
          Chat History & Sessions
        </span>
        <button
          onClick={onClose}
          className="text-[#888888] hover:text-white transition-colors cursor-pointer p-0.5"
          title="Close drawer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <div
              key={session.id}
              onClick={() => {
                onSelectSession(session.id);
                onClose();
              }}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs group ${
                isActive
                  ? 'bg-[#2b2b2b] text-white'
                  : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#007acc] flex-shrink-0" />
                <span className="truncate font-medium text-[11px]">{session.title}</span>
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                {isActive && <Check className="w-3.5 h-3.5 text-sky-400" />}
                {onDeleteSession && sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title="Delete session"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-[#888888] transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatHistoryDrawer;
