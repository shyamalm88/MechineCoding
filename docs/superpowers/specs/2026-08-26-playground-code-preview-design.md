# Playground — Code + Preview Reference App Design

> **Revised 2026-08-27.** The original version of this spec specified
> `@codesandbox/sandpack-react` for full in-browser editing. That was dropped
> after weighing cost against the actual goal — see "Why not Sandpack" below.
> The goal, folder layout, and deployment story are unchanged; the editing
> subsystem is gone.

## Goal

A browsable library of front-end interview problems where each entry shows
**what it does** (a live, running preview) next to **how it's built** (the
real source, syntax-highlighted). Pick a problem in the sidebar, read the
description, flip between Preview and Code.

Problems get added one at a time over time — this project builds the app,
seeded with two problems to prove both supported problem shapes work.

## Why not Sandpack

Sandpack is free (Apache-2.0), so licensing was never the issue. It was
dropped on weight and fit:

- ~54 packages and a 1.2MB library (CodeMirror, `react-devtools-inline`,
  stitches, and its own bundler client).
- Each preview boots a second bundler inside an iframe, adding a per-problem
  load delay.
- All of that buys in-browser *editing* — which is not the goal. The goal is
  reading code and seeing it run.

Rendering the component directly and showing its source via Vite's `?raw`
import achieves the goal with zero new packages, no iframe, an instant
preview, and a guarantee that the code shown is exactly the code running.

## Non-Goals

- **No in-browser code editing.** Source is read-only. To change a problem you
  edit its `.jsx` in your editor; Vite's hot reload updates the preview live.
- No `localStorage` persistence — with nothing editable, there is nothing to
  persist.
- No starter/skeleton files and no "reveal solution" toggle. Each problem is a
  single worked implementation; the Code tab *is* the solution. (A starter file
  would be dead weight in a read-only app.)
- No auto-graded tests or judging.
- Not porting the 36 existing `practice/src/lld/*` problems. `practice/` is
  untouched by this work.
- Not seeding the full ~25-item Machine Coding list — two problems only.
- No backend. The built output is static.

## Architecture

```
playground/                          (source app)
├── package.json                     # react, react-dom, vite, @vitejs/plugin-react,
│                                    #   react-markdown, rehype-highlight, highlight.js
│                                    #   -- all already present in practice/'s tree
├── vite.config.js                   # base: './' , build.outDir: '../playground-build'
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx                      # shell: sidebar + workspace
│   ├── styles.css                   # dark IDE theme
│   ├── components/
│   │   ├── Sidebar.jsx              # problem list, search, category filter
│   │   ├── ProblemWorkspace.jsx     # description + Preview/Code tabs
│   │   ├── CodeView.jsx             # syntax-highlighted source, file tabs
│   │   └── MarkdownView.jsx         # renders problem.md
│   ├── lib/
│   │   └── sources.js               # pure: group globbed source files per problem
│   └── problems/
│       ├── index.json               # metadata registry
│       ├── loader.js                # glob discovery; joins registry + component + source
│       ├── star-rating/
│       │   ├── Solution.jsx         # default export = the previewed component
│       │   ├── styles.css
│       │   └── problem.md
│       └── debounce/
│           ├── debounce.js          # the utility being taught
│           ├── Solution.jsx         # demo harness that exercises it
│           └── problem.md
└── scripts/
    └── validate-problems.mjs        # registry <-> disk consistency check

playground-build/                    (generated output, committed)
```

## Components

- **`App.jsx`** — sidebar on the left, selected problem's workspace on the right.
- **`Sidebar.jsx`** — reads the registry, renders a searchable/filterable list.
- **Registry** (`problems/index.json`) — `{ id, title, category, difficulty }[]`.
  Hand-curated metadata, same spirit as `site.config.json` for the markdown sites.
- **Problem folder** (`problems/<id>/`) — `problem.md` (description),
  `Solution.jsx` (default-exports the component rendered in Preview), plus any
  supporting `.js`/`.css` files. Folder contents *are* the file list; there is
  no per-problem manifest to maintain.
- **`loader.js`** — three `import.meta.glob` calls, all eager:
  - `./*/Solution.jsx` as modules → the component to render.
  - `./*/*.{jsx,js,css}` with `query: '?raw'` → source text for the Code tab.
  - `./*/problem.md` with `query: '?raw'` → the description.
  Adding a problem therefore never requires editing a component — deliberately
  avoiding the burden documented for `practice/`, where each new LLD needs a
  hand-written static import in `Detail.jsx`.
- **`lib/sources.js`** — pure helper that turns the flat glob result
  (`{'./star-rating/Solution.jsx': '...'}`) into per-problem ordered file lists,
  with `Solution.jsx` first. Pure, so it is unit-tested.
- **`ProblemWorkspace.jsx`** — description panel plus a Preview/Code tab switch.
  Preview renders `<Solution />` inside an error boundary; Code renders
  `CodeView`.
- **`CodeView.jsx`** — file tabs across the top, `highlight.js` applied to the
  selected file's source.

## Data Flow

1. User picks a problem → `App` looks up the registry entry and calls
   `loadProblem(id)`.
2. `loadProblem` returns `{ ...entry, markdown, Component, files }` by reading
   the three glob maps.
3. Preview tab renders `<Component />` directly — it is a normal React
   component in the same bundle, so it mounts instantly with no iframe and no
   second bundler.
4. Code tab renders the same folder's raw source, so what is displayed is
   provably the code that just ran.

## Error Handling

- **Preview error boundary.** A throwing problem component must not blank the
  whole app; the Preview pane shows the error and the rest of the UI stays
  usable. (With Sandpack this came free from its iframe; rendering in-process
  means we own it.)
- **Fail loud on registry/disk mismatch.** A registry entry with no folder, a
  folder with no `Solution.jsx` or `problem.md`, an orphan folder, a duplicate
  id, or an unsupported field → `loader.js` throws and
  `scripts/validate-problems.mjs` exits non-zero. Same convention as
  `tools/md-site/build.py`'s slug-collision and missing-category checks.
- No network calls at runtime; no storage access, so no quota/private-browsing
  failure modes.

## Testing

No auto-graded correctness tests (explicit non-goal). Verification is:

- **Unit tests** (Node 20's built-in `node --test`, no new dependency) for the
  two pieces with real logic: `lib/sources.js` file grouping/ordering, and the
  validator's `collectProblemErrors`.
- **`npm run validate`** — registry ↔ disk consistency, also run as a
  pre-build step.
- **Manual smoke test** — `npm run dev`, confirm both problems render in
  Preview, show correct source in Code, and that the Star Rating hover/click
  and the debounce timing behave as described.

## Deployment

- `vite.config.js` sets `base: './'` — required because the app is served from
  a GitHub Pages project subpath (`/MechineCoding/playground-build/`), where
  absolute asset paths would 404 — and `build.outDir: '../playground-build'`.
- `playground-build/` is committed, matching `theory-notes/`,
  `system-design-notes/`, `javanotes-notes/` (generated output checked in,
  never hand-edited). It is not caught by the repo `.gitignore` (`build/`
  matches only a directory named exactly `build`).
- Root `index.html` gains one nav button:
  `<button type="button" data-src="playground-build/index.html">Playground</button>`.
- After changing any problem: re-run `npm run build` and commit the refreshed
  output — the same edit-source-then-regenerate workflow used by the
  markdown-based sites.

## Seed Content

Two problems, chosen to cover both shapes the app must support:

1. **`star-rating`** (Machine Coding, Easy) — a pure UI component: hover
   preview, click to commit, rating readout. Proves the "React component"
   shape: `Solution.jsx` + `styles.css`.
2. **`debounce`** (JavaScript, Medium) — a logic utility in `debounce.js` plus
   a `Solution.jsx` harness that makes its behavior visible (raw vs. debounced
   click counters). Proves the "utility + demo, multiple source files" shape
   and exercises the Code tab's file tabs.

Everything beyond these two is follow-up work, added one problem at a time.
