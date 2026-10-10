import React, { useState } from 'react';
import { UserTurn } from '../../types/chat';
import { Copy, Check, Trash2, FileText, Tag, BookOpen } from 'lucide-react';

interface UserTurnItemProps {
  turn: UserTurn;
  onDelete?: (id: string) => void;
}

export const UserTurnItem: React.FC<UserTurnItemProps> = ({ turn, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(turn.prompt || turn.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContextIcon = (icon?: string) => {
    switch (icon) {
      case 'paper':
        return <BookOpen className="w-3 h-3 text-[#38bdf8]" />;
      case 'claim':
        return <Tag className="w-3 h-3 text-[#a78bfa]" />;
      default:
        return <FileText className="w-3 h-3 text-[#34d399]" />;
    }
  };

  const textContent = turn.prompt || turn.content || '';

  return (
    <div className="group/turn flex flex-col py-2.5 transition-colors relative font-sans text-xs leading-relaxed border-b border-[#242424]/60 pb-3">
      {/* 1. Header: User Tag on Left, Actions on Right */}
      <div className="flex items-center justify-between text-[#858585] select-none text-[11px] pb-1">
        <div className="flex items-center space-x-1.5 font-medium">
          <span className="text-[#cccccc] font-semibold">You</span>
        </div>

        {/* Hover Action Controls: Copy & Delete */}
        <div className="opacity-0 group-hover/turn:opacity-100 flex items-center space-x-1 transition-opacity">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy prompt"
            className="p-1 text-[#777777] hover:text-white rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(turn.id)}
              title="Delete prompt"
              className="p-1 text-[#777777] hover:text-red-400 rounded hover:bg-[#2b2b2b] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Prompt Text */}
      <div className="text-[#e2e2e2] text-xs font-normal leading-relaxed whitespace-pre-wrap selection:bg-[#264f78]">
        {textContent}
      </div>

      {/* 3. Context Mention Pills (@claims, @papers, @files) */}
      {turn.contextPills && turn.contextPills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 select-none">
          {turn.contextPills.map((pill) => (
            <div
              key={pill.id}
              className="inline-flex items-center space-x-1 bg-[#202020] border border-[#303030] rounded px-1.5 py-0.5 text-[11px] font-mono text-[#38bdf8] shadow-sm"
            >
              {renderContextIcon(pill.icon)}
              <span>{pill.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTurnItem;
