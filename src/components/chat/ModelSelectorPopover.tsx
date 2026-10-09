import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { QUICK_MODELS } from '../../types/chat';

interface ModelSelectorPopoverProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onClose: () => void;
}

export const ModelSelectorPopover: React.FC<ModelSelectorPopoverProps> = ({
  selectedModelId,
  onSelectModel,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Outside click & Escape listener
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filteredModels = QUICK_MODELS.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-2 left-0 z-50 w-64 bg-[#252525] border border-[#383838] rounded-lg shadow-2xl p-1.5 text-xs font-sans select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Search Input */}
      <div className="p-1 mb-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search models"
          autoFocus
          className="w-full bg-[#1b1b1b] border border-[#383838] focus:border-[#007acc] rounded px-2.5 py-1 text-xs text-[#cccccc] placeholder-[#777777] outline-none"
        />
      </div>

      {/* Model List */}
      <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-[#383838]">
        {filteredModels.map((model) => {
          const isSelected = selectedModelId === model.id;

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                onSelectModel(model.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#2f2f2f] text-white'
                  : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="w-3.5 flex items-center justify-center flex-shrink-0">
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </span>
                <span className="truncate">{model.name}</span>
              </div>
              {model.isDefault && (
                <span className="text-[10px] text-[#888888] font-normal flex-shrink-0 ml-1">
                  [Default]
                </span>
              )}
            </button>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="p-2 text-center text-xs text-[#777777]">
            No matching models
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-1 border-t border-[#333333]" />

      {/* Manage Models Action */}
      <button
        type="button"
        onClick={() => {
          alert('Model management and custom endpoint configuration will be available in future releases.');
          onClose();
        }}
        className="w-full px-2.5 py-1.5 text-left rounded text-xs text-[#999999] hover:text-white hover:bg-[#2a2d2e] transition-colors cursor-pointer"
      >
        Manage Models...
      </button>
    </div>
  );
};

export default ModelSelectorPopover;
