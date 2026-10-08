import React from 'react';
import { 
  PanelLeft, 
  PanelBottom, 
  PanelRight, 
  Search, 
  Minus, 
  Square, 
  X
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
    <header className="h-[35px] bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between px-3 text-xs text-[#cccccc] select-none z-30 flex-shrink-0">
      {/* Left: App Logo & Menus */}
      <div className="flex items-center space-x-3">
        <DialecticLogo size={18} showText={true} />

        {/* Menu items */}
        <nav className="hidden md:flex items-center space-x-2 text-[#cccccc] text-[11px] ml-2">
          {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((item) => (
            <button
              key={item}
              className="px-2 py-0.5 rounded hover:bg-[#2a2d2e] transition-colors text-[#cccccc]"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Command Center / Search Bar */}
      <div className="flex-1 max-w-[480px] mx-4">
        <div className="flex items-center justify-center bg-[#252526] hover:bg-[#2c2c2d] border border-[#3c3c3c] rounded px-3 py-1 cursor-pointer transition-colors group">
          <Search className="w-3.5 h-3.5 text-[#858585] group-hover:text-[#cccccc] mr-2" />
          <span className="text-[11px] text-[#858585] group-hover:text-[#cccccc] truncate">
            {folderName ? `${folderName} (Ctrl+P)` : 'Visual Studio Code (Ctrl+P)'}
          </span>
        </div>
      </div>

      {/* Right: Layout Toggles & Window Controls */}
      <div className="flex items-center space-x-2">
        {/* Layout action toggles */}
        <div className="flex items-center border border-[#333333] rounded overflow-hidden mr-2 bg-[#1f1f1f]">
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

        {/* Window controls */}
        <div className="flex items-center space-x-1 text-[#858585]">
          <button className="p-1 hover:bg-[#2a2d2e] hover:text-white rounded">
            <Minus className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-[#2a2d2e] hover:text-white rounded">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="p-1 hover:bg-[#e81123] hover:text-white rounded">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
