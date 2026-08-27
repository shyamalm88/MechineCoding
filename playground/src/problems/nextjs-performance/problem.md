# Optimising a Next.js app

A structured answer, ordered the way you would actually investigate.

## 1. Measure first

`next build` prints per-route JS size and marks each route static (○), dynamic
(ƒ) or ISR. A route that unexpectedly became dynamic is often the whole problem.

`@next/bundle-analyzer` shows *what* is in the bundle. Lighthouse and field RUM
tell you whether users are affected.

## 2. Ship less JavaScript

- **Push `'use client'` to the leaves.** The directive is a boundary — everything
  imported below it joins the client bundle. One misplaced directive at the top
  of a layout can ship the whole app.
- `next/dynamic` for genuinely heavy, rarely used components (a chart library, a
  rich text editor), with `ssr: false` for browser-only ones.
- Check for a large date/i18n/icon library imported for one function.

## 3. Get the rendering mode right

Static beats dynamic beats blocking. Audit which routes are dynamic and *why* —
a stray `cookies()` or an unwrapped `useSearchParams()` silently forces
per-request rendering.

## 4. Fix data waterfalls

`Promise.all` for independent fetches; separate Suspense boundaries for genuinely
dependent ones so the rest of the page streams. This is usually a bigger win than
any bundle work.

## 5. Cache deliberately

Tag fetches and invalidate with `revalidateTag` on the event that changes the
data, rather than guessing a `revalidate` interval. Remember Next 15 does not
cache `fetch` by default.

## 6. The asset basics

`next/image` with `priority` on the LCP image; `next/font` to remove font CLS;
`preconnect` for third-party origins you know you will hit.

## 7. Third parties

Analytics and chat widgets are frequently the largest cost. `next/script` with
`strategy="lazyOnload"` or `afterInteractive`, and `@next/third-parties` for
common vendors.

## The framing that impresses

Name the metric you are targeting and let it choose the fix:

- **Poor LCP** → bytes and network: image priority, render-blocking resources,
  TTFB (streaming, caching).
- **Poor INP** → main-thread work: too much client JS, expensive re-renders,
  long tasks.
- **Poor CLS** → reserved space: image dimensions, font metrics, injected banners.

"Optimise everything" is the weak answer. "The field data says INP is p75 = 450ms,
so I would look at client bundle size and long tasks first" is the strong one.
