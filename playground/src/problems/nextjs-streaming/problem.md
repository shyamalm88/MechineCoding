# Streaming and Suspense in Next.js

> App Router. This is the payoff of Server Components.

## The problem it solves

Classic SSR is **all or nothing**: the server waits for every data dependency,
then sends the complete HTML. One slow query holds the entire page hostage — the
user stares at a blank screen.

## Streaming

The server sends HTML **in chunks** as it becomes ready. The shell arrives
immediately; slower regions stream in and are swapped into place.

```jsx
export default function Page() {
  return (
    <>
      <Header />                                    {/* instant */}
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />                                    {/* streams when ready */}
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Recommendations />                         {/* independently */}
      </Suspense>
    </>
  )
}
```

`loading.js` is sugar: it wraps the segment's `page.js` in a Suspense boundary
automatically.

## Why it improves the metrics

- **TTFB** drops — the shell goes out without waiting for data.
- **FCP** improves — something meaningful paints immediately.
- **LCP** may or may not improve; if the largest element is inside a suspended
  boundary, it still waits.

Placement of boundaries *is* the performance work: one boundary around
everything is barely better than no streaming.

## Avoiding waterfalls

Sequential `await`s create a server-side waterfall:

```js
const user = await getUser()          // 200ms
const posts = await getPosts(user.id) // 200ms  → 400ms total
```

If they are independent, start them together:

```js
const [a, b] = await Promise.all([getA(), getB()])
```

If genuinely dependent, put them in **separate Suspense boundaries** so the
independent parts of the page do not wait.

## The trade-offs people miss

- **Streamed content cannot change the HTTP status code or headers** — they were
  already sent. A `notFound()` inside a streamed boundary cannot produce a real
  404 status, which matters for SEO.
- Layout shift: a fallback whose size differs from the real content causes CLS.
  Skeletons should match the final dimensions.
- Too many boundaries produce a "popcorn" effect of things appearing at random.

## Related

`useTransition`/`startTransition` prevents Suspense from *replacing* already-
visible content with a fallback during navigation — React keeps the old UI until
the new one is ready, which is usually the better experience.
