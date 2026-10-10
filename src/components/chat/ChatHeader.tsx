import React, { useState, useRef, useEffect } from 'react';
import { Plus, History, MoreHorizontal, X, Pencil, Check } from 'lucide-react';

interface ChatHeaderProps {
  sessionTitle?: string;
  isHistoryOpen?: boolean;
  onToggleHistory?: () => void;
  onCloseHistory?: () => void;
  historyDrawer?: React.ReactNode;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onClose: () => void;
  onNewChat?: () => void;
  onRenameTitle?: (newTitle: string) => void;
  onClearThread?: () => void;
  onExportMarkdown?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  sessionTitle = 'New Session',
  isHistoryOpen = false,
  onToggleHistory,
  onCloseHistory,
  historyDrawer,
  isMaximized = false,
  onToggleMaximize,
  onClose,
  onNewChat,
  onRenameTitle,
  onClearThread,
  onExportMarkdown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(sessionTitle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditTitle(sessionTitle);
  }, [sessionTitle]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  // Click outside to close history dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        onCloseHistory?.();
      }
    };
    if (isHistoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHistoryOpen, onCloseHistory]);

  // Click outside to close more actions menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleCommitRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== sessionTitle) {
      onRenameTitle?.(trimmed);
    } else {
      setEditTitle(sessionTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommitRename();
    } else if (e.key === 'Escape') {
      setEditTitle(sessionTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="h-[35px] px-3 flex items-center justify-between bg-[#181818] select-none border-b border-transparent relative">
      {/* Left: Dynamic Session / Thread Title (with inline rename support) */}
      <div className="flex items-center min-w-0 pr-2 group/title">
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleCommitRename}
              onKeyDown={handleKeyDown}
              className="bg-[#252525] border border-[#007acc] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-[170px]"
            />
            <button
              onClick={handleCommitRename}
              className="p-1 hover:text-white text-[#34d399] rounded hover:bg-[#2a2d2e] cursor-pointer"
              title="Save Title"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 min-w-0">
            <h2
              onDoubleClick={() => setIsEditing(true)}
              title={`${sessionTitle} (Double-click to rename)`}
              className="text-xs font-normal text-[#cccccc] hover:text-white truncate max-w-[190px] cursor-pointer transition-colors tracking-tight"
            >
              {sessionTitle}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Rename Thread"
              className="opacity-0 group-hover/title:opacity-100 p-0.5 text-[#777777] hover:text-white rounded hover:bg-[#2a2d2e] transition-opacity cursor-pointer flex-shrink-0"
            >
              <Pencil className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
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

        {/* History Menu Button & Compact Popover */}
        <div className="relative" ref={historyRef}>
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

          {isHistoryOpen && historyDrawer}
        </div>

        {/* More Actions Menu Button & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="More Actions"
            className={`p-1 rounded transition-colors cursor-pointer ${
              isMenuOpen ? 'text-white bg-[#2a2d2e]' : 'hover:text-white hover:bg-[#2a2d2e]'
            }`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-[#202020] border border-[#333333] rounded-md shadow-2xl py-1 z-50 text-xs text-[#cccccc]">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#2b2b2b] hover:text-white flex items-center space-x-2 cursor-pointer"
              >
                <Pencil className="w-3 h-3 text-[#888888]" />
                <span>Rename Thread</span>
              </button>
              {onExportMarkdown && (
                <button
                  type="button"
                  onClick={() => {
                    onExportMarkdown();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2b2b2b] hover:text-white flex items-center space-x-2 cursor-pointer"
                >
                  <span>Export as Markdown</span>
                </button>
              )}
              {onClearThread && (
                <button
                  type="button"
                  onClick={() => {
                    onClearThread();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2b2b2b] text-rose-400 hover:text-rose-300 flex items-center space-x-2 cursor-pointer border-t border-[#2a2a2a] mt-1 pt-1"
                >
                  <span>Clear Messages</span>
                </button>
              )}
            </div>
          )}
        </div>

        {onToggleMaximize && (
          <button
            type="button"
            onClick={onToggleMaximize}
            title={isMaximized ? 'Restore Panel Size' : 'Maximize Panel (Collapse Editor)'}
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
