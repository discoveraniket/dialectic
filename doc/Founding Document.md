# Project Charter & Founding Document: The Workspace for Research

---

## 1. Executive Summary & Vision

Modern research lacks a dedicated integrated environment. While software engineers have environments that parse code semantics, trace dependencies, flag syntax errors, and run tests, researchers navigate complex inquiry workflows using disjointed tools: generic word processors, disconnected PDF readers, static citation managers, and chaotic chat interfaces.

This product is an **Agent-Driven Workspace for Independent and Early-Stage Researchers**. It covers the complete intellectual lifecycle—from initial ambiguous ideation to manuscript publication. It treats research not as raw text or administrative tasks, but as a living, interconnected **epistemic graph** composed of assumptions, literature, claims, evidence, and conclusions.

---

## 2. Core Philosophical Tenets

### I. Domain-Agnostic Epistemology

* **Universal Primitives of Inquiry:** The workspace does not build specialized silos for computer science, wet-lab biology, or humanities. Instead, it models universal epistemic structures: *Observations*, *Prior Art*, *Hypotheses*, *Methodologies*, *Evidence/Data*, and *Inferences*.
* **Medium Independence:** Regardless of whether the empirical evidence is an archival transcript, a bioinformatics sequence alignment, or tabular survey results, the system ingests them as evidence nodes tied directly to formal claims.

### II. Asymmetric Agency (AI Proposes, Human Disposes)

* **Human as Sovereign Supervisor:** High-stakes intellectual rigor demands that the AI never silently overwrite, delete, or hallucinate content into existence. The AI cannot unilaterally mutate the workspace state.
* **The "Pull Request" Paradigm:** Every structural synthesis, parameter change, hypothesis pivot, or draft edit is staged as an explicit **diff** accompanied by a clear rationale. The researcher retains full veto, edit, and approval authority.
* **Dialectical Partner over Ghostwriter:** The agent acts primarily as a critical collaborator and Socratic inquisitor rather than an auto-complete bot. It prevents intellectual atrophy by challenging weak reasoning, testing falsifiability, and probing for unstated assumptions.

### III. Pure Intellectual Leverage (Anti-Secretarial)

* **No Project Management Bloat:** The platform strictly rejects calendars, countdown timers, deadline reminders, and generic to-do boards.

---

## 3. The 7 Research Lifecycle Phases

| Phase | Epistemic Role | Agent Functionality |
| --- | --- | --- |
| **1. Ideation & Boundary Definition** | Scope, constraints, and problem formulation | Stress-testing assumptions, parameter mapping, constraint deconstruction. |
| **2. Literature & Prior Art** | Epistemic dependency management | Tracing citation graphs, extracting methodology nuances, spotting contradictions. |
| **3. Hypothesis & Protocol Design** | Test suite specification | Establishing controls, baselines, falsifiability criteria, and pre-registration outlines. |
| **4. Execution & Data Gathering** | Runtime & observation logging | Semantic tracking of experiments, pipeline debugging, data sanity linting. |
| **5. Analysis & Interpretation** | Profiling & debugging results | Statistical rigor checks, post-hoc rationalization warnings, ablation analysis. |
| **6. Manuscript Assembly** | Compilation & synthesis | Argument narrative structuring, dynamic citation mapping, structural diff editing. |
| **7. Peer Review & Dissemination** | CI/CD & code review | Adversarial review simulation, rebuttal matrix generation, reproducibility checks. |

---

## 4. Phase 1 Implementation: The Intake & Constraint Workspace

The immediate MVP milestone focuses on **Phase 1: Ideation & Constraint Scoping**. The objective is to transition a user from a raw, ambiguous impulse into a concrete, feasible research vector without premature execution.

### Architectural Layout: The Dual-Pane Interface

1. **Left Pane (Interrogation Channel):**
* A conversational channel where the agent conducts Socratic interviews.
* Focuses on eliciting unspoken constraints: computational limits, capital/budget, physical laboratory access, timelines, and technical skill sets.


2. **Right Pane (Live Project Dossier):**
* A structured, real-time artifact representing current project state.
* Displays confirmed parameters, out-of-scope boundaries, working definitions, and open questions.
* Modified **exclusively** when the user accepts staged agent proposals.



### Concrete Example Workflow (The "Bioinformatics" Scenario)

* **User Input:** *"I want to do research in bioinformatics. No lab access. Good computer, fast internet, time, and money. Suggest ideas."*
* **Analytical Operations Performed by System:**
1. **Constraint Extraction:** Detects hard blockers (zero wet-lab dependencies; must rely on public datasets like NCBI/GEO/UniProt) and available leverage (high local/cloud compute, budget for APIs or open access).
2. **Taxonomic Framing:** Rather than listing 10 unguided topics, the agent surfaces distinct **Inquiry Archetypes** (e.g., *Cross-Dataset Meta-Analysis*, *In-Silico Structural Modeling*, or *Tool Benchmarking & Pipeline Engineering*).
3. **Diff Proposal:** Stages a formal **Core Problem Dossier** in the Right Pane, awaiting explicit human approval.



---

## 5. System Architecture & State Model

```
               ┌────────────────────────────────────────────────────────┐
               │                  User Interface (UI)                   │
               │  ┌───────────────────────┬──────────────────────────┐  │
               │  │ Left: Socratic Stream │ Right: State/Dossier     │  │
               │  └───────────┬───────────┴─────────────▲────────────┘  │
               └──────────────┼─────────────────────────┼───────────────┘
                              │ Prompt / Critique       │ Staged Diff Approval
                              ▼                         │
               ┌────────────────────────────────────────┴───────────────┐
               │             Agent Orchestrator / Supervisor            │
               └──────────────┬─────────────────────────▲───────────────┘
                              │ Extract / Formulate     │ Propose State Change
                              ▼                         │
               ┌────────────────────────────────────────┴───────────────┐
               │               Core Epistemic State Graph               │
               │  - Constraints & Resources                             │
               │  - Core Claims & Hypotheses                            │
               │  - Evidence & Ingested Citations                       │
               │  - Out-of-Scope Boundaries                             │
               └────────────────────────────────────────────────────────┘

```

### Initial State Schema (`ProjectDossier.v1`)

```json
{
  "project_id": "uuid-v4",
  "phase": "IDEATION_AND_BOUNDARIES",
  "domain_tags": ["bioinformatics", "in-silico"],
  "constraints": {
    "wet_lab_access": false,
    "compute_profile": "High local compute + Cloud budget",
    "data_requirements": ["Public open-access repositories only"],
    "financial_runway": "Self-funded / Supported"
  },
  "inquiry_vector": {
    "archetype": "Structural Modeling / Generative Prediction",
    "status": "PROPOSED", 
    "confidence_rating": null
  },
  "boundaries": {
    "in_scope": [],
    "out_of_scope": ["In-vitro validation assays", "Animal models"],
    "unstated_assumptions": ["Availability of pre-trained checkpoint weights"]
  },
  "provenance_log": [
    {
      "timestamp": "2026-10-08T05:46:00Z",
      "actor": "AGENT",
      "action": "PROPOSE_CONSTRAINTS",
      "status": "AWAITING_USER_APPROVAL"
    }
  ]
}

```

---

## 6. Product Success Metrics

1. **Epistemic Clarity:** Time required for an early-stage researcher to formulate a falsifiable, constraint-aligned research problem.
2. **Epistemic Agency:** Percentage of agent-proposed diffs that are actively reviewed, annotated, or modified by the user (guarding against passive rubber-stamping).
3. **Execution Feasibility:** Zero abandoned projects resulting from unaddressed upfront constraints (such as discovering three months in that an idea requires wet-lab access or unobtainable data).
