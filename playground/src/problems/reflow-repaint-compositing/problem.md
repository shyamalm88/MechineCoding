# Reflow, repaint, and compositing layers

## The pipeline, and how much of it you trigger

```
JS ▶ Style ▶ Layout ▶ Paint ▶ Composite
```

- Changing **geometry** (`width`, `top`, `font-size`, adding a node) →
  **Layout** → Paint → Composite. Most expensive.
- Changing **appearance** (`color`, `background`, `box-shadow`) →
  **Paint** → Composite. Skips layout.
- Changing **`transform` / `opacity`** → **Composite only**. Runs on the
  compositor thread, so it can hit 60fps even if the main thread is busy.

That last line is why "animate transform and opacity, never top/left" is
repeated so often — it is not style preference, it is skipping two pipeline
stages.

## Layout thrashing

The real performance killer is interleaving reads and writes:

```js
for (const el of els) {
  el.style.width = el.offsetWidth + 10 + 'px'   // write, then read → forced sync layout
}
```

Reading `offsetWidth` forces the browser to flush pending style changes and
lay out **now**, inside the loop, on every iteration. Batch instead:

```js
const widths = els.map(el => el.offsetWidth)   // all reads
els.forEach((el, i) => el.style.width = widths[i] + 10 + 'px')  // all writes
```

Layout-triggering reads include `offsetTop`, `scrollHeight`,
`getBoundingClientRect()`, and `getComputedStyle()`.

## Compositing layers

`will-change: transform`, 3D transforms, `<video>` and `<canvas>` promote an
element to its own layer, which the GPU can move without repainting.

**Layers are not free** — each consumes GPU memory, and promoting hundreds of
elements ("layer explosion") is slower than not promoting any. `will-change`
should be applied just before an animation and removed after, not left on
permanently.
