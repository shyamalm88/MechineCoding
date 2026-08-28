# How to improve the performance of a web application?

## The short answer

Do not recite a list of tips. **Name the metric you are targeting and let it
choose the fix** — because the fixes for each are almost disjoint:

| Bad metric | Root cause | Where to work |
|---|---|---|
| **LCP** slow | bytes and network | images, TTFB, render-blocking resources |
| **INP** slow | main-thread work | JS size, long tasks, re-renders |
| **CLS** bad | unreserved space | image dimensions, fonts, injected content |

"Optimise everything" is the weak answer. "Field data says p75 INP is 450ms, so
I'd look at long tasks and bundle size" is the strong one.

## 1. Measure first

`next build`-style bundle output, `@next/bundle-analyzer` or `source-map-explorer`
for *what* is in the bundle. Lighthouse for a checklist. **Field data (RUM) to
decide whether any of it matters to real users.**

Optimising without knowing which metric is broken is guessing.

## 2. Deliver less

- **Code splitting** by route and by heavy component (chart libraries, editors,
  date pickers).
- **Tree shaking** — and watch for barrel files (`export * from …`) that defeat
  it by making everything look used.
- Check for a **large library imported for one function** — moment.js, lodash,
  a full icon set.
- **Modern image formats** (AVIF/WebP), correct `srcset`/`sizes`, and
  `loading="lazy"` **below the fold only**.
- **Brotli** over gzip for text.

## 3. Deliver it sooner

- **CDN** so bytes start closer to the user.
- `preconnect` for third-party origins you know you will hit; `dns-prefetch` for
  maybes.
- `preload` genuinely critical assets — the LCP image, the primary font.
- **HTTP/2 or HTTP/3** so requests multiplex instead of queueing.

## 4. Render it faster

- Keep the **critical rendering path** short: minimal render-blocking CSS,
  `defer` on scripts.
- `font-display: swap` so text is never invisible.
- **Reserve space** for images, ads and embeds — this is the whole of CLS.

## 5. Keep it fast after load

- **Virtualise long lists** — never render 10,000 rows.
- **Break up long tasks** so the main thread can respond:
  `scheduler.yield()`, `setTimeout` chunking, or `requestIdleCallback`.
- **Debounce/throttle** high-frequency handlers (scroll, resize, input).
- Move heavy computation to a **Web Worker**.
- Memoise expensive renders — after profiling, not by default.

## 6. Third parties are usually the biggest cost

Analytics, chat widgets, A/B testing and ad scripts frequently outweigh your
entire application bundle. Load them `async`, defer non-essential ones until
after interaction, and periodically audit whether each is still earning its
place.

## Worked example: the same page, two diagnoses

```
Page A: LCP 4.2s, INP 90ms
  → the hero image is 2MB PNG, not preloaded, lazy-loaded by mistake
  → fix: AVIF, correct sizing, `priority`/preload, remove lazy

Page B: LCP 1.8s, INP 620ms
  → 900KB of JS parsing on a mid-tier phone, one 400ms task on click
  → fix: code split, break up the task, virtualise the list
```

Applying Page A's fixes to Page B would achieve nothing. That is the point.

## How to answer this out loud

"I'd start by asking which metric is bad, because the fixes barely overlap. Poor
LCP is usually bytes and network — hero image format and sizing, preloading it,
TTFB, render-blocking CSS. Poor INP is main-thread work — too much JavaScript,
long tasks, unnecessary re-renders — so code splitting, breaking up tasks, maybe
a worker. Poor CLS is unreserved space — image dimensions, font swap metrics,
injected banners. And I'd measure with field data first, because a Lighthouse
100 on my laptop doesn't tell me what a mid-range Android on 4G experiences."

## Follow-ups to expect

- *What's the single biggest win usually?* Images for LCP; JavaScript for INP.
- *How do you stop regressions?* Performance budgets in CI plus alerting on field
  p75.
- *How do you handle a slow third party?* Load it after interaction, self-host if
  licensing allows, or drop it — and measure the delta.
