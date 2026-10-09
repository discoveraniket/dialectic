import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { sendChatMessageToGemini, DEFAULT_MODEL } from '../services/geminiService';

const STORAGE_KEY = 'dialectic_chat_messages_v1';
const MODEL_STORAGE_KEY = 'dialectic_selected_model_v1';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to restore chat messages from localStorage:', e);
    }
    return [];
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
        const finalText = await sendChatMessageToGemini(updatedHistory, {
          model: selectedModel,
          signal: controller.signal,
          onChunk: (_chunk, accumulated) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulated, status: 'streaming' }
                  : msg
              )
            );
          },
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: finalText, status: 'complete' }
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
    newChat,
    abort,
  };
}
