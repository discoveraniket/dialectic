import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ChevronDown, 
  MoreHorizontal,
  ArrowUp,
  SlidersHorizontal
} from 'lucide-react';

interface SecondarySideBarProps {
  width: number;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onResizeStart?: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export const SecondarySideBar: React.FC<SecondarySideBarProps> = ({
  width: _width,
  isMaximized = false,
  onToggleMaximize,
  onResizeStart: _onResizeStart,
  onClose,
}) => {
  const [promptText, setPromptText] = useState('');

  return (
    <div 
      className="w-full h-full bg-[#181818] flex flex-col select-none relative z-10 font-sans"
    >
      {/* Header: Chat tab & action icons (Borderless) */}
      <div className="h-[35px] px-3 flex items-center justify-between bg-[#181818]">
        {/* Left: Chat tab (enclosed in a separate rounded box) */}
        <div className="flex items-center">
          <div className="bg-[#2b2b2b] text-white px-2.5 py-1 rounded-md text-xs font-medium flex items-center justify-center cursor-default shadow-sm">
            Chat
          </div>
        </div>

        {/* Right: Window / Panel controls */}
        <div className="flex items-center space-x-1 text-[#858585]">
          <button title="New Chat" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button title="More Actions" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button title="Views and More Actions..." className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <span className="w-[1px] h-3 bg-[#383838] mx-0.5" />
          <button 
            onClick={onToggleMaximize}
            title={isMaximized ? "Restore Panel Size" : "Maximize Panel"}
            className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
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
            className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body: Agent Empty State */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-3">
        {/* Agent Speech Bubble with Sparkles Icon (Free-standing) */}
        <div className="flex items-center justify-center text-[#cccccc] mb-1">
          <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 7h11a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H10l-4 4v-4H6a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z" />
            <path d="M23 4c0 1.8 1.4 3.2 3.2 3.2-1.8 0-3.2 1.4-3.2 3.2 0-1.8-1.4-3.2-3.2-3.2 1.8 0 3.2-1.4 3.2-3.2z" fill="currentColor" stroke="none" />
            <path d="M27 12c0 1.1.9 2 2 2-1.1 0-2 .9-2 2 0-1.1-.9-2-2-2 1.1 0 2-.9 2-2z" fill="currentColor" stroke="none" />
          </svg>
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

      {/* Bottom Prompt Box (Borderless: no dividing line to chat body) */}
      <div className="p-3 bg-[#181818]">
        <div className="bg-[#252525] border border-[#383838] focus-within:border-[#007acc] rounded-lg overflow-hidden transition-colors">
          {/* Tip at top with horizontal divider line */}
          <div className="px-3 py-2 text-[11px] text-[#999999] border-b border-[#333333] leading-relaxed">
            <span className="font-medium text-[#cccccc]">Tip:</span> Use <span className="text-[#38bdf8] hover:underline cursor-pointer">/create-agent</span> to scaffold a custom agent for your workflow.
          </div>

          <div className="p-2.5 space-y-2">
            {/* Text input area */}
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe what to build"
              rows={2}
              className="w-full bg-transparent text-xs text-[#cccccc] placeholder-[#858585] focus:outline-none resize-none font-sans block"
            />

            {/* Bottom actions row: 4 free-standing unboxed buttons */}
            <div className="flex items-center justify-between pt-1 text-[#858585]">
              <div className="flex items-center space-x-2.5">
                {/* 1. Add Context */}
                <button 
                  title="Add Context"
                  className="hover:text-white transition-colors cursor-pointer p-0.5 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* 2. Models (Auto) */}
                <button 
                  title="Select Model"
                  className="text-xs text-[#cccccc] hover:text-white transition-colors cursor-pointer font-normal"
                >
                  Auto
                </button>

                {/* 3. Configuration */}
                <button 
                  title="Configure Parameters"
                  className="hover:text-white transition-colors cursor-pointer p-0.5 flex items-center justify-center"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Send */}
              <button
                disabled={!promptText.trim()}
                title="Send Prompt"
                className={`transition-colors p-0.5 flex items-center justify-center ${
                  promptText.trim()
                    ? 'text-white hover:text-[#0078d4] cursor-pointer'
                    : 'text-[#555555] cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default SecondarySideBar;
