/**
 * Agent Hook: Coordinates the Idea Crystallizer ReAct Loop,
 * Concept Canvas state, Staged Proposals, and Document Crystallization.
 */

import { useState, useCallback, useRef } from 'react';
import { ConceptCanvas, CrystallizedDocument, DiagnosticQuestion } from '../types/agent';
import { StagedProposal, TimelineTurn, ChatMessage } from '../types/chat';
import { runCrystallizerAgentLoop } from '../agent/loop/agentLoop';
import { GeminiContentMessage } from '../services/geminiService';

const CANVAS_STORAGE_KEY = 'dialectic_concept_canvas_v1';

function createInitialCanvas(): ConceptCanvas {
  return {
    knownConstraints: [],
    openAmbiguities: [],
    nonGoals: [],
    status: 'drafting',
    lastUpdated: Date.now(),
  };
}

export interface UseAgentOptions {
  onDocumentCrystallized?: (doc: CrystallizedDocument) => void;
}

export function useAgent(options: UseAgentOptions = {}) {
  const [canvas, setCanvas] = useState<ConceptCanvas>(() => {
    try {
      const saved = localStorage.getItem(CANVAS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return createInitialCanvas();
  });

  const [proposals, setProposals] = useState<StagedProposal[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<DiagnosticQuestion[]>([]);
  const [crystallizedDoc, setCrystallizedDoc] = useState<CrystallizedDocument | null>(null);
  const [isAgentExecuting, setIsAgentExecuting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const saveCanvas = useCallback((next: ConceptCanvas) => {
    setCanvas(next);
    try {
      localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to persist canvas:', e);
    }
  }, []);

  const resetCanvas = useCallback(() => {
    const fresh = createInitialCanvas();
    saveCanvas(fresh);
    setProposals([]);
    setActiveQuestions([]);
    setCrystallizedDoc(null);
  }, [saveCanvas]);

  const dismissQuestions = useCallback(() => {
    setActiveQuestions([]);
  }, []);

  const handleAcceptProposal = useCallback(
    (proposalId: string) => {
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: 'accepted' } : p))
      );

      // Find proposal and update canvas
      const targetProposal = proposals.find((p) => p.id === proposalId);
      if (targetProposal) {
        const addedTexts = targetProposal.diffLines
          .filter((l) => l.type === 'add')
          .map((l) => l.text);

        const updatedCanvas: ConceptCanvas = {
          ...canvas,
          knownConstraints: [...canvas.knownConstraints, ...addedTexts],
          lastUpdated: Date.now(),
        };
        saveCanvas(updatedCanvas);
      }
    },
    [canvas, proposals, saveCanvas]
  );

  const handleRejectProposal = useCallback((proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' } : p))
    );
  }, []);

  const executeAgentTurn = useCallback(
    async (
      userPrompt: string,
      currentMessages: (ChatMessage | TimelineTurn)[],
      modelId: string,
      onUpdateAgentTurn: (updater: (prevTurn: ChatMessage) => ChatMessage) => void
    ) => {
      setIsAgentExecuting(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // Convert existing chat turns to Gemini transcript format
        const history: GeminiContentMessage[] = currentMessages
          .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content || m.prompt || '' }],
          }));

        await runCrystallizerAgentLoop(history, userPrompt, {
          apiKey: undefined,
          model: modelId,
          signal: controller.signal,
          canvas,
          proposals,
          onEvent: (event) => {
            switch (event.type) {
              case 'thinking':
                onUpdateAgentTurn((t) => ({ ...t, thinking: event.thinking }));
                break;

              case 'message_chunk':
                onUpdateAgentTurn((t) => ({
                  ...t,
                  content: (t.content ? t.content + '\n' : '') + event.text,
                }));
                break;

              case 'tool_call':
                onUpdateAgentTurn((t) => ({
                  ...t,
                  toolSteps: [...(t.toolSteps || []), event.toolStep],
                }));
                break;

              case 'tool_result':
                onUpdateAgentTurn((t) => ({
                  ...t,
                  toolSteps: (t.toolSteps || []).map((step) =>
                    step.id === event.toolStep.id ? event.toolStep : step
                  ),
                }));
                break;

              case 'canvas_updated':
                saveCanvas(event.canvas);
                break;

              case 'proposal_staged':
                setProposals((prev) => [...prev, event.proposal]);
                onUpdateAgentTurn((t) => ({
                  ...t,
                  proposals: [...(t.proposals || []), event.proposal],
                }));
                break;

              case 'follow_ups':
                onUpdateAgentTurn((t) => ({
                  ...t,
                  followUpChips: event.chips,
                }));
                break;

              case 'diagnostic_inquiry':
                setActiveQuestions(event.questions);
                break;

              case 'document_crystallized':
                setCrystallizedDoc(event.document);
                options.onDocumentCrystallized?.(event.document);
                break;

              case 'complete':
                onUpdateAgentTurn((t) => ({ ...t, status: 'complete' }));
                break;

              case 'error':
                onUpdateAgentTurn((t) => ({ ...t, status: 'error', error: event.error }));
                break;
            }
          },
        });
      } finally {
        setIsAgentExecuting(false);
        abortControllerRef.current = null;
      }
    },
    [canvas, proposals, saveCanvas, options]
  );

  return {
    canvas,
    proposals,
    activeQuestions,
    crystallizedDoc,
    isAgentExecuting,
    resetCanvas,
    dismissQuestions,
    handleAcceptProposal,
    handleRejectProposal,
    executeAgentTurn,
  };
}
