/**
 * Tool definitions and execution handlers for Idea Crystallization.
 */

import {
  ConceptCanvas,
  CrystallizerToolName,
  ToolDefinition,
  ToolExecutionResult,
  CrystallizedDocument,
} from '../../types/agent';
import { StagedProposal, DiffLine } from '../../types/chat';

/**
 * Formal Tool Declarations formatted for Gemini Function Calling.
 */
export const CRYSTALLIZER_TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'probe_assumptions',
    description:
      'Examine user hypotheses and identify critical unstated assumptions, ambiguities, or methodology edge cases. Returns diagnostic questions for the user to answer and/or concise follow-up prompt chips.',
    parameters: {
      type: 'object',
      properties: {
        diagnosticQuestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Unique question key (e.g. "q_skills", "q_domain")' },
              question: { type: 'string', description: 'The direct diagnostic question to ask the user' },
              placeholder: { type: 'string', description: 'Helpful example input placeholder' },
              category: { type: 'string', description: 'Category: skills, domain, methodology, or constraints' },
            },
            required: ['id', 'question'],
          },
          description: '2 to 3 targeted calibration questions for the user to answer directly in an inline questionnaire card.',
        },
        followUpChips: {
          type: 'array',
          items: { type: 'string' },
          description: 'Concise follow-up branch choices (e.g. "[ Explore SABIO-RK ]") that populate the prompt box when clicked.',
        },
        analysis: {
          type: 'string',
          description: 'Brief summary of the uncovered blind spot or key reasoning vulnerability.',
        },
      },
      required: ['analysis'],
    },
  },
  {
    name: 'update_concept_canvas',
    description:
      'Update the persistent Concept Canvas representing the evolving mental model of the research idea (hypothesis, constraints, open ambiguities, non-goals).',
    parameters: {
      type: 'object',
      properties: {
        coreHypothesis: {
          type: 'string',
          description: 'Refined one-sentence statement of the core hypothesis or premise.',
        },
        targetAudience: {
          type: 'string',
          description: 'Primary beneficiaries, users, or academic domain.',
        },
        addKnownConstraints: {
          type: 'array',
          items: { type: 'string' },
          description: 'New technical, compute, or methodological constraints discovered.',
        },
        resolveAmbiguities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Previously open questions that have now been clarified and can be removed.',
        },
        addOpenAmbiguities: {
          type: 'array',
          items: { type: 'string' },
          description: 'New open questions or uncertainties that still need resolution.',
        },
        addNonGoals: {
          type: 'array',
          items: { type: 'string' },
          description: 'Items explicitly declared out of scope.',
        },
        status: {
          type: 'string',
          enum: ['drafting', 'crystallized'],
          description: 'Whether the idea is still drafting or has reached solid crystallized state.',
        },
      },
    },
  },
  {
    name: 'propose_document_section',
    description:
      'Stage a concrete proposed section or modification to the research dossier for user inspection and approval ("AI Proposes, Human Disposes").',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the proposal (e.g. "Primary Evaluation Metric" or "Core Scope Boundary").',
        },
        target: {
          type: 'string',
          description: 'Target document section (e.g. "Project Dossier / Scope Boundaries").',
        },
        additions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lines to add to the specification or dossier.',
        },
        removals: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lines to remove or supersede (if any).',
        },
        rationale: {
          type: 'string',
          description: 'Epistemic justification for why this section is being proposed.',
        },
      },
      required: ['title', 'additions'],
    },
  },
  {
    name: 'crystallize_document',
    description:
      'Compile the active Concept Canvas and accepted proposals into a cohesive, publication-ready research dossier or specification document.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Document title (e.g. "Research Specification: Epistemic Graph Retrieval").',
        },
        targetFileName: {
          type: 'string',
          description: 'Target filename (e.g. "SPEC.md" or "RESEARCH_DOSSIER.md").',
        },
        sections: {
          type: 'array',
          items: { type: 'object' },
          description: 'Ordered markdown sections composing the full crystallized document.',
        },
        summary: {
          type: 'string',
          description: 'Executive summary of the completed crystallization.',
        },
      },
      required: ['title', 'targetFileName'],
    },
  },
];

/**
 * Execution Context passed into tool handlers.
 */
export interface ToolExecutionContext {
  canvas: ConceptCanvas;
  proposals: StagedProposal[];
  onCanvasUpdate?: (updated: ConceptCanvas) => void;
  onProposalStage?: (proposal: StagedProposal) => void;
  onFollowUps?: (chips: string[]) => void;
  onDiagnosticInquiry?: (questions: Array<{ id: string; question: string; placeholder?: string; category?: string }>) => void;
  onDocumentCrystallize?: (doc: CrystallizedDocument) => void;
}

/**
 * Execute a recognized tool call locally against the application state.
 */
export function executeToolCall(
  callId: string,
  name: CrystallizerToolName | string,
  args: Record<string, unknown>,
  context: ToolExecutionContext
): ToolExecutionResult {
  try {
    switch (name) {
      case 'probe_assumptions': {
        const rawQuestions = (args.diagnosticQuestions as Array<Record<string, unknown>>) || [];
        const chips = (args.followUpChips as string[]) || [];
        const analysis = (args.analysis as string) || 'Identified exploratory branches.';

        // If the model passed questions inside followUpChips that look like questions, map them cleanly
        const parsedQuestions = rawQuestions.map((q, idx) => ({
          id: (q.id as string) || `q_${idx + 1}`,
          question: (q.question as string) || String(q),
          placeholder: (q.placeholder as string) || 'Type your answer...',
          category: (q.category as string) || 'inquiry',
        }));

        if (parsedQuestions.length > 0 && context.onDiagnosticInquiry) {
          context.onDiagnosticInquiry(parsedQuestions);
        }

        // Separate out non-question chips or remaining branch chips
        const remainingChips = chips.filter((c) => {
          // If it ends in ?, but no questions were parsed, treat as questions
          if (parsedQuestions.length === 0 && c.trim().endsWith('?')) {
            return false;
          }
          return true;
        });

        // Fallback: If model provided questions as chips array, convert them to diagnostic questions
        if (parsedQuestions.length === 0) {
          const extractedQuestions = chips
            .filter((c) => c.trim().endsWith('?'))
            .map((q, idx) => ({
              id: `q_${idx + 1}`,
              question: q,
              placeholder: 'Type your answer...',
              category: 'inquiry',
            }));
          if (extractedQuestions.length > 0 && context.onDiagnosticInquiry) {
            context.onDiagnosticInquiry(extractedQuestions);
          }
        }

        if (remainingChips.length > 0 && context.onFollowUps) {
          context.onFollowUps(remainingChips);
        }

        return {
          callId,
          toolName: name,
          success: true,
          result: {
            diagnosticQuestionsCount: parsedQuestions.length,
            chipsCount: remainingChips.length,
            analysis,
          },
        };
      }

      case 'update_concept_canvas': {
        const nextCanvas: ConceptCanvas = {
          ...context.canvas,
          coreHypothesis: (args.coreHypothesis as string) || context.canvas.coreHypothesis,
          targetAudience: (args.targetAudience as string) || context.canvas.targetAudience,
          knownConstraints: Array.from(
            new Set([
              ...context.canvas.knownConstraints,
              ...((args.addKnownConstraints as string[]) || []),
            ])
          ),
          openAmbiguities: Array.from(
            new Set([
              ...context.canvas.openAmbiguities.filter(
                (amb) => !((args.resolveAmbiguities as string[]) || []).includes(amb)
              ),
              ...((args.addOpenAmbiguities as string[]) || []),
            ])
          ),
          nonGoals: Array.from(
            new Set([...context.canvas.nonGoals, ...((args.addNonGoals as string[]) || [])])
          ),
          status: (args.status as 'drafting' | 'crystallized') || context.canvas.status,
          lastUpdated: Date.now(),
        };

        if (context.onCanvasUpdate) {
          context.onCanvasUpdate(nextCanvas);
        }

        return {
          callId,
          toolName: name,
          success: true,
          result: {
            updatedCanvas: nextCanvas,
          },
        };
      }

      case 'propose_document_section': {
        const title = (args.title as string) || 'Proposed Section';
        const target = (args.target as string) || 'Research Dossier';
        const additions = (args.additions as string[]) || [];
        const removals = (args.removals as string[]) || [];

        const diffLines: DiffLine[] = [
          ...removals.map((r) => ({ type: 'remove' as const, text: r })),
          ...additions.map((a) => ({ type: 'add' as const, text: a })),
        ];

        const proposal: StagedProposal = {
          id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title,
          target,
          diffLines,
          status: 'pending',
        };

        if (context.onProposalStage) {
          context.onProposalStage(proposal);
        }

        return {
          callId,
          toolName: name,
          success: true,
          result: {
            proposalId: proposal.id,
            status: 'staged_for_user_approval',
            diffCount: diffLines.length,
          },
        };
      }

      case 'crystallize_document': {
        const title = (args.title as string) || 'Research Specification';
        const targetFileName = (args.targetFileName as string) || 'SPEC.md';
        const summary = (args.summary as string) || '';

        // Build comprehensive markdown document
        const sectionsMarkdown = `
# ${title}

## Executive Summary
${summary || context.canvas.coreHypothesis || 'Document generated via Dialectic Crystallizer.'}

## Target Domain & Audience
${context.canvas.targetAudience || 'General Researchers / Engineers'}

## Core Hypothesis
${context.canvas.coreHypothesis || 'Hypothesis established during dialectic inquiry.'}

## Methodological & Technical Constraints
${context.canvas.knownConstraints.map((c) => `- ${c}`).join('\n') || '- None recorded'}

## Out-of-Scope (Non-Goals)
${context.canvas.nonGoals.map((ng) => `- ${ng}`).join('\n') || '- None recorded'}

## Status
- State: **Crystallized**
- Timestamp: ${new Date().toISOString()}
`.trim();

        const doc: CrystallizedDocument = {
          id: `doc-${Date.now()}`,
          title,
          markdownContent: sectionsMarkdown,
          targetFileName,
          createdAt: Date.now(),
        };

        if (context.onDocumentCrystallize) {
          context.onDocumentCrystallize(doc);
        }

        return {
          callId,
          toolName: name,
          success: true,
          result: {
            documentId: doc.id,
            targetFileName: doc.targetFileName,
            length: doc.markdownContent.length,
          },
        };
      }

      default:
        return {
          callId,
          toolName: String(name),
          success: false,
          result: {},
          error: `Unrecognized tool: ${String(name)}`,
        };
    }
  } catch (err: unknown) {
    return {
      callId,
      toolName: String(name),
      success: false,
      result: {},
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
