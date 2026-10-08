# Dialectic — UI Design Philosophy & Guidelines

> **Purpose:** This document outlines the fundamental UI architecture, design principles, and engineering conventions for **Dialectic**. Every developer contributing to the frontend must follow these tenets to ensure a cohesive, distraction-free, and high-leverage intellectual workspace.

---

## 1. Core Vision & Product Identity

* **Name:** Dialectic
* **What it is:** An agent-driven workspace for early-stage and independent researchers.
* **Core Mental Model:** **"AI Proposes, Human Disposes" (Asymmetric Agency)**.
  The software is a dialectical thinking partner. The AI never mutates project state silently; every structural synthesis, constraint addition, or hypothesis pivot is staged as a reviewable proposal (the Pull-Request paradigm). The human researcher remains the sovereign supervisor.
* **Anti-Secretarial (Pure Cognitive Leverage):**
  We strictly reject productivity bloat—no calendars, no countdown timers, no deadline alerts, and no generic Kanban boards. The UI is built entirely around epistemic inquiry: claims, evidence, hypotheses, constraints, and assumptions.

---

## 2. The 7-Region Layout Anatomy

Dialectic adopts the modular, collapsible **VS Code workbench layout**. This architecture separates navigation, context exploration, active work, auxiliary conversation, and system diagnostics into 7 dedicated regions:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TITLE BAR (Branding  |  Command Center Search `Ctrl+P`  |  Layout Toggles)          │
├────┬─────────────────────┬───────────────────────────────────────┬─────────────────────┤
│ 2. │ 3. PRIMARY SIDE BAR │ 4. EDITOR AREA (Main Stage)           │ 5. SECONDARY        │
│    │  (Width-Resizable)  ├───────────────────────────────────────┤    SIDE BAR         │
│ A  │                     │ Tabs: [Welcome] [File.md] ...         │    (Auxiliary Bar - │
│ C  │ • Explorer          ├───────────────────────────────────────┤     Width-Resizable)│
│ T  │ • Search            │ Breadcrumbs                           │                     │
│ I  │ • Source Control    ├───────────────────────────────────────┤ • Socratic Inquisitor│
│ V  │ • Extensions        │ Active Canvas:                        │ • Dialectical Chat  │
│ I  │                     │ - Welcome Landing Page (if empty)     │ • Propose Diff CTA  │
│ T  │                     │ - Code / Document Editor (Line Gutter)│                     │
│ Y  │                     │ - Pull-Request Staged Diff Review     │                     │
│    │                     ├───────────────────────────────────────┤                     │
│ R  │                     │ 6. BOTTOM PANEL (Height-Resizable)    │                     │
│ A  │                     │ Header (Title + Maximize/Close)       │                     │
│ I  │                     │ Clean utility area                    │                     │
│ L  │                     │                                       │                     │
├────┴─────────────────────┴───────────────────────────────────────┴─────────────────────┤
│ 7. STATUS BAR (Git Branch  |  Diagnostics  |  Cursor Position  |  Encoding)            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Regional Responsibilities:

| # | Region | Responsibility | Rules for Developers |
| :--- | :--- | :--- | :--- |
| **1** | **Title Bar** | Global window control, project name, Command Center (`Ctrl+P`), layout toggles. | Height pinned to `35px`. Keep centered search clean and unobtrusive. |
| **2** | **Activity Bar** | High-level mode navigation rail pinned to far left. | Width pinned to `48px`. Only top-level activity icons belong here (Explorer, Search, Git, Extensions, Profile, Settings). |
| **3** | **Primary Side Bar** | Context drawer matching active Activity Bar icon. | Must be width-resizable with drag handle. When no folder is loaded, show a clean "No Folder Opened" state with "Open Folder" / "Create Folder" buttons. |
| **4** | **Editor Area** | The main workspace stage. | Multi-tab support with close buttons. Defaults to the **Welcome Landing Page** when no files are open. |
| **5** | **Secondary Side Bar** *(Auxiliary Bar)* | Collapsible right-hand drawer. Dedicated to the **Socratic Inquisitor Agent**. | Never place file trees here. This is exclusively for agent dialogue, dialectical challenges, and diff staging actions. |
| **6** | **Bottom Panel** | Collapsible bottom drawer for diagnostics, logs, or terminal. | Height-resizable with maximize/restore and close controls. Avoid tab bloat until features are backed by real logic. |
| **7** | **Status Bar** | Global ambient feedback pinned to bottom. | Height pinned to `22px`. Blue accent `#007acc`. High information density with minimal distraction. |

---

## 3. Guiding Design Principles

### Principle I: Simplicity Above All
* **No vanity labels:** Do not badge the app with words like `"IDE"` or `"Cognitive IDE"`. Let the tool's precision speak for itself.
* **Earn your pixels:** Do not add mock tabs, dummy graphs, or fake logs. An empty state with a clear call-to-action is always better than artificial clutter.

### Principle II: Spatial Fluidity & User Sovereignty
* Every sidebar and panel **must be resizable** via fluid mouse-drag gutters (`resizer-x` and `resizer-y`).
* Every panel **must be toggleable** both by clicking title bar icons and via standard keyboard shortcuts:
  * `Ctrl+B` (or `Cmd+B`): Toggle Primary Side Bar
  * `Ctrl+J` (or `Cmd+J`): Toggle Bottom Panel
  * `Ctrl+Alt+B`: Toggle Secondary Auxiliary Bar

### Principle III: Dark-First, Low-Fatigue Palette
Dialectic uses a calibrated dark palette modeled after professional developer tools:

| Element | Hex Code | Usage |
| :--- | :--- | :--- |
| **Background Darkest** | `#181818` | Title Bar, Activity Bar, Bottom Panel, Status Bar background |
| **Editor / Work Surface** | `#1e1e1e` | Active editor workspace, sidebars |
| **Card / Input Background** | `#252526` | Form inputs, cards, elevated containers |
| **Borders & Dividers** | `#2b2b2b` / `#333333` | Thin 1px dividers between panes and headers |
| **Primary Accent** | `#007acc` | Active tab top border, primary buttons, status bar, focus outlines |
| **Secondary Accent** | `#38bdf8` | Dialectic brand highlights, synthesis nodes |
| **Text Primary** | `#cccccc` / `#ffffff` | Primary readable content |
| **Text Muted** | `#858585` | Breadcrumbs, inactive tabs, secondary labels |

---

## 4. Brand & Logo Specifications

* **Logo Symbolism:**
  * **White Vertical Stem:** The Sovereign Researcher (human anchor).
  * **Upper Arc (Cyan):** Thesis (initial observations and hypotheses).
  * **Lower Arc (Indigo):** Antithesis (Socratic counter-probing and constraints).
  * **Focal Spark (Node):** Synthesis (verified truth and bounded claims).
  * Combined, the elements form a minimalist **"D" monogram**.
* **Usage:**
  * Always use `<DialecticLogo size={...} />` from `src/components/brand/DialecticLogo.tsx`.
  * Do not append badges or text other than the word **Dialectic**.

---

## 5. Engineering & Development Rules

1. **Layer-by-Layer Progression:**
   * **Layer 0 (Complete):** Core layout shell, resizable containers, landing page, and brand identity.
   * **Layer 1:** Project workspace loading and folder/file state management.
   * **Layer 2:** Staged diff and Pull-Request proposal engine.
   * **Layer 3:** Socratic interrogation channel and prompt flow.
   * **Layer 4:** Backend orchestrator integration.
   * *Rule:* Never jump ahead to mock backend data before the current layer's primitives are clean and type-safe.

2. **Component Conventions:**
   * Keep layout controllers decoupled from domain data views.
   * Place layout primitives in `src/components/layout/`.
   * Place brand marks in `src/components/brand/`.
   * Keep global workbench interfaces in `src/types/layout.ts`.

3. **Iconography:**
   * Use `lucide-react`.
   * Keep standard icon sizes: `14px` (buttons/inlines), `16px` (tabs/trees), `20px` (Activity Bar).
