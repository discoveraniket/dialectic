import React, { useState } from 'react';
import { Terminal, Search, Wrench, Code, Zap, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ToolStep } from '../../types/chat';

interface ToolExecutionBadgeProps {
  tool: ToolStep;
}

export const ToolExecutionBadge: React.FC<ToolExecutionBadgeProps> = ({ tool }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderIcon = () => {
    switch (tool.iconType) {
      case 'terminal':
        return <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />;
      case 'search':
        return <Search className="w-3.5 h-3.5 text-[#a78bfa]" />;
      case 'code':
        return <Code className="w-3.5 h-3.5 text-[#34d399]" />;
      case 'bolt':
        return <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-[#cccccc]" />;
    }
  };

  return (
    <div className="mb-2.5 select-none font-sans">
      {/* 1. Rounded Dark Tool Execution Pill Card */}
      <div className="inline-flex items-center space-x-2 bg-[#222222] border border-[#303030] rounded-md px-2.5 py-1 text-xs text-[#d4d4d4] shadow-sm">
        {renderIcon()}
        <span className="font-mono text-[11.5px] font-medium tracking-tight text-[#e0e0e0]">
          {tool.label}
        </span>
        {tool.status === 'completed' && (
          <CheckCircle2 className="w-3 h-3 text-[#34d399] ml-1 opacity-70" />
        )}
      </div>

      {/* 2. Collapsible Execution Disclosure Link (e.g., "Worked for 4m >") */}
      {tool.durationText && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center space-x-1 text-[11px] text-[#777777] hover:text-[#cccccc] transition-colors cursor-pointer group py-0.5"
          >
            <span>{tool.durationText}</span>
            {isOpen ? (
              <ChevronDown className="w-3 h-3 text-[#777777] group-hover:text-white transition-colors" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#777777] group-hover:text-white transition-colors" />
            )}
          </button>
        </div>
      )}

      {/* 3. Expandable Command & Output Logs Drawer */}
      {isOpen && (
        <div className="mt-1.5 p-2.5 rounded-md bg-[#161616] border border-[#282828] text-[11px] font-mono text-[#999999] leading-relaxed max-w-full overflow-x-auto selection:bg-[#264f78]">
          {tool.command && (
            <div className="text-[#38bdf8] mb-1">
              <span className="text-[#666666] select-none">$ </span>
              {tool.command}
            </div>
          )}
          {tool.output ? (
            <div className="text-[#cccccc] whitespace-pre-wrap">{tool.output}</div>
          ) : (
            <div className="text-[#777777] italic">Tool execution completed successfully with 0 warnings.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolExecutionBadge;
