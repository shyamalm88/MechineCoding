# Core Web Vitals: A Senior Engineer's Guide

A comprehensive guide to measuring and optimizing Core Web Vitals for system design interviews.

---

## 1. What Are Core Web Vitals?

Core Web Vitals are Google's standardized metrics for measuring user experience. They directly impact **SEO rankings**.

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE WEB VITALS                          │
├──────────────────┬──────────────────┬──────────────────────┤
│       LCP        │       INP        │        CLS           │
│    Loading       │  Interactivity   │   Visual Stability   │
│                  │                  │                      │
│  < 2.5s GOOD     │  < 200ms GOOD    │   < 0.1 GOOD        │
│  2.5-4s NEEDS    │  200-500ms NEEDS │   0.1-0.25 NEEDS    │
│  > 4s POOR       │  > 500ms POOR    │   > 0.25 POOR       │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## 2. LCP (Largest Contentful Paint)

### What It Measures

The time it takes for the **largest visible element** to render in the viewport.

```
┌─────────────────────────────────────────────────────────────┐
│  Timeline                                                    │
│                                                              │
│  0ms ─────────────────────────────────────────────▶ 2500ms  │
│       │              │              │                        │
│       │              │              └── LCP: Hero image      │
│       │              │                  fully painted        │
│       │              │                                       │
│       │              └── FCP: First text painted            │
│       │                                                      │
│       └── TTFB: First byte received                         │
│                                                              │
│  What counts as LCP element:                                 │
│  ├── <img> elements                                         │
│  ├── <image> inside <svg>                                   │
│  ├── <video> poster image                                   │
│  ├── Background image via CSS url()                         │
│  └── Block-level text elements (<h1>, <p>, etc.)            │
└─────────────────────────────────────────────────────────────┘
```

### Measuring LCP

```js
// Using web-vitals library
import { onLCP } from 'web-vitals';

onLCP((metric) => {
  console.log('LCP:', metric.value);
  console.log('LCP Element:', metric.entries[0]?.element);
  console.log('Rating:', metric.rating);  // 'good', 'needs-improvement', 'poor'

  // Send to analytics
  sendToAnalytics({
    name: 'LCP',
    value: metric.value,
    id: metric.id,
    rating: metric.rating
  });
});
```

```js
// Using PerformanceObserver directly
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];

  console.log('LCP:', lastEntry.startTime);
  console.log('Element:', lastEntry.element);
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });
```

### Optimizing LCP

| Cause | Solution |
|-------|----------|
| Slow server response | CDN, edge caching, optimize backend |
| Render-blocking resources | Inline critical CSS, defer JS |
| Slow resource load | Preload LCP image, use CDN |
| Client-side rendering | SSR/SSG for above-fold content |

```html
<!-- Preload the LCP image -->
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high">

<!-- For responsive images -->
<link rel="preload" as="image" href="/hero.jpg"
      imagesrcset="hero-400.jpg 400w, hero-800.jpg 800w"
      imagesizes="100vw">
```

```html
<!-- Inline critical CSS -->
<style>
  .hero-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
</style>

<!-- Prioritize LCP image -->
<img src="hero.jpg" fetchpriority="high" alt="Hero">
```

---

## 3. INP (Interaction to Next Paint)

### What It Measures

INP measures the **latency of all user interactions** throughout the page lifecycle and reports the worst one (at the 98th percentile).

```
User clicks button
       │
       ▼
┌──────────────────┐
│  Input Delay     │  ← Time waiting in queue (main thread busy)
│  (event queued)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Processing Time │  ← Event handler execution time
│  (handler runs)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Presentation    │  ← Time for browser to paint the result
│  Delay           │
└────────┬─────────┘
         │
         ▼
    Next Paint

INP = Input Delay + Processing Time + Presentation Delay
```

### Why INP Replaced FID

| Metric | What It Measures | Problem |
|--------|------------------|---------|
| **FID** | Only FIRST interaction delay | Easy to game (fast initial load, slow later) |
| **INP** | ALL interactions, reports worst | Measures real user experience |

### Measuring INP

```js
import { onINP } from 'web-vitals';

onINP((metric) => {
  console.log('INP:', metric.value);
  console.log('Rating:', metric.rating);

  // The interaction that caused the worst INP
  const entry = metric.entries[0];
  console.log('Interaction target:', entry.target);
  console.log('Interaction type:', entry.name);  // 'click', 'keydown', etc.
});
```

```js
// Manual measurement with PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // entry.duration = total interaction time
    // entry.processingStart - entry.startTime = input delay
    // entry.processingEnd - entry.processingStart = processing time

    if (entry.duration > 200) {
      console.warn('Slow interaction:', {
        type: entry.name,
        duration: entry.duration,
        target: entry.target
      });
    }
  }
});

observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
```

### Optimizing INP

```js
// ❌ BAD - Long task blocks main thread
button.addEventListener('click', () => {
  // 200ms of synchronous work
  processLargeDataset(data);
  updateUI();
});

// ✅ GOOD - Yield to main thread
button.addEventListener('click', async () => {
  // Show immediate feedback
  button.classList.add('loading');

  // Yield control back to browser
  await scheduler.yield?.() || new Promise(r => setTimeout(r, 0));

  // Do heavy work
  processLargeDataset(data);
  updateUI();
});
```

```js
// ✅ BETTER - Use Web Worker for heavy computation
const worker = new Worker('processor.js');

button.addEventListener('click', () => {
  button.classList.add('loading');
  worker.postMessage(data);
});

worker.onmessage = (e) => {
  updateUI(e.data);
  button.classList.remove('loading');
};
```

```js
// ✅ Break up work with requestIdleCallback
function processInChunks(items, callback) {
  const queue = [...items];

  function processNext(deadline) {
    while (queue.length > 0 && deadline.timeRemaining() > 0) {
      const item = queue.shift();
      callback(item);
    }

    if (queue.length > 0) {
      requestIdleCallback(processNext);
    }
  }

  requestIdleCallback(processNext);
}
```

| Cause | Solution |
|-------|----------|
| Long event handlers | Break into smaller tasks, yield |
| Heavy computation | Move to Web Worker |
| Large DOM updates | Virtual DOM, batch updates |
| Third-party scripts | Defer, facade pattern |

---

## 4. CLS (Cumulative Layout Shift)

### What It Measures

CLS quantifies how much visible elements **unexpectedly shift** during page load.

```
┌─────────────────────────────────────────────────────────────┐
│  Before Ad Loads              After Ad Loads                 │
│  ┌────────────────┐           ┌────────────────┐            │
│  │    Header      │           │    Header      │            │
│  ├────────────────┤           ├────────────────┤            │
│  │    Article     │           │      AD        │ ← Inserted │
│  │    Content     │           ├────────────────┤            │
│  │                │           │    Article     │ ← Shifted! │
│  │   [Button]     │           │    Content     │            │
│  └────────────────┘           │   [Button]     │ ← Misclick!│
│                               └────────────────┘            │
│                                                              │
│  CLS Score = Impact Fraction × Distance Fraction            │
│                                                              │
│  Impact: % of viewport affected                              │
│  Distance: How far elements moved (as % of viewport)         │
└─────────────────────────────────────────────────────────────┘
```

### The CLS Formula

```
Layout Shift Score = Impact Fraction × Distance Fraction

Impact Fraction = (Area of shifted elements) / (Viewport area)
Distance Fraction = (Max distance moved) / (Viewport height or width)

Example:
- Element covers 50% of viewport (impact = 0.5)
- Element moves 25% of viewport height (distance = 0.25)
- Score = 0.5 × 0.25 = 0.125
```

### Measuring CLS

```js
import { onCLS } from 'web-vitals';

onCLS((metric) => {
  console.log('CLS:', metric.value);
  console.log('Shifts:', metric.entries.length);

  // Identify culprit elements
  metric.entries.forEach(entry => {
    entry.sources?.forEach(source => {
      console.log('Shifted element:', source.node);
    });
  });
});
```

```js
// Using PerformanceObserver
let clsValue = 0;
let clsEntries = [];

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Only count unexpected shifts (not from user input)
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      clsEntries.push(entry);
    }
  }
});

observer.observe({ type: 'layout-shift', buffered: true });
```

### Optimizing CLS

```html
<!-- ✅ Reserve space for images with aspect-ratio -->
<img
  src="photo.jpg"
  width="800"
  height="600"
  style="aspect-ratio: 4/3; width: 100%; height: auto;"
  alt="Photo"
>

<!-- ✅ Reserve space for ads -->
<div class="ad-container" style="min-height: 250px;">
  <!-- Ad loads here -->
</div>
```

```css
/* ✅ Prevent font swap layout shift */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: optional;  /* or 'swap' with size-adjust */
  size-adjust: 100.5%;     /* Match fallback metrics */
}
```

```css
/* ✅ Use transform for animations (doesn't cause layout shift) */
.animate {
  transform: translateY(-10px);  /* Good */
}

.animate-bad {
  margin-top: -10px;  /* Bad - causes layout shift */
}
```

| Cause | Solution |
|-------|----------|
| Images without dimensions | Always set width/height or aspect-ratio |
| Ads/embeds without reserved space | Use min-height containers |
| Dynamically injected content | Insert below fold or reserve space |
| Web fonts causing FOUT | font-display: optional, or size-adjust |
| Animations using layout properties | Use transform instead |

---

## 5. Additional Metrics

### TTFB (Time to First Byte)

```js
const navigation = performance.getEntriesByType('navigation')[0];
const ttfb = navigation.responseStart - navigation.requestStart;

// Good: < 800ms
// Needs improvement: 800-1800ms
// Poor: > 1800ms
```

### FCP (First Contentful Paint)

```js
import { onFCP } from 'web-vitals';

onFCP((metric) => {
  console.log('FCP:', metric.value);
  // Good: < 1.8s
});
```

### Long Tasks

```js
// Detect tasks blocking main thread > 50ms
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn(`Long task: ${entry.duration}ms`);

    // Get attribution if available
    if (entry.attribution) {
      console.log('Script:', entry.attribution[0]?.name);
    }
  }
});

observer.observe({ type: 'longtask', buffered: true });
```

---

## 6. Complete Measurement Setup

```js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    // Include page context
    url: window.location.href,
    userAgent: navigator.userAgent,
    connection: navigator.connection?.effectiveType,
    deviceMemory: navigator.deviceMemory
  });

  // Use sendBeacon for reliability (survives page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics/vitals', body);
  } else {
    fetch('/analytics/vitals', {
      body,
      method: 'POST',
      keepalive: true
    });
  }
}

// Register all Core Web Vitals
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);

// Additional helpful metrics
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);

// Report only once per page
const reported = new Set();
function sendOnce(metric) {
  if (!reported.has(metric.name)) {
    reported.add(metric.name);
    sendToAnalytics(metric);
  }
}
```

---

## 7. Debugging in DevTools

### Chrome DevTools Performance Panel

```
1. Open DevTools → Performance tab
2. Check "Web Vitals" checkbox
3. Click Record, interact with page
4. Stop recording
5. Look for:
   - LCP marker on timeline
   - Layout Shift events (red bars)
   - Long Tasks (gray bars > 50ms)
```

### Lighthouse

```
1. Open DevTools → Lighthouse tab
2. Select "Performance" category
3. Generate report
4. Check:
   - Core Web Vitals scores
   - "Opportunities" for improvements
   - "Diagnostics" for detailed issues
```

### Web Vitals Extension

```
Chrome Extension: "Web Vitals"
- Shows real-time CWV scores
- Green/Yellow/Red indicators
- Click for detailed breakdown
```

---

## 8. Lab vs Field Data

| Data Type | Source | Use Case |
|-----------|--------|----------|
| **Lab** | Lighthouse, DevTools | Development, debugging |
| **Field** | CrUX, RUM | Real user experience |

```
┌─────────────────────────────────────────────────────────────┐
│  WHY THEY DIFFER                                             │
│                                                              │
│  Lab Data:                                                   │
│  - Simulated device/network                                  │
│  - No real user interaction                                  │
│  - Consistent, reproducible                                  │
│                                                              │
│  Field Data:                                                 │
│  - Real devices (slow phones!)                              │
│  - Real networks (3G in India!)                             │
│  - Real user behavior                                        │
│                                                              │
│  Field data is what Google uses for rankings!                │
└─────────────────────────────────────────────────────────────┘
```

### Chrome User Experience Report (CrUX)

```js
// Query CrUX API
const response = await fetch(
  `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${API_KEY}`,
  {
    method: 'POST',
    body: JSON.stringify({
      url: 'https://example.com',
      metrics: ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift']
    })
  }
);

const data = await response.json();
console.log('P75 LCP:', data.record.metrics.largest_contentful_paint.percentiles.p75);
```

---

## 9. Quick Reference

| Metric | Good | Needs Work | Poor | Primary Cause |
|--------|------|------------|------|---------------|
| LCP | < 2.5s | 2.5-4s | > 4s | Slow resource load |
| INP | < 200ms | 200-500ms | > 500ms | Long tasks |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 | Dynamic content |

### Optimization Cheat Sheet

| Metric | Quick Wins |
|--------|------------|
| **LCP** | Preload hero image, inline critical CSS, CDN |
| **INP** | Break long tasks, use Web Workers, debounce |
| **CLS** | Set image dimensions, reserve ad space, use transform |

---

## 10. Interview Tip

> "I measure Core Web Vitals using the web-vitals library and send data to our analytics backend using sendBeacon for reliability. For LCP, I preload the hero image and inline critical CSS. For INP, I profile with DevTools to find long tasks and break them up using yield points or move heavy computation to Web Workers. For CLS, I ensure all images have explicit dimensions and reserve space for dynamic content like ads. I distinguish between lab and field data—Lighthouse is for debugging, but CrUX/RUM reflects real user experience and is what Google uses for rankings. We track P75 values and set alerts when they degrade."
