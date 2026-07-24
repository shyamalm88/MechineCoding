# Theory Notes — Markdown-to-Site Generator Design

## Goal

Turn `Theory/*.md` (24 reference notes: JS core, browser internals, performance,
security, architecture, etc.) into a browsable static HTML site — the same
"open index.html, click a topic in the sidebar" experience already built for
`grokking-system-design/`.

Unlike `grokking-system-design/` (a one-off scraper for a single course export),
this generator must be **reusable**: there are more markdown folders in this repo
that will need the same treatment later (confirmed candidate: `system-design/latest
& updated/`, 18 files, canonical docs — see Future Use Case below). So the build
tool is written generic and source-agnostic; `Theory/` is just its first caller.

## Non-Goals

- No changes to `Theory/*.md` themselves — they stay the untouched source of truth.
- No Lottie or any hand-authored animation. Diagrams are Mermaid (live-rendered)
  or ASCII (styled as code) — both come straight out of the markdown source, so
  the pipeline never requires manual asset authoring outside the `.md` files.
- Not building the `system-design/` site now — that folder is noted as a validated
  future use of this same tool, not part of this implementation.

## Architecture

```
tools/md-site/                       (new, generic, reusable — not Theory-specific)
├── build.py                         # python3 tools/md-site/build.py <source-dir> <output-dir>
├── assets/                          # bundled locally, copied into every generated output/assets/
│   ├── style.css                    # Option-A visual style (see Styling)
│   ├── highlight.min.js + theme.css # syntax highlighting for code fences
│   └── mermaid.min.js               # live diagram rendering
└── tests/
    └── test_build.py

Theory/                              (untouched source)
├── site.config.json                 # NEW — title + category map for this folder
└── *.md                             # 24 files, unchanged

theory-notes/                        (new, generated output — sibling to grokking-system-design/)
├── index.html                       # sidebar + landing text
├── notes/
│   └── <slug>.html                  # one per Theory/*.md
└── assets/                          # copied from tools/md-site/assets/
```

Usage: `python3 tools/md-site/build.py Theory/ theory-notes/`. Rerun anytime to
regenerate; `theory-notes/` is disposable build output, never hand-edited.

## Per-Source Config (`site.config.json`)

Lives next to the source `.md` files, travels with them. Read by `build.py` if
present.

```json
{
  "title": "Theory Notes",
  "categories": {
    "javascript-core.md": "JavaScript & Runtime",
    "v8-internals.md": "JavaScript & Runtime",

    "browser-internals.md": "Browser & Rendering",
    "browser-document-execution.md": "Browser & Rendering",
    "rendering-spectrum.md": "Browser & Rendering",
    "hydration.md": "Browser & Rendering",

    "core-web-vitals.md": "Performance",
    "web-performance.md": "Performance",
    "react-performance.md": "Performance",
    "cache.md": "Performance",
    "assets.md": "Performance",

    "state-management.md": "State & Architecture",
    "state-machines.md": "State & Architecture",
    "optimistic-updates.md": "State & Architecture",
    "monorepo.md": "State & Architecture",
    "MicroFrontEnd Design system.md": "State & Architecture",

    "network.md": "Network & Security",
    "cors-security.md": "Network & Security",
    "security.md": "Network & Security",
    "graphql.md": "Network & Security",
    "javascript-sdk.md": "Network & Security",

    "webpack.md": "Build & Observability",
    "observability.md": "Build & Observability",

    "Yotube1000cuts.md": "Case Studies"
  }
}
```

Category display order in the sidebar follows first-appearance order in the map
above. **If no `site.config.json` exists** for a given source folder, `build.py`
falls back to a flat, alphabetically-sorted sidebar using the folder name as the
site title — so the tool works immediately against any new folder before anyone
writes a config.

## Data Flow / Pipeline

1. `build.py <source-dir> <output-dir>` reads `<source-dir>/site.config.json`
   (or falls back per above).
2. For each `.md` file: convert to HTML with Python's `markdown` library,
   extensions `fenced_code`, `tables`, `toc`, `attr_list`.
3. Post-process the converted HTML: any ` ```mermaid ` fence (which
   `fenced_code` emits as `<pre><code class="language-mermaid">...`) is rewritten
   to `<div class="mermaid">...</div>` — the markup `mermaid.js` actually looks
   for. Plain/ASCII code fences are left as regular `<pre><code>` and pick up
   the same dark code-panel styling.
4. Wrap the converted fragment in the page template (see Styling) with a
   sidebar built from the category map, grouped into collapsible `<details>`
   sections matching `grokking-system-design`'s pattern.
5. Write to `<output-dir>/notes/<slug>.html`. Also generate `<output-dir>/index.html`
   (sidebar + landing/empty state) and copy `tools/md-site/assets/` →
   `<output-dir>/assets/`.

## Styling — Option A ("Mintlify-style", approved via visual mockup)

Validated interactively with real content from `javascript-core.md` (Closures
section) and real diagrams from `browser-internals.md` (ASCII) and
`javascript-core.md` (Mermaid prototype-chain graph). Locked values:

- Font: `ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`
- Page background: `#fbfbfe`; sidebar background `#f8f7fc`, border `#ece9f7`
- Sidebar active item: background `#ece9fd`, text `#5b3df0`, font-weight 600
- Sidebar group label: `#9691b3`, uppercase, small, letter-spacing
- Accent color: `#5b3df0` (violet) — used for eyebrow category label above
  each `<h1>`, inline `<code>` text, active nav state
- Body text: `#3d3959`; headings: `#232037`
- Code panels (both regular code fences and ASCII diagrams): dark
  `#1e1b2e` background, `#d7d3f5` text, 10px rounded corners, subtle violet
  shadow, syntax-highlighted via `highlight.js` (bundled, offline)
- Inline code: `#f1eefc` background, `#5b3df0` text, rounded chip
- Mermaid diagrams: rendered live via bundled `mermaid.min.js`, framed in a
  separate white card (not the dark code panel) with `theme: 'base'` and
  `themeVariables` matched to the violet accent, so the diagram stays legible
  against its own light background
- highlight.js and mermaid.js are bundled locally in `tools/md-site/assets/`
  (not loaded from a CDN) so `theory-notes/index.html` keeps working fully
  offline, consistent with "open the file directly, no server" from
  `grokking-system-design/`

## Error Handling

- `site.config.json` present but missing a `.md` file from its `categories`
  map → `build.py` raises loudly. Keeps the mapping honest as new Theory notes
  get added later; a silently-dropped note is worse than a build failure.
- No `site.config.json` at all → flat alphabetical fallback, never a hard
  failure (this is what makes the tool usable against a brand-new folder with
  zero setup).
- No network calls at build or view time (assets bundled, not CDN-loaded) —
  no failure mode tied to connectivity.

## Testing

`python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v`

Covers:
- Config-driven grouping: every source `.md` file is accounted for in the
  category map (completeness check against `Theory/site.config.json`)
- No-config fallback produces a flat alphabetical sidebar
- Markdown → HTML conversion produces non-empty output for a representative
  file
- Mermaid fence → `<div class="mermaid">` post-processing (regression test
  using the real prototype-chain example from `javascript-core.md`)
- Missing-file-from-config raises
- Smoke test: real invocation against `Theory/` → `theory-notes/` produces
  `index.html` and one expected note file (e.g. `notes/javascript-core.html`)

## Future Use Case (validates genericity, not implemented now)

`system-design/latest & updated/` (18 canonical docs, confirmed separate from
13 stale `.md` files elsewhere in `system-design/`) already uses both Mermaid
(18/18 files) and ASCII diagrams (10/18 files) — the exact two diagram types
this design handles. Building that site later is just:
`python3 tools/md-site/build.py "system-design/latest & updated" system-design-notes/`
plus an optional `site.config.json` for category grouping. No changes to
`tools/md-site/` anticipated.
