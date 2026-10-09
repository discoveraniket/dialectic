import React from 'react';

interface ChatEmptyStateProps {
  onActionClick?: () => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-3 select-none">
      {/* Agent Speech Bubble with Sparkles Icon */}
      <div className="flex items-center justify-center text-[#cccccc] mb-1">
        <svg
          className="w-10 h-10"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h11a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H10l-4 4v-4H6a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3z" />
          <path d="M23 4c0 1.8 1.4 3.2 3.2 3.2-1.8 0-3.2 1.4-3.2 3.2 0-1.8-1.4-3.2-3.2-3.2 1.8 0 3.2-1.4 3.2-3.2z" fill="currentColor" stroke="none" />
          <path d="M27 12c0 1.1.9 2 2 2-1.1 0-2 .9-2 2 0-1.1-.9-2-2-2 1.1 0 2-.9 2-2z" fill="currentColor" stroke="none" />
        </svg>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">
          Research with Agent
        </h3>
        <p className="text-xs text-[#858585] mt-1">
          AI responses may be inaccurate
        </p>
      </div>
    </div>
  );
};
