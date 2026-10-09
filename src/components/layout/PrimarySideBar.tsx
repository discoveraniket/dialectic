import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal, 
  FileCode,
  File,
  X
} from 'lucide-react';
import { ActivityBarItem, WorkspaceFolder } from '../../types/layout';

interface PrimarySideBarProps {
  activeView: ActivityBarItem;
  width: number;
  workspaceFolder: WorkspaceFolder | null;
  onResizeStart?: (e: React.MouseEvent) => void;
  onOpenFolderClick?: () => void;
  onNewFolderClick: () => void;
  onCloseFolder: () => void;
  onOpenTab: (tabId: string, title: string) => void;
}

export const PrimarySideBar: React.FC<PrimarySideBarProps> = ({
  activeView,
  width: _width,
  workspaceFolder,
  onResizeStart: _onResizeStart,
  onOpenFolderClick,
  onNewFolderClick: _onNewFolderClick,
  onCloseFolder,
  onOpenTab,
}) => {
  const [isNoFolderOpen, setIsNoFolderOpen] = useState(true);
  const [isWorkspaceFolderOpen, setIsWorkspaceFolderOpen] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'explorer':
        return workspaceFolder ? `Explorer: ${workspaceFolder.name}` : 'Explorer';
      case 'search':
        return 'Search';
      case 'source-control':
        return 'Source Control';
      case 'run-debug':
        return 'Run and Debug';
      case 'extensions':
        return 'Extensions';
      default:
        return 'Side Bar';
    }
  };

  const handleOpenAction = () => {
    if (onOpenFolderClick) {
      onOpenFolderClick();
    }
  };

  return (
    <div 
      className="w-full h-full bg-[#181818] flex flex-col select-none relative z-10 font-sans"
    >
      {/* Side Bar Header (Borderless) */}
      <div className="h-[35px] px-4 flex items-center justify-between text-[11px] font-semibold text-[#cccccc]">
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
              <div className="space-y-0.5">
                {/* Accordion: No Folder Opened */}
                <div 
                  onClick={() => setIsNoFolderOpen(!isNoFolderOpen)}
                  className="flex items-center px-3 py-1 text-[#cccccc] font-semibold text-[11px] cursor-pointer hover:bg-[#2a2d2e] select-none"
                >
                  {isNoFolderOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                  )}
                  <span>No Folder Opened</span>
                </div>

                {isNoFolderOpen && (
                  <div className="px-4 py-2 space-y-3">
                    <p className="text-xs text-[#858585] leading-relaxed">
                      You have not yet opened a folder.
                    </p>

                    <div className="space-y-2">
                      {/* Primary Open Folder */}
                      <button
                        onClick={handleOpenAction}
                        className="w-full py-1.5 px-3 bg-[#0078d4] hover:bg-[#026ec1] text-white rounded text-xs font-medium flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                      >
                        Open Folder
                      </button>

                      {/* Secondary Open Recent */}
                      <button
                        onClick={handleOpenAction}
                        className="w-full py-1.5 px-3 bg-[#313131] hover:bg-[#3c3c3c] border border-[#3c3c3c] text-white rounded text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
                      >
                        Open Recent
                      </button>
                    </div>

                    {/* Tunnel note & action */}
                    <div className="pt-1 space-y-1.5">
                      <p className="text-[11px] text-[#858585] leading-relaxed">
                        To connect to a machine that has Remote Tunnel Access enabled or learn about how to do that, click here:
                      </p>
                      <button
                        onClick={handleOpenAction}
                        className="w-full py-1.5 px-3 bg-[#0078d4] hover:bg-[#026ec1] text-white rounded text-xs font-medium flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                      >
                        Connect to Tunnel...
                      </button>
                    </div>

                    {/* Remote repository note & action */}
                    <div className="pt-1 space-y-1.5">
                      <p className="text-[11px] text-[#858585] leading-relaxed">
                        You can open a remote repository or pull request without cloning.
                      </p>
                      <button
                        onClick={handleOpenAction}
                        className="w-full py-1.5 px-3 bg-[#0078d4] hover:bg-[#026ec1] text-white rounded text-xs font-medium flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                      >
                        Open Remote Repository
                      </button>
                    </div>
                  </div>
                )}
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
            <div className="mt-2 border-t border-[#2b2b2b]">
              <div 
                onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                className="flex items-center px-3 py-1 text-[#cccccc] font-semibold text-[11px] cursor-pointer hover:bg-[#2a2d2e] select-none"
              >
                {isOutlineOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                )}
                <span>Outline</span>
              </div>
              {isOutlineOpen && (
                <div className="pl-6 pr-2 py-2 text-[11px] text-[#858585]">
                  No symbols found.
                </div>
              )}
            </div>

            {/* Timeline Accordion */}
            <div className="mt-1 border-t border-[#2b2b2b]">
              <div 
                onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                className="flex items-center px-3 py-1 text-[#cccccc] font-semibold text-[11px] cursor-pointer hover:bg-[#2a2d2e] select-none"
              >
                {isTimelineOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#858585]" />
                )}
                <span>Timeline</span>
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

        {/* Run and Debug View */}
        {activeView === 'run-debug' && (
          <div className="p-3 text-[11px] text-[#858585]">
            No debug configurations registered.
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
    </div>
  );
};

export default PrimarySideBar;
