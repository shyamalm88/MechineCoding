# Grokking System Design — Interactive Index

A static, browsable index over the exported "Grokking Modern System Design
Interview for Engineers & Managers" course. Split into two sidebar sections:
Fundamentals (chapters 1–25) and Case Studies (chapters 26–40).

## Browsing

Open `index.html` directly in a browser — no server, no build step. Click
any chapter in the left sidebar.

## Regenerating content

The `chapters/` and `diagrams/` folders are generated output, not hand-edited.
To rebuild them from the source course export:

```bash
python3 scripts/build.py
```

By default this reads from
`~/Downloads/Grokking Modern System Design Interview for Engineers & Managers/`
and writes into this folder. Pass explicit paths to override:

```bash
python3 scripts/build.py /path/to/source /path/to/output
```

## Running tests

```bash
python3 -m unittest discover -s scripts/tests -t scripts -v
```

## Design

See `docs/superpowers/specs/2026-07-23-grokking-system-design-index-design.md`
for the full design rationale.
