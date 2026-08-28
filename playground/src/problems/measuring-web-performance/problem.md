# How to measure the performance of a website?

## The short answer

Two kinds of data, and confusing them is the classic mistake:

- **Lab** — a controlled, reproducible run on your machine (Lighthouse,
  WebPageTest, DevTools). Great for *debugging*.
- **Field / RUM** — collected from real users (`web-vitals`, CrUX, your own
  analytics). Noisy, but it is **the truth**.

Optimising against Lighthouse alone is how you ship a site that scores 100 and
still feels slow — your laptop on fibre is not a mid-range Android on 4G.

## The APIs

```js
// Core Web Vitals in the field
import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(metric => send(metric))

// Where did the time go?
performance.getEntriesByType('navigation')   // DNS, TCP, TTFB, DOM events
performance.getEntriesByType('resource')     // per-asset timing

// Your own spans
performance.mark('checkout:start')
performance.mark('checkout:end')
performance.measure('checkout', 'checkout:start', 'checkout:end')
```

`PerformanceObserver` is the general mechanism, and it has one important
feature:

```js
new PerformanceObserver(list => …).observe({ type: 'largest-contentful-paint', buffered: true })
```

**`buffered: true`** delivers entries that occurred *before* your observer was
registered — without it you miss the very events you care about, because they
happened while your script was still loading.

## Report percentiles, not averages

An average hides the users who are suffering:

```
p50 = 1.2s    "the site is fast"
p95 = 9.0s    5% of sessions are miserable
```

The mean is dragged around by outliers in ways that obscure both. Track **p75**
(what Core Web Vitals grade against) and **p95**.

Segment too: by device class, connection type, country and route. "Slow" is
almost always concentrated somewhere specific.

## Traps

**`Date.now()` for durations.** It is wall-clock: it can jump forwards or
backwards (NTP correction, DST, the user changing the clock), so you can
genuinely record negative durations. Use `performance.now()`, which is monotonic
and sub-millisecond.

**Measuring only on your own machine and network.** Throttle to a mid-tier
device and 4G in DevTools at minimum.

**Reporting CWV on `load`.** CLS and INP **accumulate over the whole page
lifetime** — a layout shift at minute three still counts. Report on
`visibilitychange → hidden`, which is the only event reliably fired on mobile
(`unload` often is not).

## What to actually look at

| Symptom | Where to look |
|---|---|
| Slow first paint | TTFB, render-blocking CSS/JS, LCP element |
| Janky interaction | Long tasks, main-thread work, INP attribution |
| Content jumping | CLS entries — which element shifted |
| Slow overall on mobile only | JS bundle size, CPU-bound work |

DevTools **Performance** panel for the flame graph, **Coverage** for unused
CSS/JS, **Lighthouse** for a checklist, and field data to decide whether any of
it matters to real users.

## How to answer this out loud

"I'd separate lab and field data. Lab — Lighthouse, WebPageTest, the DevTools
profiler — is reproducible and good for debugging, but it's one machine on one
network. Field data from the `web-vitals` library is what tells you whether
users are actually affected. I'd report p75 and p95 rather than averages,
segmented by device and connection, because the pain is usually concentrated.
Two practical gotchas: use `performance.now()` not `Date.now()` because
wall-clock can jump, and report CLS and INP on visibilitychange rather than load
since they accumulate over the session."

## Follow-ups to expect

- *How do you measure a SPA route change?* User Timing marks around the
  transition — navigation timing only covers the initial load.
- *What is TTFB telling you?* Server time plus network; split it with Server
  Timing headers.
- *How do you catch regressions?* Lighthouse CI with budgets in the pipeline,
  plus alerting on field p75.
