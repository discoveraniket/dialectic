import React from 'react';
import { 
  Menu,
  Files, 
  Search, 
  GitFork, 
  Play,
  Boxes, 
  User, 
  Settings 
} from 'lucide-react';
import { ActivityBarItem } from '../../types/layout';

interface ActivityBarProps {
  activeItem: ActivityBarItem;
  onSelectItem: (item: ActivityBarItem) => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeItem,
  onSelectItem,
}) => {
  const topNavItems: Array<{ id: ActivityBarItem; label: string; icon: React.ReactNode }> = [
    { id: 'explorer', label: 'Explorer (Ctrl+Shift+E)', icon: <Files className="w-5 h-5" /> },
    { id: 'search', label: 'Search (Ctrl+Shift+F)', icon: <Search className="w-5 h-5" /> },
    { id: 'source-control', label: 'Source Control (Ctrl+Shift+G)', icon: <GitFork className="w-5 h-5" /> },
    { id: 'run-debug', label: 'Run and Debug (Ctrl+Shift+D)', icon: <Play className="w-5 h-5" /> },
    { id: 'extensions', label: 'Extensions (Ctrl+Shift+X)', icon: <Boxes className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-12 bg-transparent border-r border-[#2b2b2b] flex flex-col justify-between items-center py-1 select-none z-20 flex-shrink-0 font-sans">
      {/* Top action icons with Hamburger Menu at very top */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* Application Menu Button (Hamburger) */}
        <button
          title="Application Menu"
          className="w-9 h-9 rounded-md flex items-center justify-center text-[#858585] hover:text-white hover:bg-[#383838]/60 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {topNavItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              title={item.label}
              className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                isActive 
                  ? 'bg-[#383838] text-white shadow-sm' 
                  : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#383838]/50'
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* Bottom action icons */}
      <div className="flex flex-col items-center space-y-1 w-full pb-1">
        <button
          title="Accounts"
          className="w-9 h-9 rounded-md flex items-center justify-center text-[#858585] hover:text-[#cccccc] hover:bg-[#383838]/50 transition-colors"
        >
          <User className="w-5 h-5" />
        </button>
        <button
          title="Manage"
          className="w-9 h-9 rounded-md flex items-center justify-center text-[#858585] hover:text-[#cccccc] hover:bg-[#383838]/50 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default ActivityBar;
