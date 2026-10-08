import React from 'react';
import { 
  Files, 
  Search, 
  GitFork, 
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
    { id: 'extensions', label: 'Extensions (Ctrl+Shift+X)', icon: <Boxes className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2 select-none z-20 flex-shrink-0">
      {/* Top action icons */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {topNavItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              title={item.label}
              className={`relative w-full h-11 flex items-center justify-center transition-colors ${
                isActive ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              {/* Active left border indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#007acc]" />
              )}
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* Bottom action icons */}
      <div className="flex flex-col items-center space-y-1 w-full">
        <button
          title="Accounts"
          className="w-full h-10 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <User className="w-5 h-5" />
        </button>
        <button
          title="Manage"
          className="w-full h-10 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
