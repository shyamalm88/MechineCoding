# Playground — Code + Preview Reference App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browsable library at `playground/` where each interview problem shows a live running preview beside its real, syntax-highlighted source — seeded with two problems.

**Architecture:** A standalone Vite + React 18 app. Each problem is a folder whose `Solution.jsx` default-exports a component; the Preview tab renders that component directly (no iframe, no second bundler) and the Code tab shows the same folder's source via Vite's `?raw` import, so what's displayed is provably what ran. `import.meta.glob` discovers problems, so adding one never requires editing a component.

**Tech Stack:** Vite 5, React 18.2, `react-markdown` + `rehype-highlight` + `highlight.js`, `node --test` (built into Node 20). **No new packages** — every dependency is already in `practice/`'s tree.

**Spec:** `docs/superpowers/specs/2026-08-26-playground-code-preview-design.md`

---

## Verified Facts

Confirmed before writing this plan — do not substitute from memory:

- `highlight.js@11.11.1` is already installed transitively via
  `rehype-highlight` → `lowlight`. Declaring it directly in `package.json`
  installs nothing new; it just stops us relying on hoisting.
- `playground-build/` is **not** matched by the repo `.gitignore` (`build/`
  matches only a directory named exactly `build`), so the built output can be
  committed.
- Node 20.15 ships `node --test`; a `node --test <dir>` run works with no
  test-framework dependency.
- `practice/` already uses `react-markdown` + `rehype-highlight` and imports
  `highlight.js/styles/github-dark.css` — this plan follows that same pattern.

## Vite glob mechanics this plan depends on

Three eager globs, two of them over the *same* files with different queries:

```js
import.meta.glob('./*/Solution.jsx', { eager: true })                                  // modules
import.meta.glob('./*/*.{jsx,js,css}', { eager: true, query: '?raw', import: 'default' }) // source text
import.meta.glob('./*/problem.md',    { eager: true, query: '?raw', import: 'default' })  // description
```

`query: '?raw'` + `import: 'default'` yields the file contents as a plain
string. (`as: 'raw'` is the deprecated Vite 4 spelling — do not use it.)

---

## File Structure

| File | Responsibility |
|---|---|
| `playground/package.json` | Deps + `dev`/`build`/`validate`/`test` scripts |
| `playground/vite.config.js` | React plugin, `base: './'`, output to `../playground-build` |
| `playground/index.html` | Vite HTML entry |
| `playground/src/main.jsx` | React 18 root mount |
| `playground/src/styles.css` | Dark IDE theme |
| `playground/src/App.jsx` | Shell: sidebar + workspace |
| `playground/src/lib/sources.js` | Pure: group/order globbed source files per problem |
| `playground/src/lib/sources.test.mjs` | Unit tests for the above |
| `playground/src/problems/index.json` | Problem metadata registry |
| `playground/src/problems/loader.js` | Glob discovery; joins registry + component + source |
| `playground/src/problems/star-rating/` | Seed problem (UI component) |
| `playground/src/problems/debounce/` | Seed problem (utility + demo harness) |
| `playground/src/components/Sidebar.jsx` | Problem list with search + filters |
| `playground/src/components/ProblemWorkspace.jsx` | Description + Preview/Code tabs |
| `playground/src/components/PreviewPane.jsx` | Renders the component inside an error boundary |
| `playground/src/components/CodeView.jsx` | File tabs + syntax-highlighted source |
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
    "highlight.js": "^11.11.1",
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

`base: './'` is required — the built app is served from a GitHub Pages subpath
(`/MechineCoding/playground-build/`), where absolute asset paths would 404.

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

Replaced in Task 8 — exists only so the dev server boots and proves the
toolchain works.

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
Expected: completes with no `ERESOLVE` peer-dependency errors.

- [ ] **Step 8: Verify the dev server boots**

Run: `cd playground && npm run dev`
Expected: Vite prints `Local: http://localhost:5173/` and the page shows
"Playground scaffold OK". Stop with Ctrl-C.

- [ ] **Step 9: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/package.json playground/package-lock.json playground/vite.config.js playground/index.html playground/src/main.jsx playground/src/App.jsx playground/src/styles.css
git commit -m "feat(playground): scaffold Vite + React app shell"
```

---

### Task 2: Seed problem — Star Rating (UI component)

**Files:**
- Create: `playground/src/problems/star-rating/problem.md`
- Create: `playground/src/problems/star-rating/Solution.jsx`
- Create: `playground/src/problems/star-rating/styles.css`

- [ ] **Step 1: Create `playground/src/problems/star-rating/problem.md`**

```markdown
# Star Rating

A 5-star rating widget with hover preview.

## Requirements

- Hovering a star previews that rating — every star up to and including the
  hovered one fills.
- Moving the pointer off the widget restores the committed rating.
- Clicking a star commits that rating.
- Show the committed rating as text, or "No rating yet".

## How it works

Two pieces of state: the committed `rating`, and a transient `hovered` value.
The displayed value is `hovered || rating` — hover wins while the pointer is
over the widget, and falls back to the real rating once it leaves.

`onMouseLeave` sits on the **container**, not on each star. Putting it on each
star would clear the preview while moving between adjacent stars, making the
fill flicker.
```

- [ ] **Step 2: Create `playground/src/problems/star-rating/styles.css`**

Class names are prefixed `sr-` because this stylesheet is bundled into the
same document as the app shell — unprefixed names like `.star` would collide
with other problems added later.

```css
.sr-rating { display: flex; align-items: center; gap: 4px; }

.sr-star {
  font-size: 32px;
  line-height: 1;
  color: #4a5163;
  cursor: pointer;
  user-select: none;
  transition: color 0.12s ease;
}

.sr-star.sr-filled { color: #f5b301; }

.sr-label { margin-left: 14px; font-size: 14px; color: #8b95a9; }
```

- [ ] **Step 3: Create `playground/src/problems/star-rating/Solution.jsx`**

```jsx
import { useState } from 'react'
import './styles.css'

const STARS = [1, 2, 3, 4, 5]

export default function StarRating() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  // Hover wins while the pointer is over the widget; otherwise show what the
  // user actually committed.
  const active = hovered || rating

  return (
    <div className="sr-rating" onMouseLeave={() => setHovered(0)}>
      {STARS.map((value) => (
        <span
          key={value}
          className={value <= active ? 'sr-star sr-filled' : 'sr-star'}
          role="button"
          tabIndex={0}
          aria-label={`Rate ${value} out of 5`}
          onMouseEnter={() => setHovered(value)}
          onClick={() => setRating(value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setRating(value)
          }}
        >
          ★
        </span>
      ))}
      <p className="sr-label">{rating ? `${rating} / 5` : 'No rating yet'}</p>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/problems/star-rating/
git commit -m "feat(playground): add star-rating seed problem"
```

---

### Task 3: Seed problem — Debounce (utility + demo harness)

Split across two source files on purpose: it proves the Code tab's file tabs
work, and it mirrors how the utility would actually be used in a real project.

**Files:**
- Create: `playground/src/problems/debounce/problem.md`
- Create: `playground/src/problems/debounce/debounce.js`
- Create: `playground/src/problems/debounce/Solution.jsx`

- [ ] **Step 1: Create `playground/src/problems/debounce/problem.md`**

```markdown
# Debounce

`debounce(fn, delay)` returns a wrapped function that postpones calling `fn`
until `delay` ms have elapsed since the **last** call. Rapid successive calls
collapse into a single invocation.

## How to see it work

Click the button rapidly in the Preview tab. The raw counter increments on
every click; the debounced counter increments **once**, 500ms after you stop.

## How it works

The pending timer id lives in a closure variable. Every call clears the
previous timer before scheduling a new one, so only the final call in a burst
ever fires.

The returned wrapper is a regular `function`, not an arrow — that keeps `this`
dynamic so it can be forwarded with `fn.apply(this, args)`. An arrow function
would capture `this` from the definition site instead, breaking method usage
like `obj.debouncedMethod()`.

## Debounce vs. throttle

Debounce waits for the activity to *stop* — good for search-as-you-type or
resize handlers. Throttle fires at a steady maximum rate *during* activity —
good for scroll position tracking.
```

- [ ] **Step 2: Create `playground/src/problems/debounce/debounce.js`**

```js
/**
 * Postpone calling `fn` until `delay` ms have passed since the last call to
 * the returned wrapper. A burst of calls collapses into one invocation.
 */
export function debounce(fn, delay) {
  let timeoutId

  // A regular function (not an arrow) so `this` stays dynamic and can be
  // forwarded to fn -- otherwise obj.debounced() would lose its receiver.
  return function debounced(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

- [ ] **Step 3: Create `playground/src/problems/debounce/Solution.jsx`**

```jsx
import { useMemo, useRef, useState } from 'react'
import { debounce } from './debounce.js'

const DELAY_MS = 500

export default function DebounceDemo() {
  const [rawCount, setRawCount] = useState(0)
  const [debouncedCount, setDebouncedCount] = useState(0)

  // useRef + useMemo so the debounced wrapper survives re-renders. Recreating
  // it every render would reset its pending timer, and nothing would ever be
  // debounced.
  const bumpRef = useRef(() => setDebouncedCount((count) => count + 1))
  const bumpDebounced = useMemo(() => debounce(() => bumpRef.current(), DELAY_MS), [])

  const handleClick = () => {
    setRawCount((count) => count + 1)
    bumpDebounced()
  }

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Click me fast
      </button>
      <p>
        Raw clicks: <b>{rawCount}</b>
      </p>
      <p>
        Debounced calls: <b>{debouncedCount}</b>
      </p>
      <p style={{ color: '#8b95a9', fontSize: 13 }}>
        The debounced counter fires once, {DELAY_MS}ms after you stop clicking.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/problems/debounce/
git commit -m "feat(playground): add debounce seed problem"
```

---

### Task 4: Source-file grouping logic (TDD)

Pure function — turns the flat glob result into per-problem ordered file
lists. Real logic worth testing: the ordering rule (`Solution.jsx` first) and
correct folder attribution.

**Files:**
- Create: `playground/src/lib/sources.js`
- Test: `playground/src/lib/sources.test.mjs`

- [ ] **Step 1: Write the failing tests**

Create `playground/src/lib/sources.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupSourcesByProblem, ENTRY_FILENAME } from './sources.js'

test('ENTRY_FILENAME is Solution.jsx', () => {
  assert.equal(ENTRY_FILENAME, 'Solution.jsx')
})

test('groups files under their problem id', () => {
  const grouped = groupSourcesByProblem({
    './star-rating/Solution.jsx': 'jsx source',
    './star-rating/styles.css': 'css source',
    './debounce/Solution.jsx': 'demo source',
  })

  assert.deepEqual(Object.keys(grouped).sort(), ['debounce', 'star-rating'])
  assert.equal(grouped['star-rating'].length, 2)
  assert.equal(grouped.debounce.length, 1)
})

test('each file carries its name and contents', () => {
  const grouped = groupSourcesByProblem({
    './debounce/Solution.jsx': 'demo source',
  })

  assert.deepEqual(grouped.debounce[0], {
    name: 'Solution.jsx',
    code: 'demo source',
  })
})

test('Solution.jsx sorts first regardless of glob order', () => {
  const grouped = groupSourcesByProblem({
    './debounce/debounce.js': 'util',
    './debounce/Solution.jsx': 'demo',
  })

  assert.deepEqual(
    grouped.debounce.map((file) => file.name),
    ['Solution.jsx', 'debounce.js'],
  )
})

test('remaining files sort alphabetically after the entry file', () => {
  const grouped = groupSourcesByProblem({
    './x/styles.css': 'c',
    './x/helpers.js': 'b',
    './x/Solution.jsx': 'a',
  })

  assert.deepEqual(
    grouped.x.map((file) => file.name),
    ['Solution.jsx', 'helpers.js', 'styles.css'],
  )
})

test('ignores paths that are not two segments deep', () => {
  const grouped = groupSourcesByProblem({
    './loose.js': 'not in a problem folder',
    './x/Solution.jsx': 'kept',
  })

  assert.deepEqual(Object.keys(grouped), ['x'])
})

test('returns an empty object for an empty glob result', () => {
  assert.deepEqual(groupSourcesByProblem({}), {})
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd playground && node --test src/lib/`
Expected: FAIL — `Cannot find module '.../src/lib/sources.js'`

- [ ] **Step 3: Write the implementation**

Create `playground/src/lib/sources.js`:

```js
/** The file in each problem folder whose default export gets previewed. */
export const ENTRY_FILENAME = 'Solution.jsx'

/**
 * Turn a flat `import.meta.glob` result keyed by path:
 *   { './star-rating/Solution.jsx': '<source>' }
 * into per-problem ordered file lists:
 *   { 'star-rating': [{ name: 'Solution.jsx', code: '<source>' }] }
 *
 * The entry file is listed first so the Code tab opens on the component
 * itself rather than on a stylesheet; everything else follows alphabetically.
 */
export function groupSourcesByProblem(globResult) {
  const grouped = {}

  for (const [path, code] of Object.entries(globResult)) {
    // './<problem-id>/<file>' -> ['', '<problem-id>', '<file>']
    const segments = path.split('/')
    if (segments.length !== 3) continue

    const [, problemId, name] = segments
    if (!grouped[problemId]) grouped[problemId] = []
    grouped[problemId].push({ name, code })
  }

  for (const files of Object.values(grouped)) {
    files.sort((a, b) => {
      if (a.name === ENTRY_FILENAME) return -1
      if (b.name === ENTRY_FILENAME) return 1
      return a.name.localeCompare(b.name)
    })
  }

  return grouped
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd playground && node --test src/lib/`
Expected: PASS — `# pass 7`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/lib/sources.js playground/src/lib/sources.test.mjs
git commit -m "feat(playground): add source-file grouping logic with tests"
```

---

### Task 5: Problem registry and loader

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
    "difficulty": "Easy"
  },
  {
    "id": "debounce",
    "title": "Debounce",
    "category": "JavaScript",
    "difficulty": "Medium"
  }
]
```

- [ ] **Step 2: Create `playground/src/problems/loader.js`**

```js
import registry from './index.json'
import { groupSourcesByProblem, ENTRY_FILENAME } from '../lib/sources.js'

// Vite statically analyses these globs at build time, so every problem folder
// is bundled without a hand-maintained import list. The same Solution.jsx is
// globbed twice -- once as a module to render, once as raw text to display --
// which is what guarantees the Code tab shows exactly the code that ran.
const componentModules = import.meta.glob('./*/Solution.jsx', { eager: true })

const sourceTexts = import.meta.glob('./*/*.{jsx,js,css}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const markdownTexts = import.meta.glob('./*/problem.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const sourcesByProblem = groupSourcesByProblem(sourceTexts)

export function listProblems() {
  return registry
}

/**
 * Join a registry entry with its on-disk content. Throws loudly on a mismatch
 * rather than rendering an empty workspace -- same fail-loud convention as
 * tools/md-site/build.py.
 */
export function loadProblem(id) {
  const entry = registry.find((problem) => problem.id === id)
  if (!entry) throw new Error(`Unknown problem id: ${id}`)

  const module = componentModules[`./${id}/${ENTRY_FILENAME}`]
  if (!module?.default) {
    throw new Error(`Problem "${id}" is missing a default export in ${ENTRY_FILENAME}`)
  }

  const markdown = markdownTexts[`./${id}/problem.md`]
  if (markdown === undefined) {
    throw new Error(`Problem "${id}" is missing problem.md`)
  }

  const files = sourcesByProblem[id]
  if (!files?.length) {
    throw new Error(`Problem "${id}" has no source files`)
  }

  return { ...entry, Component: module.default, markdown, files }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/problems/index.json playground/src/problems/loader.js
git commit -m "feat(playground): add glob-based problem registry and loader"
```

---

### Task 6: Problem validation script (TDD)

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
}

const ALL_PRESENT = { hasSolution: () => true, hasMarkdown: () => true }

test('no errors when every entry has matching files on disk', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    ...ALL_PRESENT,
  })
  assert.deepEqual(errors, [])
})

test('reports a registry entry with no folder on disk', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: [],
    hasSolution: () => false,
    hasMarkdown: () => false,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /debounce.*no folder/i)
})

test('reports a folder missing Solution.jsx', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasSolution: () => false,
    hasMarkdown: () => true,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /Solution\.jsx/)
})

test('reports a folder missing problem.md', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce'],
    hasSolution: () => true,
    hasMarkdown: () => false,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /problem\.md/)
})

test('reports an orphan folder missing from the registry', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY],
    folders: ['debounce', 'orphaned'],
    ...ALL_PRESENT,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /orphaned.*not in the registry/i)
})

test('reports a duplicate id', () => {
  const errors = collectProblemErrors({
    registry: [VALID_ENTRY, VALID_ENTRY],
    folders: ['debounce'],
    ...ALL_PRESENT,
  })
  assert.ok(errors.some((error) => /duplicate/i.test(error)))
})

test('reports an entry missing a required metadata field', () => {
  const { difficulty, ...withoutDifficulty } = VALID_ENTRY
  const errors = collectProblemErrors({
    registry: [withoutDifficulty],
    folders: ['debounce'],
    ...ALL_PRESENT,
  })
  assert.equal(errors.length, 1)
  assert.match(errors[0], /difficulty/)
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

const REQUIRED_FIELDS = ['id', 'title', 'category', 'difficulty']
const ENTRY_FILENAME = 'Solution.jsx'

/**
 * Pure comparison of a registry against what's on disk. Filesystem access is
 * injected so this is directly unit-testable.
 */
export function collectProblemErrors({ registry, folders, hasSolution, hasMarkdown }) {
  const errors = []
  // Two sets on purpose: `claimed` is every id the registry mentions at all,
  // `validated` is only those that passed field validation. The orphan check
  // below uses `claimed`, so an entry rejected for a missing field doesn't ALSO
  // get its folder reported as an orphan -- one fault, one error message.
  const claimed = new Set()
  const validated = new Set()
  const folderSet = new Set(folders)

  for (const entry of registry) {
    const { id } = entry
    if (id) claimed.add(id)

    const missingFields = REQUIRED_FIELDS.filter((field) => !entry[field])
    if (missingFields.length > 0) {
      errors.push(
        `Registry entry "${id ?? '<no id>'}" is missing required field(s): ` +
          missingFields.join(', '),
      )
      continue
    }

    if (validated.has(id)) {
      errors.push(`Duplicate registry id: ${id}`)
      continue
    }
    validated.add(id)

    if (!folderSet.has(id)) {
      errors.push(`Problem "${id}" is in the registry but has no folder on disk`)
      continue
    }

    if (!hasSolution(id)) errors.push(`Problem "${id}" is missing ${ENTRY_FILENAME}`)
    if (!hasMarkdown(id)) errors.push(`Problem "${id}" is missing problem.md`)
  }

  for (const folder of folders) {
    if (!claimed.has(folder)) {
      errors.push(`Folder "${folder}" exists but is not in the registry`)
    }
  }

  return errors
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url))
  const problemsDir = join(here, '..', 'src', 'problems')

  const registry = JSON.parse(readFileSync(join(problemsDir, 'index.json'), 'utf8'))
  const folders = readdirSync(problemsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  const errors = collectProblemErrors({
    registry,
    folders,
    hasSolution: (id) => existsSync(join(problemsDir, id, ENTRY_FILENAME)),
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

### Task 7: Workspace components

**Files:**
- Create: `playground/src/components/MarkdownView.jsx`
- Create: `playground/src/components/PreviewPane.jsx`
- Create: `playground/src/components/CodeView.jsx`
- Create: `playground/src/components/ProblemWorkspace.jsx`

- [ ] **Step 1: Create `playground/src/components/MarkdownView.jsx`**

```jsx
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

export default function MarkdownView({ markdown }) {
  if (!markdown) return null

  return (
    <div className="markdown-view">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdown}</ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 2: Create `playground/src/components/PreviewPane.jsx`**

Problem components render in-process, so a throwing component would blank the
whole app without this boundary. React only supports error boundaries as class
components — there is no hook equivalent.

```jsx
import { Component } from 'react'

class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="preview-error">
          <strong>This problem threw while rendering.</strong>
          <pre>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function PreviewPane({ problemId, Component: Problem }) {
  return (
    <div className="preview-pane">
      {/* Keyed by problem id so switching problems resets a previously
          caught error instead of showing it forever. */}
      <PreviewErrorBoundary key={problemId}>
        <Problem />
      </PreviewErrorBoundary>
    </div>
  )
}
```

- [ ] **Step 3: Create `playground/src/components/CodeView.jsx`**

```jsx
import { useEffect, useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import 'highlight.js/styles/github-dark.css'

// Register only the languages these problems actually use, rather than pulling
// in highlight.js's full ~190-language bundle. `xml` is required even though no
// file maps to it directly: highlight.js's javascript grammar delegates to xml
// to highlight JSX tags, and without it JSX renders unstyled.
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

function languageFor(filename) {
  if (filename.endsWith('.css')) return 'css'
  return 'javascript' // .js and .jsx -- highlight.js handles JSX via javascript
}

export default function CodeView({ files }) {
  const [activeName, setActiveName] = useState(files[0].name)

  // If the problem changes, the previously active filename may not exist in
  // the new file list -- fall back to that problem's entry file.
  useEffect(() => {
    if (!files.some((file) => file.name === activeName)) {
      setActiveName(files[0].name)
    }
  }, [files, activeName])

  const active = files.find((file) => file.name === activeName) ?? files[0]

  const highlighted = useMemo(
    () => hljs.highlight(active.code, { language: languageFor(active.name) }).value,
    [active],
  )

  return (
    <div className="code-view">
      {files.length > 1 && (
        <div className="code-tabs">
          {files.map((file) => (
            <button
              key={file.name}
              type="button"
              className={file.name === active.name ? 'code-tab active' : 'code-tab'}
              onClick={() => setActiveName(file.name)}
            >
              {file.name}
            </button>
          ))}
        </div>
      )}
      <pre className="code-block">
        <code
          className="hljs"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  )
}
```

- [ ] **Step 4: Create `playground/src/components/ProblemWorkspace.jsx`**

```jsx
import { useState } from 'react'
import MarkdownView from './MarkdownView.jsx'
import PreviewPane from './PreviewPane.jsx'
import CodeView from './CodeView.jsx'

const TABS = ['Preview', 'Code']

export default function ProblemWorkspace({ problem }) {
  const [tab, setTab] = useState(TABS[0])

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
        <div className="tab-switch">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              className={name === tab ? 'tab active' : 'tab'}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </header>

      <div className="workspace-body">
        <aside className="workspace-description">
          <MarkdownView markdown={problem.markdown} />
        </aside>

        <div className="workspace-stage">
          {tab === 'Preview' ? (
            <PreviewPane problemId={problem.id} Component={problem.Component} />
          ) : (
            <CodeView files={problem.files} />
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/components/
git commit -m "feat(playground): add preview/code workspace components"
```

---

### Task 8: Sidebar and app shell

**Files:**
- Create: `playground/src/components/Sidebar.jsx`
- Modify: `playground/src/App.jsx` (replaces the Task 1 placeholder)
- Modify: `playground/src/styles.css` (append layout styles, remove `.app-shell`)

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

- [ ] **Step 3: Update `playground/src/styles.css`**

Delete the `.app-shell` rule created in Task 1 (its placeholder is gone), keep
the `:root` block and base rules, and append:

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

.tab-switch {
  display: flex;
  gap: 4px;
  background: var(--pg-panel);
  border: 1px solid var(--pg-line);
  border-radius: 9px;
  padding: 4px;
  flex-shrink: 0;
}
.tab {
  font-size: 13px;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--pg-muted);
  cursor: pointer;
}
.tab.active { background: var(--pg-accent); color: #1a1206; }

.workspace-body { flex: 1; display: flex; min-height: 0; }
.workspace-description {
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 20px 24px;
  border-right: 1px solid var(--pg-line);
}
.workspace-stage { flex: 1; min-width: 0; min-height: 0; overflow: auto; }

/* ---- preview ---- */
.preview-pane { padding: 28px; }
.preview-error {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(241, 113, 113, 0.4);
  background: rgba(241, 113, 113, 0.08);
  color: var(--pg-hard);
  font-size: 13.5px;
}
.preview-error pre { margin: 10px 0 0; white-space: pre-wrap; font-family: var(--pg-mono); font-size: 12px; }

/* ---- code ---- */
.code-view { height: 100%; display: flex; flex-direction: column; min-height: 0; }
.code-tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px 0;
  border-bottom: 1px solid var(--pg-line);
  flex-shrink: 0;
}
.code-tab {
  font-family: var(--pg-mono);
  font-size: 12px;
  padding: 7px 13px;
  border: none;
  border-radius: 6px 6px 0 0;
  background: transparent;
  color: var(--pg-faint);
  cursor: pointer;
}
.code-tab.active { background: var(--pg-panel-alt); color: var(--pg-text); }
.code-block {
  margin: 0;
  padding: 18px 22px;
  overflow: auto;
  flex: 1;
  min-height: 0;
  font-family: var(--pg-mono);
  font-size: 12.8px;
  line-height: 1.6;
}
.code-block code.hljs { background: transparent; padding: 0; }

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

Run: `cd playground && npm run dev`, open the printed URL, and check each:

1. Sidebar lists **Star Rating** and **Debounce**; category chips filter the list; the search box filters by title.
2. Star Rating opens on the **Preview** tab showing five grey stars.
3. Hovering star 4 fills stars 1–4; moving the pointer off the widget clears the preview; clicking star 3 commits it and the label reads `3 / 5`.
4. Switch to the **Code** tab — `Solution.jsx` is shown first, syntax-highlighted, with a `styles.css` tab beside it.
5. Select **Debounce** — the Preview tab shows the button and two counters.
6. Click the button ~6 times rapidly: the raw counter matches your click count; the debounced counter increments exactly once, ~500ms after you stop.
7. Debounce's **Code** tab shows two file tabs, `Solution.jsx` first, then `debounce.js`.
8. Edit `src/problems/star-rating/Solution.jsx` in your editor (e.g. change the label text), save, and confirm the Preview hot-reloads without a manual refresh.

Stop the dev server with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add playground/src/App.jsx playground/src/components/Sidebar.jsx playground/src/styles.css
git commit -m "feat(playground): add sidebar, app shell, and dark IDE styling"
```

---

### Task 9: Build output and hub integration

**Files:**
- Create: `playground-build/` (generated)
- Modify: `index.html` (repo root — after the Java Notes button)

- [ ] **Step 1: Run the full test suite**

Run: `cd playground && npm test`
Expected: PASS — 14 tests (7 sources + 7 validator), `# fail 0`

- [ ] **Step 2: Build the static output**

Run: `cd playground && npm run build`
Expected: `Problem validation passed (2 problems).`, then Vite writes to
`../playground-build/` and prints a `✓ built in` summary.

- [ ] **Step 3: Verify the built output uses relative asset paths**

Run: `grep -o 'src="[^"]*"' /Volumes/Personal/MechineCoding/playground-build/index.html`
Expected: paths begin with `./assets/`, not `/assets/` — confirming
`base: './'` took effect. Absolute paths would 404 under the Pages subpath.

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

Then open `http://localhost:8936/index.html`, click the **Playground** tab, and
confirm the app loads in the iframe and a preview renders.

- [ ] **Step 6: Commit**

```bash
cd /Volumes/Personal/MechineCoding
git add index.html playground-build/
git commit -m "feat(playground): build static output and add hub nav tab"
```

---

### Task 10: Document the workflow

**Files:**
- Create: `playground/README.md`
- Modify: `CLAUDE.md` (repo root — layout table and a new section)

- [ ] **Step 1: Create `playground/README.md`**

````markdown
# playground — code + preview reference app

A browsable library of front-end interview problems. Each entry shows a live
running preview beside its real source, syntax-highlighted.

The preview renders the actual React component in the same bundle — no iframe,
no second bundler — and the Code tab shows that same file via Vite's `?raw`
import, so the code you read is provably the code that ran.

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
   - `problem.md` — the description shown beside the preview.
   - `Solution.jsx` — **default-exports** the component to render.
   - any supporting `.js` / `.css` files (they appear as extra Code tabs).
2. Add an entry to `src/problems/index.json`:
   ```json
   { "id": "<id>", "title": "...", "category": "...", "difficulty": "Easy" }
   ```
3. Run `npm run validate` to confirm the registry and disk agree.

No component edits are needed — `src/problems/loader.js` discovers folders via
`import.meta.glob`.

### Conventions

- **Prefix your CSS class names** (e.g. `.sr-star`). Problem stylesheets are
  bundled into the same document as the app shell, so unprefixed names will
  collide with other problems.
- `Solution.jsx` is listed first in the Code tab; everything else follows
  alphabetically.
- Keep the component self-contained — it renders in-process, so an infinite
  loop or a thrown error affects the app (a boundary catches throws, but not
  hangs).

## Editing

Code is read-only in the browser. Edit a problem's `.jsx` in your editor and
Vite's hot reload updates the preview immediately.
````

- [ ] **Step 2: Add `playground/` to the CLAUDE.md layout table**

In `/Volumes/Personal/MechineCoding/CLAUDE.md`, find:

```
| `practice/` | Vite + React 18 app for visualizing LLD solutions |
```

Add immediately after it:

```
| `playground/` | Vite + React app: problem library with live preview + read-only source |
| `playground-build/` | Generated static build of `playground/` — not hand-edited |
```

- [ ] **Step 3: Add a CLAUDE.md section describing the workflow**

In `/Volumes/Personal/MechineCoding/CLAUDE.md`, add this section immediately
before the `### System design docs` heading:

````markdown
### Playground app (`playground/`)

A problem library where each entry shows a live preview beside its read-only
source. Separate from `practice/`, which it supersedes for new problems. See
`playground/README.md` for full usage.

```bash
cd playground && npm install
npm run dev      # http://localhost:5173
npm run build    # validates, then builds into ../playground-build/
```

Adding a problem requires **no component changes** — create
`src/problems/<id>/{problem.md,Solution.jsx}` and add one entry to
`src/problems/index.json`; `loader.js` finds it via `import.meta.glob`.
(Contrast with `practice/`, where each new LLD needs a hand-written static
import in `Detail.jsx`.)

Problem stylesheets share the app's document, so **prefix problem CSS class
names** to avoid collisions.

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

- [ ] `cd playground && npm test` passes (14 tests: 7 sources + 7 validator)
- [ ] `cd playground && npm run validate` reports 2 problems
- [ ] `cd playground && npm run build` succeeds and writes `playground-build/`
- [ ] `playground-build/index.html` references `./assets/…` (relative paths)
- [ ] Star Rating: hover previews, click commits, Code tab shows 2 files
- [ ] Debounce: rapid clicks increment raw every time, debounced once
- [ ] Editing a problem's `.jsx` hot-reloads the preview
- [ ] Root hub page shows a working **Playground** tab
- [ ] `git status` clean (`playground/node_modules/` is already gitignored)
