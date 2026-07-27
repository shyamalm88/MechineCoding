# The Complete Guide to Web Asset Optimization

A comprehensive reference for loading, optimizing, and delivering every type of web asset. The ultimate guide for system design interviews and production applications.

---

## Table of Contents

1. [Critical Rendering Path](#1-critical-rendering-path)
2. [Scripts](#2-scripts)
3. [Stylesheets](#3-stylesheets)
4. [Fonts](#4-fonts)
5. [Images](#5-images)
6. [Videos](#6-videos)
7. [Resource Hints](#7-resource-hints)
8. [Third-Party Scripts & Analytics](#8-third-party-scripts--analytics)
9. [Caching Strategies](#9-caching-strategies)
10. [Compression](#10-compression)
11. [HTTP/2 & HTTP/3](#11-http2--http3)
12. [Core Web Vitals Impact](#12-core-web-vitals-impact)
13. [Priority Hints](#13-priority-hints)
14. [Service Workers & Offline](#14-service-workers--offline)
15. [CDN & Edge Optimization](#15-cdn--edge-optimization)
16. [Loading Order Cheatsheet](#16-loading-order-cheatsheet)

---

## 1. Critical Rendering Path

The browser must complete these steps before showing content:

```
HTML → DOM
              ↘
                → Render Tree → Layout → Paint
              ↗
CSS  → CSSOM
```

### Render-Blocking Resources

| Resource Type   | Blocks Render? | Solution                        |
| --------------- | -------------- | ------------------------------- |
| CSS in `<head>` | Yes            | Critical CSS inline, defer rest |
| Sync `<script>` | Yes            | Use `defer` or `async`          |
| Fonts           | Partially      | `font-display: swap`            |
| Images          | No             | But affects LCP                 |

### The Goal

Minimize **Time to First Contentful Paint (FCP)** by:

1. Inlining critical CSS
2. Deferring non-critical CSS/JS
3. Preloading critical assets
4. Avoiding render-blocking resources

---

## 2. Scripts

### 2.1 Loading Modes

```html
<!-- BLOCKING: Stops everything -->
<script src="app.js"></script>

<!-- ASYNC: Download parallel, execute immediately when ready -->
<script src="analytics.js" async></script>

<!-- DEFER: Download parallel, execute after DOM ready, in order -->
<script src="main.js" defer></script>

<!-- MODULE: Deferred by default, strict mode -->
<script type="module" src="app.mjs"></script>
```

### 2.2 Comparison Table

| Attribute       | Download   | Execution Order | Blocks Parser?   | Use Case                            |
| --------------- | ---------- | --------------- | ---------------- | ----------------------------------- |
| None            | Sequential | Document order  | Yes              | Legacy, inline scripts              |
| `async`         | Parallel   | Download order  | During execution | Analytics, ads, independent scripts |
| `defer`         | Parallel   | Document order  | No               | App code needing DOM                |
| `type="module"` | Parallel   | Document order  | No               | Modern ES modules                   |

### 2.3 Visual Timeline

```
HTML:    ████████████████████████████████████████
         ↓ script tag found

BLOCKING:
Parse:   ████░░░░░░░░░░░░░░░░░████████████████
Download:    ░░░░████████░░░░░░░
Execute:            ░░░░████░░░
                              ↑ continues parsing

DEFER:
Parse:   ████████████████████████████████████████
Download:    ░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░
Execute:                                    ████
                                            ↑ after DOMContentLoaded

ASYNC:
Parse:   ████████████░░░░████████████████████████
Download:    ░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░
Execute:            ████
                    ↑ immediately when ready (pauses parser)
```

### 2.4 Multiple Deferred Scripts

```html
<script src="vendor.js" defer></script>
<!-- 500KB, downloads slow -->
<script src="app.js" defer></script>
<!-- 50KB, downloads fast -->
```

Even if `app.js` finishes first, browser waits and executes `vendor.js` first (order preserved).

### 2.5 The `async defer` Fallback

```html
<script src="app.js" async defer></script>
```

- Modern browsers: Use `async`, ignore `defer`
- IE9 and older: Use `defer` as fallback

### 2.6 Dynamic Script Loading

```js
// Creates async behavior by default
const script = document.createElement("script");
script.src = "analytics.js";
document.head.appendChild(script);

// Force synchronous-like behavior
script.async = false; // Will execute in order if multiple scripts
```

### 2.7 Tree Shaking & Side Effects

```json
// package.json
{
  "sideEffects": false, // Safe to tree-shake everything
  "sideEffects": ["*.css", "*.scss", "./src/polyfills.js"] // Exceptions
}
```

**Warning:** Files with only imports (CSS, polyfills) may be removed if marked as side-effect-free.

---

## 3. Stylesheets

### 3.1 CSS is Render-Blocking

By default, CSS blocks rendering because the browser needs complete CSSOM.

```html
<!-- BLOCKING: Must download before render -->
<link rel="stylesheet" href="styles.css" />
```

### 3.2 Critical CSS Pattern

Inline critical (above-the-fold) CSS, defer the rest:

```html
<head>
  <!-- Critical CSS inlined -->
  <style>
    /* Only styles needed for initial viewport */
    header {
      ...;
    }
    .hero {
      ...;
    }
    nav {
      ...;
    }
  </style>

  <!-- Non-critical CSS deferred -->
  <link
    rel="preload"
    href="full.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <noscript><link rel="stylesheet" href="full.css" /></noscript>
</head>
```

### 3.3 CSS Loading Strategies

| Strategy            | Technique                   | Use Case                         |
| ------------------- | --------------------------- | -------------------------------- |
| **Inline Critical** | `<style>` in head           | Above-the-fold content           |
| **Preload + Swap**  | `rel="preload"` with onload | Non-critical styles              |
| **Media Query**     | `media="print"` swap        | Print styles, non-matching media |
| **Dynamic Import**  | JavaScript injection        | Route-specific styles            |

### 3.4 Media Attribute Trick

```html
<!-- Downloads with low priority, doesn't block render -->
<link rel="stylesheet" href="print.css" media="print" />

<!-- Load non-critical CSS without blocking -->
<link
  rel="stylesheet"
  href="non-critical.css"
  media="print"
  onload="this.media='all'"
/>
```

### 3.5 CSS Containment

Limit browser's rendering work:

```css
.widget {
  contain: layout style paint; /* Isolate from rest of page */
  content-visibility: auto; /* Skip rendering if off-screen */
}
```

### 3.6 Reducing CSS Size

| Technique     | Savings               | Tool                |
| ------------- | --------------------- | ------------------- |
| Minification  | 10-30%                | cssnano, clean-css  |
| Remove unused | 50-90%                | PurgeCSS, UnCSS     |
| CSS Modules   | Scoped, no duplicates | Built into bundlers |
| Atomic CSS    | Highly reusable       | Tailwind, Tachyons  |

---

## 4. Fonts

### 4.1 Font Loading Problems

| Problem                            | Description                    |
| ---------------------------------- | ------------------------------ |
| **FOIT** (Flash of Invisible Text) | Text hidden until font loads   |
| **FOUT** (Flash of Unstyled Text)  | System font shown, then swaps  |
| **Layout Shift**                   | Text reflows when font changes |

### 4.2 font-display Property

```css
@font-face {
  font-family: "MyFont";
  src: url("font.woff2") format("woff2");
  font-display: swap; /* Show fallback immediately, swap when ready */
}
```

| Value      | Block Period    | Swap Period     | Use Case                |
| ---------- | --------------- | --------------- | ----------------------- |
| `auto`     | Browser decides | Browser decides | Default                 |
| `block`    | 3s              | Infinite        | Icon fonts              |
| `swap`     | None            | Infinite        | Body text (recommended) |
| `fallback` | 100ms           | 3s              | Balance of FOIT/FOUT    |
| `optional` | 100ms           | None            | Non-essential fonts     |

### 4.3 Preloading Fonts

```html
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="/fonts/main.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**Important:** `crossorigin` is required even for same-origin fonts!

### 4.4 Font Loading Best Practices

```html
<head>
  <!-- 1. Preconnect to font origin -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- 2. Preload critical font files -->
  <link
    rel="preload"
    href="/fonts/heading.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- 3. Use font-display: swap -->
  <style>
    @font-face {
      font-family: "Heading";
      src: url("/fonts/heading.woff2") format("woff2");
      font-display: swap;
    }
  </style>
</head>
```

### 4.5 Reducing Font Size

| Technique             | Description                                              |
| --------------------- | -------------------------------------------------------- |
| **Subset**            | Only include characters you need (latin vs full unicode) |
| **Variable Fonts**    | One file for all weights/styles                          |
| **WOFF2**             | Best compression, 30% smaller than WOFF                  |
| **System Font Stack** | Zero download, instant render                            |

### 4.6 System Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, sans-serif;
```

### 4.7 Font Loading API

```js
// Check if font is loaded
document.fonts.ready.then(() => {
  document.body.classList.add("fonts-loaded");
});

// Load font programmatically
const font = new FontFace("MyFont", "url(/fonts/my.woff2)");
await font.load();
document.fonts.add(font);
```

---

## 5. Images

### 5.1 Image Formats Comparison

| Format   | Best For              | Transparency | Animation | Compression               |
| -------- | --------------------- | ------------ | --------- | ------------------------- |
| **JPEG** | Photos                | No           | No        | Lossy                     |
| **PNG**  | Graphics, screenshots | Yes          | No        | Lossless                  |
| **WebP** | Everything            | Yes          | Yes       | Both (30% smaller)        |
| **AVIF** | Everything            | Yes          | Yes       | Both (50% smaller)        |
| **SVG**  | Icons, logos          | Yes          | Yes       | Vector (scalable)         |
| **GIF**  | Simple animations     | Yes          | Yes       | Lossless (limited colors) |

### 5.2 Modern Format with Fallback

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>
```

### 5.3 Responsive Images

```html
<!-- Different sizes for different viewports -->
<img
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px,
         (max-width: 1000px) 800px,
         1200px"
  src="medium.jpg"
  alt="Description"
/>

<!-- Different images for art direction -->
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg" />
  <source media="(max-width: 1000px)" srcset="tablet.jpg" />
  <img src="desktop.jpg" alt="Description" />
</picture>
```

### 5.4 Lazy Loading

```html
<!-- Native lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description" />

<!-- Eager load above-the-fold images (LCP) -->
<img src="hero.jpg" loading="eager" fetchpriority="high" alt="Hero" />
```

| Value   | Behavior                   |
| ------- | -------------------------- |
| `lazy`  | Load when near viewport    |
| `eager` | Load immediately (default) |

### 5.5 Image Decoding

```html
<!-- Don't block main thread for decoding -->
<img src="large.jpg" decoding="async" alt="Description" />
```

### 5.6 Aspect Ratio & Layout Shift

```html
<!-- Prevent layout shift with dimensions -->
<img src="photo.jpg" width="800" height="600" alt="Description" />

<!-- Or use aspect-ratio CSS -->
<style>
  .image-container {
    aspect-ratio: 16 / 9;
  }
</style>
```

### 5.7 Image CDN Transformations

```html
<!-- Cloudinary example -->
<img
  src="https://res.cloudinary.com/demo/image/upload/w_400,f_auto,q_auto/sample.jpg"
/>

<!-- Imgix example -->
<img src="https://example.imgix.net/image.jpg?w=400&auto=format,compress" />
```

Common transformations:

- `f_auto` / `auto=format` - Serve best format (AVIF/WebP/JPEG)
- `q_auto` / `auto=compress` - Automatic quality optimization
- `w_400` - Resize to width
- `dpr_2` - Device pixel ratio for retina

### 5.8 LCP Image Optimization

The Largest Contentful Paint image needs special treatment:

```html
<head>
  <!-- Preload LCP image -->
  <link rel="preload" as="image" href="hero.jpg" fetchpriority="high" />
</head>
<body>
  <!-- LCP image with high priority -->
  <img
    src="hero.jpg"
    fetchpriority="high"
    loading="eager"
    decoding="async"
    alt="Hero"
  />
</body>
```

---

## 6. Videos

### 6.1 Video Loading Attributes

```html
<video src="video.mp4" poster="thumbnail.jpg" <!-- Show before load -->
  preload="metadata"
  <!-- Only load metadata initially -->
  playsinline
  <!-- Don't fullscreen on mobile -->
  >
</video>
```

| preload Value | Behavior                           |
| ------------- | ---------------------------------- |
| `none`        | Don't preload anything             |
| `metadata`    | Load duration, dimensions only     |
| `auto`        | Browser decides (often full video) |

### 6.2 Lazy Load Videos

```html
<!-- Only load when near viewport -->
<video preload="none" poster="thumb.jpg">
  <source data-src="video.webm" type="video/webm" />
  <source data-src="video.mp4" type="video/mp4" />
</video>

<script>
  // Intersection Observer to load video sources
</script>
```

### 6.3 Video Formats

| Format   | Codec | Browser Support | Use Case           |
| -------- | ----- | --------------- | ------------------ |
| **MP4**  | H.264 | Universal       | Fallback           |
| **WebM** | VP9   | Chrome, Firefox | Better compression |
| **WebM** | AV1   | Modern browsers | Best compression   |

### 6.4 Animated Images vs Video

Replace GIFs with videos for huge savings:

```html
<!-- Instead of 10MB GIF -->
<video autoplay loop muted playsinline>
  <source src="animation.webm" type="video/webm" />
  <source src="animation.mp4" type="video/mp4" />
</video>
```

A 10MB GIF can become a 500KB video!

---

## 7. Resource Hints

### 7.1 Complete Reference

```html
<!-- DNS lookup only (cheapest) -->
<link rel="dns-prefetch" href="https://api.example.com" />

<!-- DNS + TCP + TLS (use sparingly, max 2-3) -->
<link rel="preconnect" href="https://api.example.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Download now, use on THIS page (high priority) -->
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="hero.jpg" as="image" />
<link rel="preload" href="font.woff2" as="font" crossorigin />

<!-- Download later, use on NEXT page (low priority, idle time) -->
<link rel="prefetch" href="next-page.js" />

<!-- Preload ES modules -->
<link rel="modulepreload" href="app.mjs" />

<!-- Prerender entire page (Chrome only) -->
<link rel="prerender" href="https://example.com/likely-next-page" />
```

### 7.2 Comparison Table

| Hint            | What It Does            | Priority | Cost                | Use Case                     |
| --------------- | ----------------------- | -------- | ------------------- | ---------------------------- |
| `dns-prefetch`  | DNS lookup              | Low      | Very cheap          | Third-party domains          |
| `preconnect`    | DNS + TCP + TLS         | Medium   | ~100-300ms saved    | Critical third-party APIs    |
| `preload`       | Full download           | High     | Network + memory    | Critical current-page assets |
| `prefetch`      | Full download           | Low      | Uses idle bandwidth | Next-page assets             |
| `modulepreload` | Download + parse module | High     | Network + CPU       | Critical ES modules          |
| `prerender`     | Full page render        | Very Low | Expensive           | Highly likely next page      |

### 7.3 The `as` Attribute

Required for `preload` to set correct priority and headers:

```html
<link rel="preload" href="style.css" as="style" />
<link rel="preload" href="main.js" as="script" />
<link rel="preload" href="font.woff2" as="font" crossorigin />
<link rel="preload" href="data.json" as="fetch" crossorigin />
<link rel="preload" href="hero.jpg" as="image" />
<link rel="preload" href="video.mp4" as="video" />
```

### 7.4 Common Mistakes

```html
<!-- WRONG: Missing crossorigin for fonts -->
<link rel="preload" href="font.woff2" as="font" />

<!-- CORRECT -->
<link rel="preload" href="font.woff2" as="font" crossorigin />

<!-- WRONG: Preloading too many resources -->
<link rel="preload" href="a.js" as="script" />
<link rel="preload" href="b.js" as="script" />
<link rel="preload" href="c.js" as="script" />
<!-- ... 10 more preloads = defeats the purpose -->

<!-- WRONG: Preconnect to too many origins -->
<link rel="preconnect" href="https://a.com" />
<link rel="preconnect" href="https://b.com" />
<link rel="preconnect" href="https://c.com" />
<link rel="preconnect" href="https://d.com" />
<!-- Max 2-3 preconnects! -->
```

---

## 8. Third-Party Scripts & Analytics

### 8.1 The Cost of Third-Party

Third-party scripts are often the biggest performance killers:

- **Main thread blocking**
- **Additional DNS/connections**
- **Unpredictable size & execution time**
- **No control over caching**

### 8.2 Loading Strategies

```html
<!-- Option 1: async (most common) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>

<!-- Option 2: Defer until idle (better) -->
<script>
  // Load after page is interactive
  window.addEventListener("load", () => {
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://analytics.example.com/script.js";
      document.body.appendChild(script);
    }, 2000); // 2 second delay
  });
</script>

<!-- Option 3: requestIdleCallback (best) -->
<script>
  requestIdleCallback(() => {
    // Load analytics when browser is idle
  });
</script>
```

### 8.3 Facade Pattern (YouTube, Maps, Chat)

Don't load heavy embeds until interaction:

```html
<!-- Instead of loading 1MB YouTube embed -->
<div class="youtube-facade" data-video-id="dQw4w9WgXcQ">
  <img src="thumbnail.jpg" alt="Video thumbnail" />
  <button>Play Video</button>
</div>

<script>
  document.querySelector(".youtube-facade").addEventListener("click", (e) => {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${e.target.dataset.videoId}?autoplay=1`;
    e.target.replaceWith(iframe);
  });
</script>
```

### 8.4 Web Workers for Analytics

Offload tracking to worker thread:

```js
// analytics-worker.js
self.onmessage = (e) => {
  fetch("https://analytics.example.com/collect", {
    method: "POST",
    body: JSON.stringify(e.data),
    keepalive: true, // Complete even if page closes
  });
};

// main.js
const analyticsWorker = new Worker("analytics-worker.js");
analyticsWorker.postMessage({ event: "page_view", page: location.href });
```

### 8.5 Partytown (Third-Party in Worker)

Move third-party scripts to web worker:

```html
<script>
  partytown = { forward: ["dataLayer.push"] };
</script>
<script src="partytown.js"></script>
<script
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js"
></script>
```

---

## 9. Caching Strategies

### 9.1 Cache-Control Headers

```
# Immutable assets (hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# HTML (always revalidate)
Cache-Control: no-cache

# API responses (short cache)
Cache-Control: private, max-age=60

# No caching at all
Cache-Control: no-store
```

### 9.2 Caching Strategy by Asset Type

| Asset Type     | Filename          | Cache-Control     | Why                      |
| -------------- | ----------------- | ----------------- | ------------------------ |
| JS/CSS bundles | `app.a1b2c3.js`   | 1 year, immutable | Hash changes on update   |
| Images         | `hero.d4e5f6.jpg` | 1 year, immutable | Hash changes on update   |
| HTML           | `index.html`      | no-cache          | Always check for updates |
| Fonts          | `font.woff2`      | 1 year            | Rarely change            |
| API data       | -                 | Short or no-store | Dynamic content          |

### 9.3 ETag & Last-Modified

```
# Server response
ETag: "abc123"
Last-Modified: Tue, 01 Jan 2024 00:00:00 GMT

# Client revalidation request
If-None-Match: "abc123"
If-Modified-Since: Tue, 01 Jan 2024 00:00:00 GMT

# Server response if unchanged
304 Not Modified
```

### 9.4 Service Worker Caching

```js
// Cache-first strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

// Network-first with cache fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
```

---

## 10. Compression

### 10.1 Compression Algorithms

| Algorithm     | Compression           | Speed     | Browser Support |
| ------------- | --------------------- | --------- | --------------- |
| **gzip**      | Good                  | Fast      | Universal       |
| **Brotli**    | 15-25% better         | Slower    | Modern browsers |
| **Zstandard** | Fastest at same ratio | Very fast | Limited         |

### 10.2 What to Compress

| Compress      | Don't Compress             |
| ------------- | -------------------------- |
| HTML, CSS, JS | JPEG, PNG, WebP, AVIF      |
| JSON, XML     | WOFF2 (already compressed) |
| SVG           | MP4, WebM                  |
| Plain text    | ZIP, GZIP files            |

### 10.3 Content Negotiation

```
# Client request
Accept-Encoding: br, gzip, deflate

# Server response (Brotli)
Content-Encoding: br
```

### 10.4 Typical Savings

| File Type  | Original | Gzip   | Brotli |
| ---------- | -------- | ------ | ------ |
| HTML       | 100 KB   | 20 KB  | 17 KB  |
| CSS        | 150 KB   | 25 KB  | 20 KB  |
| JavaScript | 500 KB   | 120 KB | 95 KB  |
| JSON       | 200 KB   | 30 KB  | 25 KB  |

---

## 11. HTTP/2 & HTTP/3

### 11.1 HTTP/1.1 Limitations

- **6 connections per domain** max
- **Head-of-line blocking** - one slow resource blocks others
- **No multiplexing** - one request per connection at a time

### 11.2 HTTP/2 Benefits

| Feature                   | Benefit                           |
| ------------------------- | --------------------------------- |
| **Multiplexing**          | Many requests over one connection |
| **Header compression**    | HPACK reduces header size         |
| **Server push**           | Send resources before requested   |
| **Stream prioritization** | Important resources first         |

### 11.3 HTTP/2 Strategy Changes

| Old (HTTP/1.1)      | New (HTTP/2+)              |
| ------------------- | -------------------------- |
| Bundle everything   | Granular chunks            |
| CSS sprites         | Individual images          |
| Domain sharding     | Single domain              |
| Inline small assets | Separate files (cacheable) |

### 11.4 HTTP/3 (QUIC)

- **UDP-based** - No TCP head-of-line blocking
- **0-RTT resumption** - Faster repeat connections
- **Better on unreliable networks** - Mobile, WiFi

### 11.5 Granular Chunking Strategy

```js
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: 50000,  // 50KB chunks
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
      },
    },
  },
},
```

| Strategy        | On Code Change    | User Downloads |
| --------------- | ----------------- | -------------- |
| One 2MB bundle  | Re-download 2MB   | 2MB            |
| Granular chunks | Re-download ~50KB | ~50KB          |

---

## 12. Core Web Vitals Impact

### 12.1 LCP (Largest Contentful Paint)

**Target:** < 2.5 seconds

| Asset Type | Impact        | Optimization                       |
| ---------- | ------------- | ---------------------------------- |
| Hero image | Direct        | Preload, proper format, responsive |
| Web fonts  | Delays text   | font-display: swap, preload        |
| CSS        | Blocks render | Critical CSS inline                |
| JS         | Can block     | defer, async                       |

```html
<!-- LCP optimization combo -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high" />
<link rel="preload" as="font" href="heading.woff2" crossorigin />
<style>
  /* Critical CSS */
</style>
```

### 12.2 FID/INP (Interaction Responsiveness)

**Target:** < 100ms (FID) / < 200ms (INP)

| Problem           | Solution                                |
| ----------------- | --------------------------------------- |
| Long JS tasks     | Break into chunks, yield to main thread |
| Heavy third-party | Defer, use web workers                  |
| Large bundle      | Code splitting                          |

```js
// Yield to allow paint
async function processItems(items) {
  for (const item of items) {
    process(item);
    (await scheduler.yield?.()) ?? new Promise((r) => setTimeout(r, 0));
  }
}
```

### 12.3 CLS (Cumulative Layout Shift)

**Target:** < 0.1

| Cause                     | Solution                            |
| ------------------------- | ----------------------------------- |
| Images without dimensions | Set width/height or aspect-ratio    |
| Fonts causing reflow      | font-display: optional, size-adjust |
| Dynamic content           | Reserve space with min-height       |
| Ads/embeds                | Fixed size containers               |

```html
<!-- Prevent layout shift -->
<img src="photo.jpg" width="800" height="600" alt="" />

<style>
  @font-face {
    font-family: "MyFont";
    src: url("font.woff2");
    font-display: swap;
    size-adjust: 105%; /* Match fallback metrics */
  }
</style>
```

---

## 13. Priority Hints

### 13.1 fetchpriority Attribute

```html
<!-- High priority (LCP image) -->
<img src="hero.jpg" fetchpriority="high" />

<!-- Low priority (below fold) -->
<img src="footer-logo.jpg" fetchpriority="low" />

<!-- High priority script -->
<script src="critical.js" fetchpriority="high"></script>

<!-- Low priority prefetch -->
<link rel="prefetch" href="next.js" fetchpriority="low" />
```

### 13.2 Default Priorities

| Resource             | Default Priority |
| -------------------- | ---------------- |
| CSS in head          | Highest          |
| Fonts                | High             |
| Scripts (blocking)   | High             |
| Scripts (async)      | Low              |
| Images (in viewport) | High             |
| Images (below fold)  | Low              |

### 13.3 Fetch API Priority

```js
fetch("/api/critical-data", { priority: "high" });
fetch("/api/analytics", { priority: "low" });
```

---

## 14. Service Workers & Offline

### 14.1 Caching Strategies

| Strategy                   | Use Case                | Code                                 |
| -------------------------- | ----------------------- | ------------------------------------ |
| **Cache First**            | Static assets           | `cache.match() \|\| fetch()`         |
| **Network First**          | API, fresh content      | `fetch().catch(() => cache.match())` |
| **Stale While Revalidate** | Balance of fresh + fast | Return cache, update in background   |
| **Cache Only**             | Offline-only assets     | `cache.match()`                      |
| **Network Only**           | Always fresh            | `fetch()`                            |

### 14.2 Stale While Revalidate

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("dynamic").then((cache) => {
      return cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
        return cached || fetchPromise;
      });
    })
  );
});
```

### 14.3 Precaching

```js
// Install event - cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static-v1").then((cache) => {
      return cache.addAll(["/", "/app.js", "/styles.css", "/offline.html"]);
    })
  );
});
```

---

## 15. CDN & Edge Optimization

### 15.1 CDN Benefits

| Benefit                    | Description                 |
| -------------------------- | --------------------------- |
| **Geographic proximity**   | Serve from nearest edge     |
| **Reduced latency**        | Shorter round trips         |
| **Offload origin**         | Less server load            |
| **DDoS protection**        | Absorb attacks at edge      |
| **Automatic optimization** | Image resizing, compression |

### 15.2 Edge Computing

```js
// Cloudflare Worker example
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Personalize at edge
  const country = request.cf.country;
  const response = await fetch(request);

  // Modify response
  return new HTMLRewriter()
    .on("h1", new CountryHandler(country))
    .transform(response);
}
```

### 15.3 Cache Invalidation

```bash
# Purge by URL
curl -X POST "https://api.cloudflare.com/purge" -d '{"files":["https://example.com/style.css"]}'

# Purge by tag
curl -X POST "https://api.cloudflare.com/purge" -d '{"tags":["static-assets"]}'
```

---

## 16. Loading Order Cheatsheet

### 16.1 Optimal `<head>` Order

```html
<head>
  <!-- 1. Character encoding (must be in first 1024 bytes) -->
  <meta charset="UTF-8" />

  <!-- 2. Viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- 3. Preconnect to critical origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://api.example.com" />

  <!-- 4. Preload critical assets -->
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin />
  <link rel="preload" href="/hero.webp" as="image" fetchpriority="high" />

  <!-- 5. Critical CSS inline -->
  <style>
    /* Critical above-fold CSS */
  </style>

  <!-- 6. Async non-critical CSS -->
  <link
    rel="stylesheet"
    href="/main.css"
    media="print"
    onload="this.media='all'"
  />

  <!-- 7. Deferred scripts -->
  <script src="/app.js" defer></script>

  <!-- 8. Async third-party -->
  <script async src="https://analytics.example.com/script.js"></script>

  <!-- 9. Prefetch for next navigation -->
  <link rel="prefetch" href="/about.js" />

  <!-- 10. DNS prefetch for secondary domains -->
  <link rel="dns-prefetch" href="https://cdn.example.com" />
</head>
```

### 16.2 Asset Priority Matrix

| Asset               | Priority | Loading         | Caching         |
| ------------------- | -------- | --------------- | --------------- |
| Critical CSS        | Highest  | Inline          | -               |
| LCP Image           | Highest  | Preload + eager | 1 year          |
| Web fonts           | High     | Preload         | 1 year          |
| Main JS             | High     | defer           | 1 year (hashed) |
| Non-critical CSS    | Medium   | Async load      | 1 year          |
| Below-fold images   | Low      | lazy            | 1 year          |
| Third-party scripts | Lowest   | async + delayed | -               |
| Prefetch resources  | Idle     | prefetch        | Varies          |

### 16.3 Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                     ASSET LOADING BIBLE                         │
├─────────────────────────────────────────────────────────────────┤
│ SCRIPTS                                                         │
│   • App code → defer                                            │
│   • Analytics → async + delay                                   │
│   • Critical → inline or preload                                │
├─────────────────────────────────────────────────────────────────┤
│ STYLES                                                          │
│   • Above-fold → inline                                         │
│   • Rest → preload + media swap                                 │
│   • Third-party → preconnect                                    │
├─────────────────────────────────────────────────────────────────┤
│ FONTS                                                           │
│   • Critical → preload + swap                                   │
│   • Secondary → swap or optional                                │
│   • Always → WOFF2 + crossorigin                                │
├─────────────────────────────────────────────────────────────────┤
│ IMAGES                                                          │
│   • LCP → preload + eager + fetchpriority="high"               │
│   • Below-fold → loading="lazy"                                 │
│   • Format → AVIF > WebP > JPEG                                 │
│   • Always → width/height for CLS                               │
├─────────────────────────────────────────────────────────────────┤
│ RESOURCE HINTS                                                  │
│   • Critical API → preconnect (max 2-3)                         │
│   • Third-party → dns-prefetch                                  │
│   • Current page → preload                                      │
│   • Next page → prefetch                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 17. Build Tool Configuration (Webpack/Vite)

### 17.1 Critical CSS with Critters (Automatic)

Critters automatically inlines critical CSS and defers the rest:

```js
// webpack.config.js
const Critters = require("critters-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new Critters({
      // Inline critical CSS for above-the-fold
      preload: "swap", // Preload strategy for rest
      inlineFonts: true, // Inline critical @font-face
      pruneSource: true, // Remove inlined CSS from stylesheet
      compress: true, // Minify inlined CSS
      mergeStylesheets: true, // Combine all stylesheets
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

**Output:**

```html
<head>
  <!-- Critical CSS inlined automatically -->
  <style>
    .header {
      ...;
    }
    .hero {
      ...;
    }
    .nav {
      ...;
    }
  </style>

  <!-- Rest loaded async -->
  <link
    rel="preload"
    href="main.abc123.css"
    as="style"
    onload="this.rel='stylesheet'"
  />
</head>
```

### 17.2 Code Splitting for Critical JS

```js
// webpack.config.js
module.exports = {
  entry: {
    // Critical: loads first, contains minimal bootstrap
    critical: "./src/critical.js",
    // Main: deferred, loads after critical
    main: "./src/index.js",
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,

      cacheGroups: {
        // Critical vendor libs (React, essential UI)
        criticalVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: "critical-vendor",
          chunks: "all",
          priority: 30,
          enforce: true,
        },

        // Non-critical vendors (charts, heavy libs)
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 20,
        },

        // Shared code between entry points
        common: {
          minChunks: 2,
          name: "common",
          chunks: "all",
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },

    // Separate runtime for better caching
    runtimeChunk: "single",
  },
};
```

### 17.3 Preload/Prefetch with Webpack Magic Comments

```js
// Dynamic imports with hints
// PRELOAD: Critical for current page (high priority)
const Header = import(/* webpackPreload: true */ "./Header");

// PREFETCH: Needed for next navigation (idle time)
const Dashboard = import(/* webpackPrefetch: true */ "./Dashboard");

// Named chunks for better caching
const UserProfile = import(
  /* webpackChunkName: "user-profile" */
  /* webpackPrefetch: true */
  "./UserProfile"
);
```

**Generated HTML:**

```html
<link rel="preload" href="Header.js" as="script" />
<link rel="prefetch" href="Dashboard.js" />
<link rel="prefetch" href="user-profile.js" />
```

### 17.4 HTML Webpack Plugin for Resource Hints

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",

      // Script loading strategy
      scriptLoading: "defer", // 'blocking' | 'defer' | 'module'

      // Inject assets
      inject: "head", // Put scripts in head with defer

      // Preload critical chunks
      meta: {
        viewport: "width=device-width, initial-scale=1",
      },
    }),
  ],
};

// Custom resource hints plugin
class ResourceHintsPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("ResourceHintsPlugin", (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        "ResourceHintsPlugin",
        (data, cb) => {
          // Add preconnect
          data.assetTags.meta.unshift({
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://api.example.com",
            },
          });
          cb(null, data);
        }
      );
    });
  }
}
```

### 17.5 Complete Critical Path Webpack Config

```js
// webpack.config.js - Production optimized for above-the-fold
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Critters = require("critters-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "production",

  entry: {
    critical: "./src/critical.js", // Minimal bootstrap
    main: "./src/index.js", // Full app
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    clean: true,
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs
            drop_debugger: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],

    splitChunks: {
      chunks: "all",
      maxSize: 50000, // 50KB max chunks for HTTP/2
      cacheGroups: {
        criticalVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "critical-vendor",
          priority: 30,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 20,
        },
      },
    },

    runtimeChunk: "single",
    moduleIds: "deterministic", // Stable chunk hashes
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { modules: false }], // Preserve ES modules for tree shaking
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(woff2?|ttf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // Inline < 4KB images
          },
        },
        generator: {
          filename: "images/[name].[hash:8][ext]",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      scriptLoading: "defer",
      inject: "head",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),

    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].chunk.css",
    }),

    // Auto-inline critical CSS
    new Critters({
      preload: "swap",
      inlineFonts: true,
      pruneSource: true,
    }),

    // Generate Brotli/Gzip
    new CompressionPlugin({
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // Only compress > 10KB
      minRatio: 0.8,
    }),

    // Analyze bundle (run with --analyze flag)
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),

  // Performance budgets
  performance: {
    maxAssetSize: 250000, // 250KB per asset
    maxEntrypointSize: 250000, // 250KB initial load
    hints: "error", // Fail build if exceeded
  },
};
```

### 17.6 Vite Configuration for Critical Path

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { critters } from "@vite-pwa/assets-generator";

export default defineConfig({
  plugins: [react()],

  build: {
    // Target modern browsers for smaller bundles
    target: "es2020",

    // CSS code splitting
    cssCodeSplit: true,

    // Chunk strategy
    rollupOptions: {
      output: {
        // Manual chunks for critical path
        manualChunks: (id) => {
          // Critical vendor libs
          if (id.includes("node_modules/react")) {
            return "critical-vendor";
          }
          // Heavy libs loaded later
          if (
            id.includes("node_modules/chart.js") ||
            id.includes("node_modules/moment")
          ) {
            return "heavy-vendor";
          }
          // Other node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },

        // Asset naming
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name)) {
            return "css/[name]-[hash][extname]";
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return "fonts/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },

    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // Preload critical assets
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === "js" && filename.includes("critical")) {
        return { runtime: `preloadLink("${filename}")` };
      }
      return filename;
    },
  },
});
```

### 17.7 Route-Based Code Splitting (React)

```jsx
// App.jsx - Critical vs lazy routes
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// CRITICAL: Import directly (bundled with main)
import Home from "./pages/Home";
import Header from "./components/Header";

// NON-CRITICAL: Lazy load (separate chunks)
const Dashboard = lazy(() =>
  import(
    /* webpackChunkName: "dashboard" */
    /* webpackPrefetch: true */
    "./pages/Dashboard"
  )
);

const Settings = lazy(() =>
  import(
    /* webpackChunkName: "settings" */
    "./pages/Settings"
  )
);

// Heavy features - only load on demand
const Analytics = lazy(() =>
  import(
    /* webpackChunkName: "analytics" */
    "./pages/Analytics"
  )
);

function App() {
  return (
    <>
      <Header /> {/* Critical - renders immediately */}
      <Suspense fallback={<div className="skeleton" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </>
  );
}
```

### 17.8 Manual Critical CSS Extraction

```js
// scripts/extract-critical.js
const critical = require("critical");
const fs = require("fs");
const path = require("path");

async function extractCriticalCSS() {
  const pages = [
    { url: "/", output: "index.html" },
    { url: "/products", output: "products.html" },
  ];

  for (const page of pages) {
    const result = await critical.generate({
      base: "dist/",
      src: page.output,
      target: {
        html: page.output,
        css: `critical-${page.output.replace(".html", ".css")}`,
      },
      width: 1300,
      height: 900,
      inline: true, // Inline critical CSS
      extract: true, // Remove from original CSS
      penthouse: {
        blockJSRequests: false,
      },
    });

    console.log(`✓ Extracted critical CSS for ${page.url}`);
  }
}

extractCriticalCSS();
```

**package.json:**

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "postbuild": "node scripts/extract-critical.js"
  }
}
```

### 17.9 Performance Budget Configuration

```js
// webpack.config.js
module.exports = {
  performance: {
    // Error if budgets exceeded
    hints: 'error',

    // Individual asset limit
    maxAssetSize: 200 * 1024,  // 200KB

    // Initial load limit (critical path)
    maxEntrypointSize: 150 * 1024,  // 150KB

    // Custom checks
    assetFilter: (assetFilename) => {
      // Only check JS and CSS
      return /\.(js|css)$/.test(assetFilename);
    },
  },
};

// bundlesize.config.json (CI integration)
{
  "files": [
    {
      "path": "dist/critical*.js",
      "maxSize": "30 kB",
      "compression": "brotli"
    },
    {
      "path": "dist/main*.js",
      "maxSize": "150 kB",
      "compression": "brotli"
    },
    {
      "path": "dist/*.css",
      "maxSize": "50 kB",
      "compression": "brotli"
    }
  ]
}
```

### 17.10 Above-the-Fold Optimization Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│              ABOVE-THE-FOLD SPEED CHECKLIST                     │
├─────────────────────────────────────────────────────────────────┤
│ CSS                                                             │
│   □ Critical CSS inlined (<14KB)                                │
│   □ Non-critical CSS deferred with media="print" trick          │
│   □ Critters/Critical configured in build                       │
│   □ Unused CSS removed (PurgeCSS)                               │
├─────────────────────────────────────────────────────────────────┤
│ JAVASCRIPT                                                      │
│   □ Critical JS < 50KB (compressed)                             │
│   □ Main bundle uses defer                                      │
│   □ Route-based code splitting                                  │
│   □ Heavy libs lazy loaded (charts, editors)                    │
│   □ webpackPrefetch for likely next pages                       │
├─────────────────────────────────────────────────────────────────┤
│ IMAGES                                                          │
│   □ LCP image preloaded with fetchpriority="high"               │
│   □ Hero image in modern format (WebP/AVIF)                     │
│   □ Responsive srcset configured                                │
│   □ Width/height attributes set                                 │
├─────────────────────────────────────────────────────────────────┤
│ FONTS                                                           │
│   □ Critical font preloaded                                     │
│   □ font-display: swap                                          │
│   □ Subset to required characters                               │
│   □ WOFF2 format                                                │
├─────────────────────────────────────────────────────────────────┤
│ BUILD OUTPUT                                                    │
│   □ Initial JS < 150KB (compressed)                             │
│   □ Initial CSS < 50KB (compressed)                             │
│   □ All assets Brotli compressed                                │
│   □ Content hashes for caching                                  │
│   □ Performance budgets enforced                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interview Answer Template

> "For asset optimization, I follow a priority-based approach:
>
> **Critical path first:** I inline critical CSS and preload LCP images and fonts. Scripts use `defer` for app code and `async` with delays for analytics.
>
> **Fonts:** I use `font-display: swap` to avoid FOIT, preload critical fonts, and always serve WOFF2.
>
> **Images:** I serve modern formats (AVIF/WebP) with fallbacks, use responsive images with `srcset`, lazy-load below-fold images, and always set dimensions to prevent layout shift.
>
> **Third-party:** I delay loading until after the page is interactive, use facades for heavy embeds like YouTube, and consider Partytown for running scripts in workers.
>
> **Caching:** Immutable assets with content hashes get 1-year cache, HTML uses no-cache for instant updates.
>
> The goal is achieving good Core Web Vitals: LCP under 2.5s, INP under 200ms, and CLS under 0.1."
