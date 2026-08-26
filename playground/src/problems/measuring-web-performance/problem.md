# How to measure the performance of a website?

## Lab vs field — the distinction that matters

**Lab data** is a controlled, reproducible run: Lighthouse, WebPageTest,
DevTools Performance panel. Great for debugging, but it is one machine on one
network, and it cannot tell you what real users experience.

**Field data (RUM)** is collected from real users: the `web-vitals` library,
Chrome UX Report, or your own analytics. Noisy, but it is the truth.

The classic mistake is shipping against a Lighthouse score of 100 and having
users still complain — your laptop is not their phone on 4G.

## The APIs

```js
// Core Web Vitals in the field
import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(m => send(m))

// Navigation and resource timing
performance.getEntriesByType('navigation')
performance.getEntriesByType('resource')

// Your own marks
performance.mark('checkout:start')
performance.measure('checkout', 'checkout:start')
```

`PerformanceObserver` is the general mechanism — it reports entries as they
occur, including ones that happened before your code ran (via `buffered: true`).

## Report percentiles, not averages

An average hides the users who are suffering. If p50 is 1.2s and p95 is 9s,
5% of sessions are miserable and the mean says everything is fine. Track p75
(what Core Web Vitals grade against) and p95.

## Traps

- Measuring only on your own machine and network.
- `Date.now()` for durations — it is wall-clock and can jump. Use
  `performance.now()`, which is monotonic.
- Forgetting that CLS and INP accumulate over the whole page lifetime, so they
  must be reported on visibility change, not on load.
