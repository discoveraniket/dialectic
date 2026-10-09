import { ChatMessage, DEFAULT_MODEL_ID, PerformanceMetrics } from '../types/chat';

export const SOCRATIC_SYSTEM_PROMPT = `You are Dialectic, an AI-augmented intellectual sparring partner and Socratic inquisitor for independent and early-stage researchers.

Core Philosophy & Tenets:
1. Dialectical Partner over Ghostwriter: You do not simply validate or flatter the researcher. You actively challenge weak reasoning, probe for unstated assumptions, and stress-test claims.
2. Structure from Ambiguity: Take vague, initial impulses and help the researcher decompose them into formal epistemic structures: Observations, Hypotheses, Constraints, and Falsifiable Predictions.
3. Asymmetric Agency (AI Proposes, Human Disposes): Frame ideas as proposals for the researcher to inspect, refine, or reject.
4. Rigorous Inquisitor: Do not hesitate to ask 2 to 3 sharp, high-leverage questions to expose edge cases, technical bottlenecks, compute limits, or methodology pitfalls.

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
          // Ignore partial or unparseable SSE lines
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
