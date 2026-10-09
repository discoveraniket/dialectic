import React from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  PanelLeft, 
  PanelBottom, 
  PanelRight, 
  Search
} from 'lucide-react';
import { DialecticLogo } from '../brand/DialecticLogo';

interface TitleBarProps {
  folderName?: string;
  isPrimarySidebarOpen: boolean;
  isBottomPanelOpen: boolean;
  isSecondarySidebarOpen: boolean;
  onTogglePrimarySidebar: () => void;
  onToggleBottomPanel: () => void;
  onToggleSecondarySidebar: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  folderName,
  isPrimarySidebarOpen,
  isBottomPanelOpen,
  isSecondarySidebarOpen,
  onTogglePrimarySidebar,
  onToggleBottomPanel,
  onToggleSecondarySidebar,
}) => {
  return (
    <header className="h-[35px] bg-[#3c3c3c] flex items-center justify-between px-3 text-xs text-[#cccccc] select-none z-30 flex-shrink-0 font-sans">
      {/* Left: Standalone App Logo Mark only (no text label) */}
      <div className="flex items-center">
        <DialecticLogo size={18} showText={false} />
      </div>

      {/* Center: Navigation History (<- ->) placed directly adjacent to the Search box */}
      <div className="flex-1 max-w-[560px] mx-4 flex items-center justify-center space-x-2">
        {/* Navigation History: ← and → buttons */}
        <div className="flex items-center space-x-1 text-[#858585]">
          <button
            title="Go Back (Alt+LeftArrow)"
            disabled
            className="p-1 text-[#555555] cursor-not-allowed rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            title="Go Forward (Alt+RightArrow)"
            disabled
            className="p-1 text-[#555555] cursor-not-allowed rounded"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Command Center / Search Bar */}
        <div className="flex-1 max-w-[460px] flex items-center justify-center bg-[#252526] hover:bg-[#2c2c2d] border border-[#3c3c3c] rounded px-3 py-1 cursor-pointer transition-colors group">
          <Search className="w-3.5 h-3.5 text-[#858585] group-hover:text-[#cccccc] mr-2" />
          <span className="text-[11px] text-[#858585] group-hover:text-[#cccccc] truncate">
            {folderName ? `${folderName} (Ctrl+P)` : 'Workspace'}
          </span>
        </div>
      </div>

      {/* Right: Layout Toggles */}
      <div className="flex items-center space-x-1">
        <div className="flex items-center border border-[#333333] rounded overflow-hidden bg-[#1f1f1f]">
          <button
            onClick={onTogglePrimarySidebar}
            title="Toggle Primary Side Bar (Ctrl+B)"
            className={`p-1 transition-colors ${
              isPrimarySidebarOpen ? 'bg-[#094771] text-white' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleBottomPanel}
            title="Toggle Bottom Panel (Ctrl+J)"
            className={`p-1 transition-colors border-l border-[#333333] ${
              isBottomPanelOpen ? 'bg-[#094771] text-white' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'
            }`}
          >
            <PanelBottom className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleSecondarySidebar}
            title="Toggle Secondary Side Bar (Ctrl+Alt+B)"
            className={`p-1 transition-colors border-l border-[#333333] ${
              isSecondarySidebarOpen ? 'bg-[#094771] text-white' : 'text-[#858585] hover:text-white hover:bg-[#2a2d2e]'
            }`}
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TitleBar;
