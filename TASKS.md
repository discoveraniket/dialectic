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
- [x] Task 2.4: Refactor `SecondarySideBar.tsx` into the authentic `Chat` auxiliary panel with `+` `∨` `|` `✕` header, *"Build with Agent"* empty state, and modern prompt box.
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
