# How to improve the performance of a web application?

A structured answer beats a list of tips. Work through the phases a page
actually goes through.

## 1. Deliver less

- **Code splitting** at route and component level; ship what the first screen
  needs and nothing more.
- **Tree shaking** and avoiding barrel files that defeat it.
- Modern image formats (AVIF/WebP), correct `sizes`/`srcset`, and
  `loading="lazy"` for below-the-fold images.
- Compression: Brotli over gzip for text assets.

## 2. Deliver it sooner

- CDN edge caching so bytes start closer to the user.
- `preconnect`/`dns-prefetch` for third-party origins you know you will hit.
- `preload` genuinely critical assets (the LCP image, the primary font).
- HTTP/2 or HTTP/3 so requests multiplex instead of queueing.

## 3. Render it faster

- Keep the critical rendering path short: render-blocking CSS minimal, scripts
  `defer`ed.
- `font-display: swap` so text is never invisible waiting on a font.
- Reserve space for images and embeds to avoid layout shift.

## 4. Keep it fast after load

- Virtualize long lists; never render 10,000 rows.
- Memoize expensive subtrees, but only after measuring — `useMemo` everywhere
  is its own cost.
- Debounce/throttle high-frequency handlers (scroll, resize, input).
- Move heavy computation to a Web Worker so the main thread stays responsive.

## The thing that separates a good answer

Say **"measure first"** and mean it. Name the metric you are targeting — a
slow LCP (bytes/network) demands a completely different fix from a poor INP
(main-thread work). Optimising without knowing which one is broken is guessing.
