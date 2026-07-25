# Theory Notes — Interactive Index

A static, browsable index over `Theory/*.md` — 24 reference notes on
JavaScript internals, browser internals, performance, security, and
architecture. Grouped in the sidebar by topic.

## Browsing

Open `index.html` directly in a browser — no server, no build step. Click
any note in the left sidebar.

## Regenerating content

`index.html`, `notes/`, and `assets/` are generated output, not hand-edited.
The source of truth is `../Theory/*.md` and `../Theory/site.config.json`
(title + category grouping).

To rebuild after editing a note in `Theory/`:

```bash
python3 tools/md-site/build.py Theory/ theory-notes/
```

This same generator (`tools/md-site/`) is source-agnostic — see
`tools/md-site/README.md` for using it against other markdown folders.

## Running tests

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```
