import React from 'react';
import { ChatContainer } from '../chat/ChatContainer';
import { CrystallizedDocument } from '../../types/agent';

interface SecondarySideBarProps {
  width: number;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  onResizeStart?: (e: React.MouseEvent) => void;
  onClose: () => void;
  onDocumentCrystallized?: (doc: CrystallizedDocument) => void;
}

export const SecondarySideBar: React.FC<SecondarySideBarProps> = ({
  width: _width,
  isMaximized = false,
  onToggleMaximize,
  onResizeStart: _onResizeStart,
  onClose,
  onDocumentCrystallized,
}) => {
  return (
    <div className="w-full h-full bg-[#181818] flex flex-col relative z-10 font-sans">
      <ChatContainer
        isMaximized={isMaximized}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
        onDocumentCrystallized={onDocumentCrystallized}
      />
    </div>
  );
};

export default SecondarySideBar;
