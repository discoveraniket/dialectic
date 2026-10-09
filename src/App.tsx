import React, { useState, useEffect, useRef } from 'react';
import { TitleBar } from './components/layout/TitleBar';
import { ActivityBar } from './components/layout/ActivityBar';
import { PrimarySideBar } from './components/layout/PrimarySideBar';
import { SecondarySideBar } from './components/layout/SecondarySideBar';
import { BottomPanel } from './components/layout/BottomPanel';
import { EditorArea } from './components/layout/EditorArea';
import { StatusBar } from './components/layout/StatusBar';
import { FolderModal } from './components/layout/FolderModal';
import { ActivityBarItem, EditorTab, WorkspaceFolder } from './types/layout';

export const App: React.FC = () => {
  // Panel Visibilities
  const [isActivityBarVisible, setIsActivityBarVisible] = useState(true);
  const [isPrimarySidebarOpen, setIsPrimarySidebarOpen] = useState(true);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(true);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [isBottomPanelMaximized, setIsBottomPanelMaximized] = useState(false);

  // Active Navigation
  const [activeActivityItem, setActiveActivityItem] = useState<ActivityBarItem>('explorer');

  // Resizable Dimensions
  const [primaryWidth, setPrimaryWidth] = useState(260);
  const [secondaryWidth, setSecondaryWidth] = useState(320);
  const [panelHeight, setPanelHeight] = useState(160);
  const [isSecondaryMaximized, setIsSecondaryMaximized] = useState(false);

  // Dragging states
  const isDraggingPrimary = useRef(false);
  const isDraggingSecondary = useRef(false);
  const isDraggingPanel = useRef(false);

  // Workspace Folder State (Null by default: No folder opened)
  const [workspaceFolder, setWorkspaceFolder] = useState<WorkspaceFolder | null>(null);

  // Modal dialog state for Open / Create Folder
  const [folderModalState, setFolderModalState] = useState<{ isOpen: boolean; mode: 'open' | 'create' }>({
    isOpen: false,
    mode: 'open',
  });

  // Editor Tabs (defaults to Welcome Landing Page)
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([
    { id: 'welcome', title: 'Welcome' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('welcome');

  // Activity Bar Navigation Click
  const handleSelectActivityItem = (item: ActivityBarItem) => {
    if (activeActivityItem === item && isPrimarySidebarOpen) {
      setIsPrimarySidebarOpen(false);
    } else {
      setActiveActivityItem(item);
      setIsPrimarySidebarOpen(true);
      setIsActivityBarVisible(true);
    }
  };

  // Toggle Primary Sidebar (Full -> Slim -> Hidden -> Full)
  const handleTogglePrimarySidebar = () => {
    if (isPrimarySidebarOpen) {
      setIsPrimarySidebarOpen(false);
    } else if (isActivityBarVisible) {
      setIsActivityBarVisible(false);
    } else {
      setIsActivityBarVisible(true);
      setIsPrimarySidebarOpen(true);
    }
  };

  // Open Tab Handler
  const handleOpenTab = (tabId: string, title: string) => {
    if (!openTabs.find((t) => t.id === tabId)) {
      setOpenTabs((prev) => [...prev, { id: tabId, title }]);
    }
    setActiveTabId(tabId);
  };

  // Close Tab Handler
  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t.id !== id);
    setOpenTabs(remaining);
    if (activeTabId === id) {
      if (remaining.length > 0) {
        setActiveTabId(remaining[remaining.length - 1].id);
      } else {
        // When all tabs are closed, return to the Welcome landing tab
        setOpenTabs([{ id: 'welcome', title: 'Welcome' }]);
        setActiveTabId('welcome');
      }
    }
  };

  // Folder Actions
  const handleOpenFolderClick = () => {
    setFolderModalState({ isOpen: true, mode: 'open' });
  };

  const handleNewFolderClick = () => {
    setFolderModalState({ isOpen: true, mode: 'create' });
  };

  const handleFolderSubmit = (name: string) => {
    setWorkspaceFolder({
      name,
      path: `/${name}`,
      files: [],
    });
    setIsPrimarySidebarOpen(true);
    setActiveActivityItem('explorer');
  };

  const handleCloseFolder = () => {
    setWorkspaceFolder(null);
    setOpenTabs([{ id: 'welcome', title: 'Welcome' }]);
    setActiveTabId('welcome');
  };

  const handleNewFile = () => {
    const newId = `untitled-${Date.now()}`;
    const newTab: EditorTab = { id: newId, title: 'Untitled-1' };
    setOpenTabs((prev) => [...prev.filter((t) => t.id !== 'welcome'), newTab]);
    setActiveTabId(newId);
  };

  // Mouse drag resize event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingPrimary.current) {
        const newWidth = Math.max(160, Math.min(600, e.clientX - 48));
        setPrimaryWidth(newWidth);
      }
      if (isDraggingSecondary.current) {
        const newWidth = Math.max(200, Math.min(700, window.innerWidth - e.clientX));
        setSecondaryWidth(newWidth);
      }
      if (isDraggingPanel.current) {
        const newHeight = Math.max(80, Math.min(window.innerHeight - 150, window.innerHeight - e.clientY - 22));
        setPanelHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isDraggingPrimary.current = false;
      isDraggingSecondary.current = false;
      isDraggingPanel.current = false;
      document.body.classList.remove('cursor-col-resize', 'cursor-row-resize');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Keyboard Shortcuts (standard VS Code keybindings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+B / Cmd+B -> Toggle Primary Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && !e.altKey) {
        e.preventDefault();
        handleTogglePrimarySidebar();
      }
      // Ctrl+J / Cmd+J -> Toggle Bottom Panel
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsBottomPanelOpen((prev) => !prev);
      }
      // Ctrl+Alt+B -> Toggle Secondary Sidebar
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSecondarySidebarOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrimarySidebarOpen, isActivityBarVisible]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1f1f1f] overflow-hidden select-none font-sans">
      {/* 1. TITLE BAR */}
      <TitleBar
        folderName={workspaceFolder?.name}
        isPrimarySidebarOpen={isPrimarySidebarOpen || isActivityBarVisible}
        isBottomPanelOpen={isBottomPanelOpen}
        isSecondarySidebarOpen={isSecondarySidebarOpen}
        onTogglePrimarySidebar={handleTogglePrimarySidebar}
        onToggleBottomPanel={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
        onToggleSecondarySidebar={() => setIsSecondarySidebarOpen(!isSecondarySidebarOpen)}
      />

      {/* WORKBENCH BODY: Recessed backdrop with Modern UI 3-Tile Floating Layout */}
      <div className="flex-1 flex overflow-hidden p-1 relative bg-[#1f1f1f]">
        {/* TILE 1: UNIFIED LEFT TILE (ACTIVITY BAR + PRIMARY SIDE BAR) */}
        {isActivityBarVisible && (
          <div 
            style={{ width: isPrimarySidebarOpen ? `${48 + primaryWidth}px` : '48px' }}
            className="h-full flex-shrink-0 rounded-lg border border-[#2b2b2b] bg-[#181818] overflow-hidden flex flex-row relative transition-[width] duration-150 ease-out"
          >
            <ActivityBar
              activeItem={activeActivityItem}
              onSelectItem={handleSelectActivityItem}
            />
            {isPrimarySidebarOpen && (
              <div className="flex-1 h-full min-w-0 flex flex-col relative overflow-hidden">
                <PrimarySideBar
                  activeView={activeActivityItem}
                  width={primaryWidth}
                  workspaceFolder={workspaceFolder}
                  onOpenFolderClick={handleOpenFolderClick}
                  onNewFolderClick={handleNewFolderClick}
                  onCloseFolder={handleCloseFolder}
                  onOpenTab={handleOpenTab}
                  onResizeStart={(e) => {
                    e.preventDefault();
                    isDraggingPrimary.current = true;
                    document.body.classList.add('cursor-col-resize');
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* LEFT RESIZER SASH (IN THIN INTER-TILE GAP WITH 3 VERTICAL DOTS) */}
        {isActivityBarVisible && isPrimarySidebarOpen && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              isDraggingPrimary.current = true;
              document.body.classList.add('cursor-col-resize');
            }}
            className="w-[4px] h-full cursor-col-resize hover:bg-[#0078d4] active:bg-[#0078d4] transition-colors z-20 flex-shrink-0 flex items-center justify-center group"
            title="Resize Side Bar"
          >
            <div className="flex flex-col items-center space-y-[3px] group-hover:opacity-0 transition-opacity pointer-events-none select-none">
              <span className="w-[2px] h-[2px] rounded-full bg-[#666666]" />
              <span className="w-[2px] h-[2px] rounded-full bg-[#666666]" />
              <span className="w-[2px] h-[2px] rounded-full bg-[#666666]" />
            </div>
          </div>
        )}

        {/* TILE 2: CENTER TILE (EDITOR AREA + DOCKED BOTTOM PANEL) */}
        <div className="flex-1 flex flex-col h-full rounded-lg border border-[#2b2b2b] bg-[#1f1f1f] overflow-hidden relative min-w-0">
          {/* EDITOR AREA (WITH WELCOME LANDING PAGE) */}
          <div className="flex-1 overflow-hidden min-h-0">
            <EditorArea
              openTabs={openTabs}
              activeTabId={activeTabId}
              onSelectTab={(id) => setActiveTabId(id)}
              onCloseTab={handleCloseTab}
              onOpenFolder={handleOpenFolderClick}
              onNewFolder={handleNewFolderClick}
              onNewFile={handleNewFile}
            />
          </div>

          {/* DOCKED BOTTOM PANEL */}
          {isBottomPanelOpen && (
            <BottomPanel
              height={panelHeight}
              isMaximized={isBottomPanelMaximized}
              onToggleMaximize={() => setIsBottomPanelMaximized(!isBottomPanelMaximized)}
              onClose={() => setIsBottomPanelOpen(false)}
              onResizeStart={(e) => {
                e.preventDefault();
                isDraggingPanel.current = true;
                document.body.classList.add('cursor-row-resize');
              }}
            />
          )}
        </div>

        {/* RIGHT RESIZER SASH (IN THIN INTER-TILE GAP WITH 3 VERTICAL DOTS) */}
        {isSecondarySidebarOpen && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              isDraggingSecondary.current = true;
              document.body.classList.add('cursor-col-resize');
            }}
            className="w-[4px] h-full cursor-col-resize hover:bg-[#0078d4] active:bg-[#0078d4] transition-colors z-20 flex-shrink-0 flex items-center justify-center group"
            title="Resize Secondary Side Bar"
          >
            <div className="flex flex-col items-center space-y-[3px] group-hover:opacity-0 transition-opacity pointer-events-none select-none">
              <span className="w-[2px] h-[2px] rounded-full bg-[#666666]" />
              <span className="w-[2px] h-[2px] rounded-full bg-[#666666]" />
              <span className="w-[2px] h-[2px] rounded-full bg-[#666666]" />
            </div>
          </div>
        )}

        {/* TILE 3: RIGHT TILE (AUXILIARY BAR / CHAT) */}
        {isSecondarySidebarOpen && (
          <div 
            style={{ width: isSecondaryMaximized ? 'min(580px, 45vw)' : `${secondaryWidth}px` }}
            className="h-full flex-shrink-0 rounded-lg border border-[#2b2b2b] bg-[#181818] overflow-hidden flex flex-col relative transition-[width] duration-150 ease-out"
          >
            <SecondarySideBar
              width={secondaryWidth}
              isMaximized={isSecondaryMaximized}
              onToggleMaximize={() => setIsSecondaryMaximized(!isSecondaryMaximized)}
              onClose={() => setIsSecondarySidebarOpen(false)}
              onResizeStart={(e) => {
                e.preventDefault();
                isDraggingSecondary.current = true;
                document.body.classList.add('cursor-col-resize');
              }}
            />
          </div>
        )}
      </div>

      {/* 7. STATUS BAR */}
      <StatusBar />

      {/* OPEN / CREATE FOLDER MODAL DIALOG */}
      <FolderModal
        isOpen={folderModalState.isOpen}
        mode={folderModalState.mode}
        onClose={() => setFolderModalState((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleFolderSubmit}
      />
    </div>
  );
};

export default App;
