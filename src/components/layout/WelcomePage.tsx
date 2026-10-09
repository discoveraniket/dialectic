import React, { useState } from 'react';
import { 
  FolderOpen, 
  Folder,
  FilePlus, 
  GitBranch, 
  Radio,
  Star,
  Globe,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface WelcomePageProps {
  onOpenFolder: () => void;
  onNewFolder: () => void;
  onNewFile: () => void;
}

interface WalkthroughStep {
  title: string;
  description: string;
  done: boolean;
}

interface WalkthroughCard {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  icon: React.ReactNode;
  steps: WalkthroughStep[];
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onOpenFolder,
  onNewFolder: _onNewFolder,
  onNewFile,
}) => {
  const [showOnStartup, setShowOnStartup] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [walkthroughs, setWalkthroughs] = useState<WalkthroughCard[]>([
    {
      id: 'get-started',
      title: 'Get Started with Dialectic for Web...',
      description: 'Customize your editor, learn the basics, and start research',
      icon: <Star className="w-4 h-4 text-white" />,
      steps: [
        { title: 'Open or create a workspace folder', description: 'Mount an existing workspace directory', done: true },
        { title: 'Learn the primary side bar views', description: 'Explore files, search buffers, and inspect trees', done: true },
        { title: 'Use the Command Center (Ctrl+P)', description: 'Quickly find files and execute commands', done: true },
        { title: 'Split editor buffers', description: 'Side-by-side editing for notes and code', done: false },
      ],
    },
    {
      id: 'browse-remote',
      title: 'Browse & Edit Remotely...',
      badge: 'New',
      icon: <Globe className="w-4 h-4 text-white" />,
      steps: [
        { title: 'Connect to remote repositories', description: 'Browse and edit GitHub repositories directly', done: false },
        { title: 'Commit and push changes', description: 'Stash or commit changes from the browser', done: false },
      ],
    },
    {
      id: 'fundamentals',
      title: 'Learn the Fundamentals',
      icon: <Lightbulb className="w-4 h-4 text-[#38bdf8]" />,
      steps: [
        { title: 'Master keyboard shortcuts', description: 'Work efficiently without leaving the keyboard', done: true },
        { title: 'Diagnostics and panels', description: 'Use Ctrl+J to toggle the bottom panel', done: false },
      ],
    },
  ]);

  const handleToggleStep = (walkthroughId: string, stepIndex: number) => {
    setWalkthroughs((prev) =>
      prev.map((w) => {
        if (w.id !== walkthroughId) return w;
        const newSteps = [...w.steps];
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          done: !newSteps[stepIndex].done,
        };
        return { ...w, steps: newSteps };
      })
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#1e1e1e] text-[#cccccc] flex flex-col justify-between py-8 px-8 md:px-12 select-none font-sans">
      {/* Main 2-Column Content Area */}
      <div className="max-w-4xl w-full mx-auto space-y-8 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Start & Recent */}
          <div className="space-y-6">
            {/* Start Section */}
            <div className="space-y-2.5">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Start
              </h2>

              <div className="space-y-1.5 text-[13px]">
                {/* New File */}
                <button
                  onClick={onNewFile}
                  className="flex items-center space-x-2.5 text-[#3794ff] hover:underline cursor-pointer group text-left py-0.5"
                >
                  <FilePlus className="w-4 h-4 text-[#3794ff] flex-shrink-0" />
                  <span>New File...</span>
                </button>

                {/* Open File */}
                <button
                  onClick={onOpenFolder}
                  className="flex items-center space-x-2.5 text-[#3794ff] hover:underline cursor-pointer group text-left py-0.5"
                >
                  <Folder className="w-4 h-4 text-[#3794ff] flex-shrink-0" />
                  <span>Open File...</span>
                </button>

                {/* Open Folder */}
                <button
                  onClick={onOpenFolder}
                  className="flex items-center space-x-2.5 text-[#3794ff] hover:underline cursor-pointer group text-left py-0.5"
                >
                  <FolderOpen className="w-4 h-4 text-[#3794ff] flex-shrink-0" />
                  <span>Open Folder...</span>
                </button>

                {/* Open Repository */}
                <button
                  onClick={onOpenFolder}
                  className="flex items-center space-x-2.5 text-[#3794ff] hover:underline cursor-pointer group text-left py-0.5"
                >
                  <GitBranch className="w-4 h-4 text-[#3794ff] flex-shrink-0" />
                  <span>Open Repository...</span>
                </button>

                {/* Open Tunnel */}
                <button
                  onClick={onOpenFolder}
                  className="flex items-center space-x-2.5 text-[#3794ff] hover:underline cursor-pointer group text-left py-0.5"
                >
                  <Radio className="w-4 h-4 text-[#3794ff] flex-shrink-0" />
                  <span>Open Tunnel...</span>
                </button>
              </div>
            </div>

            {/* Recent Section */}
            <div className="space-y-2 pt-2">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Recent
              </h2>
              <p className="text-xs text-[#858585] leading-relaxed">
                You have no recent folders,{' '}
                <button
                  onClick={onOpenFolder}
                  className="text-[#3794ff] hover:underline cursor-pointer"
                >
                  open a folder
                </button>{' '}
                to start.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Walkthroughs */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-semibold text-white tracking-wide">
              Walkthroughs
            </h2>

            <div className="space-y-2">
              {walkthroughs.map((w) => {
                const isExpanded = expandedId === w.id;

                return (
                  <div
                    key={w.id}
                    className={`rounded border transition-all ${
                      isExpanded
                        ? 'bg-[#252526] border-[#007acc]'
                        : 'bg-[#252526]/80 hover:bg-[#2a2d2e] border-[#2d2d2d] hover:border-[#383838]'
                    }`}
                  >
                    {/* Compact Card Header */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : w.id)}
                      className="p-3 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded bg-[#007acc] flex items-center justify-center flex-shrink-0">
                          {w.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-white truncate">
                              {w.title}
                            </span>
                            {w.badge && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#007acc] text-white">
                                {w.badge}
                              </span>
                            )}
                          </div>
                          {w.description && (
                            <p className="text-[11px] text-[#858585] truncate mt-0.5">
                              {w.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-[#858585] ml-2 flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {/* Step details on expand */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#333333] space-y-1.5 bg-[#1f1f20]">
                        {w.steps.map((step, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleToggleStep(w.id, idx)}
                            className="flex items-start space-x-2 py-1 px-1.5 rounded hover:bg-[#2a2d2e] cursor-pointer group"
                          >
                            <div
                              className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                step.done
                                  ? 'bg-[#007acc] border-[#007acc] text-white'
                                  : 'border-[#555555]'
                              }`}
                            >
                              {step.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <div className="min-w-0 text-xs">
                              <span className={step.done ? 'text-[#858585] line-through' : 'text-[#cccccc]'}>
                                {step.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER (Startup checkbox + telemetry notice) */}
      <div className="max-w-4xl w-full mx-auto pt-8 flex flex-col items-center justify-center text-xs text-[#858585] space-y-1.5">
        <label className="flex items-center space-x-2 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={showOnStartup}
            onChange={(e) => setShowOnStartup(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#3c3c3c] bg-[#252526] accent-[#007acc] text-[#007acc] cursor-pointer"
          />
          <span className="text-[#858585] group-hover:text-[#cccccc] transition-colors">
            Show welcome page on startup
          </span>
        </label>

        <p className="text-[11px] text-[#6e7681] text-center">
          Dialectic collects workspace analytics. Read our{' '}
          <span className="text-[#3794ff] hover:underline cursor-pointer">privacy statement</span> and learn how to{' '}
          <span className="text-[#3794ff] hover:underline cursor-pointer">opt out</span>.
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
