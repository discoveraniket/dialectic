import React from 'react';
import { 
  X, 
  Split, 
  MoreHorizontal, 
  FileCode,
  File,
  ChevronRight
} from 'lucide-react';
import { EditorTab } from '../../types/layout';
import { WelcomePage } from './WelcomePage';
import { DialecticLogo } from '../brand/DialecticLogo';

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
    <div className="flex-1 flex flex-col h-full bg-[#1f1f1f] overflow-hidden font-sans">
      {/* Editor Tab Bar: Inactive background #2b2b2b, Active tab #1f1f1f flush with top/left */}
      <div className="h-[35px] bg-[#2b2b2b] flex items-center justify-between select-none flex-shrink-0">
        <div className="flex items-center h-full overflow-x-auto overflow-y-hidden">
          {openTabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const isWelcome = tab.id === 'welcome';
            const isFirst = index === 0;

            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                style={{
                  marginRight: isActive ? 8 : 0,
                  marginLeft: isActive && !isFirst ? 8 : 0,
                }}
                className={`h-full flex items-center px-3.5 cursor-pointer group text-xs transition-colors relative flex-shrink-0 ${
                  isActive
                    ? `bg-[#1f1f1f] text-white z-10 rounded-tr-[10px] ${isFirst ? 'rounded-tl-[8px]' : 'rounded-tl-[10px]'}`
                    : 'bg-transparent text-[#969696] hover:text-[#cccccc] hover:bg-[#323233]'
                }`}
              >
                {isWelcome ? (
                  <DialecticLogo size={15} className="mr-2 flex-shrink-0" />
                ) : tab.title.endsWith('.md') ? (
                  <File className="w-3.5 h-3.5 mr-2 text-[#4d9375] flex-shrink-0" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 mr-2 text-[#61afef] flex-shrink-0" />
                )}

                <span className={`truncate max-w-[160px] mr-2.5 font-normal ${isWelcome ? 'italic' : ''}`}>
                  {tab.title}
                </span>

                <button
                  onClick={(e) => onCloseTab(tab.id, e)}
                  className="opacity-70 group-hover:opacity-100 hover:bg-[#383838] hover:text-white rounded p-0.5 transition-all ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Bottom-right concave fillet curve (scoop) */}
                {isActive && (
                  <svg 
                    style={{
                      position: 'absolute',
                      right: -8,
                      bottom: 0,
                      width: 8,
                      height: 8,
                      fill: '#1f1f1f',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                    viewBox="0 0 8 8"
                  >
                    <path d="M 0 0 A 8 8 0 0 0 8 8 L 0 8 Z" />
                  </svg>
                )}

                {/* Bottom-left concave fillet curve (if not first tab) */}
                {isActive && !isFirst && (
                  <svg 
                    style={{
                      position: 'absolute',
                      left: -8,
                      bottom: 0,
                      width: 8,
                      height: 8,
                      fill: '#1f1f1f',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                    viewBox="0 0 8 8"
                  >
                    <path d="M 8 0 A 8 8 0 0 1 0 8 L 8 8 Z" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Tab actions on right */}
        <div className="flex items-center space-x-1 px-2 text-[#858585]">
          <button title="Split Editor Right" className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors">
            <Split className="w-3.5 h-3.5" />
          </button>
          <button title="More Editor Actions" className="p-1 hover:text-white hover:bg-[#333333] rounded transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumbs bar (only shown when viewing a file, not welcome page) */}
      {!isWelcomeActive && activeTab && (
        <div className="h-[22px] px-3 bg-[#1f1f1f] border-b border-[#2b2b2b] flex items-center text-[11px] text-[#858585] flex-shrink-0">
          <span className="hover:text-white cursor-pointer">workspace</span>
          <ChevronRight className="w-3 h-3 mx-1 text-[#555555]" />
          <span className="text-[#cccccc] font-medium">{activeTab.title}</span>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#1f1f1f] relative">
        {isWelcomeActive ? (
          <WelcomePage
            onOpenFolder={onOpenFolder}
            onNewFolder={onNewFolder}
            onNewFile={onNewFile}
          />
        ) : (
          /* Editor Canvas with line numbers or rendered document */
          <div className="flex font-mono text-xs text-[#d4d4d4] p-3 leading-6 h-full">
            {/* Gutter / Line Numbers */}
            <div className="w-12 text-right pr-4 text-[#858585] select-none border-r border-[#2b2b2b] flex flex-col flex-shrink-0">
              {Array.from({
                length: Math.max(30, (activeTab?.content || '').split('\n').length),
              }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code / Markdown Document Area */}
            <div className="flex-1 pl-4 flex flex-col overflow-y-auto font-mono text-xs whitespace-pre-wrap select-text text-[#d4d4d4]">
              {activeTab?.content ? (
                <div>{activeTab.content}</div>
              ) : (
                <div className="flex flex-col text-[#9cdcfe]">
                  <div className="text-[#6a9955]">// File: {activeTab?.title}</div>
                  <div>&nbsp;</div>
                  <div><span className="text-[#569cd6]">export default function</span> <span className="text-[#dcdcaa]">WorkspaceModule</span>() &#123;</div>
                  <div className="pl-4 text-[#ce9178]">"use strict";</div>
                  <div className="pl-4"><span className="text-[#c586c0]">return</span> <span className="text-[#4ec9b0]">null</span>;</div>
                  <div>&#125;</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorArea;
