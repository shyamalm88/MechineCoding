# Playground — In-Browser Coding Platform Design

## Goal

Build a StackBlitz/CodeSandbox-style practice platform for front-end interview
questions: pick a problem from a list, get a real in-browser code editor and
live preview (no local dev server needed to *solve* a problem), and have your
progress persist across visits. Problems get added one at a time over time —
this project builds the *platform*, seeded with two problems to prove both
supported problem shapes work end to end.

This supersedes the "reskin `practice/src/lld/`" idea raised earlier — that
folder pattern (edit in VS Code, view via a shared Vite dev server) is
explicitly not the target experience. `practice/` is untouched by this work.

## Non-Goals

- No auto-graded test runner / pass-fail judging. Correctness is eyeballed via
  the live preview (decided when comparing options — "Live preview only").
- Not porting or migrating any of the 36 existing `practice/src/lld/*`
  problems. This is a new, separate app.
- Not seeding the full ~25-item Machine Coding list from the "Frontend
  Interview Hub" mockup right now — only 2 problems, as a proof of concept.
  Adding the rest is ongoing follow-up work outside this build.
- No backend/server component. Everything (editor, bundler, preview,
  persistence) runs client-side; the built app is static output.

## Architecture

```
playground/                          (new, source app — dev-only, like practice/)
├── package.json                     # own deps: react, react-dom, vite,
│                                     #   @vitejs/plugin-react,
│                                     #   @codesandbox/sandpack-react,
│                                     #   react-markdown, rehype-highlight
├── vite.config.js                   # base: './' , build.outDir: '../playground-build'
├── src/
│   ├── App.jsx                      # shell: sidebar + ProblemWorkspace
│   ├── components/
│   │   ├── Sidebar.jsx              # problem list, search, category/difficulty filter
│   │   └── ProblemWorkspace.jsx     # SandpackProvider/Layout/Editor/Preview + solution toggle
│   ├── hooks/
│   │   └── usePersistedSandpackFiles.js
│   └── problems/
│       ├── index.json               # registry: [{id, title, category, difficulty, template}]
│       ├── star-rating/
│       │   ├── problem.md
│       │   └── files.js             # exports starterFiles, solutionFiles
│       └── debounce/
│           ├── problem.md
│           └── files.js
└── scripts/
    └── validate-problems.mjs        # registry <-> disk consistency check

playground-build/                    (new, generated output — committed, like theory-notes/)
├── index.html
└── assets/                          # Vite's hashed JS/CSS bundle
```

Usage: `cd playground && npm install && npm run dev` for local development;
`npm run build` regenerates `../playground-build/`, which is what's actually
linked from the root hub and deployed via GitHub Pages.

This mirrors the existing source/output split (`Theory/` → `theory-notes/`,
`JavaNotes/` → `javanotes-notes/`), but the "generator" here is Vite's own
build instead of `tools/md-site/build.py` — there's no reason to route a real
React+Sandpack app through the markdown-site generator.

## Components

- **`App.jsx`** — top-level layout: `Sidebar` on the left, selected problem's
  `ProblemWorkspace` on the right. Dark theme throughout (decided: "Dark IDE
  look").
- **`Sidebar.jsx`** — reads `problems/index.json`, renders a filterable list
  (search box + category/difficulty pills, simplified from the pasted
  mockup's Practice Questions view — no pagination needed at this scale).
- **Problem registry** (`problems/index.json`) — array of
  `{ id, title, category, difficulty, template: "react" | "vanilla" }`. Same
  shape convention as `practice/src/lld/index.json`.
- **Per-problem folder** (`problems/<id>/`):
  - `problem.md` — description, rendered via `react-markdown` (already a
    proven dependency pattern from `practice/`).
  - `files.js` — exports `starterFiles` (blank/skeleton — decided: "Blank
    skeleton + hidden solution toggle") and `solutionFiles` (reference
    implementation), both as Sandpack `files` objects
    (`{ "/App.js": { code: "..." }, "/styles.css": { code: "..." } }`).
- **`ProblemWorkspace.jsx`** — three-pane layout: problem description | code
  editor | live preview, built from Sandpack's fine-grained components
  (`SandpackProvider`, `SandpackLayout`, `SandpackCodeEditor`,
  `SandpackPreview` — not the all-in-one `<Sandpack>` wrapper, since
  persistence and the solution toggle need direct control). `template` from
  the registry entry selects Sandpack's `react` or `vanilla` template, so
  both UI problems (Star Rating) and plain-JS-logic problems (debounce) work
  through the same component.
- **`usePersistedSandpackFiles(problemId, starterFiles)`** — on mount, reads
  `localStorage["playground:<problemId>"]`; if present, merges it over
  `starterFiles` as the initial code. Subscribes to Sandpack file changes
  (debounced ~500ms) and writes the current file contents back to
  `localStorage`.
- **"Reveal solution" toggle** — a button in `ProblemWorkspace` that swaps
  which file set is fed to Sandpack (`solutionFiles` vs. the persisted
  starter attempt), remounting the Sandpack instance via a `key` change so
  state doesn't bleed between the two. Viewing the solution never overwrites
  the saved starter attempt in `localStorage`; toggling back restores it
  exactly as left.

## Data Flow

1. User picks a problem in `Sidebar` → `App` looks up its registry entry and
   renders `ProblemWorkspace` for that `id`.
2. `ProblemWorkspace` loads `problem.md` and `files.js` for the id.
3. `usePersistedSandpackFiles` checks `localStorage` for a saved attempt;
   falls back to `starterFiles` if none exists yet.
4. Sandpack mounts with those files, bundles client-side, and renders the
   live preview in its iframe. Every keystroke re-bundles and updates the
   preview (Sandpack's built-in hot reload — no custom wiring needed).
5. Edits debounce-save to `localStorage` via the hook.
6. "Reveal solution" flips local component state, swapping in
   `solutionFiles` (read-only viewing is allowed — the user can still edit
   the solution copy to experiment, but those edits are never persisted,
   only the starter-attempt copy is saved).

## Error Handling

- Sandpack sandboxes runtime/compile errors inside its own preview iframe and
  error overlay — no additional error UI needed for code the user writes.
- A registry entry (`problems/index.json`) referencing a problem `id` with no
  matching folder, or a folder missing `files.js`/`problem.md`, fails loudly
  — both `scripts/validate-problems.mjs` and the app's own import at runtime
  should throw rather than silently rendering a blank workspace. This matches
  the existing "fail loud on inconsistency" convention from
  `tools/md-site/build.py` (its slug-collision and missing-category checks).
- `localStorage` reads/writes are wrapped in `try/catch` (private browsing,
  quota exceeded) — on failure, persistence silently degrades to
  in-memory-only for that session rather than crashing the app.

## Testing

No auto-graded correctness tests (decided: "Live preview only" — this is a
non-goal for the platform itself). Verification instead:

- `scripts/validate-problems.mjs` — a small Node script asserting every
  `problems/index.json` entry has a corresponding folder with both
  `problem.md` and `files.js`, and that `files.js` exports non-empty
  `starterFiles`/`solutionFiles`. Run manually and as a pre-build check.
- Manual smoke test after implementation: `npm run dev`, open both seeded
  problems (`star-rating` = react template, `debounce` = vanilla template),
  confirm the live preview renders for each, confirm an edit survives a page
  reload (persistence), confirm "Reveal solution" swaps content and "back to
  my code" restores the saved attempt unchanged.

## Deployment

- `playground/vite.config.js` sets `base: './'` (relative asset paths — required
  since this will be served from a GitHub Pages project-site subpath,
  `/MechineCoding/playground-build/`, not domain root) and
  `build.outDir: '../playground-build'`.
- After `npm run build`, `playground-build/` is committed to the repo root,
  same convention as `theory-notes/`, `system-design-notes/`,
  `javanotes-notes/` (generated output checked in, never hand-edited).
- Root `index.html` hub gets one more nav button:
  `<button type="button" data-src="playground-build/index.html">Playground</button>`,
  appended after the existing "Java Notes" tab — same pattern used for every
  prior addition to the hub.
- Whenever a problem is added or edited under `playground/src/problems/`,
  re-run `npm run build` in `playground/` and commit the refreshed
  `playground-build/` output, mirroring the existing
  edit-source-then-regenerate-site workflow already used for the
  markdown-based sites.

## Seed Content (proof of concept)

Two problems, chosen to exercise both Sandpack templates:

1. **`star-rating`** (`template: "react"`, category "Machine Coding",
   difficulty "Easy") — interactive star rating with hover preview and click
   selection. Validates the React-UI problem shape end to end.
2. **`debounce`** (`template: "vanilla"`, category "JavaScript",
   difficulty "Medium") — implement a `debounce(fn, delay)` utility; preview
   shows a simple button + counter/log wired to the debounced function so the
   behavior is visible without needing a test runner. Validates the
   plain-JS-logic problem shape end to end.

Everything beyond these two is intentionally left for later, added one
problem at a time as originally requested.
