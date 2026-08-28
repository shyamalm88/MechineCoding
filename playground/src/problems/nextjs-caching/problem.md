# The four caches in Next.js App Router

> Next.js 15. Caching defaults changed significantly in 15 — verify against the
> version you are on, because most tutorials describe 13/14 behaviour.

The single most confusing part of the App Router. There are **four** distinct
caches and "it's cached" is meaningless without saying which.

| Cache | Where | Lifetime | Caches |
|---|---|---|---|
| **Request Memoization** | Server | One render pass | Duplicate `fetch`es in one request |
| **Data Cache** | Server | Persistent, across requests/deploys | `fetch` results |
| **Full Route Cache** | Server | Until revalidated/redeployed | Rendered HTML + RSC payload |
| **Router Cache** | **Client** | Session (in memory) | RSC payloads for visited routes |

## 1. Request Memoization

Two components both call `fetch('/api/user')` in the same render → **one**
request. Deduplication scoped to a single render pass, automatic, React-level.

This is why "fetch where you need it" is fine in RSC — no prop drilling of data
just to avoid duplicate calls.

## 2. Data Cache

Persists `fetch` results **across requests**.

**The Next 15 change:** `fetch` is **no longer cached by default** (it was in
13/14). Opt in explicitly:

```js
fetch(url, { cache: 'force-cache' })
fetch(url, { next: { revalidate: 60 } })
fetch(url, { next: { tags: ['posts'] } })
```

Also in 15: `GET` Route Handlers are no longer cached by default, and the client
Router Cache no longer caches page segments by default.

## 3. Full Route Cache

The rendered output of a static route. Invalidated by `revalidatePath`,
`revalidateTag`, or a deploy. A route that opts into dynamic rendering has no
Full Route Cache at all.

## 4. Router Cache (client)

Prefetched and visited RSC payloads, so back/forward and `<Link>` navigation are
instant. It is why data can look stale after a mutation even though the server is
correct — you are seeing the client cache.

`router.refresh()` clears it for the current route.

## Invalidation

```js
revalidateTag('posts')      // everything tagged 'posts'
revalidatePath('/blog')     // a specific path
router.refresh()            // client-side, current route
```

**Tags are the good tool.** Tag a fetch, then invalidate from a Server Action or
webhook the moment the data actually changes — far better than guessing a
`revalidate` interval.

## The debugging question

When someone says "my data is stale", ask **which cache**:

- Stale after a mutation in the same session → Router Cache → `router.refresh()`
- Stale for everyone → Data Cache / Full Route Cache → `revalidateTag`
- Duplicate identical requests in one render → memoization is not applying
  (different URL or options, or not using `fetch`)

Non-`fetch` data access (a direct DB query) is **not** in the Data Cache. Wrap it
in React `cache()` for per-request memoization, or `unstable_cache` for
persistence.

## Worked example: "my data is stale" — which cache?

A user submits a form, the database updates, but the list still shows the old
data. There are three possible culprits and they need different fixes:

```
Stale only for this user, this session  → Router Cache   → router.refresh()
Stale for everyone, all sessions        → Data / Full Route Cache → revalidateTag()
Duplicate identical requests in one render → memoization isn't applying
                                             (different URL/options, or not fetch)
```

Asking *which* cache is what turns an hour of guessing into a two-minute fix.

## How to answer this out loud

"There are four, and 'it's cached' is meaningless without saying which. Request
Memoization dedupes identical fetches within a single render. The Data Cache
persists fetch results across requests — and in Next 15 fetch is no longer
cached by default, which most tutorials get wrong. The Full Route Cache holds
rendered output for static routes. And the Router Cache is client-side, which is
why data can look stale after a mutation even though the server is correct.
For invalidation I'd tag fetches and call `revalidateTag` from the mutation,
rather than guessing a revalidate interval."

## Follow-ups to expect

- *How do you cache a database query?* It is not in the Data Cache — wrap it in
  React `cache()` for per-request dedup or `unstable_cache` to persist.
- *Why is my Server Action's change not showing?* Client Router Cache — call
  `revalidatePath`/`revalidateTag` in the action, or `router.refresh()`.
- *What changed in Next 15?* fetch and GET Route Handlers are uncached by
  default, and the client Router Cache no longer caches page segments.
