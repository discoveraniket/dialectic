# Product Specification: Dialectic Workbench UI (vscode.dev Modern UI 3-Tile Architecture)

## 1. Product Summary
Dialectic is an AI-augmented research workspace with a web-first IDE interface. This specification defines the visual alignment of the workbench shell with **Visual Studio Code for the Web (`https://vscode.dev`) Modern UI (3-Tile Floating Layout)**, featuring distinct rounded floating tiles for the unified left sidebar, center editor area, and right auxiliary chat panel, unified dark modern palette, and clean divider lines.

## 2. Target User
Researchers, developers, and knowledge workers seeking the modern IDE layout found on the official `vscode.dev` web experience.

## 3. Modern UI 3-Tile Architecture
- **Workbench Canvas (Backdrop)**:
  - Dark backdrop background: `#1f1f1f`.
  - Outer margins: `p-1` (4px). Thin inter-tile gap with center vertical three-dot resize handle.
- **Part Title Bar (`header`)**:
  - Height: `35px`, background: `#1f1f1f`, **no bottom divider line** (flows seamlessly into canvas).
  - App logo mark on far left, navigation history `<` `>` next to centered Command Center search bar (`bg-[#2b2b2b] border-[#3c3c3c]`).
  - Layout toggle controls on right: **free-standing individual icon buttons without an enclosing box container**.
- **Tile 1: Unified Left Tile (`rounded-lg border border-[#2b2b2b] bg-[#181818] overflow-hidden`)**:
  - Contains **both** Activity Bar and Primary Side Bar (Explorer) inside the same rounded card container.
  - Sub-part Activity Bar (`aside`): Width `48px`, `bg-transparent` / `#181818`, subtle internal divider `border-r border-[#2b2b2b]`. Hamburger menu `☰` at top, tool navigation icons, Accounts and Settings at bottom.
  - Sub-part Primary Side Bar (Explorer): `bg-[#181818]`, borderless header (no bottom underline), `∨ No Folder Opened` with styled action buttons, `> Outline`, `> Timeline`.
  - Sidebar Collapse: When Primary Sidebar is toggled closed, Left Tile collapses to slim Activity Bar (48px wide); double-toggle completely hides the tile.
- **Tile 2: Center Tile (Editor Area + Docked Bottom Panel)**:
  - Container: `rounded-lg border border-[#2b2b2b] bg-[#1f1f1f] overflow-hidden flex flex-col`.
  - Embedded tab strip at top: Inactive background `#2b2b2b`, active tab `#1f1f1f` **flush with the top edge (no top/left gap of #2b2b2b), full height (`h-full`), borderless, with smooth convex curved top-right corner (`rounded-tr-[8px]`), top-left corner (`rounded-tl-[8px]` for first tab), and bottom-right concave fillet curve (scoop)**, seamlessly merging into `#1f1f1f` editor canvas below without a bottom border line.
  - Editor Canvas: `#1f1f1f` hosting Welcome landing page or code buffers.
  - Bottom Panel: When opened (`Ctrl+J`), docks inside the bottom of the Center Tile with a horizontal sash resizer, maintaining the Center Tile's outer rounded border.
- **Tile 3: Right Tile (Auxiliary Bar / Modern Agent Timeline)**:
  - Container: `rounded-lg border border-[#2b2b2b] bg-[#181818] overflow-hidden flex flex-col`.
  - Open by default on application launch (`isSecondarySidebarOpen = true`).
  - **Leftward Expansion & Full Center Maximization**:
    - **Free Leftward Expansion**: No arbitrary 700px width limit. Resizer sash can be dragged freely to the left until reaching the Left Tile boundary.
    - **Full Center Maximization**: When maximized via `[ ]` button or shortcut, Tile 2 (Center Tile / Editor Area) is hidden, and Tile 3 (Chat) expands to fill the entire remaining workspace (`flex-1`) directly adjacent to Tile 1 (Left Tile). Toggling restore unhides the Center Tile and returns Chat to its previous customized width.
  - **Header (Modern Agent Top Bar)**:
    - Left: Dynamic Active Session / Thread Title with **inline thread renaming** (double-click or edit icon triggers an inline editing input; commits on Enter or blur, cancels on Escape).
    - Right: Free-standing unboxed action buttons: `+` (New Thread), `History` (Clock icon for thread drawer), `...` (More Actions: Export as Markdown, Clear Messages), Maximize `[ ]` (Full Center expansion), and `✕` (Close Panel).
  - **Action Timeline Stream (Unboxed Continuous Canvas)**:
    - Zero alternating bubble boxes (`ml-4` / `mr-2` borders removed). Continuous flow on `#181818` canvas.
    - **User Turn**:
      - Researcher identity (`You`) + timestamp.
      - Prompt text with optional context mention pills (`@claims`, `@papers`, `@files`).
    - **Agent Turn (Execution Timeline)**:
      - **Tool Execution Step Pill**: Rounded badge `[ >_ terminal:esbuild ]` (`bg-[#222222] border border-[#303030] rounded-md px-2.5 py-1 text-xs font-mono text-[#d4d4d4]`).
      - **Duration Disclosure**: Collapsible summary `Worked for 4m >` or `Thought for 1.8s >` directly beneath tool pill.
      - **Reasoning Drawer**: Collapsible epistemic chain-of-thought analysis.
      - **Structured Typography**: Crisp bold headings (`### Cause of the Error`, `### Actions Taken`), hairline horizontal dividers (`<hr>` / `border-b border-[#2d2d2d]`), and inline code badge pills (`^4.3.3`, `@tailwindcss/vite`, `vite.config.ts`).
      - **Code Block Utility Bar**: Rounded dark card (`bg-[#141414] border border-[#262626] rounded-lg`) with top utility bar: language badge (`bash`) on left; Terminal run, Context mention `@`, and Copy buttons on right.
      - **Staged Proposal Cards ("AI Proposes, Human Disposes")**: Interactive pull-request style card with diff additions (`+`) / subtractions (`-`) and `[✓ Accept into Dossier]` / `[✕ Reject]` action buttons.
      - **Socratic Probing Follow-Up Chips**: Clickable follow-up inquiry pills (`[ Focus on SABIO-RK ]`, `[ Explore Falsifiability ]`) that populate prompt input.
      - **Telemetry Strip**: Subtle metadata bar (TTFT, tok/s, context tokens, total time).
  - **Bottom Floating Prompt Card**:
    - Floating prompt card at the bottom: **No dividing line** between prompt container and stream.
    - Prompt card (`rounded-lg bg-[#252525] border border-[#383838] focus-within:border-[#007acc]`):
      - Text input area with "Write your thoughts" placeholder.
      - Bottom action controls: **4 free-standing, unboxed buttons**:
        1. `+` (Add Context)
        2. `Auto` (Model selector with popover)
        3. `⇄` (Configuration / Settings)
        4. `↑` (Send prompt)
- **Part Status Bar (`footer`)**:
  - Height: `22px`, background: `#1f1f1f`, **no top divider line** (flows seamlessly from canvas).
  - Remote indicator badge (`>< Web`) on far left, diagnostic counters, keyboard layout, and notifications on right.

## 4. Dividers and Resizer Sashes
- Inter-tile divider gaps are thin (`w-[4px]` or `w-1`), containing a subtle vertical three-dot resize handle indicator in the vertical center. Highlights with `#0078d4` line during active drag/hover.
- Horizontal sash sits between the editor canvas and the docked bottom panel inside the Center Tile.

## 5. Functional Chat & Socratic Inquisitor Architecture
- **Inference Engine**:
  - Live LLM calls via Google Gemini API using `GEMINI_API_KEY` configured in the environment.
  - Quick Models selection with `gemini-3.1-flash-lite` as the default model:
    - `gemini-3.1-flash-lite` [Default]
    - `gemini-3.5-flash-lite`
    - `gemini-3.8-flash`
  - Model Selector Popover matching VS Code style:
    - Anchored above model button in the prompt card.
    - Search input (`Search models`).
    - Model list with active checkmark `✓`.
    - Internal divider line and `Manage Models...` action item.
  - Streaming or dynamic response delivery with robust error handling and loading indicators.
  - **Collapsible Thinking Disclosure**:
    - Surfaces internal reasoning/chain-of-thought in an expandable drawer above the agent output.
    - Features duration indicator (e.g. `Thought for 1.4s ▾`) and defaults to collapsed.
  - **Formatted Markdown & LaTeX Rendering**:
    - Rich formatting for headings, bullet points, and code blocks.
    - Mathematical notation support for research equations (inline `$...$` and display `$$...$$`).
  - **Message Tile Actions**:
    - Individual copy button (copies raw text) and delete button (removes message from session).
  - **Performance Metrics Bar (Agent Replies)**:
    - Displayed directly below assistant messages in a subtle metadata strip:
      - `TTFT` (Time To First Token in ms).
      - `tok/s` (Generation speed in tokens per second).
      - `Context size` (Input context tokens).
      - `Total time` (Overall duration in seconds).
- **Agent Persona (Socratic Inquisitor)**:
  - Role: Critical collaborative thinking partner for independent researchers.
  - Behaviors: Structures vague ideas into clear inquiry domains, challenges unexamined assumptions, identifies methodological constraints, and actively asks targeted questions rather than passive auto-completion.
- **Persistence & Session Management**:
  - Chat history, active messages, and chosen model persisted in `localStorage` across browser reloads.
  - Ability to clear history or start a fresh session via the `+` (New Chat) action.
- **Component Decomposition**:
  - Modular chat feature architecture (`ChatContainer`, `ChatHeader`, `ChatMessageList`, `ChatMessageItem`, `ChatPromptInput`, `ModelSelectorPopover`, `ReasoningDisclosure`, `PerformanceMetricsBar`, `ChatEmptyState`) keeping individual components focused and under 250 lines.

## 6. Explicit Out-of-Scope List
- Autonomous backend file system mutations and real git cloning (deferred to later agentic tool phases).
- Multi-agent orchestration frameworks (saved for future lifecycle phases).
- Real arbitrary shell execution without user sandboxing.

## 7. Tech Stack & Dependencies
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (VS Code Dark Modern palette)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite (configured with `GEMINI_API_KEY` bridge)
- **LLM API**: Google Gemini REST API / client integration with structured tool definitions (Function Calling)

## 8. Primary Agentic Timeline & Crystallization Data Models
- `TimelineTurn`: Polymorphic turn union: `UserTurn | AgentTurn`
- `UserTurn`: `{ id: string; kind: 'user'; prompt: string; timestamp: number; contextPills?: ContextPill[] }`
- `AgentTurn`: `{ id: string; kind: 'agent'; timestamp: number; status: 'idle' | 'executing' | 'streaming' | 'complete' | 'error'; toolSteps?: ToolStep[]; reasoning?: { thinking: string; durationText?: string }; content: string; proposals?: StagedProposal[]; followUpChips?: string[]; metrics?: PerformanceMetrics; error?: string }`
- `ToolStep`: `{ id: string; label: string; iconType: 'terminal' | 'search' | 'tool' | 'code' | 'bolt'; durationText?: string; status: 'completed' | 'running' | 'error'; command?: string; output?: string }`
- `StagedProposal`: `{ id: string; title: string; target?: string; diffLines: DiffLine[]; status?: 'pending' | 'accepted' | 'rejected' }`
- `DiffLine`: `{ type: 'add' | 'remove' | 'context'; text: string }`
- `ContextPill`: `{ id: string; label: string; icon?: 'file' | 'claim' | 'paper' | 'tag' }`
- `ChatSession`: `{ id: string; title: string; createdAt: number; updatedAt: number; turns: TimelineTurn[] }`
- `PerformanceMetrics`: `{ ttftMs?: number; totalTimeMs?: number; tokensPerSec?: number; contextTokens?: number; totalTokens?: number }`
- `AIModelOption`: `{ id: string; name: string; provider: 'gemini' | 'mock'; description?: string }`

### Idea Crystallization Domain Models
- `ConceptCanvas`:
  ```typescript
  export interface ConceptCanvas {
    coreHypothesis?: string;
    targetAudience?: string;
    knownConstraints: string[];
    openAmbiguities: string[];
    nonGoals: string[];
    status: 'drafting' | 'crystallized';
  }
  ```
- `AgentToolDefinition`: Strict typed schema for Gemini function calling (`name`, `description`, `parameters`).
- `AgentToolExecution`: `{ toolName: string; args: Record<string, unknown>; stepId: string }`
- `CrystallizedDocument`: `{ id: string; title: string; content: string; createdAt: number; targetPath?: string }`

## 9. Idea Crystallization Engine Architecture
- **Engine Layer (`src/agent/`)**:
  - Independent TypeScript layer decoupled from React rendering.
  - **ReAct Agent Loop (`src/agent/loop/`)**: Step execution, iterative tool invocations with loop boundaries (max 6 turns per prompt).
  - **Tool Registry (`src/agent/tools/`)**:
    1. `probe_assumptions`: Surfaces 2-3 Socratic challenge questions/chips to expose blind spots.
    2. `update_concept_canvas`: Syncs the evolving mental model (hypothesis, constraints, ambiguities, non-goals).
    3. `propose_document_section`: Emits a `StagedProposal` card for user review ("AI Proposes, Human Disposes").
    4. `crystallize_document`: Generates a structured markdown dossier / spec document when ambiguities are resolved.
  - **State Synchronization (`useChat` / `useAgent`)**: Dispatches `ToolStep` and `StagedProposal` updates seamlessly into the chat timeline and editor canvas.

## 10. Socratic Inquest Questionnaire & Branching Chips Architecture
- **Inquest Duality**:
  1. **Branch Choice Chips (`followUpChips`)**:
     - Concise pivot choices (e.g., `[ Focus on SABIO-RK ]`, `[ Explore Falsifiability ]`).
     - Behavior: Clicking copies the suggested prompt direction directly into the main prompt textarea.
  2. **Diagnostic Questions Form (`diagnosticQuestions`)**:
     - Emitted when the agent asks multi-part clarifying questions to calibrate domain, skills, or constraints.
     - Behavior: Renders an interactive `ActiveInquiryForm` directly docked above the bottom prompt box.
     - Each question has its own dedicated input field so the researcher can answer in place.
     - `Submit Answers ↑`: Formats all provided answers into a structured researcher reply and triggers the agent loop.
     - `Dismiss ✕`: Collapses or hides the form without submitting.

## 11. Agent Telemetry & Log Inspector Architecture
- **Purpose**: Expose high-fidelity, transparent logs for every agent interaction, tool invocation, and Gemini API request/response cycle to prevent silent freezes and aid debugging.
- **Log Store (`src/agent/telemetry/logger.ts`)**:
  - In-memory event buffer holding typed log entries: `{ id: string; timestamp: number; level: 'info' | 'tool' | 'api' | 'warn' | 'error'; source: string; message: string; details?: unknown }`.
  - Pub/sub listener mechanism so UI views update reactively without polling.
  - One-click markdown/text export utility (`copyAllLogs()`).
- **Bottom Panel Integration (`BottomPanel.tsx`)**:
  - Activated via standard shortcut (`Ctrl+J`) or layout toggle.
  - Keeps Chat Toolbar clean and minimal (no added clutter in chat UI).
  - Displays formatted console logs with level badges, expandable JSON detail payloads, a `Copy All` button, and a `Clear` button.
- **Watchdog & Freeze Prevention**:
  - Hardened error handling in `agentLoop.ts` and `geminiService.ts`: captures network drops, 4xx/5xx responses, rate limits, and JSON parse errors.
  - Marks hanging turns with explicit error banners so the UI never stays trapped on an idle cursor.
