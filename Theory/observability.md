# Frontend Observability & Monitoring: A Senior Engineer's Guide

You can't improve what you can't measure. Observability is how you understand your application in production.

---

## 1. The Three Pillars of Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY                                 │
├──────────────────┬──────────────────┬───────────────────────────┤
│      LOGS        │     METRICS      │         TRACES            │
│                  │                  │                           │
│ What happened?   │ How much/often?  │ How long did it take?     │
│                  │                  │                           │
│ - Error messages │ - Page views     │ - Request duration        │
│ - User actions   │ - Error rates    │ - Component render time   │
│ - API responses  │ - Core Web Vitals│ - API call waterfall      │
│                  │                  │                           │
│ Sentry, LogRocket│ DataDog, Grafana │ OpenTelemetry, Jaeger     │
└──────────────────┴──────────────────┴───────────────────────────┘
```

---

## 2. Error Tracking

Errors in production are inevitable. Catching them quickly is what matters.

### Global Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Send to error tracking service
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Sentry Integration

```js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://xxx@sentry.io/123',
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION,

  // Sample 10% of transactions for performance
  tracesSampleRate: 0.1,

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network request failed',
  ],

  // Add context to all events
  beforeSend(event) {
    // Scrub sensitive data
    if (event.request?.cookies) {
      event.request.cookies = '[Filtered]';
    }
    return event;
  },
});

// Manual error capture with context
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'checkout',
      paymentMethod: 'stripe',
    },
    user: {
      id: user.id,
      email: user.email,
    },
  });
}
```

### Unhandled Promise Rejections

```js
// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason, {
    tags: { type: 'unhandledrejection' },
  });
});

// Catch global errors
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error, {
    tags: { type: 'global-error' },
  });
});
```

---

## 3. Core Web Vitals

Google's metrics for user experience, affecting SEO rankings.

### The Three Core Web Vitals

| Metric | What It Measures | Good | Needs Work | Poor |
|--------|------------------|------|------------|------|
| **LCP** (Largest Contentful Paint) | Loading performance | < 2.5s | 2.5-4s | > 4s |
| **INP** (Interaction to Next Paint) | Interactivity | < 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | < 0.1 | 0.1-0.25 | > 0.25 |

### Measuring with web-vitals Library

```js
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,  // 'good', 'needs-improvement', 'poor'
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // Use sendBeacon for reliability (survives page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

// Collect all Core Web Vitals
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### Understanding Each Metric

#### LCP (Largest Contentful Paint)

```
┌─────────────────────────────────────────────────────────────────┐
│  Timeline                                                        │
│  0ms ──────────────────────────────────────────────────▶ 2500ms │
│       │                    │                                     │
│       │                    └── LCP: Hero image fully rendered    │
│       │                                                          │
│       └── First byte received                                    │
│                                                                  │
│  What counts as LCP:                                             │
│  - <img> elements                                                │
│  - <image> inside <svg>                                          │
│  - <video> poster image                                          │
│  - Background image via CSS                                      │
│  - Block-level text elements                                     │
└─────────────────────────────────────────────────────────────────┘

Optimization:
- Preload LCP image: <link rel="preload" as="image" href="hero.jpg">
- Use CDN for faster delivery
- Optimize image size and format (WebP/AVIF)
- Remove render-blocking resources
```

#### INP (Interaction to Next Paint)

```
User clicks button
       │
       ▼
┌──────────────────┐
│  Input Delay     │  ← JS blocking main thread
│  (event queued)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Processing Time │  ← Event handler execution
│  (handler runs)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Presentation    │  ← Browser paints the update
│  Delay           │
└────────┬─────────┘
         │
         ▼
    Next Paint

Total INP = Input Delay + Processing + Presentation

Optimization:
- Break up long tasks (yield to main thread)
- Use requestIdleCallback for non-critical work
- Debounce/throttle expensive handlers
- Move heavy work to Web Workers
```

#### CLS (Cumulative Layout Shift)

```
┌─────────────────────────────────────────────────────────────────┐
│  Before Ad Loads              After Ad Loads                     │
│  ┌────────────────┐           ┌────────────────┐                │
│  │    Header      │           │    Header      │                │
│  ├────────────────┤           ├────────────────┤                │
│  │    Article     │           │      AD        │ ← Inserted!    │
│  │    Content     │           ├────────────────┤                │
│  │                │           │    Article     │ ← Shifted!     │
│  │   [Button]     │           │    Content     │                │
│  └────────────────┘           │                │                │
│                               │   [Button]     │ ← User clicks  │
│                               └────────────────┘    wrong thing │
│                                                                  │
│  CLS Score = (Impact Fraction) × (Distance Fraction)            │
└─────────────────────────────────────────────────────────────────┘

Optimization:
- Reserve space for dynamic content (aspect-ratio, min-height)
- Don't insert content above existing content
- Use transform for animations instead of top/left
- Preload fonts to avoid FOUT
```

---

## 4. Performance Monitoring

### Custom Performance Marks

```js
// Mark when component starts rendering
performance.mark('product-list-start');

// ... component renders ...

// Mark when done
performance.mark('product-list-end');

// Measure the duration
performance.measure(
  'product-list-render',
  'product-list-start',
  'product-list-end'
);

// Get the measurement
const measures = performance.getEntriesByName('product-list-render');
console.log(`Render took: ${measures[0].duration}ms`);

// Send to analytics
sendToAnalytics({
  name: 'product-list-render',
  value: measures[0].duration,
});
```

### React Profiler API

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id,           // Component ID
  phase,        // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration,   // Estimated time without memoization
  startTime,      // When React started rendering
  commitTime      // When React committed this update
) {
  // Send to monitoring
  if (actualDuration > 16) {  // More than one frame
    sendToAnalytics({
      component: id,
      phase,
      duration: actualDuration,
      wasted: actualDuration - baseDuration,
    });
  }
}

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList products={products} />
</Profiler>
```

### Long Task Detection

```js
// Detect tasks blocking main thread for > 50ms
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn('Long Task detected:', entry);

      sendToAnalytics({
        name: 'long-task',
        duration: entry.duration,
        startTime: entry.startTime,
      });
    }
  }
});

observer.observe({ entryTypes: ['longtask'] });
```

---

## 5. User Session Recording

Tools like LogRocket, FullStory, or Hotjar record user sessions for debugging.

### What to Capture

```js
// LogRocket example
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');

// Identify users
LogRocket.identify(user.id, {
  name: user.name,
  email: user.email,
  plan: user.subscription,
});

// Track custom events
LogRocket.track('Checkout Started', {
  cartValue: 99.99,
  itemCount: 3,
});

// Attach to Sentry errors
Sentry.init({
  beforeSend(event) {
    const sessionURL = LogRocket.sessionURL;
    if (sessionURL) {
      event.extra.sessionURL = sessionURL;
    }
    return event;
  },
});
```

### Privacy Considerations

```js
// Mask sensitive inputs
LogRocket.init('your-app-id', {
  network: {
    // Don't log request/response bodies
    requestSanitizer: (request) => {
      if (request.url.includes('/api/auth')) {
        request.body = null;
      }
      return request;
    },
  },
  dom: {
    // Mask sensitive elements
    inputSanitizer: true,  // Masks all inputs by default
    textSanitizer: (text, element) => {
      if (element.classList.contains('sensitive')) {
        return '***';
      }
      return text;
    },
  },
});
```

---

## 6. Real User Monitoring (RUM)

Collect data from actual users, not synthetic tests.

### Custom RUM Implementation

```js
// Collect navigation timing
const navigation = performance.getEntriesByType('navigation')[0];

const metrics = {
  // Time to First Byte
  ttfb: navigation.responseStart - navigation.requestStart,

  // DOM Content Loaded
  domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,

  // Page fully loaded
  loadComplete: navigation.loadEventEnd - navigation.startTime,

  // DNS lookup time
  dns: navigation.domainLookupEnd - navigation.domainLookupStart,

  // TCP connection time
  tcp: navigation.connectEnd - navigation.connectStart,

  // Time downloading document
  download: navigation.responseEnd - navigation.responseStart,
};

// Send with user context
sendToAnalytics({
  type: 'page-load',
  metrics,
  context: {
    url: window.location.href,
    userAgent: navigator.userAgent,
    connection: navigator.connection?.effectiveType,  // '4g', '3g', etc.
    deviceMemory: navigator.deviceMemory,  // GB
  },
});
```

### Resource Timing

```js
// Monitor resource loading performance
const resources = performance.getEntriesByType('resource');

resources.forEach((resource) => {
  if (resource.initiatorType === 'script' && resource.duration > 1000) {
    console.warn(`Slow script: ${resource.name} took ${resource.duration}ms`);
  }

  if (resource.initiatorType === 'img' && resource.transferSize > 500000) {
    console.warn(`Large image: ${resource.name} is ${resource.transferSize} bytes`);
  }
});
```

---

## 7. Alerting Strategy

### Alert on Symptoms, Not Causes

```
BAD:  Alert when CPU > 80%
GOOD: Alert when P95 response time > 500ms

BAD:  Alert when memory > 90%
GOOD: Alert when error rate > 1%
```

### Alert Fatigue Prevention

```yaml
# Example alerting rules (Datadog/Grafana style)

# Critical: Page someone
- name: Error rate spike
  condition: error_rate > 5% for 5 minutes
  severity: critical
  notify: pagerduty

# Warning: Slack channel
- name: Elevated latency
  condition: p95_latency > 1000ms for 15 minutes
  severity: warning
  notify: slack-engineering

# Info: Dashboard only
- name: Slightly elevated errors
  condition: error_rate > 1% for 10 minutes
  severity: info
  notify: none
```

---

## 8. Debugging in Production

### Source Maps

```js
// webpack.config.js
module.exports = {
  devtool: 'hidden-source-map',  // Generate but don't expose in bundle

  // Upload to Sentry
  plugins: [
    new SentryWebpackPlugin({
      include: './dist',
      ignore: ['node_modules'],
      release: process.env.RELEASE_VERSION,
    }),
  ],
};
```

### Feature Flags for Debugging

```js
// Enable verbose logging for specific users
if (featureFlags.isEnabled('debug-mode', { userId: user.id })) {
  console.log('Detailed debug info:', {
    state: store.getState(),
    props,
    network: performance.getEntriesByType('resource'),
  });
}
```

---

## 9. Observability Stack Comparison

| Tool | Best For | Cost |
|------|----------|------|
| **Sentry** | Error tracking | Free tier, then usage-based |
| **LogRocket** | Session replay | Per-session pricing |
| **DataDog** | Full-stack APM | Expensive, per-host |
| **Grafana Cloud** | Custom metrics | Free tier, then usage |
| **Google Analytics 4** | User analytics | Free |
| **Vercel Analytics** | Web Vitals (Next.js) | Included with Vercel |
| **OpenTelemetry** | Vendor-neutral tracing | Free (open source) |

---

## 10. Interview Tip

> "I approach observability as a critical production requirement, not an afterthought. I implement error boundaries with Sentry integration to catch and contextualize errors. For performance, I track Core Web Vitals using the web-vitals library and set up alerts for P75/P95 degradation. I use the Performance API to measure critical user journeys and the Long Task API to detect main thread blocking. For debugging, I ensure source maps are uploaded to Sentry (but not exposed in bundles) and use session replay tools with proper PII masking. The key is actionable data—I alert on user-facing symptoms, not infrastructure metrics."
