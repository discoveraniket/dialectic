/**
 * Core domain types for the Dialectic Idea Crystallizer Agentic Engine.
 * Provides strict typing for the Concept Canvas, Tool System,
 * ReAct Agent Loop events, and synthesized documents.
 */

import type { StagedProposal, ToolStep } from './chat';

/**
 * Structured epistemic canvas tracking the evolving state of a research idea.
 */
export interface ConceptCanvas {
  /** The central premise or core value proposition */
  coreHypothesis?: string;
  /** Primary beneficiaries, personas, or target domain */
  targetAudience?: string;
  /** Hard technical, methodological, or operational constraints */
  knownConstraints: string[];
  /** Open questions, blind spots, or unresolved ambiguities */
  openAmbiguities: string[];
  /** Explicitly excluded scope or anti-features */
  nonGoals: string[];
  /** Progression status of the canvas */
  status: 'drafting' | 'crystallized';
  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * Supported core tool names for Idea Crystallization.
 */
export type CrystallizerToolName =
  | 'probe_assumptions'
  | 'update_concept_canvas'
  | 'propose_document_section'
  | 'crystallize_document';

/**
 * Parameter definition for tools, matching the JSON Schema format
 * required by LLM Function Calling (e.g., Google Gemini).
 */
export interface ToolPropertyDef {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  items?: {
    type: 'string' | 'number' | 'boolean' | 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  enum?: string[];
  properties?: Record<string, unknown>;
}

export interface ToolParameterSchema {
  type: 'object';
  properties: Record<string, ToolPropertyDef>;
  required?: string[];
}

/**
 * Definition of an agent tool for model declaration.
 */
export interface ToolDefinition {
  name: CrystallizerToolName | string;
  description: string;
  parameters: ToolParameterSchema;
}

/**
 * An invocation emitted by the LLM during reasoning.
 */
export interface ToolCallInvocation {
  id: string;
  name: CrystallizerToolName | string;
  args: Record<string, unknown>;
}

/**
 * Output returned from executing a tool.
 */
export interface ToolExecutionResult {
  callId: string;
  toolName: string;
  success: boolean;
  result: Record<string, unknown>;
  error?: string;
}

/**
 * Discrete question for user calibration.
 */
export interface DiagnosticQuestion {
  id: string;
  question: string;
  placeholder?: string;
  category?: string;
}

/**
 * Discrete events streamed by the ReAct Agent Loop during execution.
 */
export type AgentLoopEvent =
  | { type: 'step_start'; stepIndex: number; maxSteps: number }
  | { type: 'thinking'; thinking: string }
  | { type: 'tool_call'; toolStep: ToolStep; invocation: ToolCallInvocation }
  | { type: 'tool_result'; toolStep: ToolStep; result: ToolExecutionResult }
  | { type: 'canvas_updated'; canvas: ConceptCanvas }
  | { type: 'proposal_staged'; proposal: StagedProposal }
  | { type: 'follow_ups'; chips: string[] }
  | { type: 'diagnostic_inquiry'; questions: DiagnosticQuestion[] }
  | { type: 'message_chunk'; text: string }
  | { type: 'document_crystallized'; document: CrystallizedDocument }
  | { type: 'complete'; finishReason: 'completed' | 'max_iterations' | 'blocked' }
  | { type: 'error'; error: string };

/**
 * Output document produced once an idea reaches crystallization.
 */
export interface CrystallizedDocument {
  id: string;
  title: string;
  markdownContent: string;
  targetFileName: string; // e.g. "SPEC.md" or "RESEARCH_DOSSIER.md"
  createdAt: number;
}
