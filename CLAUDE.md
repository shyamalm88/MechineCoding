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
| `tools/md-site/` | Reusable markdown-to-HTML-site generator (source-agnostic) |
| `theory-notes/` | Generated static site built from the former `Theory/*.md` notes via `tools/md-site/` — not hand-edited. `Theory/` itself was removed from the repo after this site was generated, committed, and pushed; restore it from git history (`git log -- Theory/`) if it ever needs to be regenerated or edited |
| `system-design-notes/` | Generated static site built from the former `system-design/*.md` docs via `tools/md-site/` — not hand-edited. `system-design/` itself was removed from the repo the same way, after this site was generated, committed, and pushed; restore it from git history (`git log -- system-design/`) if it ever needs to be regenerated or edited |

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
`system-design-notes/` (see table above) is the only surviving copy of the 25 system design docs — the source `system-design/*.md` folder was removed after generating that site. Each doc follows a 10-section template: Requirements → Component Architecture → State Management → API Design → Performance → Accessibility → Error Handling → Testing → Security → Deployment.

### Markdown-to-site generator (`tools/md-site/`)
Converts any folder of `.md` files into a browsable static HTML site — see `tools/md-site/README.md` for full usage. Two sources have used it so far: the former `Theory/*.md` (→ `theory-notes/`) and the former `system-design/*.md` (→ `system-design-notes/`) — both sources were removed after their sites were generated, committed, and pushed, so there is currently nothing left in the repo to regenerate from. To use this tool again (on either restored source or a new folder), the pattern is:
```bash
python3 tools/md-site/build.py <source-dir> <output-dir>
```
Never hand-edit a generated site's `index.html`, `notes/`, or `assets/` — only its `README.md` is hand-authored. Sidebar grouping and title come from an optional `<source-dir>/site.config.json`; category order follows that file's own key order, not alphabetical filename order.
