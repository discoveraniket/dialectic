import React from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface BottomPanelProps {
  height: number;
  onResizeStart: (e: React.MouseEvent) => void;
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  height,
  onResizeStart,
  onClose,
  isMaximized,
  onToggleMaximize,
}) => {
  return (
    <div 
      style={{ height: isMaximized ? 'calc(100% - 35px)' : `${height}px` }} 
      className="bg-[#181818] border-t border-[#2b2b2b] flex flex-col select-none relative flex-shrink-0 z-20"
    >
      {/* Horizontal Split Sash on Top Edge (1px border line + 4px hitbox) */}
      {!isMaximized && (
        <div
          onMouseDown={onResizeStart}
          className="monaco-sash-horizontal"
        />
      )}

      {/* Panel Header Bar (Clean - No Tabs, only Maximize and Close buttons) */}
      <div className="h-[35px] px-3 flex items-center justify-between border-b border-[#2b2b2b] text-[11px] font-semibold text-[#858585] bg-[#181818]">
        <div className="text-[11px] font-semibold tracking-wider text-[#858585] uppercase">
          PANEL
        </div>

        {/* Panel Controls */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={onToggleMaximize}
            title={isMaximized ? "Restore Panel Size" : "Maximize Panel"}
            className="text-[#858585] hover:text-white p-1 rounded hover:bg-[#2a2d2e] transition-colors"
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={onClose}
            title="Close Panel (Ctrl+J)"
            className="text-[#858585] hover:text-white p-1 rounded hover:bg-[#2a2d2e] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clean Empty Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center text-xs text-[#555555]">
        <span>Panel content placeholder</span>
      </div>
    </div>
  );
};
