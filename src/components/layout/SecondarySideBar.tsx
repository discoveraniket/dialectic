import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare
} from 'lucide-react';

interface SecondarySideBarProps {
  width: number;
  onResizeStart: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export const SecondarySideBar: React.FC<SecondarySideBarProps> = ({
  width,
  onResizeStart,
  onClose,
}) => {
  const [inputVal, setInputVal] = useState('');

  return (
    <div 
      style={{ width: `${width}px` }} 
      className="h-full bg-[#1e1e1e] border-l border-[#2b2b2b] flex flex-col select-none relative flex-shrink-0 z-10"
    >
      {/* Resize Handle on Left Edge */}
      <div
        onMouseDown={onResizeStart}
        className="resizer-x absolute top-0 left-0 w-[4px] h-full cursor-col-resize hover:bg-[#0078d4] transition-colors"
      />

      {/* Header */}
      <div className="h-[35px] px-3 flex items-center justify-between border-b border-[#2b2b2b] text-[11px] font-semibold text-[#cccccc] bg-[#181818]">
        <div className="flex items-center space-x-1.5 text-white">
          <MessageSquare className="w-3.5 h-3.5 text-[#007acc]" />
          <span>SECONDARY SIDE BAR</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={onClose}
            title="Close Secondary Side Bar"
            className="text-[#858585] hover:text-white p-1 rounded hover:bg-[#2a2d2e]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Raw Body / Empty State */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center text-[#555555]">
        <MessageSquare className="w-10 h-10 mb-2 opacity-30 text-[#858585]" />
        <span className="text-xs text-[#858585]">Auxiliary Side Bar Content</span>
        <span className="text-[11px] text-[#555555] mt-1">Ready for conversation or tool views</span>
      </div>

      {/* Raw Input Box */}
      <div className="p-3 border-t border-[#2b2b2b] bg-[#181818]">
        <div className="relative">
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a message or command..."
            rows={2}
            className="w-full bg-[#252526] border border-[#3c3c3c] focus:border-[#007acc] rounded p-2 text-xs text-[#cccccc] placeholder-[#6e7681] focus:outline-none resize-none font-sans"
          />
          <div className="flex items-center justify-between mt-1 text-[10px] text-[#858585]">
            <span>Shift+Enter for newline</span>
            <button 
              onClick={() => setInputVal('')}
              className="flex items-center px-2.5 py-1 bg-[#007acc] hover:bg-[#0062a3] text-white rounded transition-colors"
            >
              <Send className="w-3 h-3 mr-1" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
