import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, ChatSession, TimelineTurn } from '../types/chat';
import { sendChatMessageToGemini, DEFAULT_MODEL } from '../services/geminiService';

const SESSIONS_STORAGE_KEY = 'dialectic_chat_sessions_v3';
const ACTIVE_SESSION_STORAGE_KEY = 'dialectic_active_session_id_v3';
const MODEL_STORAGE_KEY = 'dialectic_selected_model_v1';

function createInitialSession(): ChatSession {
  return {
    id: `session-${Date.now()}`,
    title: 'New Session',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    turns: [],
  };
}

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to restore sessions:', e);
    }
    return [createInitialSession()];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (saved && sessions.some((s) => s.id === saved)) return saved;
    } catch {
      // fallback
    }
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages: ChatMessage[] = (activeSession?.turns || []) as unknown as ChatMessage[];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(MODEL_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return DEFAULT_MODEL;
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, activeSessionId);
    } catch (e) {
      console.warn('Failed to persist sessions:', e);
    }
  }, [sessions, activeSessionId]);

  const switchSession = useCallback((id: string) => {
    if (sessions.some((s) => s.id === id)) {
      setActiveSessionId(id);
    }
  }, [sessions]);

  const renameSession = useCallback((id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: trimmed, updatedAt: Date.now() } : s))
    );
  }, []);

  const clearCurrentSession = useCallback(() => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, turns: [], updatedAt: Date.now() } : s))
    );
    setError(null);
  }, [activeSessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userTurn: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        kind: 'user',
        role: 'user',
        prompt: trimmed,
        content: trimmed,
        timestamp: Date.now(),
        status: 'complete',
      };

      const agentPlaceholder: ChatMessage = {
        id: `msg-agent-${Date.now() + 1}`,
        kind: 'agent',
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'streaming',
      };

      // Auto-title session from first user message if it's currently "New Session"
      const isFirstMessage = (activeSession?.turns.length || 0) === 0;
      const computedTitle =
        isFirstMessage && activeSession?.title === 'New Session'
          ? trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '')
          : activeSession?.title || 'New Session';

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                title: computedTitle,
                updatedAt: Date.now(),
                turns: [
                  ...s.turns,
                  userTurn as unknown as TimelineTurn,
                  agentPlaceholder as unknown as TimelineTurn,
                ],
              }
            : s
        )
      );

      setIsLoading(true);
      setError(null);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const historyForApi = [...messages, userTurn];
        const result = await sendChatMessageToGemini(historyForApi, {
          model: selectedModel,
          signal: controller.signal,
          onChunk: (_chunk, parsed) => {
            setSessions((prev) =>
              prev.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      turns: s.turns.map((t) =>
                        t.id === agentPlaceholder.id
                          ? ({
                              ...t,
                              content: parsed.content,
                              thinking: parsed.thinking,
                              metrics: parsed.metrics,
                              status: 'streaming',
                            } as unknown as TimelineTurn)
                          : t
                      ),
                    }
                  : s
              )
            );
          },
        });

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  turns: s.turns.map((t) =>
                    t.id === agentPlaceholder.id
                      ? ({
                          ...t,
                          content: result.content,
                          thinking: result.thinking,
                          metrics: result.metrics,
                          status: 'complete',
                        } as unknown as TimelineTurn)
                      : t
                  ),
                }
              : s
          )
        );
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(errMsg);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [activeSession?.title, activeSession?.turns.length, activeSessionId, isLoading, messages, selectedModel]
  );

  const sendAgentMessage = useCallback(
    async (
      content: string,
      agentExecutor: (
        userPrompt: string,
        currentMessages: (ChatMessage | TimelineTurn)[],
        modelId: string,
        onUpdateAgentTurn: (updater: (prevTurn: ChatMessage) => ChatMessage) => void
      ) => Promise<void>
    ) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userTurn: ChatMessage = {
        id: `msg-user-${Date.now()}`,
        kind: 'user',
        role: 'user',
        prompt: trimmed,
        content: trimmed,
        timestamp: Date.now(),
        status: 'complete',
      };

      const agentPlaceholder: ChatMessage = {
        id: `msg-agent-${Date.now() + 1}`,
        kind: 'agent',
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'streaming',
      };

      const isFirstMessage = (activeSession?.turns.length || 0) === 0;
      const computedTitle =
        isFirstMessage && activeSession?.title === 'New Session'
          ? trimmed.slice(0, 36) + (trimmed.length > 36 ? '...' : '')
          : activeSession?.title || 'New Session';

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                title: computedTitle,
                updatedAt: Date.now(),
                turns: [
                  ...s.turns,
                  userTurn as unknown as TimelineTurn,
                  agentPlaceholder as unknown as TimelineTurn,
                ],
              }
            : s
        )
      );

      setIsLoading(true);
      setError(null);

      try {
        await agentExecutor(
          trimmed,
          [...messages, userTurn],
          selectedModel,
          (updater) => {
            setSessions((prev) =>
              prev.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      turns: s.turns.map((t) =>
                        t.id === agentPlaceholder.id
                          ? (updater(t as unknown as ChatMessage) as unknown as TimelineTurn)
                          : t
                      ),
                    }
                  : s
              )
            );
          }
        );
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [activeSession?.title, activeSession?.turns.length, activeSessionId, isLoading, messages, selectedModel]
  );

  const deleteMessage = useCallback(
    (id: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, turns: s.turns.filter((t) => t.id !== id) }
            : s
        )
      );
    },
    [activeSessionId]
  );

  const deleteSession = useCallback(
    (id: string) => {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length === 0) {
        const fresh = createInitialSession();
        setSessions([fresh]);
        setActiveSessionId(fresh.id);
      } else {
        setSessions(remaining);
        if (activeSessionId === id) {
          setActiveSessionId(remaining[0].id);
        }
      }
    },
    [sessions, activeSessionId]
  );

  const newChat = useCallback(() => {
    const newSession = createInitialSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    sessions,
    activeSessionId,
    activeSession,
    sessionTitle: activeSession?.title || 'New Session',
    messages,
    isLoading,
    error,
    selectedModel,
    setSelectedModel,
    switchSession,
    renameSession,
    clearCurrentSession,
    sendMessage,
    sendAgentMessage,
    deleteMessage,
    deleteSession,
    newChat,
  };
}
