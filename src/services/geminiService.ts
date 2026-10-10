import { ChatMessage, DEFAULT_MODEL_ID, PerformanceMetrics } from '../types/chat';
import { ConceptCanvas, ToolDefinition } from '../types/agent';
import { agentLogger } from '../agent/telemetry/logger';

export const SOCRATIC_SYSTEM_PROMPT = `You are Dialectic, an AI-augmented intellectual sparring partner and Socratic inquisitor for independent and early-stage researchers.

Core Philosophy & Tenets:
1. Dialectical Partner over Ghostwriter: You do not simply validate or flatter the researcher. You actively challenge weak reasoning, probe for unstated assumptions, and stress-test claims.
2. Structure from Ambiguity: Take vague, initial impulses and help the researcher decompose them into formal epistemic structures: Observations, Hypotheses, Constraints, and Falsifiable Predictions.
3. Asymmetric Agency (AI Proposes, Human Disposes): When refining an idea, use the provided tools to stage concrete proposals, probe assumptions, and maintain the Concept Canvas.
4. Active Tool Use:
   - When the user expresses an initial vague concept or claims, call 'probe_assumptions' to surface blind spots.
   - When an assumption or constraint is established, call 'update_concept_canvas' to persist it into working memory.
   - When proposing a concrete section, call 'propose_document_section' so the user can inspect diffs and accept/reject them.
   - When the idea is mature, call 'crystallize_document' to compile the complete research document.

Reasoning & Epistemic Scrutiny:
Before your final answer, you may wrap your preliminary reasoning, assumption checks, and constraint analysis inside a <thought>...</thought> block. Always present your final structured response outside the <thought> block.

Formatting:
- Intellectually rigorous, concise, analytical, and respectful.
- Use clear markdown headings and bullet points.
- Support standard LaTeX math notation for equations (inline $...$ and display $$...$$).
- Conclude responses with pointed questions that drive the inquiry forward.`;

export interface ParsedStreamChunk {
  thinking?: string;
  content: string;
  metrics: PerformanceMetrics;
}

export interface SendMessageOptions {
  apiKey?: string;
  model?: string;
  signal?: AbortSignal;
  onChunk?: (chunk: string, parsed: ParsedStreamChunk) => void;
}

export interface GeminiContentPart {
  text?: string;
  thought_signature?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
    thought_signature?: string;
  };
  functionResponse?: {
    name: string;
    response: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export interface GeminiContentMessage {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
}

export interface SendGeminiWithToolsOptions {
  messages: GeminiContentMessage[];
  tools?: ToolDefinition[];
  apiKey?: string;
  model?: string;
  signal?: AbortSignal;
  activeCanvas?: ConceptCanvas;
}

export interface GeminiWithToolsResult {
  content: string;
  thinking?: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    args: Record<string, unknown>;
  }>;
  /** Complete raw parts exactly as returned by Gemini, preserving thought_signature */
  rawModelParts?: GeminiContentPart[];
}

export const getGeminiApiKey = (): string => {
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
};

export const DEFAULT_MODEL = DEFAULT_MODEL_ID;

export function parseThinkingAndContent(rawText: string): { thinking?: string; content: string } {
  const thoughtMatch = rawText.match(/<thought>([\s\S]*?)<\/thought>/i);
  if (thoughtMatch) {
    const thinking = thoughtMatch[1].trim();
    const content = rawText.replace(/<thought>[\s\S]*?<\/thought>/i, '').trim();
    return { thinking, content };
  }

  // Handle unclosed <thought> during live streaming
  const openThoughtMatch = rawText.match(/<thought>([\s\S]*)$/i);
  if (openThoughtMatch) {
    return {
      thinking: openThoughtMatch[1].trim(),
      content: '',
    };
  }

  return { content: rawText };
}

/**
 * Standard Chat Streaming (used for classic conversational interactions)
 */
export async function sendChatMessageToGemini(
  messages: ChatMessage[],
  options: SendMessageOptions = {}
): Promise<{ content: string; thinking?: string; metrics: PerformanceMetrics }> {
  const apiKey = options.apiKey || getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'Gemini API key not found. Please provide GEMINI_API_KEY in your environment or .env file.'
    );
  }

  const rawModel = options.model || DEFAULT_MODEL;
  const model = rawModel === 'auto' ? DEFAULT_MODEL_ID : rawModel;

  const contents = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

  const payload = {
    system_instruction: {
      parts: [{ text: SOCRATIC_SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const startTime = performance.now();
  let ttftMs: number | undefined;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    throw new Error(`Network error connecting to Gemini API: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || response.statusText;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(`Gemini API Error (${response.status}): ${errorDetail}`);
  }

  if (!response.body) {
    throw new Error('No response body received from Gemini API');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedText = '';
  let buffer = '';

  const contextTokens = Math.round(
    messages.reduce((acc, m) => acc + (m.content ? m.content.length : 0), 0) / 4
  );

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (ttftMs === undefined) {
        ttftMs = Math.round(performance.now() - startTime);
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(dataStr);
          const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunk) {
            accumulatedText += chunk;
            const parsedChunk = parseThinkingAndContent(accumulatedText);
            const currentDurationMs = Math.round(performance.now() - startTime);
            const outputTokens = Math.round(accumulatedText.length / 4);
            const tokensPerSec =
              currentDurationMs > 0 ? Math.round((outputTokens / (currentDurationMs / 1000)) * 10) / 10 : 0;

            if (options.onChunk) {
              options.onChunk(chunk, {
                thinking: parsedChunk.thinking,
                content: parsedChunk.content,
                metrics: {
                  ttftMs,
                  totalTimeMs: currentDurationMs,
                  tokensPerSec,
                  contextTokens,
                  outputTokens,
                },
              });
            }
          }
        } catch {
          // Ignore partial SSE lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  const totalTimeMs = Math.round(performance.now() - startTime);
  const outputTokens = Math.round(accumulatedText.length / 4);
  const tokensPerSec =
    totalTimeMs > 0 ? Math.round((outputTokens / (totalTimeMs / 1000)) * 10) / 10 : 0;

  const finalParsed = parseThinkingAndContent(accumulatedText);

  return {
    content: finalParsed.content || accumulatedText,
    thinking: finalParsed.thinking,
    metrics: {
      ttftMs: ttftMs || totalTimeMs,
      totalTimeMs,
      tokensPerSec,
      contextTokens,
      outputTokens,
    },
  };
}

/**
 * Executes a function-calling enabled step with Google Gemini for the Agent Loop.
 */
export async function sendGeminiWithTools(
  options: SendGeminiWithToolsOptions
): Promise<GeminiWithToolsResult> {
  const apiKey = options.apiKey || getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'Gemini API key not found. Please configure GEMINI_API_KEY in your environment.'
    );
  }

  const rawModel = options.model || DEFAULT_MODEL;
  const model = rawModel === 'auto' ? DEFAULT_MODEL_ID : rawModel;

  // Build tools declaration
  const toolsPayload =
    options.tools && options.tools.length > 0
      ? [
          {
            function_declarations: options.tools.map((t) => ({
              name: t.name,
              description: t.description,
              parameters: t.parameters,
            })),
          },
        ]
      : undefined;

  // Augment system prompt with current canvas state if present
  let systemText = SOCRATIC_SYSTEM_PROMPT;
  if (options.activeCanvas) {
    systemText += `\n\nCURRENT CONCEPT CANVAS STATE:\n${JSON.stringify(options.activeCanvas, null, 2)}`;
  }

  const payload: Record<string, unknown> = {
    system_instruction: {
      parts: [{ text: systemText }],
    },
    contents: options.messages,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 2048,
    },
  };

  if (toolsPayload) {
    payload.tools = toolsPayload;
  }

  agentLogger.api('geminiService', `Sending request to Gemini (${model})`, {
    messageCount: options.messages.length,
    toolsProvided: options.tools?.map((t) => t.name),
  });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      agentLogger.warn('geminiService', 'Request aborted by user');
      throw err;
    }
    const errMsg = `Network error calling Gemini: ${err instanceof Error ? err.message : String(err)}`;
    agentLogger.error('geminiService', errMsg);
    throw new Error(errMsg);
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error?.message || response.statusText;
    } catch {
      errorDetail = response.statusText;
    }
    const errorMsg = `Gemini API Error (${response.status}): ${errorDetail}`;
    agentLogger.error('geminiService', errorMsg, { status: response.status, errorDetail });
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const parts: GeminiContentPart[] = candidate?.content?.parts || [];

  let rawText = '';
  const toolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }> = [];

  for (const part of parts) {
    if (part.text) {
      rawText += part.text;
    }
    if (part.functionCall) {
      toolCalls.push({
        id: `call-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: part.functionCall.name,
        args: part.functionCall.args || {},
      });
    }
  }

  const parsed = parseThinkingAndContent(rawText);

  agentLogger.api('geminiService', `Received response from Gemini`, {
    hasText: Boolean(parsed.content),
    toolCallsCount: toolCalls.length,
    toolCallNames: toolCalls.map((tc) => tc.name),
  });

  return {
    content: parsed.content,
    thinking: parsed.thinking,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    rawModelParts: parts,
  };
}
