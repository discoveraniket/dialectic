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
  const [isPrimarySidebarOpen, setIsPrimarySidebarOpen] = useState(true);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(true);
  const [isBottomPanelMaximized, setIsBottomPanelMaximized] = useState(false);

  // Active Navigation
  const [activeActivityItem, setActiveActivityItem] = useState<ActivityBarItem>('explorer');

  // Resizable Dimensions
  const [primaryWidth, setPrimaryWidth] = useState(260);
  const [secondaryWidth, setSecondaryWidth] = useState(320);
  const [panelHeight, setPanelHeight] = useState(160);

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
        setIsPrimarySidebarOpen((prev) => !prev);
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
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#181818] overflow-hidden select-none font-sans">
      {/* 1. TITLE BAR */}
      <TitleBar
        folderName={workspaceFolder?.name}
        isPrimarySidebarOpen={isPrimarySidebarOpen}
        isBottomPanelOpen={isBottomPanelOpen}
        isSecondarySidebarOpen={isSecondarySidebarOpen}
        onTogglePrimarySidebar={() => setIsPrimarySidebarOpen(!isPrimarySidebarOpen)}
        onToggleBottomPanel={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
        onToggleSecondarySidebar={() => setIsSecondarySidebarOpen(!isSecondarySidebarOpen)}
      />

      {/* WORKBENCH BODY */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 2. ACTIVITY BAR (FAR LEFT) */}
        <ActivityBar
          activeItem={activeActivityItem}
          onSelectItem={handleSelectActivityItem}
        />

        {/* 3. PRIMARY SIDE BAR */}
        {isPrimarySidebarOpen && (
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
        )}

        {/* 4. MAIN CENTRAL WORKSPACE (EDITOR + BOTTOM PANEL) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* EDITOR AREA (WITH WELCOME LANDING PAGE) */}
          <div className="flex-1 overflow-hidden">
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

          {/* 6. BOTTOM PANEL (CLEAN - NO TABS) */}
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

        {/* 5. SECONDARY SIDE BAR (AUXILIARY BAR) */}
        {isSecondarySidebarOpen && (
          <SecondarySideBar
            width={secondaryWidth}
            onClose={() => setIsSecondarySidebarOpen(false)}
            onResizeStart={(e) => {
              e.preventDefault();
              isDraggingSecondary.current = true;
              document.body.classList.add('cursor-col-resize');
            }}
          />
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
