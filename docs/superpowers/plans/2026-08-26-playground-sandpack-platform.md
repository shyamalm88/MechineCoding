# Playground — In-Browser Coding Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a StackBlitz-style practice platform at `playground/` where each interview problem opens in a real in-browser code editor with a live preview, with edits persisted across visits — seeded with two proof-of-concept problems.

**Architecture:** A standalone Vite + React 18 app (independent of `practice/`). `@codesandbox/sandpack-react` provides the bundler, editor, and preview iframe. Problems live as self-contained folders (`problem.md` + `files.js` exporting `starterFiles`/`solutionFiles`), discovered via `import.meta.glob` so adding a problem never requires editing a component. Pure logic (file merging, storage) lives in `src/lib/` and is unit-tested with Node's built-in test runner; React/Sandpack integration is verified manually per the approved spec.

**Tech Stack:** Vite 5, React 18.2, `@codesandbox/sandpack-react` 2.20, `react-markdown` + `rehype-highlight`, `node --test` (built into Node 20 — no new test dependency).

**Spec:** `docs/superpowers/specs/2026-08-26-playground-sandpack-platform-design.md`

---

## Verified API Facts

These were confirmed against the installed package before writing this plan — do not substitute from memory:

- Package `@codesandbox/sandpack-react@2.20.0`; peer deps accept React 18.
- Main entry exports: `SandpackProvider`, `SandpackLayout`, `SandpackCodeEditor`, `SandpackPreview`, `useSandpack`, `defaultDark`.
- `useSandpack()` returns `{ sandpack, dispatch, listen }`; `sandpack.files` is `{ [path]: { code: string } }`.
- Template `"react"` provides `/App.js`, `/index.js`, `/styles.css`, `/package.json`, `/public/index.html`.
- Template `"vanilla"` provides `/index.html`, `/index.js`, `/styles.css`, `/package.json`.
- `playground-build/` is **not** matched by the repo `.gitignore` (`build/` only matches a dir named exactly `build`), so the built output can be committed.

## Deliberate Deviations from the Spec

Two intentional changes, both discovered while verifying the real Sandpack API:

1. **`usePersistedSandpackFiles` hook → `PersistenceBridge` component.** The spec
   named a single hook, but `useSandpack()` only works *inside* `SandpackProvider`
   — and `ProblemWorkspace` is the component that renders that provider, so it
   cannot call such a hook itself. The responsibility is therefore split: pure
   merge logic in `src/lib/persistence.js`, storage access in `src/lib/storage.js`,
   and a headless `PersistenceBridge` child that observes and saves from inside
   the provider. Same behavior, correct React structure, and the pure half
   becomes unit-testable.

2. **Added a "Reset" control.** Not in the spec, but persistence without a reset
   is a trap — once a starter file is edited there would be no way back to the
   skeleton. It is a direct consequence of the approved persistence decision, so
   it ships with it.

---

## File Structure

| File | Responsibility |
|---|---|
| `playground/package.json` | Deps + `dev`/`build`/`validate`/`test` scripts |
| `playground/vite.config.js` | React plugin, `base: './'`, output to `../playground-build` |
| `playground/index.html` | Vite HTML entry |
| `playground/src/main.jsx` | React 18 root mount |
| `playground/src/styles.css` | Dark IDE theme for the app shell |
| `playground/src/App.jsx` | Shell: sidebar + selected problem workspace |
| `playground/src/lib/persistence.js` | Pure: storage key, merge saved over starter, shape conversion |
| `playground/src/lib/persistence.test.mjs` | Unit tests for the above |
| `playground/src/lib/storage.js` | `localStorage` read/write/clear wrapped in try/catch |
| `playground/src/problems/index.json` | Problem metadata registry (hand-curated) |
| `playground/src/problems/loader.js` | Glob-based discovery; joins registry + `files.js` + `problem.md` |
| `playground/src/problems/star-rating/` | Seed problem (react template) |
| `playground/src/problems/debounce/` | Seed problem (vanilla template) |
| `playground/src/components/Sidebar.jsx` | Problem list with search + filters |
| `playground/src/components/ProblemWorkspace.jsx` | Description \| editor \| preview + solution/reset controls |
| `playground/src/components/PersistenceBridge.jsx` | Headless: debounce-saves Sandpack files |
| `playground/src/components/MarkdownView.jsx` | Renders `problem.md` |
| `playground/scripts/validate-problems.mjs` | Registry ↔ disk consistency check |
| `playground/scripts/validate-problems.test.mjs` | Unit tests for the validator |
| `index.html` (repo root) | Add "Playground" hub tab |

---

### Task 1: Scaffold the Vite app

**Files:**
- Create: `playground/package.json`
- Create: `playground/vite.config.js`
- Create: `playground/index.html`
- Create: `playground/src/main.jsx`
- Create: `playground/src/App.jsx`
- Create: `playground/src/styles.css`

- [ ] **Step 1: Create `playground/package.json`**

```json
{
  "name": "playground",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "npm run validate && vite build",
    "preview": "vite preview",
    "validate": "node scripts/validate-problems.mjs",
    "test": "node --test scripts/ src/lib/"
  },
  "dependencies": {
    "@codesandbox/sandpack-react": "^2.20.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-markdown": "^10.1.0",
    "rehype-highlight": "^7.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  }
}
```

- [ ] **Step 2: Create `playground/vite.config.js`**

`base: './'` is required — the built app is served from a GitHub Pages subpath (`/MechineCoding/playground-build/`), not domain root, so absolute asset paths would 404.

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds into ../playground-build/, which is committed and linked from the
// root hub page -- same source/output split as Theory/ -> theory-notes/.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../playground-build',
    emptyOutDir: true,
  },
})
```

- [ ] **Step 3: Create `playground/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `playground/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 5: Create a placeholder `playground/src/App.jsx`**

Replaced in Task 9 — this exists only so the dev server boots and proves the toolchain works.

```jsx
export default function App() {
  return <div className="app-shell">Playground scaffold OK</div>
}
```

- [ ] **Step 6: Create `playground/src/styles.css`**

```css
:root {
  --pg-bg: #0b0e14;
  --pg-panel: #11151f;
  --pg-panel-alt: #161b26;
  --pg-line: rgba(150, 170, 210, 0.16);
  --pg-text: #d7dee9;
  --pg-muted: #8b95a9;
  --pg-faint: #5d6478;
  --pg-accent: #e0a458;
  --pg-easy: #4ade80;
  --pg-medium: #e0a458;
  --pg-hard: #f17171;
  --pg-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  --pg-sans: "Inter", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; }

html, body, #root { height: 100%; margin: 0; }

body {
  background: var(--pg-bg);
  color: var(--pg-text);
  font-family: var(--pg-sans);
  -webkit-font-smoothing: antialiased;
}

.app-shell { padding: 24px; }
```

- [ ] **Step 7: Install dependencies**

Run: `cd playground && npm install`
Expected: completes without `ERESOLVE` peer-dependency errors (Sandpack 2.20 accepts React 18).

- [ ] **Step 8: Verify the dev server boots**

Run: `cd playground && npm run dev`
Expected: Vite prints a `Local: http://localhost:5173/` URL and the page shows "Playground scaffold OK". Stop the server with Ctrl-C.

- [ ] **Step 9: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/package.json playground/package-lock.json playground/vite.config.js playground/index.html playground/src/main.jsx playground/src/App.jsx playground/src/styles.css
git commit -m "feat(playground): scaffold Vite + React app shell"
```

---

### Task 2: Persistence pure logic (TDD)

Pure functions only — no React, no `localStorage` — so they are directly unit-testable. This is where the real bug risk lives (a saved file for a path the problem no longer defines must not resurrect stale code).

**Files:**
- Create: `playground/src/lib/persistence.js`
- Test: `playground/src/lib/persistence.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `playground/src/lib/persistence.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { storageKey, mergePersistedFiles, toSavedShape } from './persistence.js'

test('storageKey namespaces the problem id', () => {
  assert.equal(storageKey('debounce'), 'playground:debounce')
})

test('mergePersistedFiles returns starter files when nothing is saved', () => {
  const starter = { '/App.js': { code: 'starter' } }
  assert.deepEqual(mergePersistedFiles(starter, null), starter)
})

test('mergePersistedFiles overlays saved code onto starter files', () => {
  const starter = { '/App.js': { code: 'starter' }, '/styles.css': { code: 'css' } }
  const saved = { '/App.js': 'my attempt' }
  assert.deepEqual(mergePersistedFiles(starter, saved), {
    '/App.js': { code: 'my attempt' },
    '/styles.css': { code: 'css' },
  })
})

test('mergePersistedFiles drops saved paths the problem no longer defines', () => {
  const starter = { '/App.js': { code: 'starter' } }
  const saved = { '/App.js': 'kept', '/Removed.js': 'stale' }
  const merged = mergePersistedFiles(starter, saved)
  assert.deepEqual(Object.keys(merged), ['/App.js'])
  assert.equal(merged['/App.js'].code, 'kept')
})

test('mergePersistedFiles ignores non-string saved values', () => {
  const starter = { '/App.js': { code: 'starter' } }
  assert.equal(mergePersistedFiles(starter, { '/App.js': 42 })['/App.js'].code, 'starter')
})

test('toSavedShape flattens Sandpack files to path -> code', () => {
  const files = { '/App.js': { code: 'a', readOnly: false }, '/styles.css': { code: 'b' } }
  assert.deepEqual(toSavedShape(files), { '/App.js': 'a', '/styles.css': 'b' })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd playground && node --test src/lib/`
Expected: FAIL — `Cannot find module '.../src/lib/persistence.js'`

- [ ] **Step 3: Write the implementation**

Create `playground/src/lib/persistence.js`:

```js
export const STORAGE_PREFIX = 'playground:'

export function storageKey(problemId) {
  return `${STORAGE_PREFIX}${problemId}`
}

/**
 * Overlay a saved attempt onto a problem's starter files.
 *
 * Iterates the STARTER paths, not the saved ones, on purpose: if a problem's
 * files.js later renames or drops a file, the stale entry still sitting in
 * localStorage must not reappear in the editor.
 */
export function mergePersistedFiles(starterFiles, savedFiles) {
  if (!savedFiles) return starterFiles

  const merged = {}
  for (const [path, file] of Object.entries(starterFiles)) {
    const savedCode = savedFiles[path]
    merged[path] =
      typeof savedCode === 'string' ? { ...file, code: savedCode } : file
  }
  return merged
}

/** Reduce Sandpack's file map to the plain {path: code} shape we persist. */
export function toSavedShape(sandpackFiles) {
  const out = {}
  for (const [path, file] of Object.entries(sandpackFiles)) {
    out[path] = file.code
  }
  return out
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd playground && node --test src/lib/`
Expected: PASS — `# pass 6`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/lib/persistence.js playground/src/lib/persistence.test.mjs
git commit -m "feat(playground): add persistence merge logic with tests"
```

---

### Task 3: localStorage wrapper

Separated from `persistence.js` so that module stays pure/testable. This one only handles the browser API and its failure modes (private browsing, quota exceeded) — per the spec, failures degrade to in-memory rather than crashing.

**Files:**
- Create: `playground/src/lib/storage.js`

- [ ] **Step 1: Write the implementation**

```js
import { storageKey } from './persistence.js'

/**
 * localStorage can throw outright (Safari private browsing) or on quota
 * exhaustion. Every access is guarded so a storage failure degrades to
 * "this session just won't persist" instead of taking down the app.
 */

export function readSaved(problemId) {
  try {
    const raw = window.localStorage.getItem(storageKey(problemId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeSaved(problemId, savedShape) {
  try {
    window.localStorage.setItem(storageKey(problemId), JSON.stringify(savedShape))
    return true
  } catch {
    return false
  }
}

export function clearSaved(problemId) {
  try {
    window.localStorage.removeItem(storageKey(problemId))
    return true
  } catch {
    return false
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/lib/storage.js
git commit -m "feat(playground): add guarded localStorage wrapper"
```

---

### Task 4: Seed problem — Star Rating (react template)

**Files:**
- Create: `playground/src/problems/star-rating/problem.md`
- Create: `playground/src/problems/star-rating/files.js`

- [ ] **Step 1: Create `playground/src/problems/star-rating/problem.md`**

```markdown
# Star Rating

Build a 5-star rating widget.

## Requirements

- Hovering over a star previews that rating — every star up to and including
  the hovered one fills.
- Moving the pointer off the widget restores the currently selected rating.
- Clicking a star commits that rating.
- Show the committed rating as text (e.g. `3 / 5`), or "No rating yet".

## Hints

- You need two pieces of state: the committed `rating` and the transient
  `hovered` value.
- The displayed value is `hovered || rating` — hover wins while the pointer is
  over the widget.
- Put `onMouseLeave` on the container, not on each star, so moving between
  stars doesn't clear the preview.
```

- [ ] **Step 2: Create `playground/src/problems/star-rating/files.js`**

```js
const styles = `body {
  font-family: ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  padding: 24px;
}
.rating { display: flex; align-items: center; gap: 4px; }
.star { font-size: 32px; color: #d0d0d0; cursor: pointer; user-select: none; }
.star.filled { color: #f5b301; }
.label { margin-left: 12px; font-size: 14px; color: #555; }
`

export const starterFiles = {
  '/App.js': {
    code: `import "./styles.css";

// Build a 5-star rating widget.
//
//  - Hovering a star previews that rating (all stars up to it fill).
//  - Leaving the widget restores the selected rating.
//  - Clicking a star commits that rating.
//
// The stars render already -- wire up the state and handlers.

export default function App() {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value} className="star">
          ★
        </span>
      ))}
    </div>
  );
}
`,
  },
  '/styles.css': { code: styles },
}

export const solutionFiles = {
  '/App.js': {
    code: `import { useState } from "react";
import "./styles.css";

export default function App() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  // Hover wins while the pointer is over the widget; otherwise show what
  // the user actually committed.
  const active = hovered || rating;

  return (
    <div className="rating" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={value <= active ? "star filled" : "star"}
          onMouseEnter={() => setHovered(value)}
          onClick={() => setRating(value)}
        >
          ★
        </span>
      ))}
      <p className="label">{rating ? \`\${rating} / 5\` : "No rating yet"}</p>
    </div>
  );
}
`,
  },
  '/styles.css': { code: styles },
}
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/problems/star-rating/
git commit -m "feat(playground): add star-rating seed problem"
```

---

### Task 5: Seed problem — Debounce (vanilla template)

The demo harness builds its own DOM in `index.js` rather than overriding the template's `index.html`, so the problem is self-contained and doesn't depend on the vanilla template's internal markup.

**Files:**
- Create: `playground/src/problems/debounce/problem.md`
- Create: `playground/src/problems/debounce/files.js`

- [ ] **Step 1: Create `playground/src/problems/debounce/problem.md`**

```markdown
# Debounce

Implement `debounce(fn, delay)`.

## Requirements

- Return a new function that postpones calling `fn` until `delay` ms have
  elapsed since the **last** call to the wrapped function.
- Rapid successive calls collapse into a single invocation.
- The wrapped function forwards its arguments and `this` to `fn`.

## How to verify

Click the button rapidly. The raw counter increments on every click; the
debounced counter should increment **once**, 500ms after you stop clicking.

## Hints

- Keep the pending `setTimeout` id in a closure variable.
- Every call clears the previous timer before scheduling a new one.
- Use a regular `function` (not an arrow) for the returned wrapper so `this`
  can be forwarded with `fn.apply(this, args)`.
```

- [ ] **Step 2: Create `playground/src/problems/debounce/files.js`**

```js
const styles = `body {
  font-family: ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  padding: 24px;
}
button { font-size: 15px; padding: 10px 18px; cursor: pointer; }
p { font-size: 15px; }
.hint { color: #666; font-size: 13px; }
`

const harness = `
// ---- Demo harness (no need to change) --------------------------------
let rawCount = 0;
let debouncedCount = 0;

document.body.innerHTML = \`
  <button id="tick">Click me fast</button>
  <p>Raw clicks: <b id="raw">0</b></p>
  <p>Debounced calls: <b id="debounced">0</b></p>
  <p class="hint">A correct debounce(fn, 500) fires once, 500ms after you stop clicking.</p>
\`;

const rawEl = document.getElementById("raw");
const debouncedEl = document.getElementById("debounced");

const bump = debounce(() => {
  debouncedCount += 1;
  debouncedEl.textContent = debouncedCount;
}, 500);

document.getElementById("tick").addEventListener("click", () => {
  rawCount += 1;
  rawEl.textContent = rawCount;
  bump();
});
`

export const starterFiles = {
  '/index.js': {
    code: `import "./styles.css";

// ---- Your task -------------------------------------------------------
// Implement debounce(fn, delay): return a wrapped function that postpones
// calling \`fn\` until \`delay\` ms have passed since the LAST call.
// Rapid calls should collapse into a single invocation.
function debounce(fn, delay) {
  // TODO: replace this passthrough with a real implementation.
  return fn;
}
// ----------------------------------------------------------------------
${harness}`,
  },
  '/styles.css': { code: styles },
}

export const solutionFiles = {
  '/index.js': {
    code: `import "./styles.css";

function debounce(fn, delay) {
  let timeoutId;

  // A regular function (not an arrow) so \`this\` at the call site can be
  // forwarded through to fn.
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
${harness}`,
  },
  '/styles.css': { code: styles },
}
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/problems/debounce/
git commit -m "feat(playground): add debounce seed problem"
```

---

### Task 6: Problem registry and loader

Uses `import.meta.glob` so adding a problem means creating a folder + one registry entry — never editing a component. This deliberately avoids the maintenance burden documented for `practice/` (where each new LLD requires a hand-written static import in `Detail.jsx`).

**Files:**
- Create: `playground/src/problems/index.json`
- Create: `playground/src/problems/loader.js`

- [ ] **Step 1: Create `playground/src/problems/index.json`**

```json
[
  {
    "id": "star-rating",
    "title": "Star Rating",
    "category": "Machine Coding",
    "difficulty": "Easy",
    "template": "react"
  },
  {
    "id": "debounce",
    "title": "Debounce",
    "category": "JavaScript",
    "difficulty": "Medium",
    "template": "vanilla"
  }
]
```

- [ ] **Step 2: Create `playground/src/problems/loader.js`**

```js
import registry from './index.json'

// Vite statically analyses these globs at build time, so every problem
// folder is bundled without a hand-maintained import list.
const fileModules = import.meta.glob('./*/files.js', { eager: true })
const markdownModules = import.meta.glob('./*/problem.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export function listProblems() {
  return registry
}

/**
 * Join a registry entry with its on-disk content. Throws loudly on a
 * mismatch rather than rendering an empty workspace -- same fail-loud
 * convention as tools/md-site/build.py.
 */
export function loadProblem(id) {
  const entry = registry.find((problem) => problem.id === id)
  if (!entry) throw new Error(`Unknown problem id: ${id}`)

  const module = fileModules[`./${id}/files.js`]
  if (!module) throw new Error(`Missing files.js for problem: ${id}`)

  const markdown = markdownModules[`./${id}/problem.md`]
  if (markdown === undefined) {
    throw new Error(`Missing problem.md for problem: ${id}`)
  }

  return {
    ...entry,
    markdown,
    starterFiles: module.starterFiles,
    solutionFiles: module.solutionFiles,
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/problems/index.json playground/src/problems/loader.js
git commit -m "feat(playground): add glob-based problem registry and loader"
```

---

### Task 7: Problem validation script (TDD)

**Files:**
- Create: `playground/scripts/validate-problems.mjs`
- Test: `playground/scripts/validate-problems.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `playground/scripts/validate-problems.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { collectProblemErrors } from './validate-problems.mjs'

const VALID_ENTRY = {
  id: 'debounce',
  title: 'Debounce',
  category: 'JavaScript',
  difficulty: 'Medium',
  template: 'vanilla',
}

test('no errors when every entry has matching files on disk', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasFiles: () => true,
    hasMarkdown: () => true,
  })
  assert.deepEqual(errors, [])
})

test('reports a registry entry with no folder on disk', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: [],
    hasFiles: () => false,
    hasMarkdown: () => false,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /debounce.*no folder/i)
})

test('reports a folder missing files.js', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasFiles: () => false,
    hasMarkdown: () => true,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /files\.js/)
})

test('reports a folder missing problem.md', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasFiles: () => true,
    hasMarkdown: () => false,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /problem\.md/)
})

test('reports an orphan folder missing from the registry', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce', 'orphaned'],
    hasFiles: () => true,
    hasMarkdown: () => true,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /orphaned.*not in the registry/i)
})

test('reports an unsupported template value', () => {
  const errors = collectProblemErrors({
    registry: [{ ...VALID_ENTRY, template: 'cobol' }],
    folders: ['debounce'],
    hasFiles: () => true,
    hasMarkdown: () => true,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /template/)
})

test('reports a duplicate id', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY, VALID_ENTRY],
    folders: ['debounce'],
    hasFiles: () => true,
    hasMarkdown: () => true,
  })
  assert.ok(errors.some((e) => /duplicate/i.test(e)))
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd playground && node --test scripts/`
Expected: FAIL — `Cannot find module '.../scripts/validate-problems.mjs'`

- [ ] **Step 3: Write the implementation**

Create `playground/scripts/validate-problems.mjs`:

```js
#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SUPPORTED_TEMPLATES = new Set(['react', 'vanilla'])

/**
 * Pure comparison of a registry against what's on disk. Filesystem access is
 * injected so this is directly unit-testable.
 */
export function collectProblemErrors({ registry, folders, hasFiles, hasMarkdown }) {
  const errors = []
  const seen = new Set()
  const folderSet = new Set(folders)

  for (const entry of registry) {
    const { id, template } = entry

    if (seen.has(id)) {
      errors.push(`Duplicate registry id: ${id}`)
      continue
    }
    seen.add(id)

    if (!SUPPORTED_TEMPLATES.has(template)) {
      errors.push(
        `Problem "${id}" has an unsupported template: ${template} ` +
          `(expected one of: ${[...SUPPORTED_TEMPLATES].join(', ')})`,
      )
    }

    if (!folderSet.has(id)) {
      errors.push(`Problem "${id}" is in the registry but has no folder on disk`)
      continue
    }

    if (!hasFiles(id)) errors.push(`Problem "${id}" is missing files.js`)
    if (!hasMarkdown(id)) errors.push(`Problem "${id}" is missing problem.md`)
  }

  for (const folder of folders) {
    if (!seen.has(folder)) {
      errors.push(`Folder "${folder}" exists but is not in the registry`)
    }
  }

  return errors
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url))
  const problemsDir = join(here, '..', 'src', 'problems')

  const registry = JSON.parse(
    readFileSync(join(problemsDir, 'index.json'), 'utf8'),
  )
  const folders = readdirSync(problemsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  const errors = collectProblemErrors({
    registry,
    folders,
    hasFiles: (id) => existsSync(join(problemsDir, id, 'files.js')),
    hasMarkdown: (id) => existsSync(join(problemsDir, id, 'problem.md')),
  })

  if (errors.length > 0) {
    console.error('Problem validation failed:')
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
  }

  console.log(`Problem validation passed (${registry.length} problems).`)
}

// Only run main() when executed directly, so importing this module in tests
// doesn't touch the filesystem or call process.exit().
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd playground && node --test scripts/`
Expected: PASS — `# pass 7`, `# fail 0`

- [ ] **Step 5: Verify the script passes against the real problems**

Run: `cd playground && npm run validate`
Expected: `Problem validation passed (2 problems).`

- [ ] **Step 6: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/scripts/
git commit -m "feat(playground): add problem registry validation script with tests"
```

---

### Task 8: Workspace components

**Files:**
- Create: `playground/src/components/MarkdownView.jsx`
- Create: `playground/src/components/PersistenceBridge.jsx`
- Create: `playground/src/components/ProblemWorkspace.jsx`

- [ ] **Step 1: Create `playground/src/components/MarkdownView.jsx`**

```jsx
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

export default function MarkdownView({ markdown }) {
  if (!markdown) return null

  return (
    <div className="markdown-view">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdown}</ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 2: Create `playground/src/components/PersistenceBridge.jsx`**

A headless component: it must live *inside* `SandpackProvider` to read files via `useSandpack()`, but renders nothing.

```jsx
import { useEffect, useRef } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { toSavedShape } from '../lib/persistence.js'
import { writeSaved } from '../lib/storage.js'

const SAVE_DEBOUNCE_MS = 500

/**
 * Renders nothing -- exists to observe Sandpack's file state from inside the
 * provider and debounce-save it. `enabled` is false while the reference
 * solution is on screen, so viewing the solution never overwrites the user's
 * own saved attempt.
 */
export default function PersistenceBridge({ problemId, enabled }) {
  const { sandpack } = useSandpack()
  const { files } = sandpack
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      writeSaved(problemId, toSavedShape(files))
    }, SAVE_DEBOUNCE_MS)

    return () => clearTimeout(timeoutRef.current)
  }, [files, problemId, enabled])

  return null
}
```

- [ ] **Step 3: Create `playground/src/components/ProblemWorkspace.jsx`**

```jsx
import { useMemo, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  defaultDark,
} from '@codesandbox/sandpack-react'
import { mergePersistedFiles } from '../lib/persistence.js'
import { readSaved, clearSaved } from '../lib/storage.js'
import MarkdownView from './MarkdownView.jsx'
import PersistenceBridge from './PersistenceBridge.jsx'

export default function ProblemWorkspace({ problem }) {
  const [showSolution, setShowSolution] = useState(false)
  // Bumping this remounts Sandpack, which is how we discard in-editor state
  // when resetting back to the starter files.
  const [resetToken, setResetToken] = useState(0)

  // Read localStorage once per (problem, reset) rather than on every render.
  // resetToken is in the dependency list on purpose: bumping it is what forces
  // a re-read after the saved copy has been cleared.
  const attemptFiles = useMemo(
    () => mergePersistedFiles(problem.starterFiles, readSaved(problem.id)),
    [problem.id, problem.starterFiles, resetToken],
  )

  const files = showSolution ? problem.solutionFiles : attemptFiles

  const handleReset = () => {
    if (!window.confirm('Discard your saved code and restore the starter?')) return
    clearSaved(problem.id)
    setShowSolution(false)
    setResetToken((token) => token + 1)
  }

  return (
    <section className="workspace">
      <header className="workspace-head">
        <div>
          <h1>{problem.title}</h1>
          <p className="workspace-meta">
            <span>{problem.category}</span>
            <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
          </p>
        </div>
        <div className="workspace-actions">
          <button type="button" onClick={() => setShowSolution((shown) => !shown)}>
            {showSolution ? '← Back to my code' : 'Reveal solution'}
          </button>
          <button type="button" className="ghost" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      {showSolution && (
        <p className="solution-banner">
          Viewing the reference solution — edits here are not saved.
        </p>
      )}

      <div className="workspace-body">
        <aside className="workspace-description">
          <MarkdownView markdown={problem.markdown} />
        </aside>

        <div className="workspace-sandbox">
          <SandpackProvider
            key={`${problem.id}:${showSolution ? 'solution' : 'attempt'}:${resetToken}`}
            template={problem.template}
            theme={defaultDark}
            files={files}
          >
            <PersistenceBridge problemId={problem.id} enabled={!showSolution} />
            <SandpackLayout>
              <SandpackCodeEditor showLineNumbers showTabs />
              <SandpackPreview showOpenInCodeSandbox={false} />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/components/
git commit -m "feat(playground): add Sandpack workspace with solution toggle and persistence"
```

---

### Task 9: Sidebar and app shell

**Files:**
- Create: `playground/src/components/Sidebar.jsx`
- Modify: `playground/src/App.jsx` (replaces the Task 1 placeholder)
- Modify: `playground/src/styles.css` (appends layout styles)

- [ ] **Step 1: Create `playground/src/components/Sidebar.jsx`**

```jsx
import { useMemo, useState } from 'react'

const ALL = 'All'

export default function Sidebar({ problems, selectedId, onSelect }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)

  const categories = useMemo(
    () => [ALL, ...new Set(problems.map((problem) => problem.category))],
    [problems],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return problems.filter((problem) => {
      if (category !== ALL && problem.category !== category) return false
      if (!needle) return true
      return `${problem.title} ${problem.category}`.toLowerCase().includes(needle)
    })
  }, [problems, query, category])

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        Play<span>ground</span>
      </div>

      <input
        className="sidebar-search"
        type="search"
        value={query}
        placeholder="Search problems…"
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="sidebar-filters">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={name === category ? 'chip active' : 'chip'}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <ul className="sidebar-list">
        {visible.map((problem) => (
          <li key={problem.id}>
            <button
              type="button"
              className={problem.id === selectedId ? 'item active' : 'item'}
              onClick={() => onSelect(problem.id)}
            >
              <span className="item-title">{problem.title}</span>
              <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="sidebar-empty">No matches.</li>}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: Replace `playground/src/App.jsx`**

```jsx
import { useMemo, useState } from 'react'
import { listProblems, loadProblem } from './problems/loader.js'
import Sidebar from './components/Sidebar.jsx'
import ProblemWorkspace from './components/ProblemWorkspace.jsx'

export default function App() {
  const problems = useMemo(() => listProblems(), [])
  const [selectedId, setSelectedId] = useState(problems[0]?.id ?? null)

  const problem = useMemo(
    () => (selectedId ? loadProblem(selectedId) : null),
    [selectedId],
  )

  return (
    <div className="layout">
      <Sidebar problems={problems} selectedId={selectedId} onSelect={setSelectedId} />
      <main className="main">
        {problem ? (
          <ProblemWorkspace key={problem.id} problem={problem} />
        ) : (
          <p className="empty-state">No problems yet.</p>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Append layout styles to `playground/src/styles.css`**

Append the following after the existing content (keep the `:root` block and base rules from Task 1, and delete the now-unused `.app-shell` rule):

```css
.layout { display: flex; height: 100%; min-height: 0; }

/* ---- sidebar ---- */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--pg-panel);
  border-right: 1px solid var(--pg-line);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}
.sidebar-brand { font-size: 18px; font-weight: 700; }
.sidebar-brand span { color: var(--pg-accent); }
.sidebar-search {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--pg-line);
  background: var(--pg-bg);
  color: var(--pg-text);
  font-size: 13.5px;
  outline: none;
}
.sidebar-filters { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  font-size: 12px;
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid var(--pg-line);
  background: transparent;
  color: var(--pg-muted);
  cursor: pointer;
}
.chip.active { background: var(--pg-accent); border-color: var(--pg-accent); color: #1a1206; }
.sidebar-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--pg-text);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}
.item:hover { background: var(--pg-panel-alt); }
.item.active { background: var(--pg-panel-alt); border-color: var(--pg-line); }
.item-title { min-width: 0; }
.sidebar-empty { color: var(--pg-faint); font-size: 13px; padding: 8px 12px; }

/* ---- difficulty pills ---- */
.difficulty {
  font-family: var(--pg-mono);
  font-size: 10.5px;
  padding: 2px 8px;
  border-radius: 999px;
  flex-shrink: 0;
}
.difficulty.easy { color: var(--pg-easy); background: rgba(74, 222, 128, 0.14); }
.difficulty.medium { color: var(--pg-medium); background: rgba(224, 164, 88, 0.14); }
.difficulty.hard { color: var(--pg-hard); background: rgba(241, 113, 113, 0.14); }

/* ---- workspace ---- */
.main { flex: 1; min-width: 0; min-height: 0; overflow: hidden; }
.workspace { height: 100%; display: flex; flex-direction: column; min-height: 0; }
.workspace-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--pg-line);
  flex-shrink: 0;
}
.workspace-head h1 { margin: 0 0 6px; font-size: 20px; }
.workspace-meta { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--pg-muted); }
.workspace-actions { display: flex; gap: 8px; flex-shrink: 0; }
.workspace-actions button {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--pg-accent);
  background: var(--pg-accent);
  color: #1a1206;
  cursor: pointer;
}
.workspace-actions button.ghost { background: transparent; color: var(--pg-muted); border-color: var(--pg-line); }
.solution-banner {
  margin: 0;
  padding: 8px 24px;
  font-size: 12.5px;
  color: var(--pg-accent);
  background: rgba(224, 164, 88, 0.1);
  border-bottom: 1px solid var(--pg-line);
  flex-shrink: 0;
}
.workspace-body { flex: 1; display: flex; min-height: 0; }
.workspace-description {
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 20px 24px;
  border-right: 1px solid var(--pg-line);
}
.workspace-sandbox { flex: 1; min-width: 0; min-height: 0; }
/* Make Sandpack fill the remaining height instead of its default fixed size. */
.workspace-sandbox .sp-wrapper,
.workspace-sandbox .sp-layout { height: 100%; }
.workspace-sandbox .sp-stack { height: 100% !important; }

/* ---- markdown ---- */
.markdown-view { font-size: 14px; line-height: 1.65; }
.markdown-view h1 { font-size: 19px; margin-top: 0; }
.markdown-view h2 { font-size: 15px; color: var(--pg-accent); margin-top: 22px; }
.markdown-view code { font-family: var(--pg-mono); font-size: 12.5px; }
.markdown-view :not(pre) > code {
  background: var(--pg-panel-alt);
  padding: 1px 5px;
  border-radius: 4px;
}
.markdown-view pre { border-radius: 8px; padding: 12px; overflow-x: auto; }
.markdown-view a { color: var(--pg-accent); }

.empty-state { padding: 40px; color: var(--pg-faint); }
```

- [ ] **Step 4: Verify both problems work end to end**

Run: `cd playground && npm run dev`, then open the printed URL and check each item:

1. Sidebar lists **Star Rating** and **Debounce**; the category chips filter the list.
2. Star Rating (react template) loads — the editor shows `/App.js` and the preview renders five grey stars.
3. Type an edit in the editor and confirm the preview live-updates.
4. Reload the page — your edit is still there (persistence works).
5. Click **Reveal solution** — the working solution loads; hover/click on the stars behaves per the spec.
6. Click **← Back to my code** — your own edited attempt returns, unchanged.
7. Switch to Debounce (vanilla template) — the preview shows the button and two counters.
8. Click **Reveal solution**, then click the preview button rapidly: the raw counter climbs per click, the debounced counter increments once ~500ms after you stop.
9. Click **Reset**, accept the confirm — the starter code returns.

Stop the dev server with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/App.jsx playground/src/components/Sidebar.jsx playground/src/styles.css
git commit -m "feat(playground): add sidebar, app shell, and dark IDE styling"
```

---

### Task 10: Build output and hub integration

**Files:**
- Create: `playground-build/` (generated)
- Modify: `index.html` (repo root, line 72 — after the Java Notes button)

- [ ] **Step 1: Run the full test suite**

Run: `cd playground && npm test`
Expected: PASS — all tests from `scripts/` and `src/lib/`, `# fail 0`

- [ ] **Step 2: Build the static output**

Run: `cd playground && npm run build`
Expected: validation prints `Problem validation passed (2 problems).`, then Vite writes to `../playground-build/` and prints a `✓ built in` summary.

- [ ] **Step 3: Verify the built output uses relative asset paths**

Run: `grep -o 'src="[^"]*"' /Volumes/Personal/MechineCoding/playground-build/index.html`
Expected: paths begin with `./assets/`, not `/assets/` — confirming `base: './'` took effect (absolute paths would 404 under the GitHub Pages subpath).

- [ ] **Step 4: Add the hub nav button**

In `/Volumes/Personal/MechineCoding/index.html`, find:

```html
  <button type="button" data-src="javanotes-notes/index.html">Java Notes</button>
</nav>
```

Replace with:

```html
  <button type="button" data-src="javanotes-notes/index.html">Java Notes</button>
  <button type="button" data-src="playground-build/index.html">Playground</button>
</nav>
```

- [ ] **Step 5: Verify the hub serves the built app**

```bash
cd /Volumes/Personal/MechineCoding
python3 -m http.server 8936 >/tmp/pg-server.log 2>&1 &
sleep 1
curl -s -o /dev/null -w "hub: %{http_code}\n" localhost:8936/index.html
curl -s -o /dev/null -w "playground: %{http_code}\n" localhost:8936/playground-build/index.html
curl -s localhost:8936/index.html | grep -c 'playground-build/index.html'
kill %1
```

Expected: both `200`, and the grep count is `1`.

Then open `http://localhost:8936/index.html` in a browser, click the **Playground** tab, and confirm the app loads inside the iframe and a problem's preview renders.

- [ ] **Step 6: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add index.html playground-build/
git commit -m "feat(playground): build static output and add hub nav tab"
```

---

### Task 11: Document the workflow

**Files:**
- Create: `playground/README.md`
- Modify: `CLAUDE.md` (repo root — the repository-layout table and a new section)

- [ ] **Step 1: Create `playground/README.md`**

````markdown
# playground — in-browser coding platform

A StackBlitz-style practice app: pick a problem, solve it in a real
in-browser editor, see it run live. Built with Vite + React and
[Sandpack](https://sandpack.codesandbox.io/), which supplies the bundler,
editor, and preview iframe.

## Commands

```bash
cd playground
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Node's built-in runner)
npm run validate   # check the problem registry against disk
npm run build      # validate, then build into ../playground-build/
```

`playground-build/` is committed and is what the root hub page links to.
Re-run `npm run build` and commit the output after changing any problem.

## Adding a problem

1. Create `src/problems/<id>/` containing:
   - `problem.md` — the description shown beside the editor.
   - `files.js` — exports `starterFiles` and `solutionFiles`, each a Sandpack
     file map (`{ '/App.js': { code: '...' } }`).
2. Add an entry to `src/problems/index.json`:
   ```json
   { "id": "<id>", "title": "...", "category": "...", "difficulty": "Easy", "template": "react" }
   ```
   `template` is `react` or `vanilla`.
3. Run `npm run validate` to confirm the registry and disk agree.

No component edits are needed — `src/problems/loader.js` discovers folders via
`import.meta.glob`.

## Template file paths

- `react`: `/App.js`, `/index.js`, `/styles.css`, `/package.json`, `/public/index.html`
- `vanilla`: `/index.html`, `/index.js`, `/styles.css`, `/package.json`

Only override the files your problem actually needs; the rest come from the
template.

## Persistence

In-editor changes are debounce-saved to `localStorage` under
`playground:<problem-id>`. Viewing the reference solution never overwrites a
saved attempt. **Reset** clears the saved copy and restores the starter files.
````

- [ ] **Step 2: Add `playground/` to the CLAUDE.md repository-layout table**

In `/Volumes/Personal/MechineCoding/CLAUDE.md`, find this row in the layout table:

```
| `practice/` | Vite + React 18 app for visualizing LLD solutions |
```

Add immediately after it:

```
| `playground/` | Vite + React app: in-browser coding platform (Sandpack editor + live preview) |
| `playground-build/` | Generated static build of `playground/` — not hand-edited |
```

- [ ] **Step 3: Add a CLAUDE.md section describing the workflow**

In `/Volumes/Personal/MechineCoding/CLAUDE.md`, add this section immediately before the `### System design docs` heading:

````markdown
### Playground app (`playground/`)

An in-browser coding platform (Sandpack) — separate from `practice/`, which it
supersedes for new problems. See `playground/README.md` for full usage.

```bash
cd playground && npm install
npm run dev      # http://localhost:5173
npm run build    # validates, then builds into ../playground-build/
```

Adding a problem requires **no component changes** — create
`src/problems/<id>/{problem.md,files.js}` and add one entry to
`src/problems/index.json`; `loader.js` finds it via `import.meta.glob`.
(Contrast with `practice/`, where each new LLD needs a hand-written static
import in `Detail.jsx`.)

`playground-build/` is generated output — never hand-edit it. Re-run
`npm run build` and commit the result after changing any problem.
````

- [ ] **Step 4: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/README.md CLAUDE.md
git commit -m "docs(playground): document workflow and adding problems"
```

---

## Verification Checklist

Before considering the plan complete, confirm all of these:

- [ ] `cd playground && npm test` passes (13 tests: 6 persistence + 7 validator)
- [ ] `cd playground && npm run validate` reports 2 problems
- [ ] `cd playground && npm run build` succeeds and writes `playground-build/`
- [ ] `playground-build/index.html` references `./assets/…` (relative paths)
- [ ] Star Rating: preview renders, edit persists across reload, solution toggle round-trips
- [ ] Debounce: preview renders, solution's debounced counter fires once after rapid clicks
- [ ] Root hub page shows a working **Playground** tab
- [ ] `git status` is clean (no stray untracked files; `playground/node_modules/` is already gitignored)
