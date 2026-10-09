# Implementation Tasks: Dialectic Workbench UI (VS Code Web Alignment)

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
- [x] Task 2.4: Refactor `SecondarySideBar.tsx` into the authentic `Chat` auxiliary panel with `+` `∨` `|` `✕` header, *"Build with Agent"* empty state, and modern prompt box.
- [x] Task 2.5: Standardize all borders and dividing lines across the workbench to `#2b2b2b` and verify dark background uniformity.
- [x] Task 2.6: Verification — Run `npm run build` and verify that the app visually matches the `vscode.dev` screenshot.

## Phase 3: Modern Tiled Layout & Curved Tabs (Completed)
- [x] Task 3.1: Update `App.tsx` to implement the recessed workbench backdrop (`#141414`), padding/gaps (`p-1.5 gap-1.5`), and floating tile wrappers (`rounded-lg border border-[#2b2b2b]`).
- [x] Task 3.2: Update `EditorArea.tsx` tab strip to recessed background (`#141414`), curved active tab (`rounded-t-md`), and *italic* `Welcome` tab typography.
- [x] Task 3.3: Refine outer borders and header styling in `PrimarySideBar.tsx` and `SecondarySideBar.tsx` to harmonize within the floating tile containers.
- [x] Task 3.4: Verification — Run `npm run build` and verify clean compilation and visual alignment.

## Phase 4: Title Bar & Activity Bar Fine Adjustments (Completed)
- [x] Task 4.1: Update `ActivityBar.tsx` to place the `☰` hamburger menu button at the top, directly above Explorer.
- [x] Task 4.2: Update `TitleBar.tsx` to:
  - Remove "Dialectic" text wordmark and place only the app logo mark on the far left.
  - Move `←` and `→` navigation buttons directly adjacent to the left of the Command Center search box.
  - Remove the bottom dividing border (`border-b`) from the Title Bar.
- [x] Task 4.3: Verification — Run `npm run build` and verify clean compilation and visual alignment with reference screenshot.

## Phase 5: 3-Tier Grayscale Palette Alignment (Completed)
- [x] Task 5.1: Update `TitleBar.tsx` background to `#3c3c3c` (Shade 1).
- [x] Task 5.2: Update `ActivityBar.tsx` background to `#333333` (Shade 2).
- [x] Task 5.3: Update `PrimarySideBar.tsx`, `SecondarySideBar.tsx`, and tile containers in `App.tsx` to `#252526` (Shade 3).
- [x] Task 5.4: Update `EditorArea.tsx` and `WelcomePage.tsx` to `#1e1e1e` editor canvas with `#252526` tab strip and `#1e1e1e` active tab.
- [x] Task 5.5: Verification — Run `npm run build` and verify that the 3 shades of gray render correctly.
