# Streaming and Suspense in Next.js

> App Router. This is the payoff of Server Components.

## The short answer

Classic SSR is **all or nothing**: the server waits for every data dependency,
then sends the complete HTML. One slow query holds the entire page hostage and
the user stares at a blank screen.

**Streaming** sends HTML in chunks as it becomes ready. The shell arrives
immediately; slower regions stream in and swap into place.

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

`loading.js` is sugar for exactly this: it wraps the segment's `page.js` in a
Suspense boundary automatically.

## Worked example: where the time goes

```
Without streaming:
  [========= wait for slowest query (2s) =========][paint everything]
                                                    user sees nothing until here

With streaming:
  [shell 0.2s][header paints][feed streams 1.2s][recs stream 2s]
   user sees content here ↑
```

Same total work. Completely different perceived speed — and TTFB and FCP improve
measurably, not just subjectively.

## Which metrics improve

- **TTFB** drops — the shell goes out without waiting for data
- **FCP** improves — something meaningful paints immediately
- **LCP** *may* improve. If the largest element is *inside* a suspended
  boundary, it still waits. Worth saying, because "streaming fixes LCP" is not
  automatically true.

**Boundary placement is the performance work.** One boundary around everything
is barely better than no streaming at all.

## Avoiding waterfalls

Sequential awaits create a **server-side waterfall**:

```js
const user = await getUser()            // 200ms
const posts = await getPosts(user.id)   // 200ms  → 400ms total
```

If they are independent, start them together:

```js
const [user, posts] = await Promise.all([getUser(), getPosts()])
```

If they are genuinely dependent, put them in **separate Suspense boundaries** so
the independent parts of the page do not wait for the chain.

## The trade-offs people miss

**Streamed content cannot change the HTTP status or headers.** They were already
sent with the shell. So a `notFound()` inside a streamed boundary **cannot
produce a real 404 status** — the UI changes but the response was already 200.

That matters for SEO and for anything downstream reading status codes. If the
404 must be a real 404, the check has to happen before streaming starts.

**Layout shift.** A fallback whose dimensions differ from the real content causes
CLS. Skeletons should match the final size, not just look plausible.

**Popcorn effect.** Too many small boundaries resolving at random moments feels
worse than one clean load.

## Streaming and transitions

During client navigation, Suspense would normally replace visible content with a
fallback — a visible regression. `startTransition` (which `<Link>` uses
internally) tells React to **keep the old UI** until the new one is ready.

## How to answer this out loud

"Classic SSR waits for all data then sends everything, so one slow query blocks
the whole page. Streaming sends the shell immediately and streams each Suspense
boundary as it resolves, so TTFB and FCP improve — LCP only if the largest
element isn't inside a suspended boundary. `loading.js` is just an automatic
Suspense wrapper. The real work is boundary placement and avoiding waterfalls:
`Promise.all` for independent fetches, separate boundaries for dependent ones.
The catch worth knowing is that once you start streaming the status code is
already sent, so `notFound()` inside a boundary can't produce a real 404."

## Follow-ups to expect

- *How does the browser render partial HTML?* Chunks arrive with inline scripts
  that move streamed content into place.
- *Does this work without JavaScript?* The HTML streams and renders; the swap
  scripts are tiny and inline.
- *Where should boundaries go?* Around each independently-slow region — route
  level plus genuinely heavy widgets.
