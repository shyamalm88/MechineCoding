# System Design Notes — Interactive Index

A static, browsable index over `system-design/*.md` — 25 frontend system
design write-ups (e-commerce, social feeds, media streaming, booking
platforms, productivity tools, fintech, and core infra building blocks).
Grouped in the sidebar by topic.

## Browsing

Open `index.html` directly in a browser — no server, no build step. Click
any doc in the left sidebar.

## Regenerating content

`index.html`, `notes/`, and `assets/` are generated output, not hand-edited.
The source of truth is `../system-design/*.md` and
`../system-design/site.config.json` (title + category grouping).

To rebuild after editing a doc in `system-design/` (requires
`pip3 install -r tools/md-site/requirements.txt` once):

```bash
python3 tools/md-site/build.py system-design/ system-design-notes/
```

This same generator (`tools/md-site/`) is source-agnostic — see
`tools/md-site/README.md` for using it against other markdown folders.

## Running tests

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```
