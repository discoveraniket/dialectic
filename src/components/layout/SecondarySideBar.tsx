import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ChevronDown, 
  Split,
  Sparkles,
  ArrowUp,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

interface SecondarySideBarProps {
  width: number;
  onResizeStart: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export const SecondarySideBar: React.FC<SecondarySideBarProps> = ({
  width: _width,
  onResizeStart,
  onClose,
}) => {
  const [promptText, setPromptText] = useState('');

  return (
    <div 
      className="w-full h-full bg-[#252526] flex flex-col select-none relative z-10 font-sans"
    >
      {/* Resize Handle on Left Edge */}
      <div
        onMouseDown={onResizeStart}
        className="resizer-x absolute top-0 left-0 w-[4px] h-full cursor-col-resize hover:bg-[#0078d4] transition-colors"
      />

      {/* Header: Chat tab & action icons */}
      <div className="h-[35px] px-3 flex items-center justify-between border-b border-[#2b2b2b] bg-[#252526]">
        {/* Left: Chat tab */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-white px-1 py-0.5 border-b-2 border-[#007acc]">
            Chat
          </span>
        </div>

        {/* Right: Window / Panel controls */}
        <div className="flex items-center space-x-1 text-[#858585]">
          <button title="New Chat" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button title="More Actions" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button title="Split Chat" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors">
            <Split className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onClose}
            title="Close Panel"
            className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: Agent Empty State */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-3">
        {/* Star / Sparkle Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#252526] border border-[#333333] flex items-center justify-center text-[#cccccc] shadow-inner">
          <Sparkles className="w-6 h-6 text-[#38bdf8]" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            Build with Agent
          </h3>
          <p className="text-xs text-[#858585] mt-1">
            AI responses may be inaccurate
          </p>
          <button className="text-xs text-[#3794ff] hover:underline cursor-pointer mt-1.5 leading-relaxed block max-w-[240px] mx-auto">
            Generate Agent Instructions to onboard AI onto your codebase.
          </button>
        </div>
      </div>

      {/* Bottom Prompt Box */}
      <div className="p-3 bg-[#252526] border-t border-[#2b2b2b]">
        <div className="bg-[#1f1f20] border border-[#333333] focus-within:border-[#007acc] rounded-lg p-2.5 space-y-2 transition-colors">
          {/* Tip at top */}
          <div className="text-[11px] text-[#858585] flex items-center space-x-1">
            <Bot className="w-3 h-3 text-[#38bdf8] flex-shrink-0" />
            <span className="truncate">
              Tip: Use <span className="text-[#3794ff]">/create-agent</span> to scaffold a custom agent for your workflow.
            </span>
          </div>

          {/* Text input area */}
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Describe what to build"
            rows={2}
            className="w-full bg-transparent text-xs text-[#cccccc] placeholder-[#6e7681] focus:outline-none resize-none font-sans"
          />

          {/* Bottom actions row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1.5">
              <button 
                title="Add Context"
                className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded text-[#858585] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button 
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#2a2d2e] hover:bg-[#333333] text-[11px] text-[#cccccc] transition-colors"
              >
                <span>Auto</span>
                <SlidersHorizontal className="w-2.5 h-2.5 text-[#858585]" />
              </button>
            </div>

            <button
              disabled={!promptText.trim()}
              className="w-6 h-6 rounded bg-[#333333] hover:bg-[#0078d4] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondarySideBar;
