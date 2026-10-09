export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'streaming' | 'complete' | 'error';

export interface PerformanceMetrics {
  ttftMs?: number;        // Time To First Token in ms
  totalTimeMs?: number;   // Total generation duration in ms
  tokensPerSec?: number;  // Generation speed in tokens/sec
  contextTokens?: number; // Input prompt context size estimation
  outputTokens?: number;  // Generated output token count estimation
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  thinking?: string;
  timestamp: number;
  status?: MessageStatus;
  error?: string;
  metrics?: PerformanceMetrics;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface AIModelOption {
  id: string;
  name: string;
  provider: 'gemini' | 'mock';
  description?: string;
  isDefault?: boolean;
  tag?: string;
}

export const DEFAULT_MODEL_ID = 'gemini-3.1-flash-lite';

export const QUICK_MODELS: AIModelOption[] = [
  {
    id: 'auto',
    name: 'Auto',
    provider: 'gemini',
    description: 'Automatically routes to default research model',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'gemini-3.1-flash-lite',
    provider: 'gemini',
    isDefault: true,
    description: 'Default fast responsive research model',
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'gemini-3.5-flash-lite',
    provider: 'gemini',
    description: 'Balanced speed and synthesis depth',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'gemini-3.8-flash',
    provider: 'gemini',
    description: 'Advanced reasoning and hypothesis testing',
  },
];
