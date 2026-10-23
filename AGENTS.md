---
name: karpathy-guidelines
description: Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria.
license: MIT
---

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.


# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Composition root. Wires state and layout together and stays deliberately thin
- `src/types.ts` - Domain types for the editable mockup document (mode, sections, focus, appearance, frame)
- `src/services/` - Framework-free logic and data. Start here for behaviour changes: `mockupState.ts` (state shape + pure reducer), `layout.ts` (split geometry and clamping), `drag.ts` (pointer maths), `mockupCanvas.ts` (canvas DOM lookup, preview focus, PNG export pipeline), `uploads.ts` (file reading and blob URL lifetime), `presets.ts` (background presets), `frames.ts` (frame metadata), `constants.ts` (ids, limits, defaults), `color.ts` (contrast helper)
- `src/hooks/` - React adapters over the services: `useMockupState.ts` (reducer + stable actions), `useRafThrottle.ts` (one update per animation frame), `useDividerDrag.ts`, `useCropDrag.ts`
- `src/components/` - Preview surface and shell: `MockupCanvas.tsx`, `FrameShell.tsx` (device chrome), `MockupContent.tsx` (split/single/empty hero), `ControlPanel.tsx`, `FloatingSuggestionBox.tsx`, `icons.tsx`
- `src/components/sections/` - One file per control-panel section: `ImagerySection.tsx`, `FormatSection.tsx`, `PreviewFrameSection.tsx`, `CanvasBackgroundSection.tsx`, `BrandHeader.tsx`, `ExportFooter.tsx`
- `src/components/ui/` - Shared panel primitives: `RangeInput.tsx`, `BackgroundSwatches.tsx`
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

### State and rendering conventions

- All editing state lives in `useMockupState()` (`src/hooks/useMockupState.ts`). Add new state to `MockupState` and new commands to `MockupActions` instead of adding `useState` to components.
- Components receive state slices (`appearance`, `frame`, `sections`, `focus`) plus stable `actions` callbacks, and are wrapped in `memo`. Keep those identities stable: never pass freshly built objects or inline arrow functions into a memoized child.
- UI-only state (dropzone drag flag, export progress, suggestion box) stays local to its component.
- Clamping and derived values belong in `src/services` as pure functions, not in components.

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

### Tooling caveats

- **Do not run `pnpm run format` (oxfmt 0.2.0).** It silently drops the separator between members of single-line object and type literals (`{ x: number; y: number }` becomes `{ x: number y: number }`), which is invalid TypeScript. Keep multi-member types and object literals on separate lines so a stray format run cannot corrupt them.
- `npx tsc --noEmit` cannot currently validate this workspace: the installed `node_modules/**/*.d.ts` files are missing member separators too (for example `@types/node/buffer.d.ts` and even `typescript/lib/lib.scripthost.d.ts`), so the compiler reports thousands of syntax errors in its own libs. Use `pnpm build` (Vite + oxc) as the working gate: it parses and resolves every module.

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.
