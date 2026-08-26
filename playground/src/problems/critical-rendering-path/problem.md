# What is the Critical Rendering Path?

The sequence the browser must complete to turn bytes into pixels.

## The steps

```
HTML  ──parse──▶  DOM  ┐
                       ├──▶ Render Tree ──▶ Layout ──▶ Paint ──▶ Composite
CSS   ──parse──▶ CSSOM ┘
```

1. **DOM** — HTML is parsed into a node tree, incrementally.
2. **CSSOM** — CSS is parsed into a style tree. CSS is **render-blocking**: the
   browser will not paint until it has the CSSOM, otherwise it would flash
   unstyled content.
3. **Render tree** — DOM + CSSOM, containing only visible nodes.
   `display: none` nodes are excluded; `visibility: hidden` nodes are kept
   (they still occupy space).
4. **Layout (reflow)** — computes geometry: position and size of every box.
5. **Paint** — fills in pixels: text, colours, shadows, borders.
6. **Composite** — assembles painted layers in the correct order.

## Why scripts matter so much

A plain `<script>` blocks parsing: the parser stops, fetches, executes, then
resumes. Worse, because scripts can read computed styles, a script also waits
for any pending CSS — so **CSS can block JavaScript, which blocks the DOM**.

`defer` (execute after parsing, in order) and `async` (execute whenever it
arrives) both avoid blocking the parser.

## Shortening the path

- Inline the critical CSS for above-the-fold content; load the rest async.
- `defer` non-essential scripts.
- Preload the LCP image and primary font.
- Reduce the number of render-blocking requests, not just their total size.
