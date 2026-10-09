import React from 'react';
import { Plus, SlidersHorizontal, ArrowUp, Loader2 } from 'lucide-react';

interface ChatPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelectModel?: () => void;
  selectedModelName?: string;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatPromptInput: React.FC<ChatPromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  onSelectModel,
  selectedModelName = 'Auto',
  disabled = false,
  isLoading = false,
  placeholder = 'Write your thoughts',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="p-3 bg-[#181818] flex-shrink-0">
      <div className="bg-[#252525] border border-[#383838] focus-within:border-[#007acc] rounded-lg overflow-hidden transition-colors">
        {/* Tip at top with horizontal divider line */}
        <div className="px-3 py-2 text-[11px] text-[#999999] border-b border-[#333333] leading-relaxed select-none">
          <span className="font-medium text-[#cccccc]">View context</span>
        </div>

        <div className="p-2.5 space-y-2">
          {/* Text input area */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            disabled={disabled}
            className="w-full bg-transparent text-xs text-[#cccccc] placeholder-[#858585] focus:outline-none resize-none font-sans block"
          />

          {/* Bottom actions row: 4 free-standing unboxed buttons */}
          <div className="flex items-center justify-between pt-1 text-[#858585] select-none">
            <div className="flex items-center space-x-2.5">
              {/* 1. Add Context */}
              <button
                type="button"
                title="Add Context"
                className="hover:text-white transition-colors cursor-pointer p-0.5 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* 2. Models (Auto) */}
              <button
                type="button"
                onClick={onSelectModel}
                title="Select Model"
                className="text-xs text-[#cccccc] hover:text-white transition-colors cursor-pointer font-normal"
              >
                {selectedModelName}
              </button>

              {/* 3. Configuration */}
              <button
                type="button"
                title="Configure Parameters"
                className="hover:text-white transition-colors cursor-pointer p-0.5 flex items-center justify-center"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Send */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!value.trim() || disabled || isLoading}
              title={isLoading ? 'Generating response...' : 'Send Prompt'}
              className={`transition-colors p-0.5 flex items-center justify-center ${value.trim() && !disabled && !isLoading
                  ? 'text-white hover:text-[#0078d4] cursor-pointer'
                  : 'text-[#555555] cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
