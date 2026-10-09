import { ChatMessage, DEFAULT_MODEL_ID } from '../types/chat';

export const SOCRATIC_SYSTEM_PROMPT = `You are Dialectic, an AI-augmented intellectual sparring partner and Socratic inquisitor for independent and early-stage researchers.

Core Philosophy & Tenets:
1. Dialectical Partner over Ghostwriter: You do not simply validate or flatter the researcher. You actively challenge weak reasoning, probe for unstated assumptions, and stress-test claims.
2. Structure from Ambiguity: Take vague, initial impulses and help the researcher decompose them into formal epistemic structures: Observations, Hypotheses, Constraints, and Falsifiable Predictions.
3. Asymmetric Agency (AI Proposes, Human Disposes): Frame ideas as proposals for the researcher to inspect, refine, or reject.
4. Rigorous Inquisitor: Do not hesitate to ask 2 to 3 sharp, high-leverage questions to expose edge cases, technical bottlenecks, compute limits, or methodology pitfalls.

Tone & Style:
- Intellectually rigorous, concise, analytical, and respectful.
- Use clear headings and structured bullet points.
- Conclude responses with actionable questions that drive the inquiry forward.`;

export interface SendMessageOptions {
  apiKey?: string;
  model?: string;
  signal?: AbortSignal;
  onChunk?: (chunk: string, fullText: string) => void;
}

export const getGeminiApiKey = (): string => {
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
};

export const DEFAULT_MODEL = DEFAULT_MODEL_ID;

export async function sendChatMessageToGemini(
  messages: ChatMessage[],
  options: SendMessageOptions = {}
): Promise<string> {
  const apiKey = options.apiKey || getGeminiApiKey();

  if (!apiKey) {
    throw new Error(
      'Gemini API key not found. Please provide GEMINI_API_KEY in your environment or .env file.'
    );
  }

  const rawModel = options.model || DEFAULT_MODEL;
  const model = rawModel === 'auto' ? DEFAULT_MODEL_ID : rawModel;

  // Format messages for Gemini API
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

  // Handle SSE streaming response
  if (!response.body) {
    throw new Error('No response body received from Gemini API');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

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
            if (options.onChunk) {
              options.onChunk(chunk, accumulatedText);
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

  return accumulatedText;
}
