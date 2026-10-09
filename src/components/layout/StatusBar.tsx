import React from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  AlertTriangle, 
  XCircle, 
  Bell,
  Layout
} from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-[22px] bg-[#181818] border-t border-[#2b2b2b] text-[#cccccc] flex items-center justify-between px-2 text-[11px] select-none flex-shrink-0 z-30 font-sans">
      {/* Left side items */}
      <div className="flex items-center space-x-1.5 h-full">
        {/* Remote Indicator (vscode.dev >< Web badge) */}
        <button 
          title="Open Remote Window (Dialectic Web)"
          className="h-full px-2 hover:bg-[#2a2d2e] flex items-center space-x-1.5 transition-colors cursor-pointer text-[#cccccc] hover:text-white font-medium -ml-2"
        >
          {/* Iconic VS Code Remote >< bracket icon */}
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#38bdf8]" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.7 3.3L1.4 6.6a2 2 0 0 0 0 2.8l3.3 3.3.7-.7-3.3-3.3a1 1 0 0 1 0-1.4l3.3-3.3-.7-.7zm6.6 0l-.7.7 3.3 3.3a1 1 0 0 1 0 1.4l-3.3 3.3.7.7 3.3-3.3a2 2 0 0 0 0-2.8l-3.3-3.3z"/>
          </svg>
          <span className="text-[11px]">Web</span>
        </button>

        {/* Git Branch */}
        <button className="flex items-center space-x-1 hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors">
          <GitBranch className="w-3 h-3 text-[#858585]" />
          <span>main</span>
        </button>

        {/* Sync Status */}
        <button className="flex items-center space-x-1 hover:bg-[#2a2d2e] hover:text-white px-1 py-0.5 rounded transition-colors" title="Synchronize Changes">
          <RefreshCw className="w-2.5 h-2.5 text-[#858585]" />
        </button>

        {/* Problems Diagnostics */}
        <button className="flex items-center space-x-1 hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors" title="No Problems">
          <XCircle className="w-3 h-3 text-[#858585]" />
          <span>0</span>
          <AlertTriangle className="w-3 h-3 text-[#858585] ml-1" />
          <span>0</span>
        </button>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-2">
        <span className="hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[#858585] hover:text-[#cccccc]">
          Ln 1, Col 1
        </span>

        <span className="hidden md:inline hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[#858585] hover:text-[#cccccc]">
          Spaces: 2
        </span>

        <span className="hidden md:inline hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[#858585] hover:text-[#cccccc]">
          UTF-8
        </span>

        <span className="hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[#858585] hover:text-[#cccccc]">
          TypeScript JSX
        </span>

        {/* Layout indicator */}
        <button className="flex items-center space-x-1 hover:bg-[#2a2d2e] hover:text-white px-1.5 py-0.5 rounded transition-colors text-[#858585]" title="Select Keyboard Layout">
          <Layout className="w-3 h-3" />
          <span>Layout: us</span>
        </button>

        {/* Notifications */}
        <button className="hover:bg-[#2a2d2e] hover:text-white p-1 rounded transition-colors text-[#858585]" title="Notifications">
          <Bell className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};

export default StatusBar;
