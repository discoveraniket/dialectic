import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { sendChatMessageToGemini, DEFAULT_MODEL } from '../services/geminiService';

const STORAGE_KEY = 'dialectic_chat_messages_v1';
const MODEL_STORAGE_KEY = 'dialectic_selected_model_v1';

const INITIAL_DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-user-demo-1',
    role: 'user',
    content:
      'I want to formulate a kinetic equation for enzyme transition states using sequence features. What is the fundamental relation for transition state theory?',
    timestamp: Date.now() - 60000,
    status: 'complete',
  },
  {
    id: 'msg-agent-demo-1',
    role: 'assistant',
    thinking:
      '1. Deconstructing kinetic parameters: k_cat relates directly to transition state free energy barrier ΔG‡ via Eyring-Polanyi equation.\n2. Flagging unexamined assumptions: Sequence embeddings predict ground state structures reliably, but transition states involve femtosecond vibrational modes.\n3. Identifying research bottleneck: Without structural or solvent coordinates, pure sequence predictions are statistical correlations rather than causal biophysics.',
    content:
      '### Transition State Epistemic Formulation\n\nUnder **Eyring-Polanyi Transition State Theory**, the catalytic rate constant $k_{cat}$ is fundamentally related to the free energy of activation $\\Delta G^{\\ddagger}$:\n\n$$k_{cat} = \\frac{k_B T}{h} \\exp\\left(-\\frac{\\Delta G^{\\ddagger}}{RT}\\right)$$\n\nWhere:\n- $k_B$ is the **Boltzmann constant**\n- $h$ is **Planck\'s constant**\n- $R$ is the universal gas constant\n- $T$ is absolute temperature\n\n### Socratic Probing\n1. How does your sequence model plan to account for **transition state stabilization** versus simple substrate ground-state binding affinity ($K_m$)?\n2. Have you isolated negative baseline controls to prevent memorization of homology families?',
    timestamp: Date.now() - 30000,
    status: 'complete',
    metrics: {
      ttftMs: 148,
      totalTimeMs: 1620,
      tokensPerSec: 54.3,
      contextTokens: 184,
      outputTokens: 290,
    },
  },
];

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to restore chat messages from localStorage:', e);
    }
    return INITIAL_DEMO_MESSAGES;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(MODEL_STORAGE_KEY);
      if (saved) return saved;
    } catch (e) {
      console.warn('Failed to restore selected model from localStorage:', e);
    }
    return DEFAULT_MODEL;
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync messages to localStorage whenever messages array updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat messages to localStorage:', e);
    }
  }, [messages]);

  // Sync selectedModel to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, selectedModel);
    } catch (e) {
      console.warn('Failed to save selected model to localStorage:', e);
    }
  }, [selectedModel]);

  // Clean up ongoing request on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessageId = `msg-user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const assistantMessageId = `msg-agent-${Date.now() + 1}-${Math.random().toString(36).slice(2, 7)}`;

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
        status: 'complete',
      };

      const assistantMessagePlaceholder: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'streaming',
      };

      const updatedHistory = [...messages, userMessage];
      setMessages([...updatedHistory, assistantMessagePlaceholder]);
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await sendChatMessageToGemini(updatedHistory, {
          model: selectedModel,
          signal: controller.signal,
          onChunk: (_chunk, parsed) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: parsed.content,
                      thinking: parsed.thinking,
                      metrics: parsed.metrics,
                      status: 'streaming',
                    }
                  : msg
              )
            );
          },
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: result.content,
                  thinking: result.thinking,
                  metrics: result.metrics,
                  status: 'complete',
                }
              : msg
          )
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, status: 'complete' }
                : msg
            )
          );
        } else {
          const errMsg = err instanceof Error ? err.message : String(err);
          setError(errMsg);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    status: 'error',
                    error: errMsg,
                    content: msg.content || 'Failed to generate response.',
                  }
                : msg
            )
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading, selectedModel]
  );

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const newChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove chat messages from localStorage:', e);
    }
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    selectedModel,
    setSelectedModel,
    sendMessage,
    deleteMessage,
    newChat,
    abort,
  };
}
