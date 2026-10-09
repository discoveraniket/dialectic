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
  - Borderless header with `Chat` tab and `+ ∨ ... ✕` controls.
  - Body: "Build with Agent" empty state and rounded prompt input box (`rounded-lg border border-[#333333] bg-[#1f1f20]`).
- **Part Status Bar (`footer`)**:
  - Height: `22px`, background: `#1f1f1f`, **no top divider line** (flows seamlessly from canvas).
  - Remote indicator badge (`>< Web`) on far left, diagnostic counters, keyboard layout, and notifications on right.

## 4. Dividers and Resizer Sashes
- Inter-tile divider gaps are thin (`w-[4px]` or `w-1`), containing a subtle vertical three-dot resize handle indicator in the vertical center. Highlights with `#0078d4` line during active drag/hover.
- Horizontal sash sits between the editor canvas and the docked bottom panel inside the Center Tile.

## 5. Explicit Out-of-Scope List
- Backend file access, real git cloning, or remote server connections.
- Real LLM backend integration (chat is client-side visual simulation).

## 6. Tech Stack & Dependencies
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (VS Code Dark Modern palette)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite
