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
- **Tile 3: Right Tile (Auxiliary Bar / Chat)**:
  - Container: `rounded-lg border border-[#2b2b2b] bg-[#181818] overflow-hidden flex flex-col`.
  - Open by default on application launch (`isSecondarySidebarOpen = true`).
  - Header:
    - Left: "Chat" tab button enclosed inside a separate rounded box container (`bg-[#2b2b2b] text-white px-2.5 py-1 rounded-md text-xs font-medium`).
    - Right: Controls `+` (New Chat), `∨` (Dropdown), `...` (More Actions), vertical divider (`|`), **Maximize button (`[ ]` corner brackets icon to toggle panel expansion)**, and `✕` (Close).
  - Body & Prompt Box:
    - Empty state: speech bubble with sparkles icon, "Research with Agent", and action link.
    - Floating prompt card at the bottom: **No dividing line** between the prompt card container and the chat body (`border-t` removed).
    - Prompt card (`rounded-lg bg-[#252525] border border-[#383838] overflow-hidden`):
      - Tip banner at top with `/create-agent` shortcut.
      - **Internal horizontal divider line (`border-b border-[#333333]`) separating the tip banner from the typing area**.
      - Text input area with "Write your thoughts" placeholder.
      - Bottom action controls: **4 free-standing, unboxed buttons** (no separate button backgrounds/boxes):
        1. `+` (Add Context)
        2. `Auto` (Model selector)
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

## 7. Tech Stack & Dependencies
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (VS Code Dark Modern palette)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite (configured with `GEMINI_API_KEY` bridge)
- **LLM API**: Google Gemini REST API / client integration

## 8. Primary Chat Data Models
- `ChatMessage`: `{ id: string; role: 'user' | 'assistant' | 'system'; content: string; thinking?: string; timestamp: number; status?: 'sending' | 'streaming' | 'complete' | 'error'; metrics?: PerformanceMetrics }`
- `PerformanceMetrics`: `{ ttftMs?: number; totalTimeMs?: number; tokensPerSec?: number; contextTokens?: number; totalTokens?: number }`
- `ChatSession`: `{ id: string; title: string; createdAt: number; updatedAt: number; messages: ChatMessage[] }`
- `AIModelOption`: `{ id: string; name: string; provider: 'gemini' | 'mock'; description?: string }`
