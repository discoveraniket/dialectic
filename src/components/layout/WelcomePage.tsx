import React from 'react';
import { 
  FolderOpen, 
  FolderPlus, 
  FilePlus, 
  Clock, 
  Compass
} from 'lucide-react';
import { DialecticLogo } from '../brand/DialecticLogo';

interface WelcomePageProps {
  onOpenFolder: () => void;
  onNewFolder: () => void;
  onNewFile: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onOpenFolder,
  onNewFolder,
  onNewFile,
}) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#1e1e1e] text-[#cccccc] flex flex-col items-center py-12 px-6 select-none font-sans">
      <div className="max-w-3xl w-full space-y-10">
        {/* Hero Header */}
        <div className="space-y-2 border-b border-[#2b2b2b] pb-8">
          <div className="flex items-center space-x-4">
            <DialecticLogo size={44} />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Dialectic</h1>
              <p className="text-sm text-[#858585] mt-0.5">Research Workspace</p>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Start & Recent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Start Actions */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#007acc]" />
              <span>Start</span>
            </h2>

            <div className="space-y-2">
              {/* Open Folder Button */}
              <button
                onClick={onOpenFolder}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#252526] hover:bg-[#2a2d2e] border border-[#333333] hover:border-[#007acc] transition-colors group text-left"
              >
                <div className="p-2 rounded bg-[#1e1e1e] group-hover:bg-[#007acc]/20 text-[#007acc] transition-colors">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-[#58a6ff]">Open Folder...</div>
                  <div className="text-xs text-[#858585]">Open an existing workspace or project directory</div>
                </div>
              </button>

              {/* Create New Folder Button */}
              <button
                onClick={onNewFolder}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#252526] hover:bg-[#2a2d2e] border border-[#333333] hover:border-[#007acc] transition-colors group text-left"
              >
                <div className="p-2 rounded bg-[#1e1e1e] group-hover:bg-[#238636]/20 text-[#238636] transition-colors">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-[#7ee787]">Create New Folder...</div>
                  <div className="text-xs text-[#858585]">Initialize a new folder workspace directly</div>
                </div>
              </button>

              {/* New File Button */}
              <button
                onClick={onNewFile}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[#252526] hover:bg-[#2a2d2e] border border-[#333333] hover:border-[#007acc] transition-colors group text-left"
              >
                <div className="p-2 rounded bg-[#1e1e1e] group-hover:bg-[#61afef]/20 text-[#61afef] transition-colors">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-[#61afef]">New File...</div>
                  <div className="text-xs text-[#858585]">Start with an empty untitled editor buffer</div>
                </div>
              </button>
            </div>
          </div>

          {/* Column 2: Recent & Shortcuts */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#858585]" />
              <span>Recent</span>
            </h2>

            <div className="p-4 rounded-lg bg-[#252526] border border-[#333333] space-y-2 text-xs text-[#858585]">
              <p>No recent folders opened yet.</p>
              <p className="text-[11px] text-[#555555]">
                Folders and projects you open or create will appear here for fast access.
              </p>
            </div>

            {/* Quick Keyboard Shortcuts Cheatsheet */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-[#858585] uppercase tracking-wider mb-2">
                Help & Key Shortcuts
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#2b2b2b]">
                  <span className="text-[#858585]">Command Palette</span>
                  <kbd className="px-2 py-0.5 bg-[#252526] border border-[#3c3c3c] rounded text-[11px] text-white">Ctrl+Shift+P</kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2b2b2b]">
                  <span className="text-[#858585]">Quick Open File</span>
                  <kbd className="px-2 py-0.5 bg-[#252526] border border-[#3c3c3c] rounded text-[11px] text-white">Ctrl+P</kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2b2b2b]">
                  <span className="text-[#858585]">Toggle Primary Side Bar</span>
                  <kbd className="px-2 py-0.5 bg-[#252526] border border-[#3c3c3c] rounded text-[11px] text-white">Ctrl+B</kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2b2b2b]">
                  <span className="text-[#858585]">Toggle Bottom Panel</span>
                  <kbd className="px-2 py-0.5 bg-[#252526] border border-[#3c3c3c] rounded text-[11px] text-white">Ctrl+J</kbd>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#858585]">Toggle Secondary Side Bar</span>
                  <kbd className="px-2 py-0.5 bg-[#252526] border border-[#3c3c3c] rounded text-[11px] text-white">Ctrl+Alt+B</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
