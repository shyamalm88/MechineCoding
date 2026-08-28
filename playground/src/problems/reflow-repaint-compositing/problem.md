# Reflow, repaint, and compositing layers

## The short answer

Every frame runs a pipeline. **How much of it you trigger depends on which
property you change:**

```
JS ▶ Style ▶ Layout ▶ Paint ▶ Composite
```

| You change | Triggers | Cost |
|---|---|---|
| `width`, `top`, `font-size`, adding a node | **Layout** → Paint → Composite | most expensive |
| `color`, `background`, `box-shadow` | **Paint** → Composite | medium |
| `transform`, `opacity` | **Composite only** | cheapest |

That last row is why "animate `transform` and `opacity`, never `top`/`left`" is
repeated constantly. It is not style preference — it literally skips two stages
and can run on the compositor thread, so the animation stays smooth **even if
the main thread is busy**.

## Worked example

```css
/* ✗ layout on every frame — janky */
@keyframes slide { from { left: 0 } to { left: 300px } }

/* ✓ composite only — smooth */
@keyframes slide { from { transform: translateX(0) } to { transform: translateX(300px) } }
```

Visually identical. Completely different cost profile.

## Layout thrashing — the real killer

The expensive pattern is not one reflow; it is **interleaving reads and writes**:

```js
for (const el of elements) {
  el.style.width = el.offsetWidth + 10 + 'px'   // write, then read → forced sync layout
}
```

Reading `offsetWidth` forces the browser to **flush pending style changes and
lay out immediately** — inside the loop, on every iteration. 100 elements means
100 forced layouts.

Batch instead:

```js
const widths = elements.map(el => el.offsetWidth)          // all READS
elements.forEach((el, i) => el.style.width = widths[i] + 10 + 'px')  // all WRITES
```

One layout instead of a hundred. Same output.

**Properties that force layout when read:** `offsetTop/Left/Width/Height`,
`scrollTop/Height`, `clientWidth/Height`, `getBoundingClientRect()`,
`getComputedStyle()`, `focus()`.

The general principle is **read-then-write**, sometimes called
read/write batching or the FastDOM pattern.

## Compositing layers

Some things get promoted to their own layer the GPU can move without repainting:

```css
will-change: transform;   /* explicit hint */
transform: translateZ(0); /* the old hack */
```

Also automatic for `<video>`, `<canvas>`, 3D transforms, and fixed-position
elements in some cases.

**Layers are not free.** Each consumes GPU memory (roughly width × height × 4
bytes), and promoting hundreds of elements — "layer explosion" — is slower than
promoting none, because the compositor now has to manage them all.

`will-change` should be applied **just before** an animation and removed after,
not left on permanently:

```js
el.style.willChange = 'transform'
// …animate…
el.addEventListener('transitionend', () => { el.style.willChange = 'auto' })
```

## How to see it

DevTools → Performance: record an interaction and look for purple **Layout** and
green **Paint** blocks. A "Forced reflow" warning in the console tells you
exactly which line caused a synchronous layout.

The **Rendering** panel has "Paint flashing" (highlights repainted regions) and
"Layer borders" (shows what got promoted).

## How to answer this out loud

"The rendering pipeline is style, layout, paint, composite, and the property you
change decides how much of it runs. Geometry triggers layout, appearance
triggers paint, and `transform`/`opacity` are composite-only — which is why
animations should use those, since they skip two stages and can run off the main
thread. The bigger real-world problem is layout thrashing: reading `offsetWidth`
forces a synchronous layout, so interleaving reads and writes in a loop causes
one per iteration. Batching all reads then all writes fixes it. And `will-change`
should be temporary, because every promoted layer costs GPU memory."

## Follow-ups to expect

- *Why is `transform` cheaper?* The element is already painted into a layer; the
  compositor just moves it.
- *What is the difference between reflow and repaint?* Reflow recomputes
  geometry; repaint redraws pixels. Reflow always implies repaint.
- *How does this relate to INP?* Long layout/paint work on the main thread is
  exactly what delays interaction responses.
