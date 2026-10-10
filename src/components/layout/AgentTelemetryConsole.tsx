import React, { useState, useEffect, useRef } from 'react';
import { agentLogger, TelemetryLogEntry, LogLevel } from '../../agent/telemetry/logger';
import { Copy, Check, Trash2, ChevronRight, ChevronDown, Filter } from 'lucide-react';

export const AgentTelemetryConsole: React.FC = () => {
  const [logs, setLogs] = useState<TelemetryLogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [copied, setCopied] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = agentLogger.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyAll = () => {
    const text = agentLogger.exportAsText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    agentLogger.clear();
  };

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'ALL') return true;
    return log.level === filterLevel;
  });

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return 'bg-rose-950/60 text-rose-300 border-rose-800';
      case 'WARN':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      case 'TOOL':
        return 'bg-sky-950/60 text-sky-300 border-sky-800';
      case 'API':
        return 'bg-purple-950/60 text-purple-300 border-purple-800';
      case 'INFO':
      default:
        return 'bg-[#252525] text-[#aaaaaa] border-[#383838]';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#141414] font-mono text-xs overflow-hidden select-text">
      {/* Utility Controls Bar */}
      <div className="h-[28px] px-3 bg-[#1c1c1c] border-b border-[#2b2b2b] flex items-center justify-between flex-shrink-0 text-[11px] select-none">
        <div className="flex items-center space-x-2">
          <span className="text-[#888888] flex items-center space-x-1">
            <Filter className="w-3 h-3 text-[#666666]" />
            <span>Filter:</span>
          </span>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
            className="bg-[#242424] text-[#cccccc] border border-[#333333] rounded px-1.5 py-0.5 text-[11px] focus:outline-none"
          >
            <option value="ALL">ALL ({logs.length})</option>
            <option value="INFO">INFO</option>
            <option value="API">API</option>
            <option value="TOOL">TOOL</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyAll}
            title="Copy all interaction logs to clipboard"
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#252525] hover:bg-[#333333] text-[#cccccc] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy All Logs'}</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            title="Clear interaction logs"
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#252525] hover:bg-[#333333] text-[#888888] hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2.5 space-y-1 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-[#333333]"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#555555]">
            <span>No agent telemetry events recorded yet. Trigger an inquiry to view live execution logs.</span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            const hasDetails = log.details !== undefined && log.details !== null;

            return (
              <div
                key={log.id}
                className="group border border-transparent hover:border-[#2b2b2b] rounded px-1.5 py-0.5 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-[#555555] flex-shrink-0">{log.timeString}</span>
                  <span
                    className={`px-1 rounded text-[9px] font-semibold border flex-shrink-0 uppercase ${getLevelColor(
                      log.level
                    )}`}
                  >
                    {log.level}
                  </span>
                  <span className="text-[#888888] flex-shrink-0">[{log.source}]</span>
                  <span
                    className={`flex-1 ${
                      log.level === 'ERROR'
                        ? 'text-rose-400'
                        : log.level === 'WARN'
                        ? 'text-amber-400'
                        : log.level === 'TOOL'
                        ? 'text-sky-300'
                        : 'text-[#d4d4d4]'
                    }`}
                  >
                    {log.message}
                  </span>

                  {hasDetails && (
                    <button
                      type="button"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-[#666666] hover:text-[#cccccc] p-0.5 cursor-pointer"
                      title={isExpanded ? 'Collapse JSON' : 'Expand JSON payload'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Expanded Details / JSON Inspector */}
                {isExpanded && hasDetails && (
                  <div className="mt-1 ml-6 p-2 rounded bg-[#0e0e0e] border border-[#262626] text-[#9cdcfe] overflow-x-auto">
                    <pre className="text-[10px] leading-tight">
                      {typeof log.details === 'string'
                        ? log.details
                        : JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AgentTelemetryConsole;
