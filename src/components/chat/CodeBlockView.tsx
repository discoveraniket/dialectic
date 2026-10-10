import React, { useState } from 'react';
import { Terminal, AtSign, Copy, Check } from 'lucide-react';

interface CodeBlockViewProps {
  language?: string;
  code: string;
}

export const CodeBlockView: React.FC<CodeBlockViewProps> = ({
  language = 'bash',
  code,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-lg bg-[#141414] border border-[#262626] overflow-hidden text-xs">
      {/* Top Utility Bar (Language tag on left, Terminal + @ + Copy on right) */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#181818] border-b border-[#242424] text-[11px] text-[#858585] select-none">
        <span className="font-mono text-[#888888] lowercase">
          {language || 'code'}
        </span>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            title="Run in Terminal"
            className="hover:text-white transition-colors cursor-pointer p-0.5"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            title="Reference in Context (@)"
            className="hover:text-white transition-colors cursor-pointer p-0.5"
          >
            <AtSign className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy Code'}
            className="hover:text-white transition-colors cursor-pointer p-0.5"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Code Text Content */}
      <pre className="p-3 text-[11.5px] font-mono leading-relaxed text-[#d4d4d4] overflow-x-auto whitespace-pre selection:bg-[#264f78]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlockView;
