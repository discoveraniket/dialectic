# Implementation Tasks: Dialectic Workbench UI (vscode.dev Modern UI Alignment)

## Phase 1: Workbench Shell Alignment (Completed)
- [x] Task 1.1: Update `TitleBar.tsx` to remove desktop window controls (`_ □ ✕`) and add web-friendly navigation controls (`☰` menu, `<` and `>` history buttons) matching `vscode.dev`.
- [x] Task 1.2: Update `App.tsx` initial state to keep the Bottom Panel closed by default on startup (`isBottomPanelOpen: false`).
- [x] Task 1.3: Update `StatusBar.tsx` to include the `vscode.dev` remote indicator badge (`><` Web indicator) on the far left.
- [x] Task 1.4: Update `PrimarySideBar.tsx` Explorer empty state to display the minimal layout with a single placeholder "New Project" button.
- [x] Task 1.5: Update `ActivityBar.tsx` and layout types to include the "Run & Debug" navigation item matching `vscode.dev`.
- [x] Task 1.6: Verify changes by compiling the project with `npm run build` and checking the complete workbench UI presentation.

## Phase 2: Visual Contrast & Dark Modern Polish (Completed)
- [x] Task 2.1: Update `StatusBar.tsx` to the Dark Modern theme (`bg-[#181818]`, `border-t border-[#2b2b2b]`, muted icons `#cccccc`, subtle remote indicator button).
- [x] Task 2.2: Refactor `WelcomePage.tsx` to remove the oversized hero header, collapse walkthrough cards by default, and streamline vertical padding and typography to match `vscode.dev` screenshot.
- [x] Task 2.3: Refactor `PrimarySideBar.tsx` Explorer to title-case `Explorer`, add `∨ No Folder Opened` collapsible accordion, and add styled `Open Folder`, `Open Recent`, `Connect to Tunnel...`, and `Open Remote Repository` actions.
- [x] Task 2.4: Refactor `SecondarySideBar.tsx` into the authentic `Chat` auxiliary panel with `+` `∨` `|` `✕` header, *"Research with Agent"* empty state, and modern prompt box.
- [x] Task 2.5: Standardize all borders and dividing lines across the workbench to `#2b2b2b` and verify dark background uniformity.
- [x] Task 2.6: Verification — Run `npm run build` and verify that the app visually matches the `vscode.dev` screenshot.

## Phase 3: vscode.dev Modern 3-Tile Layout Alignment (Completed)
- [x] Task 3.1: Update `App.tsx` layout shell to the 3-Tile architecture (Left Tile colocation of ActivityBar + Explorer, Center Tile, Right Tile, canvas `#1f1f1f`, `p-1 gap-1`, and inter-tile resizer sashes).
- [x] Task 3.2: Update `TitleBar.tsx` to `#1f1f1f` with `#2b2b2b` Command Center search box and monochrome layout toggle controls.
- [x] Task 3.3: Update `ActivityBar.tsx` and `PrimarySideBar.tsx` to `#181818` palette with internal hairline divider and borderless Explorer header.
- [x] Task 3.4: Update `EditorArea.tsx` tab strip to `#2b2b2b` inactive background and `#1f1f1f` seamless active tab blending with `#1f1f1f` editor canvas.
- [x] Task 3.5: Update `SecondarySideBar.tsx` (Chat) to `#181818` palette with borderless header and `StatusBar.tsx` to `#1f1f1f` palette.
- [x] Task 3.6: Verify implementation with `npm run build` and visual inspection against reference screenshot.

## Phase 4: Minor Layout & Divider Refinements (Completed)
- [x] Task 4.1: Update `TitleBar.tsx` to remove the bottom divider line (`border-b border-[#2b2b2b]`).
- [x] Task 4.2: Update `TitleBar.tsx` layout toggle controls to be free-standing individual buttons without an enclosing box.
- [x] Task 4.3: Update `EditorArea.tsx` tab strip so active tabs have smooth curved top corners (`rounded-t-md`).
- [x] Task 4.4: Update `App.tsx` inter-tile sashes to thin dividers with a vertical three-dot resize handle grip centered vertically.
- [x] Task 4.5: Update `StatusBar.tsx` to remove the top divider line (`border-t border-[#2b2b2b]`).
- [x] Task 4.6: Verification — Run `npm run build` and capture a screenshot with Edge to visually confirm all 5 refinements.
- [x] Task 4.7: Fix active tab to be flush with the top of Center Tile (remove pt-1 px-1 padding), borderless, full-height (h-full), with smooth rounded-tr-lg (and rounded-tl-lg on first tab) matching the vscode crop.
- [x] Task 4.8: Add smooth bottom-right concave fillet curve (scoop curve) to active tab in `EditorArea.tsx` matching vscode.dev reference.

## Phase 5: Right Chat Panel Alignment (Completed)
- [x] Task 5.1: Update Chat header tab in `SecondarySideBar.tsx` so "Chat" is enclosed in a separate rounded box (`bg-[#2b2b2b] text-white px-2.5 py-1 rounded-md text-xs font-medium`) matching vscode.
- [x] Task 5.2: Update Chat header action icons on the right side to `+ ∨ ... | [ ] ✕`, adding the Maximize button (`[ ]` corner brackets icon) with panel expand/restore functionality.
- [x] Task 5.3: Remove the dividing line (`border-t border-[#2b2b2b]`) between the prompt card container and the chat body in `SecondarySideBar.tsx`.
- [x] Task 5.4: Add an internal horizontal divider line (`border-b border-[#333333]`) between the tip banner and typing area inside the prompt card.
- [x] Task 5.5: Update the 4 bottom action buttons (`+` Add context, `Auto` Models, `⇄` Config, `↑` Send) to be free-standing and unboxed without separate background containers.
- [x] Task 5.6: Verification — Run `npm run build` and capture a screenshot with Edge to visually confirm all 5 chat panel refinements.

## Phase 6: Project Restructuring & Modular Decomposition (Architecture Preparation)
- [x] Task 6.1: Create directory structure (`src/components/chat/`, `src/services/`, `src/hooks/`) and establish domain types in `src/types/chat.ts`.
- [x] Task 6.2: Extract modular UI sub-components from `SecondarySideBar.tsx` into `src/components/chat/` (`ChatHeader.tsx`, `ChatEmptyState.tsx`, `ChatMessageItem.tsx`, `ChatMessageList.tsx`, `ChatPromptInput.tsx`, `ChatContainer.tsx`), strictly enforcing `<250 lines` rule.
- [x] Task 6.3: Refactor `SecondarySideBar.tsx` into a thin layout container hosting `ChatContainer`.
- [x] Task 6.4: Restructuring Verification — Run `npm run build` to confirm zero regression in layout, styling, and functionality before any feature logic is introduced.

## Phase 7: Functional Chat & Gemini Live Integration
- [x] Task 7.1: Configure `vite.config.ts` to bridge `process.env.GEMINI_API_KEY` into client environment, and create `.env.example` without exposing secrets.
- [x] Task 7.2: Implement `src/services/geminiService.ts` for live Google Gemini API calls, incorporating Socratic Inquisitor system instructions, model fallback, and robust error handling.
- [x] Task 7.3: Implement `src/hooks/useChat.ts` managing message state, loading lifecycle, abort controller, and `localStorage` persistence across browser reloads.
- [x] Task 7.4: Wire `useChat` into `ChatContainer`, enabling live message sending, interactive chat stream/response, and session reset.
- [x] Task 7.5: Verification — Run `npm run build` and verify end-to-end live conversational research dialogue with the Socratic agent.

## Phase 8: Quick Models Selector Popover
- [x] Task 8.1: Update `src/types/chat.ts` with quick model definitions (`gemini-3.1-flash-lite` [Default], `gemini-3.5-flash-lite`, `gemini-3.8-flash`).
- [x] Task 8.2: Update `src/services/geminiService.ts` and `src/hooks/useChat.ts` to set `gemini-3.1-flash-lite` as default and persist chosen model in `localStorage`.
- [x] Task 8.3: Implement `src/components/chat/ModelSelectorPopover.tsx` matching the reference UI (search input, active checkmark `✓`, divider, "Manage Models..." action, and outside-click handler).
- [x] Task 8.4: Wire `ModelSelectorPopover` into `ChatPromptInput.tsx` and `ChatContainer.tsx` with active button toggle styling.
- [x] Task 8.5: Verification — Run `npm run build` and verify model switcher presentation and behavior.

## Phase 9: Agentic Turn UI Polish (Collapsible Thinking, Markdown-LaTeX, Tile Actions & Performance Metrics)
- [x] Task 9.1: Update `src/types/chat.ts` with `PerformanceMetrics` type and enrich `ChatMessage` with `thinking` and `metrics`.
- [x] Task 9.2: Update `src/services/geminiService.ts` to support thinking blocks and telemetry, and update `src/hooks/useChat.ts` to track TTFT, tok/sec, context size, elapsed time, and message deletion.
- [x] Task 9.3: Implement `src/components/chat/ReasoningDisclosure.tsx` for collapsible thinking disclosure with duration tag.
- [x] Task 9.4: Implement `src/components/chat/PerformanceMetricsBar.tsx` rendering TTFT, tok/s, context size, and total time.
- [x] Task 9.5: Update `src/components/chat/ChatMessageItem.tsx` and list with copy/delete tile buttons, collapsible thinking, LaTeX/Markdown rendering, and performance metrics strip.
- [x] Task 9.6: Verification — Run `npm run build` and verify thinking disclosure, LaTeX math, copy/delete actions, and performance metrics.

## Phase 10: Specifications & Roadmap Synchronization (Current)
- [x] Task 10.1: Update `SPEC.md` and `TASKS.md` with the ground-up Agent Timeline architecture and roadmap.

## Phase 11: Domain Types & Initial Demo State
- [x] Task 11.1: Re-architect `src/types/chat.ts` with ground-up agentic timeline types (`TimelineTurn`, `UserTurn`, `AgentTurn`, `ToolStep`, `StagedProposal`, `ChatSession`).
- [x] Task 11.2: Update `src/hooks/useChat.ts` to manage sessions and preload the reference demo state (`Esbuild Terminal Process Identification`) and Dialectic Socratic dialogue.

## Phase 12: Top Header & History Session Switcher
- [x] Task 12.1: Update `src/components/chat/ChatHeader.tsx` to display dynamic thread title and modern utility buttons (`+`, `History` Clock icon, `...`, `✕`).
- [x] Task 12.2: Implement `src/components/chat/ChatHistoryDrawer.tsx` dropdown to switch between active sessions.

## Phase 13: Markdown Engine & Code Block Utility Bar
- [x] Task 13.1: Implement `src/components/chat/CodeBlockView.tsx` with top utility bar (language label, Terminal run button, `@` context button, Copy button).
- [x] Task 13.2: Redesign `src/utils/markdownRenderer.tsx` from scratch with inline code badges, bold section headings, hairline dividers, numbered steps, and KaTeX math.

## Phase 14: Tool Execution Badge & Epistemic Reasoning
- [x] Task 14.1: Implement `src/components/chat/ToolExecutionBadge.tsx` reproducing `[ >_ terminal:esbuild ]` and collapsible `Worked for 4m >`.
- [x] Task 14.2: Update `src/components/chat/ReasoningDisclosure.tsx` to match the minimal modern styling.

## Phase 15: Agent Turn, Staged Proposals & Follow-Up Chips
- [x] Task 15.1: Implement `src/components/chat/StagedProposalCard.tsx` with diff styling and `[✓ Accept into Dossier]` / `[✕ Reject]`.
- [x] Task 15.2: Implement `src/components/chat/SocraticInquiryGroup.tsx` with clickable follow-up inquiry pills.
- [x] Task 15.3: Implement `src/components/chat/AgentTurnItem.tsx` assembling tool pills, duration disclosure, markdown stream, proposals, chips, and telemetry.

## Phase 16: User Turn & Unboxed Timeline Stream Integration
- [x] Task 16.1: Implement `src/components/chat/UserTurnItem.tsx` with researcher avatar and context mention pills (`@claims`, `@vite.config.ts`).
- [x] Task 16.2: Implement `src/components/chat/AgentTimelineStream.tsx` as an unboxed open canvas stream.
- [x] Task 16.3: Update `src/components/chat/ChatPromptInput.tsx` and `src/components/chat/ChatContainer.tsx` to wire all components together seamlessly.

## Phase 17: Build Verification & Visual Audit
- [x] Task 17.1: Verify compilation with `npm run build` and visually audit against the reference screenshot.

## Phase 18: Thread Renaming & Full Center-Tile Maximization
- [x] Task 18.1: Update `src/hooks/useChat.ts` to support `renameSession(sessionId, newTitle)`.
- [x] Task 18.2: Implement inline thread title editing in `src/components/chat/ChatHeader.tsx` (edit icon, double-click, input, Enter/Escape/blur commit) and in `ChatHistoryDrawer.tsx`.
- [x] Task 18.3: Update `src/App.tsx` resize dragging constraints to allow unrestricted leftward expansion up to the Left Tile boundary, and make maximize collapse/hide Center Tile (Tile 2) so Chat (Tile 3) occupies the entire center-right area (`flex-1`).
- [x] Task 18.4: Add fine UI enhancements: sash double-click preset width toggle, More Actions (`...`) dropdown with "Export Thread as Markdown" and "Clear Messages", and floating scroll-to-bottom button.
- [x] Task 18.5: Verification — Run `npm run build` and verify thread renaming, free leftward expansion, and full center maximization.

## Phase 19: History Dropdown Polish & Sash Toggle Fixes
- [x] Task 19.1: Implement `deleteSession` in `src/hooks/useChat.ts` and pass to `ChatHistoryDrawer`.
- [x] Task 19.2: Convert Chat History into a compact dropdown anchored like the More Actions box with click-outside listener and proper sizing in `ChatHeader.tsx` and `ChatHistoryDrawer.tsx`.
- [x] Task 19.3: Fix sash double-click toggle in `src/App.tsx` with a reliable threshold between compact (320px) and half-screen width.
- [x] Task 19.4: Verification — Run `npm run build` and verify thread deletion, history dropdown close on outside click, and sash double-click toggle.

## Phase 20: Idea Crystallizer Agentic Engine (Solid Foundation)
- [x] Task 20.1: Define crystallization domain types in `src/types/agent.ts` (`ConceptCanvas`, `ToolDefinition`, `ToolResult`, `AgentLoopEvent`, `CrystallizedDocument`).
- [x] Task 20.2: Implement `src/agent/tools/registry.ts` with typed definitions and local executors for the 4 core tools:
  - `probe_assumptions`
  - `update_concept_canvas`
  - `propose_document_section`
  - `crystallize_document`
- [x] Task 20.3: Implement the ReAct agent loop in `src/agent/loop/agentLoop.ts` with guardrails (max iterations, timeout, structured event emissions).
- [x] Task 20.4: Update `src/services/geminiService.ts` to support tool calling declarations and function response cycles alongside thinking mode.
- [x] Task 20.5: Implement integration bridge hook `src/hooks/useAgent.ts` (or enhance `useChat.ts`) to stream tool steps, staged proposals, and follow-up chips into the chat timeline.
- [x] Task 20.6: Wire staged proposal approvals (`[✓ Accept into Dossier]` / `[✕ Reject]`) to update the active Concept Canvas and trigger live document synthesis into the editor area.
- [x] Task 20.7: Verification — Run `npm run build` and verify end-to-end idea crystallization flow (user enters vague concept -> agent probes -> canvas updates -> proposal staged -> user accepts -> document produced in editor).

## Phase 21: Socratic Diagnostic Q&A Form & Inquest Duality
- [x] Task 21.1: Extend `src/types/agent.ts` with `DiagnosticQuestion` interface and update `probe_assumptions` tool parameter schema to support structured diagnostic questions.
- [x] Task 21.2: Implement `src/components/chat/ActiveInquiryForm.tsx` as a docked questionnaire card above the prompt box with per-question inputs, submit, and dismiss controls.
- [x] Task 21.3: Wire `ActiveInquiryForm` into `ChatContainer.tsx` and `useAgent.ts`, formatting completed answers into the user response stream and executing the next agent turn.
- [x] Task 21.4: Retain the branch choice chip behavior in `SocraticInquiryGroup.tsx` so clicking branch chips populates the prompt box, while diagnostic questions render in the form.
- [x] Task 21.5: Verification — Run `npm run build` and test the questionnaire form flow manually.

## Phase 22: Agent Interaction Logger & Telemetry Panel (Freeze Elimination)
- [x] Task 22.1: Implement `src/agent/telemetry/logger.ts` with pub/sub event stream, log levels (`INFO`, `API`, `TOOL`, `WARN`, `ERROR`), and formatted text/markdown export.
- [x] Task 22.2: Instrument `geminiService.ts`, `agentLoop.ts`, and `registry.ts` to log every request payload, tool invocation, response event, and catch silent errors.
- [x] Task 22.3: Implement `src/components/layout/AgentTelemetryConsole.tsx` with log stream, level filters, expandable JSON details, and `[Copy All Logs]` / `[Clear]` controls.
- [x] Task 22.4: Integrate `AgentTelemetryConsole` into `BottomPanel.tsx` under the Output/Logs view, keeping the Chat toolbar minimal.
- [x] Task 22.5: Add freeze watchdog & fallback in `agentLoop.ts`: ensure failed or rejected tool calls emit explicit errors and reset streaming status rather than leaving an idle cursor.
- [x] Task 22.6: Verification — Run `npm run build` and verify that all agent actions stream into the Bottom Panel log viewer with working copy and clear actions.



