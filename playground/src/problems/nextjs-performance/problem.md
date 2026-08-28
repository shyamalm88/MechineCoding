# Optimising a Next.js app

## The short answer

Work in this order, and let the **metric choose the fix** — the fixes for LCP
and INP barely overlap:

1. Measure (build output, bundle analyzer, field data)
2. Ship less JavaScript
3. Get the rendering mode right
4. Fix data waterfalls
5. Cache deliberately
6. Asset basics
7. Audit third parties

## 1. Measure first

`next build` prints per-route JS size and marks each route:

```
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**A route that unexpectedly became `ƒ` is often the whole problem.** One stray
`cookies()` call or an unwrapped `useSearchParams()` silently converts a static
page to per-request rendering — and nothing else tells you.

`@next/bundle-analyzer` shows *what* is in the bundle. Field RUM tells you
whether users are actually affected.

## 2. Ship less JavaScript

**Push `'use client'` to the leaves.** The directive is a **boundary**:
everything imported below it joins the client bundle. One misplaced directive at
the top of a layout ships your entire app to the browser.

```jsx
// ✗ 'use client' at the top of a layout
// ✓ 'use client' on the small interactive widget only
```

- `next/dynamic` for genuinely heavy, rarely-used components — chart libraries,
  rich text editors, maps — with `ssr: false` for browser-only ones.
- Check for a large library imported for one function.

## 3. Get the rendering mode right

Static beats dynamic beats blocking. Audit which routes are dynamic **and why**.
If a page only needs cookies for a small personalised widget, move that widget
into a Client Component and keep the page static.

## 4. Fix data waterfalls

```js
// ✗ 400ms sequential
const user = await getUser()
const posts = await getPosts()

// ✓ 200ms parallel
const [user, posts] = await Promise.all([getUser(), getPosts()])
```

This is usually a **bigger win than any bundle work**, and it is invisible in a
bundle analyzer — you only see it in a trace or by reading the code.

For genuinely dependent fetches, separate Suspense boundaries so the rest of the
page streams.

## 5. Cache deliberately

Remember **Next 15 does not cache `fetch` by default**. Opt in, and prefer
**tags with on-demand invalidation** over guessing a time interval:

```js
fetch(url, { next: { tags: ['posts'] } })
// then, in the mutation that changes posts:
revalidateTag('posts')
```

Time-based revalidation is a guess; tag-based invalidation is correct by
construction.

## 6. Asset basics

`next/image` with `priority` on the LCP image, `next/font` to remove font CLS,
`preconnect` for third-party origins you know you will hit.

## 7. Third parties are often the biggest cost

Analytics, chat widgets and A/B tools frequently outweigh your entire
application bundle. `next/script` with `strategy="lazyOnload"` or
`afterInteractive`, and `@next/third-parties` for common vendors.

## The framing that impresses

```
Poor LCP → bytes and network: image priority, TTFB, render-blocking resources
Poor INP → main-thread work: client bundle size, long tasks, re-renders
Poor CLS → reserved space: image dimensions, font metrics, injected banners
```

"I'd optimise everything" is the weak answer. "Field data says p75 INP is 450ms,
so I'd start with client bundle size and long tasks" is the strong one.

## How to answer this out loud

"I'd start from the build output and field data, because the fix depends
entirely on which metric is bad. The Next-specific things I'd check first are
whether routes unexpectedly became dynamic — one `cookies()` call does that
silently — and where the `'use client'` boundaries are, since the directive is a
boundary and everything below it ships to the browser. After that, data
waterfalls are usually a bigger win than bundle size: `Promise.all` for
independent fetches and separate Suspense boundaries for dependent ones. And I'd
invalidate caches by tag rather than guessing a revalidate interval."

## Follow-ups to expect

- *How do you find what made a route dynamic?* The build output plus searching
  for `cookies`, `headers`, `searchParams`, `noStore`.
- *When is `ssr: false` right?* Browser-only libraries — maps, canvas editors —
  where SSR would crash or produce nothing useful.
- *How do you stop regressions?* Bundle-size budgets in CI and alerting on field
  p75.
