export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'idle' | 'sending' | 'executing' | 'streaming' | 'complete' | 'error';

export interface PerformanceMetrics {
  ttftMs?: number;        // Time To First Token in ms
  totalTimeMs?: number;   // Total generation duration in ms
  tokensPerSec?: number;  // Generation speed in tokens/sec
  contextTokens?: number; // Input prompt context size estimation
  outputTokens?: number;  // Generated output token count estimation
  totalTokens?: number;
}

export interface ContextPill {
  id: string;
  label: string;
  icon?: 'file' | 'claim' | 'paper' | 'tag';
}

export interface ToolStep {
  id: string;
  label: string;             // e.g. "terminal:esbuild", "search:pubmed"
  iconType: 'terminal' | 'search' | 'tool' | 'code' | 'bolt';
  durationText?: string;     // e.g. "Worked for 4m"
  status: 'completed' | 'running' | 'error';
  command?: string;
  output?: string;
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  text: string;
}

export interface StagedProposal {
  id: string;
  title: string;             // e.g. "Core Research Constraint"
  target?: string;           // e.g. "Project Dossier / Scope Boundaries"
  diffLines: DiffLine[];
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface UserTurn {
  id: string;
  kind: 'user';
  role?: 'user';
  prompt: string;
  content?: string;
  timestamp: number;
  contextPills?: ContextPill[];
  status?: MessageStatus;
  metrics?: PerformanceMetrics;
  error?: string;
}

export interface AgentTurn {
  id: string;
  kind: 'agent';
  role?: 'assistant';
  timestamp: number;
  status: MessageStatus;
  toolSteps?: ToolStep[];
  reasoning?: {
    thinking: string;
    durationText?: string;
  };
  thinking?: string;
  content: string;
  prompt?: string;
  proposals?: StagedProposal[];
  followUpChips?: string[];
  metrics?: PerformanceMetrics;
  error?: string;
}

export type TimelineTurn = UserTurn | AgentTurn;

// Unified message type providing seamless compatibility across legacy and agentic turns
export interface ChatMessage {
  id: string;
  kind?: 'user' | 'agent';
  role: MessageRole;
  prompt?: string;
  content: string;
  thinking?: string;
  timestamp: number;
  status?: MessageStatus;
  error?: string;
  metrics?: PerformanceMetrics;
  toolSteps?: ToolStep[];
  proposals?: StagedProposal[];
  followUpChips?: string[];
  contextPills?: ContextPill[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  turns: TimelineTurn[];
  messages?: ChatMessage[];
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
