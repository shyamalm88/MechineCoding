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

- **Do not import your stylesheet.** `Solution.jsx` must not
  `import './styles.css'` — that injects it globally and leaks. The platform
  reads every `.css` in the folder, scopes each rule to
  `[data-problem="<id>"]`, and injects it into the preview automatically.
- Because of that scoping you may use natural class names (`.board`, `.cell`)
  without worrying about collisions with other problems.
- Previews render on a **light page surface**, matching how a standalone page
  would look. Author colours against a white background.
- `Solution.jsx` is listed first in the Code tab; everything else follows
  alphabetically.
- Write `problem.md` as a standalone document with its own `# Title`. Headings
  are demoted one level when rendered, so the page keeps exactly one `<h1>`.
- Keep the component self-contained — it renders in-process, so a thrown error
  is caught by a boundary, but an infinite loop will still hang the page.

## Editing

Code is read-only in the browser. Edit a problem's `.jsx` in your editor and
Vite's hot reload updates the preview immediately.

## Why not an in-browser editor?

Sandpack (CodeSandbox's embeddable IDE) was evaluated and rejected: it is free
and Apache-2.0, but costs ~54 packages and 1.2MB, and boots a second bundler in
an iframe per problem — all to buy in-browser editing, which is not the goal
here. Rendering the component directly gets a live preview and readable source
with zero additional packages. See
`docs/superpowers/specs/2026-08-26-playground-code-preview-design.md`.
