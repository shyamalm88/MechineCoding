# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Run DSA / JavaScript problems
```bash
node DSA/Graph/numberOfIslands.js
node JavaScriptProblems/utility/debounce.js
```
No build step required — files are self-contained and include their own test cases at the bottom.

### React LLD practice app (`practice/`)
```bash
cd practice && npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Architecture

### Repository layout

| Directory | Purpose |
|---|---|
| `DSA/` | 125+ LeetCode-style problems, pure JS |
| `JavaScriptProblems/` | Polyfills, design patterns, async utilities, utility functions |
| `reactHooks/` | 6 custom React hooks |
| `practice/` | Vite + React 18 app for visualizing LLD solutions |
| `system-design/` | Markdown architecture docs (frontend system design) |
| `Theory/` | Markdown reference notes (browser internals, JS core, etc.) |

### DSA file format
Every DSA file follows the same convention: a JSDoc header with problem statement, intuition, and complexity, then the implementation, then test cases as plain `console.log` calls at the bottom. Run any file with Node to execute those tests.

### React LLD app — how it works

The `practice/` app is a two-pane viewer. `Sidebar.jsx` reads `src/lld/index.json` to render the list; `Detail.jsx` renders the selected problem.

**Adding a new LLD requires three changes:**
1. Create `src/lld/lld-0XX-<name>/Solution.jsx` (default export) and `problem.md`.
2. Add an entry to `src/lld/index.json`.
3. Add a **static import** and an entry in the `SOLUTION_COMPONENTS` map inside `Detail.jsx` — dynamic imports won't work because Vite needs static analysis.

`problem.md` is fetched at runtime via `fetch(`/${lld.path}/problem.md`)`, so its path in `index.json` must match the actual file location relative to `public/` (Vite serves `src/` files through the dev server).

Solution components must use a **default export** and a `.jsx` extension (Vite cannot parse JSX in `.js` files).

### JavaScript problems structure
`promise-async-problems/` is subdivided by concern: `Core/` (building blocks like retry/timeout), `execution/` (parallel/series/limit runners), `orchastration/` (compose, waterfall, dependency graphs), `reliability/` (circuit breaker, backoff), `scheduler/` (priority queues, idle runners). Each file is standalone with no imports.

### System design docs
The `system-design/latest & updated/` folder contains the canonical versions. Each doc follows a 10-section template: Requirements → Component Architecture → State Management → API Design → Performance → Accessibility → Error Handling → Testing → Security → Deployment.
