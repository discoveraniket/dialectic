# Product Specification: Dialectic Workbench UI (VS Code Web Alignment)

## 1. Product Summary
Dialectic is an AI-augmented research workspace with a web-first IDE interface. This specification defines the visual alignment of the workbench shell with **Visual Studio Code for the Web (`https://vscode.dev`)**, implementing the authentic 3-tier grayscale palette, floating tiled panels, and curved italic editor tabs.

## 2. Target User
Researchers, developers, and knowledge workers who seek an IDE-grade web application with familiar layout conventions, keyboard shortcuts, and responsive panels.

## 3. Core MVP User Stories & 3-Tier Grayscale Palette
- **Shade 1 (Title Bar)**: `#3c3c3c` (smooth upper header background).
  - Standalone logo mark on the far left.
  - History arrows (`←` `→`) adjacent to the search box (`Workspace`).
  - No bottom dividing line.
- **Shade 2 (Activity Bar)**: `#333333` (left vertical tool strip).
  - Hamburger menu `☰` at the top above Explorer.
  - Tool icons (Explorer, Search, Source Control, Run & Debug, Extensions, Accounts, Manage).
- **Shade 3 (Sidebars - Explorer & Chat)**: `#252526` (sidebar panels).
  - Explorer with `∨ No Folder Opened`, primary `Open Folder` button (`#0078d4`), secondary buttons.
  - Chat auxiliary panel with Agent empty state and prompt box.
- **Editor Canvas**: `#1e1e1e` (main editor space).
  - Tab strip on `#252526` / `#1f1f1f`.
  - Active tab on `#1e1e1e` with rounded top corners (`rounded-t-md`) and *italic* `Welcome` text.
  - Welcome page background: `#1e1e1e`.
- **Status Bar**: `#181818` / `#1f1f1f` with 1px `#2b2b2b` border, `>< Web` indicator, and diagnostic counts.

## 4. Explicit Out-of-Scope List
- Backend file access, real git cloning, or remote server connections.
- Real LLM backend integration (chat is client-side visual simulation).
- Tabbed panels inside the bottom panel (deferred to future phase).

## 5. Tech Stack & Dependencies
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS (VS Code Dark Modern / Dark+ palette)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite
