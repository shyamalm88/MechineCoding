# Core Web Vitals — LCP, INP, CLS

## The short answer

Three field metrics, graded at the **75th percentile of real users** — not your
laptop, and not an average.

| Metric | Measures | Good | Poor |
|---|---|---|---|
| **LCP** | Loading — when the largest element paints | ≤ 2.5s | > 4s |
| **INP** | Interactivity — worst interaction latency | ≤ 200ms | > 500ms |
| **CLS** | Visual stability — unexpected layout shift | ≤ 0.1 | > 0.25 |

p75 matters: you must be fast for **three-quarters** of visits, so you cannot
average away a slow cohort.

## LCP — Largest Contentful Paint

When the largest image or text block in the viewport renders. Usually a hero
image or headline.

**Fixes, roughly in order of impact:**

- Don't lazy-load it. `loading="lazy"` on the hero is a classic own goal —
  it delays the very element being measured.
- Preload it: `<link rel="preload" as="image" href="hero.avif">`
- Modern format, correctly sized (not a 4000px image in a 800px slot)
- Reduce TTFB — server time, caching, CDN
- Remove render-blocking CSS/JS ahead of it

LCP breaks into four sub-parts: TTFB → resource load delay → resource load time
→ render delay. Knowing which dominates tells you what to fix.

## INP — and why it replaced FID

**FID measured only the first interaction, and only the input delay** — not how
long your handler ran, nor when the next frame painted. You could score well on
FID while the page felt awful.

**INP** reports the **worst interaction across the whole page lifetime**, and
covers the full duration:

```
input delay  +  processing time  +  presentation delay
(waiting for      (your handler)     (rendering the
 the main thread)                     next frame)
```

**Fixes:**

- Break up long tasks — `scheduler.yield()`, chunking, `requestIdleCallback`
- Ship less JavaScript (parse and execute cost)
- Move heavy computation to a Web Worker
- Cut unnecessary re-renders
- Show feedback *before* doing the work, so the frame paints

## CLS — Cumulative Layout Shift

Sum of unexpected layout shift scores over the page lifetime.

**Fixes:**

- `width`/`height` (or `aspect-ratio`) on images and iframes so space is
  reserved
- Reserve space for ads, embeds and banners
- Never insert content **above** existing content
- `font-display: swap` **with a metrics-matched fallback**, so the swap doesn't
  reflow the page

Shifts within **500ms of a user interaction are excluded** — expanding an
accordion is expected, not a penalty. That exclusion is why "but my UI moves on
purpose" is not a problem.

## The trap

**Lab tools cannot meaningfully measure INP or final CLS.** Both accumulate over
a real session — a shift at minute three still counts, and the worst interaction
may be one Lighthouse never performs.

So a Lighthouse score of 100 does not mean your CWV are good. You need field
data: the `web-vitals` library, or Chrome UX Report.

And report them on `visibilitychange → hidden`, not `load` — otherwise you
capture only what happened in the first second.

## How to answer this out loud

"LCP, INP and CLS — loading, interactivity and visual stability — graded at the
75th percentile of real users. LCP is usually the hero image: don't lazy-load
it, preload it, serve it in a modern format at the right size. INP replaced FID
because FID only measured the first interaction's input delay; INP covers the
worst interaction end to end, so the fixes are about main-thread work — breaking
up long tasks and shipping less JavaScript. CLS is reserved space: image
dimensions, font metrics, no injecting above existing content. The key point is
INP and CLS accumulate over a session, so lab tools can't really measure them —
you need field data."

## Follow-ups to expect

- *What are the non-core vitals?* TTFB, FCP — diagnostic rather than graded.
- *Do they affect SEO?* They are a ranking signal, though content relevance
  dominates.
- *How do you find what shifted?* The CLS entries include the shifted elements;
  DevTools highlights them.
