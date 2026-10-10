/**
 * Agent Interaction Logger & Telemetry Store.
 * Captures detailed event logs for every agent loop step, tool invocation,
 * API request/response cycle, and error.
 */

export type LogLevel = 'INFO' | 'API' | 'TOOL' | 'WARN' | 'ERROR';

export interface TelemetryLogEntry {
  id: string;
  timestamp: number;
  timeString: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: unknown;
}

type LogListener = (logs: TelemetryLogEntry[]) => void;

class AgentTelemetryLogger {
  private logs: TelemetryLogEntry[] = [];
  private listeners: Set<LogListener> = new Set();
  private maxLogs = 500;

  public log(level: LogLevel, source: string, message: string, details?: unknown) {
    const now = new Date();
    const timeString = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;

    const entry: TelemetryLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      timeString,
      level,
      source,
      message,
      details,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Mirror to browser console for easy inspection during dev
    const prefix = `[Dialectic::${source}][${level}]`;
    if (level === 'ERROR') {
      console.error(prefix, message, details ?? '');
    } else if (level === 'WARN') {
      console.warn(prefix, message, details ?? '');
    } else {
      console.log(prefix, message, details ?? '');
    }

    this.notify();
  }

  public info(source: string, message: string, details?: unknown) {
    this.log('INFO', source, message, details);
  }

  public api(source: string, message: string, details?: unknown) {
    this.log('API', source, message, details);
  }

  public tool(source: string, message: string, details?: unknown) {
    this.log('TOOL', source, message, details);
  }

  public warn(source: string, message: string, details?: unknown) {
    this.log('WARN', source, message, details);
  }

  public error(source: string, message: string, details?: unknown) {
    this.log('ERROR', source, message, details);
  }

  public getLogs(): TelemetryLogEntry[] {
    return [...this.logs];
  }

  public clear() {
    this.logs = [];
    this.notify();
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = [...this.logs];
    this.listeners.forEach((fn) => fn(copy));
  }

  public exportAsText(): string {
    return this.logs
      .map((l) => {
        const detailsStr = l.details ? `\n  Details: ${JSON.stringify(l.details, null, 2)}` : '';
        return `[${l.timeString}] [${l.level.padEnd(5)}] [${l.source}] ${l.message}${detailsStr}`;
      })
      .join('\n');
  }
}

export const agentLogger = new AgentTelemetryLogger();
