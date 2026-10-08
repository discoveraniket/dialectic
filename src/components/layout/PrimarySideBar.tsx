import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal, 
  FileCode,
  File,
  FolderOpen,
  FolderPlus,
  X
} from 'lucide-react';
import { ActivityBarItem, WorkspaceFolder } from '../../types/layout';

interface PrimarySideBarProps {
  activeView: ActivityBarItem;
  width: number;
  workspaceFolder: WorkspaceFolder | null;
  onResizeStart: (e: React.MouseEvent) => void;
  onOpenFolderClick: () => void;
  onNewFolderClick: () => void;
  onCloseFolder: () => void;
  onOpenTab: (tabId: string, title: string) => void;
}

export const PrimarySideBar: React.FC<PrimarySideBarProps> = ({
  activeView,
  width,
  workspaceFolder,
  onResizeStart,
  onOpenFolderClick,
  onNewFolderClick,
  onCloseFolder,
  onOpenTab,
}) => {
  const [isWorkspaceFolderOpen, setIsWorkspaceFolderOpen] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'explorer':
        return workspaceFolder ? `EXPLORER: ${workspaceFolder.name.toUpperCase()}` : 'EXPLORER: NO FOLDER OPENED';
      case 'search':
        return 'SEARCH';
      case 'source-control':
        return 'SOURCE CONTROL';
      case 'extensions':
        return 'EXTENSIONS';
      default:
        return 'SIDE BAR';
    }
  };

  return (
    <div 
      style={{ width: `${width}px` }} 
      className="h-full bg-[#181818] border-r border-[#2b2b2b] flex flex-col select-none relative flex-shrink-0 z-10 font-sans"
    >
      {/* Side Bar Header */}
      <div className="h-[35px] px-4 flex items-center justify-between border-b border-[#2b2b2b] text-[11px] font-semibold tracking-wider text-[#cccccc]">
        <span className="truncate">{getHeaderTitle()}</span>
        <button className="text-[#858585] hover:text-white p-1 rounded">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Side Bar Body */}
      <div className="flex-1 overflow-y-auto text-xs py-1">
        {activeView === 'explorer' && (
          <>
            {/* Case A: No Folder Opened */}
            {!workspaceFolder ? (
              <div className="p-4 space-y-3">
                <p className="text-xs text-[#858585] leading-relaxed">
                  You have not yet opened a folder.
                </p>
                <div className="space-y-2 pt-1">
                  <button
                    onClick={onOpenFolderClick}
                    className="w-full py-1.5 px-3 bg-[#007acc] hover:bg-[#0062a3] text-white rounded text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open Folder</span>
                  </button>
                  <button
                    onClick={onNewFolderClick}
                    className="w-full py-1.5 px-3 bg-[#2a2d2e] hover:bg-[#333333] border border-[#3c3c3c] text-[#cccccc] hover:text-white rounded text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Create New Folder</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Case B: Folder Is Opened */
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-[#cccccc] font-bold text-[11px] hover:bg-[#2a2d2e] select-none uppercase tracking-wide group">
                  <div 
                    onClick={() => setIsWorkspaceFolderOpen(!isWorkspaceFolderOpen)}
                    className="flex items-center cursor-pointer flex-1 truncate"
                  >
                    {isWorkspaceFolderOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                    )}
                    <span className="truncate">{workspaceFolder.name}</span>
                  </div>
                  
                  {/* Close folder button */}
                  <button 
                    onClick={onCloseFolder}
                    title="Close Folder"
                    className="opacity-0 group-hover:opacity-100 hover:text-white p-0.5 rounded text-[#858585]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isWorkspaceFolderOpen && (
                  <div className="pl-3 pr-2 space-y-0.5">
                    {workspaceFolder.files.length === 0 ? (
                      <div className="pl-4 py-2 text-[11px] text-[#858585] italic">
                        Folder is empty
                      </div>
                    ) : (
                      workspaceFolder.files.map((file) => (
                        <div 
                          key={file.name}
                          onClick={() => onOpenTab(file.name, file.name)}
                          className="flex items-center px-2 py-1 text-[#cccccc] hover:bg-[#2a2d2e] rounded cursor-pointer group"
                        >
                          {file.name.endsWith('.md') ? (
                            <File className="w-3.5 h-3.5 mr-2 text-[#4d9375]" />
                          ) : (
                            <FileCode className="w-3.5 h-3.5 mr-2 text-[#61afef]" />
                          )}
                          <span className="truncate group-hover:text-white">{file.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Outline Accordion */}
            <div className="mt-2 border-t border-[#252526]">
              <div 
                onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                className="flex items-center px-2 py-1 text-[#cccccc] font-bold text-[11px] cursor-pointer hover:bg-[#2a2d2e] select-none uppercase tracking-wide"
              >
                {isOutlineOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                )}
                <span>OUTLINE</span>
              </div>
              {isOutlineOpen && (
                <div className="pl-6 pr-2 py-2 text-[11px] text-[#858585]">
                  No symbols found.
                </div>
              )}
            </div>

            {/* Timeline Accordion */}
            <div className="mt-1 border-t border-[#252526]">
              <div 
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className="flex items-center px-2 py-1 text-[#cccccc] font-bold text-[11px] cursor-pointer hover:bg-[#2a2d2e] select-none uppercase tracking-wide"
              >
                {isTimelineOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                )}
                <span>TIMELINE</span>
              </div>
              {isTimelineOpen && (
                <div className="pl-6 pr-2 py-2 text-[11px] text-[#858585]">
                  No timeline history.
                </div>
              )}
            </div>
          </>
        )}

        {/* Search View */}
        {activeView === 'search' && (
          <div className="p-3 space-y-2">
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full bg-[#252526] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2 py-1 text-xs text-[#cccccc] focus:outline-none"
            />
            <div className="text-[11px] text-[#858585] pt-2">No results.</div>
          </div>
        )}

        {/* Source Control View */}
        {activeView === 'source-control' && (
          <div className="p-3 text-[11px] text-[#858585]">
            No source control providers registered.
          </div>
        )}

        {/* Extensions View */}
        {activeView === 'extensions' && (
          <div className="p-3 space-y-2">
            <input 
              type="text" 
              placeholder="Search Extensions in Marketplace..." 
              className="w-full bg-[#252526] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2 py-1 text-xs text-[#cccccc] focus:outline-none"
            />
            <div className="text-[11px] text-[#858585] pt-2">No extensions installed.</div>
          </div>
        )}
      </div>

      {/* Resize Handle on Right Edge */}
      <div
        onMouseDown={onResizeStart}
        className="resizer-x absolute top-0 right-0 w-[4px] h-full cursor-col-resize hover:bg-[#0078d4] transition-colors"
      />
    </div>
  );
};
