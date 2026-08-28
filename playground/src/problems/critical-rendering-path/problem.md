# What is the Critical Rendering Path?

## The short answer

The sequence the browser must complete to turn bytes into pixels:

```
HTML  ──parse──▶  DOM  ┐
                       ├──▶ Render Tree ──▶ Layout ──▶ Paint ──▶ Composite
CSS   ──parse──▶ CSSOM ┘
```

Optimising it means **shortening or unblocking that chain** so something
meaningful appears sooner.

## The steps, and what can go wrong at each

**1. DOM** — HTML parsed into a node tree, incrementally. A `<script>` without
`async`/`defer` stops this dead.

**2. CSSOM** — CSS parsed into a style tree. CSS is **render-blocking**: the
browser will not paint until it has the CSSOM, because otherwise you would see a
flash of unstyled content.

**3. Render tree** — DOM + CSSOM combined, containing only **visible** nodes.

The distinction people get wrong:

| | In the render tree? | Takes up space? |
|---|---|---|
| `display: none` | **No** | No |
| `visibility: hidden` | **Yes** | Yes |
| `opacity: 0` | **Yes** | Yes |

**4. Layout (reflow)** — computes geometry: position and size of every box. This
is where `width: 50%` becomes an actual pixel value, so it depends on the
viewport.

**5. Paint** — fills in pixels: text, colours, shadows, borders.

**6. Composite** — assembles painted layers in the right order.

## The subtlety: CSS can block JavaScript

A plain `<script>` blocks parsing — everyone knows that. Less well known:

> A script also waits for any **pending CSS** before it runs.

Why? Because a script might call `getComputedStyle()`, and the browser cannot
give a correct answer until the CSSOM is complete. So the chain is:

```
slow CSS  →  blocks the script  →  blocks HTML parsing  →  blocks first paint
```

A slow stylesheet in `<head>` can therefore delay your JavaScript, which is a
genuinely non-obvious failure mode.

## Shortening the path

**Get CSS out of the way**

- Inline the critical CSS for above-the-fold content; load the rest
  asynchronously (`media="print"` + `onload` swap, or `rel=preload`).
- Split stylesheets by media so `print.css` never blocks rendering.

**Get scripts out of the way**

- `defer` for app code, `async` for independent third parties.

**Prioritise the right bytes**

- `<link rel="preload">` the LCP image and primary font.
- `preconnect` to third-party origins you know you will hit.
- `font-display: swap` so text is never invisible waiting on a font.

**Reduce the number of blocking requests**, not just their total size — each one
costs a round trip before rendering can proceed.

## Worked example

```html
<head>
  <link rel="stylesheet" href="app.css">   <!-- blocks paint -->
  <script src="analytics.js"></script>      <!-- blocks parsing AND waits for app.css -->
</head>
```

Fixed:

```html
<head>
  <style>/* critical above-the-fold rules inlined */</style>
  <link rel="preload" href="app.css" as="style" onload="this.rel='stylesheet'">
  <script defer src="analytics.js"></script>
</head>
```

First paint no longer waits on either file.

## How to answer this out loud

"The critical rendering path is DOM plus CSSOM into a render tree, then layout,
paint and composite. CSS is render-blocking because painting without it would
flash unstyled content, and a plain script blocks parsing. The non-obvious part
is that a script also waits for pending CSS — it might read computed styles — so
a slow stylesheet delays your JavaScript too. To shorten it I'd inline critical
CSS, defer scripts, preload the LCP image and font, and cut the number of
blocking requests rather than just their size."

## Follow-ups to expect

- *How does this map to Core Web Vitals?* A long critical path shows up directly
  as poor FCP and LCP.
- *What is FOUC and FOUT?* Unstyled content flash (no CSSOM yet) and unstyled
  *text* flash (font still loading).
- *Does `display: none` skip layout?* Yes — it is not in the render tree at all.
