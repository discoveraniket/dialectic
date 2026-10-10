import React, { useEffect, useRef, useState } from 'react';
import { ChatSession } from '../../types/chat';
import { Check, MessageSquare, Trash2, X, Pencil } from 'lucide-react';

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession?: (id: string) => void;
  onRenameSession?: (id: string, newTitle: string) => void;
}

export const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (editingId) {
          setEditingId(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, editingId]);

  if (!isOpen) return null;

  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string) => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onRenameSession?.(id, trimmed);
    }
    setEditingId(null);
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-full right-0 mt-1 w-64 bg-[#202020] border border-[#333333] rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[340px] z-50 text-xs text-[#cccccc] animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-3 py-2 flex items-center justify-between border-b border-[#2b2b2b] bg-[#1a1a1a]">
        <span className="text-[11px] font-semibold text-[#cccccc] tracking-tight uppercase">
          Chat History
        </span>
        <button
          onClick={onClose}
          className="text-[#888888] hover:text-white transition-colors cursor-pointer p-0.5"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const isEditing = editingId === session.id;

          return (
            <div
              key={session.id}
              onClick={() => {
                if (!isEditing) {
                  onSelectSession(session.id);
                  onClose();
                }
              }}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs group ${
                isActive
                  ? 'bg-[#2b2b2b] text-white'
                  : 'text-[#cccccc] hover:bg-[#262626] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0 pr-2 flex-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#007acc] flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(session.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#181818] border border-[#007acc] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full"
                  />
                ) : (
                  <span className="truncate font-medium text-[11px]">{session.title}</span>
                )}
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                {!isEditing && onRenameSession && (
                  <button
                    onClick={(e) => handleStartRename(e, session)}
                    title="Rename thread"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-[#888888] transition-opacity cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
                {isActive && <Check className="w-3.5 h-3.5 text-sky-400" />}
                {onDeleteSession && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title="Delete thread"
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
