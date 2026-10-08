import React from 'react';
import { 
  X, 
  Split, 
  MoreHorizontal, 
  FileCode,
  File,
  ChevronRight,
  Compass
} from 'lucide-react';
import { EditorTab } from '../../types/layout';
import { WelcomePage } from './WelcomePage';

interface EditorAreaProps {
  openTabs: EditorTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string, e: React.MouseEvent) => void;
  onOpenFolder: () => void;
  onNewFolder: () => void;
  onNewFile: () => void;
}

export const EditorArea: React.FC<EditorAreaProps> = ({
  openTabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenFolder,
  onNewFolder,
  onNewFile,
}) => {
  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const isWelcomeActive = activeTabId === 'welcome' || openTabs.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] overflow-hidden font-sans">
      {/* Editor Tab Bar */}
      <div className="h-[35px] bg-[#181818] border-b border-[#2b2b2b] flex items-center justify-between select-none overflow-x-auto flex-shrink-0">
        <div className="flex items-center h-full overflow-x-auto">
          {openTabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isWelcome = tab.id === 'welcome';

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`h-full flex items-center px-3 border-r border-[#2b2b2b] cursor-pointer group text-xs transition-colors ${
                  isActive
                    ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]'
                    : 'bg-[#181818] text-[#858585] hover:text-[#cccccc] hover:bg-[#1f1f1f]'
                }`}
              >
                {isWelcome ? (
                  <Compass className="w-3.5 h-3.5 mr-2 text-[#007acc]" />
                ) : tab.title.endsWith('.md') ? (
                  <File className="w-3.5 h-3.5 mr-2 text-[#4d9375]" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 mr-2 text-[#61afef]" />
                )}

                <span className="truncate max-w-[160px] mr-2">{tab.title}</span>

                <button
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-[#333333] hover:text-white rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Tab actions on right */}
        <div className="flex items-center space-x-1 px-2 text-[#858585]">
          <button title="Split Editor Right" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded">
            <Split className="w-3.5 h-3.5" />
          </button>
          <button title="More Editor Actions" className="p-1 hover:text-white hover:bg-[#2a2d2e] rounded">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumbs bar (only shown when viewing a file, not welcome page) */}
      {!isWelcomeActive && activeTab && (
        <div className="h-[22px] px-3 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center text-[11px] text-[#858585] flex-shrink-0">
          <span className="hover:text-white cursor-pointer">workspace</span>
          <ChevronRight className="w-3 h-3 mx-1 text-[#555555]" />
          <span className="text-[#cccccc] font-medium">{activeTab.title}</span>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#1e1e1e] relative">
        {isWelcomeActive ? (
          /* VS CODE LANDING PAGE: Choose folder or create folder */
          <WelcomePage
            onOpenFolder={onOpenFolder}
            onNewFolder={onNewFolder}
            onNewFile={onNewFile}
          />
        ) : (
          /* Raw Editor Canvas with Line Numbers */
          <div className="flex font-mono text-xs text-[#d4d4d4] p-3 leading-6">
            {/* Gutter / Line Numbers */}
            <div className="w-12 text-right pr-4 text-[#858585] select-none border-r border-[#2b2b2b] flex flex-col flex-shrink-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code / Text Area */}
            <div className="flex-1 pl-4 flex flex-col text-[#9cdcfe]">
              <div className="text-[#6a9955]">// File: {activeTab?.title}</div>
              <div>&nbsp;</div>
              <div><span className="text-[#569cd6]">export default function</span> <span className="text-[#dcdcaa]">WorkspaceModule</span>() &#123;</div>
              <div className="pl-4 text-[#ce9178]">"use strict";</div>
              <div className="pl-4"><span className="text-[#c586c0]">return</span> <span className="text-[#4ec9b0]">null</span>;</div>
              <div>&#125;</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
