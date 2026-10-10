/**
 * Multi-Turn ReAct Agent Loop for Idea Crystallization.
 * Coordinates between the LLM inference provider and the local Tool Registry.
 */

import {
  AgentLoopEvent,
  ConceptCanvas,
  CrystallizedDocument,
  ToolCallInvocation,
} from '../../types/agent';
import { StagedProposal, ToolStep } from '../../types/chat';
import {
  CRYSTALLIZER_TOOL_DEFINITIONS,
  executeToolCall,
  ToolExecutionContext,
} from '../tools/registry';
import {
  sendGeminiWithTools,
  GeminiContentMessage,
} from '../../services/geminiService';
import { agentLogger } from '../telemetry/logger';

export interface RunAgentLoopOptions {
  apiKey?: string;
  model?: string;
  signal?: AbortSignal;
  maxIterations?: number;
  canvas: ConceptCanvas;
  proposals: StagedProposal[];
  onEvent: (event: AgentLoopEvent) => void;
}

export interface AgentLoopResult {
  finalContent: string;
  thinking?: string;
  canvas: ConceptCanvas;
  proposals: StagedProposal[];
  crystallizedDoc?: CrystallizedDocument;
  toolSteps: ToolStep[];
  followUpChips?: string[];
  finishReason: 'completed' | 'max_iterations' | 'blocked' | 'aborted';
}

/**
 * Execute the iterative ReAct loop.
 */
export async function runCrystallizerAgentLoop(
  history: GeminiContentMessage[],
  userPrompt: string,
  options: RunAgentLoopOptions
): Promise<AgentLoopResult> {
  const maxIterations = options.maxIterations || 5;
  let activeCanvas = { ...options.canvas };
  let activeProposals = [...options.proposals];
  let crystallizedDoc: CrystallizedDocument | undefined;
  let followUpChips: string[] = [];
  const toolSteps: ToolStep[] = [];

  // Build the conversation transcript for multi-turn Gemini API
  const conversationMessages: GeminiContentMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: userPrompt }] },
  ];

  let accumulatedContent = '';
  let accumulatedThinking = '';

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    if (options.signal?.aborted) {
      options.onEvent({ type: 'error', error: 'Agent execution aborted by user.' });
      return {
        finalContent: accumulatedContent,
        thinking: accumulatedThinking,
        canvas: activeCanvas,
        proposals: activeProposals,
        crystallizedDoc,
        toolSteps,
        followUpChips,
        finishReason: 'aborted',
      };
    }

    agentLogger.info('agentLoop', `Starting loop iteration ${iteration}/${maxIterations}`);

    options.onEvent({
      type: 'step_start',
      stepIndex: iteration,
      maxSteps: maxIterations,
    });

    const executionContext: ToolExecutionContext = {
      canvas: activeCanvas,
      proposals: activeProposals,
      onCanvasUpdate: (updated) => {
        activeCanvas = updated;
        agentLogger.tool('agentLoop', 'Canvas state updated', updated);
        options.onEvent({ type: 'canvas_updated', canvas: updated });
      },
      onProposalStage: (prop) => {
        activeProposals.push(prop);
        agentLogger.tool('agentLoop', `Proposal staged: ${prop.title}`);
        options.onEvent({ type: 'proposal_staged', proposal: prop });
      },
      onFollowUps: (chips) => {
        followUpChips = chips;
        agentLogger.tool('agentLoop', `Follow-up branch chips received (${chips.length})`, chips);
        options.onEvent({ type: 'follow_ups', chips });
      },
      onDiagnosticInquiry: (questions) => {
        agentLogger.tool('agentLoop', `Diagnostic questions received (${questions.length})`, questions);
        options.onEvent({ type: 'diagnostic_inquiry', questions });
      },
      onDocumentCrystallize: (doc) => {
        crystallizedDoc = doc;
        agentLogger.tool('agentLoop', `Document crystallized: ${doc.targetFileName}`);
        options.onEvent({ type: 'document_crystallized', document: doc });
      },
    };

    let stepResponse;
    try {
      stepResponse = await sendGeminiWithTools({
        messages: conversationMessages,
        tools: CRYSTALLIZER_TOOL_DEFINITIONS,
        apiKey: options.apiKey,
        model: options.model,
        signal: options.signal,
        activeCanvas,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      agentLogger.error('agentLoop', `Iteration ${iteration} failed: ${errMsg}`);
      options.onEvent({ type: 'error', error: errMsg });
      return {
        finalContent: accumulatedContent,
        thinking: accumulatedThinking,
        canvas: activeCanvas,
        proposals: activeProposals,
        crystallizedDoc,
        toolSteps,
        followUpChips,
        finishReason: 'blocked',
      };
    }

    if (stepResponse.thinking) {
      accumulatedThinking += (accumulatedThinking ? '\n' : '') + stepResponse.thinking;
      options.onEvent({ type: 'thinking', thinking: accumulatedThinking });
    }

    if (stepResponse.content) {
      accumulatedContent += (accumulatedContent ? '\n' : '') + stepResponse.content;
      options.onEvent({ type: 'message_chunk', text: stepResponse.content });
    }

    // If the model did not call any tools, the response is final
    if (!stepResponse.toolCalls || stepResponse.toolCalls.length === 0) {
      agentLogger.info('agentLoop', `Iteration ${iteration} concluded with no tool calls. Loop complete.`);
      options.onEvent({ type: 'complete', finishReason: 'completed' });
      return {
        finalContent: accumulatedContent,
        thinking: accumulatedThinking,
        canvas: activeCanvas,
        proposals: activeProposals,
        crystallizedDoc,
        toolSteps,
        followUpChips,
        finishReason: 'completed',
      };
    }

    // Append model output with function calls to transcript, preserving exact thought_signatures
    const modelPartsToAppend = stepResponse.rawModelParts && stepResponse.rawModelParts.length > 0
      ? stepResponse.rawModelParts
      : [
          ...(stepResponse.content ? [{ text: stepResponse.content }] : []),
          ...stepResponse.toolCalls.map((tc) => ({
            functionCall: {
              name: tc.name,
              args: tc.args,
            },
          })),
        ];

    conversationMessages.push({
      role: 'model',
      parts: modelPartsToAppend,
    });

    // Execute each tool call and collect results
    const functionResponseParts = [];

    for (const toolCall of stepResponse.toolCalls) {
      agentLogger.tool('agentLoop', `Executing tool: ${toolCall.name}`, toolCall.args);

      const toolStep: ToolStep = {
        id: toolCall.id,
        label: mapToolToBadge(toolCall.name),
        iconType: mapToolToIcon(toolCall.name),
        status: 'running',
        command: JSON.stringify(toolCall.args),
      };

      toolSteps.push(toolStep);
      options.onEvent({
        type: 'tool_call',
        toolStep,
        invocation: toolCall as ToolCallInvocation,
      });

      const startTime = performance.now();
      const execResult = executeToolCall(
        toolCall.id,
        toolCall.name,
        toolCall.args,
        executionContext
      );
      const elapsed = Math.round(performance.now() - startTime);

      toolStep.status = execResult.success ? 'completed' : 'error';
      toolStep.durationText = `${elapsed}ms`;
      toolStep.output = JSON.stringify(execResult.result);

      agentLogger.tool('agentLoop', `Tool finished: ${toolCall.name} in ${elapsed}ms`, execResult.result);

      options.onEvent({
        type: 'tool_result',
        toolStep,
        result: execResult,
      });

      functionResponseParts.push({
        functionResponse: {
          name: toolCall.name,
          response: execResult.result,
        },
      });
    }

    // Feed tool results back into the conversation for the next model iteration
    conversationMessages.push({
      role: 'user',
      parts: functionResponseParts,
    });
  }

  options.onEvent({ type: 'complete', finishReason: 'max_iterations' });
  return {
    finalContent: accumulatedContent,
    thinking: accumulatedThinking,
    canvas: activeCanvas,
    proposals: activeProposals,
    crystallizedDoc,
    toolSteps,
    followUpChips,
    finishReason: 'max_iterations',
  };
}

function mapToolToBadge(name: string): string {
  switch (name) {
    case 'probe_assumptions':
      return 'spar:probe_assumptions';
    case 'update_concept_canvas':
      return 'canvas:update_state';
    case 'propose_document_section':
      return 'stage:propose_section';
    case 'crystallize_document':
      return 'dossier:crystallize';
    default:
      return `tool:${name}`;
  }
}

function mapToolToIcon(name: string): ToolStep['iconType'] {
  switch (name) {
    case 'probe_assumptions':
      return 'bolt';
    case 'update_concept_canvas':
      return 'tool';
    case 'propose_document_section':
      return 'code';
    case 'crystallize_document':
      return 'terminal';
    default:
      return 'tool';
  }
}
