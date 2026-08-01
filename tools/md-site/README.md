# md-site — generic markdown-to-site generator

Converts any folder of `.md` files into a browsable static HTML site: a
sidebar-navigable page per note, plus an `index.html` landing page. Used to
build `theory-notes/` from `Theory/`; written to be reusable against any
future markdown folder in this repo without modification.

## Requirements

```bash
pip3 install -r tools/md-site/requirements.txt
```

## Usage

```bash
python3 tools/md-site/build.py <source-dir> <output-dir>
```

`<source-dir>` is read-only — nothing there is ever modified. Inside
`<output-dir>`, the `notes/` and `assets/` subdirectories are fully
regenerated on every run (safe to delete and regenerate anytime) — any
other file you place directly in `<output-dir>` yourself (e.g. a
hand-written `README.md`) is left untouched.

## Optional per-source config

Drop a `site.config.json` next to the source `.md` files to control the
site title and sidebar grouping:

```json
{
  "title": "My Notes",
  "categories": {
    "some-file.md": "Category Name",
    "another-file.md": "Category Name"
  }
}
```

Every `.md` file in the source folder must appear in `categories` — if one is
missing, `build.py` raises rather than silently dropping it from the sidebar.
Sidebar category order follows the order categories first appear in this
map, not alphabetical file order.

If there's no `site.config.json` at all, the tool still works: it falls back
to a flat, alphabetically-sorted sidebar using the source folder's name as
the title.

## Sidebar

The sidebar is not baked into each generated page. Every page ships an empty
`<nav id="sidebar">` mount point and a shared `assets/sidebar.js`, which
fetches a single `assets/nav.json` (written once per build) and renders the
category tree, links, and star badges client-side, highlighting the active
page by comparing `location.href` against each link. This means adding a
note, re-categorizing one, or changing a star rating touches only
`site.config.json` and regenerates `nav.json` — not every page in `notes/`.

## Diagrams

- ` ```mermaid ` fenced code blocks render as live diagrams (Mermaid is
  vendored in `assets/`, no network access needed).
- Plain fenced code blocks (including ASCII art) render as regular code
  panels with syntax highlighting via the vendored `highlight.js`.

## Tests

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```
