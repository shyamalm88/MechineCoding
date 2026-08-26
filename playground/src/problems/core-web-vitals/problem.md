# Core Web Vitals — LCP, INP, CLS

Field metrics, graded at the **75th percentile** of real users.

| Metric | Measures | Good | Poor |
|---|---|---|---|
| **LCP** | Loading — largest element painted | ≤ 2.5 s | > 4 s |
| **INP** | Interactivity — worst interaction latency | ≤ 200 ms | > 500 ms |
| **CLS** | Visual stability — unexpected layout shift | ≤ 0.1 | > 0.25 |

## LCP

The render time of the largest image or text block in the viewport. Usually a
hero image. Fix by: preloading it, serving it in a modern format at the right
size, avoiding lazy-loading it (a classic own goal), and removing
render-blocking resources ahead of it.

## INP — and why it replaced FID

FID measured only the **first** interaction, and only its *input delay* — not
how long the handler ran or when the next frame painted. It was easy to score
well on while feeling terrible.

**INP** reports the worst interaction across the whole page lifetime, covering
input delay + processing + presentation delay. Fix by breaking up long tasks
(`scheduler.yield()`, `setTimeout` chunking), moving heavy work to a Worker, and
cutting unnecessary re-renders.

## CLS

Sum of unexpected layout shift scores. Fix by: setting `width`/`height` (or
`aspect-ratio`) on images and iframes, reserving space for ads and embeds,
never inserting content above existing content, and using `font-display: swap`
with a metrics-matched fallback to limit reflow when the webfont lands.

Shifts within 500 ms of a user interaction are excluded — expanding an
accordion is expected, not a penalty.

## Trap

Lab tools cannot measure INP or final CLS meaningfully — both accumulate over a
real session. They must come from field data.
