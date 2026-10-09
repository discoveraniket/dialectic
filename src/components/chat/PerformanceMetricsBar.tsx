import React from 'react';
import { PerformanceMetrics } from '../../types/chat';
import { Zap, Clock, Database, Gauge } from 'lucide-react';

interface PerformanceMetricsBarProps {
  metrics?: PerformanceMetrics;
}

export const PerformanceMetricsBar: React.FC<PerformanceMetricsBarProps> = ({ metrics }) => {
  if (!metrics || (!metrics.ttftMs && !metrics.totalTimeMs)) {
    return null;
  }

  const formatTokens = (tokens?: number) => {
    if (!tokens) return '0';
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
    return `${tokens}`;
  };

  const totalTimeFormatted = metrics.totalTimeMs
    ? `${(metrics.totalTimeMs / 1000).toFixed(1)}s`
    : undefined;

  return (
    <div className="pt-2 mt-2 border-t border-[#292929] flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#787878] font-mono select-none">
      {/* TTFT */}
      {metrics.ttftMs !== undefined && (
        <div className="flex items-center space-x-1" title="Time to first token">
          <Zap className="w-3 h-3 text-[#38bdf8]" />
          <span>ttft: {metrics.ttftMs}ms</span>
        </div>
      )}

      {/* Speed: tok/s */}
      {metrics.tokensPerSec !== undefined && metrics.tokensPerSec > 0 && (
        <div className="flex items-center space-x-1" title="Generation speed">
          <Gauge className="w-3 h-3 text-[#34d399]" />
          <span>{metrics.tokensPerSec} tok/s</span>
        </div>
      )}

      {/* Context Size */}
      {metrics.contextTokens !== undefined && (
        <div className="flex items-center space-x-1" title="Input context size">
          <Database className="w-3 h-3 text-[#a78bfa]" />
          <span>ctx: {formatTokens(metrics.contextTokens)}</span>
        </div>
      )}

      {/* Total Time */}
      {totalTimeFormatted && (
        <div className="flex items-center space-x-1" title="Total response time">
          <Clock className="w-3 h-3 text-[#f59e0b]" />
          <span>time: {totalTimeFormatted}</span>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsBar;
