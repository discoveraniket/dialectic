# Dialectic (`project_r`)

> **The Agent-Driven Workspace for Independent & Early-Stage Researchers**

*Dialectic* is an agent-driven workspace designed to support the entire intellectual lifecycle of research—from ambiguous ideation to manuscript publication. Rather than treating research as isolated text documents or administrative task lists, Dialectic models inquiry as an evolving **epistemic graph** connecting assumptions, prior art, claims, evidence, and conclusions.

---

> [!NOTE]
> **Project Status: Early Pre-Alpha / Initial Scaffold**  
> The project is currently in its initial bootstrap phase. The application shell, workbench layout architecture (dockable sidebars, panels, tabs, modal system), and design foundations are implemented. Epistemic engine backends, AI agent interrogation pipelines, and graph stores are actively under initial development.

---

## 💡 Core Philosophical Tenets

1. **Domain-Agnostic Epistemology**  
   Dialectic models universal primitives of inquiry (*Observations, Prior Art, Hypotheses, Methodologies, Evidence/Data, Inferences*) rather than building discipline-specific silos.
2. **Asymmetric Agency ("AI Proposes, Human Disposes")**  
   The human researcher remains the sovereign supervisor. The agent cannot unilaterally mutate project state; transformations, parameter tweaks, and hypothesis pivots are staged as explicit diffs with rationales for human review.
3. **Dialectical Partner over Ghostwriter**  
   Rather than acting as an auto-complete generative text generator, Dialectic functions as a critical Socratic collaborator—probing unstated assumptions, testing falsifiability, and detecting logical gaps.
4. **Intellectual Leverage over Secretarial Bloat**  
   Rejects generic to-do lists, calendar countdowns, and administrative overhead to focus purely on intellectual synthesis and rigor.

---

## 🗺️ The 7 Research Lifecycle Phases

| Phase | Epistemic Role | Planned Agent Functionality |
| :--- | :--- | :--- |
| **1. Ideation & Boundary Definition** *(Active Milestone)* | Scope, constraints, & problem formulation | Socratic interview, constraint elicitation, parameter mapping |
| **2. Literature & Prior Art** | Epistemic dependency management | Citation graph tracing, methodology extraction, anomaly spotting |
| **3. Hypothesis & Protocol Design** | Test suite specification | Control/baseline design, falsifiability criteria, pre-registration |
| **4. Execution & Data Gathering** | Runtime & observation logging | Semantic tracking, data sanity linting, experiment logging |
| **5. Analysis & Interpretation** | Profiling & debugging results | Statistical checks, post-hoc warnings, ablation tracking |
| **6. Manuscript Assembly** | Compilation & synthesis | Argument structuring, citation mapping, structural diff edits |
| **7. Peer Review & Dissemination** | Epistemic CI/CD | Adversarial review simulation, rebuttal matrix generation |

---

## 🛠️ Current Implementation State

The client is currently an extensible workbench built with:
- **Framework & Tooling**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Implemented UI Features
- 🖥️ **Workbench Shell**: Title bar, status bar, activity bar, and multi-tab editor area.
- 🗂️ **Primary & Secondary Sidebars**: Dockable, collapsible, and resizable sidebars with Explorer, Graph, Search, and Session views.
- 📟 **Integrated Bottom Panel**: Collapsible and resizable terminal/output/agent panel with maximize toggling.
- 📁 **Workspace Management**: Workspace folder state with simulated "Open Folder" / "Create Project" flows.
- 🎨 **Minimalist Research Theme**: Dark-mode aesthetic designed for sustained reading and high-density intellectual tasks.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` (or `pnpm` / `yarn`)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd project_r
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at the displayed local URL (typically `http://localhost:5173`).

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
project_r/
├── Founding Document.md     # Vision, philosophy, and architectural charter
├── UI_DESIGN_PHILOSOPHY.md  # Design system, layout guidelines, and UI specs
├── index.html               # Entry HTML shell
├── package.json             # Dependencies and build scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── src/
    ├── main.tsx             # Application bootstrap
    ├── App.tsx              # Root workbench layout & state orchestrator
    ├── index.css            # Global theme styles & Tailwind directives
    ├── types/
    │   └── layout.ts        # Layout interfaces and workbench types
    └── components/
        ├── brand/           # Branding assets & logos
        └── layout/          # Workbench components (Sidebars, TitleBar, Panels, Editor)
```

---

## 🧭 Immediate Roadmap

- [ ] Complete **Phase 1 MVP: Dual-Pane Intake & Constraint Workspace**
  - Left pane: Interactive Socratic interrogation stream.
  - Right pane: Real-time dynamic Project Dossier with proposal staging.
- [ ] Implement local state persistence (IndexedDB / File System Access API).
- [ ] Connect agent runtime endpoints for dialectical hypothesis evaluation.
