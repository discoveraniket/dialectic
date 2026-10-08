import React, { useState } from 'react';
import { Folder, FolderPlus, X } from 'lucide-react';

interface FolderModalProps {
  mode: 'open' | 'create';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  mode,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  const isCreate = mode === 'create';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-2xl max-w-md w-full overflow-hidden select-none">
        {/* Modal Header */}
        <div className="h-10 px-4 bg-[#1e1e1e] border-b border-[#333333] flex items-center justify-between text-xs font-semibold text-white">
          <div className="flex items-center space-x-2">
            {isCreate ? (
              <FolderPlus className="w-4 h-4 text-[#238636]" />
            ) : (
              <Folder className="w-4 h-4 text-[#007acc]" />
            )}
            <span>{isCreate ? 'Create New Folder' : 'Open Folder'}</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#858585] hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#cccccc]">
              {isCreate ? 'Folder / Workspace Name:' : 'Select or Enter Folder Path:'}
            </label>
            <input
              type="text"
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={isCreate ? 'e.g. my-research-project' : 'e.g. project_r'}
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007acc] rounded px-3 py-2 text-xs text-white placeholder-[#6e7681] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#333333]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#cccccc] hover:bg-[#333333] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className={`px-4 py-1.5 text-xs font-semibold text-white rounded transition-colors ${
                isCreate 
                  ? 'bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50' 
                  : 'bg-[#007acc] hover:bg-[#0062a3] disabled:opacity-50'
              }`}
            >
              {isCreate ? 'Create & Open' : 'Open Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
