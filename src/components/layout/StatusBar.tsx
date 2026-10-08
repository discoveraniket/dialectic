import React from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Bell
} from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-[22px] bg-[#007acc] text-white flex items-center justify-between px-2 text-[11px] select-none flex-shrink-0 z-30 font-sans">
      {/* Left side items */}
      <div className="flex items-center space-x-3">
        {/* Git Branch */}
        <button className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </button>

        {/* Sync Status */}
        <button className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors">
          <RefreshCw className="w-2.5 h-2.5" />
        </button>

        {/* Problems Diagnostics */}
        <button className="flex items-center space-x-1 hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors">
          <CheckCircle className="w-3 h-3 text-white" />
          <span>0</span>
          <AlertTriangle className="w-3 h-3 text-white/80 ml-1" />
          <span>0</span>
        </button>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-3">
        <span className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors cursor-pointer">
          Ln 1, Col 1
        </span>

        <span className="hidden md:inline hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors cursor-pointer">
          Spaces: 2
        </span>

        <span className="hidden md:inline hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors cursor-pointer">
          UTF-8
        </span>

        <span className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded transition-colors cursor-pointer">
          TypeScript JSX
        </span>

        {/* Notifications */}
        <button className="hover:bg-[#1f8ad2] p-1 rounded transition-colors">
          <Bell className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};
